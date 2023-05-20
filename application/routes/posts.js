var express = require("express");
var router = express.Router();
var multer = require("multer");
var db = require("../conf/database");
const {
  makeThumbnail,
  getPostById,
  getCommentsForPostById,
  deleteFiles,
} = require("../middleware/postsBE");
const { isLoggedIn } = require("../middleware/auth");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/videos/uploads");
  },
  filename: function (req, file, cb) {
    var fileExt = file.mimetype.split("/")[1];
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExt}`);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/create",
  isLoggedIn,
  upload.single("uploadVideo"),
  makeThumbnail,
  async function (req, res, next) {
    var { title, description } = req.body;
    var { path, thumbnail } = req.file;
    var { userID } = req.session.user;

    try {
      var [insertResult, _] = await db.execute(
        `INSERT INTO posts (fk_userID, title, description, video, thumbnail) VALUE (?,?,?,?,?);`,
        [userID, title, description, path, thumbnail]
      );
      if (insertResult && insertResult.affectedRows) {
        req.flash("success", "Post created");
        return req.session.save(function (err) {
          if (err) next(err);
          return res.redirect(`/posts/${insertResult.insertId}`);
        });
      } else {
        next(new Error("Post could not be created"));
      }
    } catch (error) {
      next(error);
    }
  }
);
router.get(
  "/:id(\\d+)",
  getPostById,
  getCommentsForPostById,
  async function (req, res) {
    res.render("viewpost", {
      title: `Post ${req.params.id}`,
      css: ["style.css"],
    });
  }
);

router.get("/search", async function (req, res, next) {
  var { search } = req.query;
  try {
    var [rows, _] = await db.execute(
      `SELECT id, description, title, thumbnail, concat_ws(' ', title, description) as
       haystack
       from posts
       having haystack like?;`,
      [`%${search}%`]
    );
    var [noResult, _] = await db.execute(
      `select u.id, u.username, p.id, p.fk_userID, p.title, p.description, p.thumbnail, p.createdAt from users u join posts p on u.id = p.fk_userID order by p.createdAt DESC;`
    );
    if (rows && rows.length == 0) {
      res.locals.searchResult = noResult;
      return res.render("search", { title: "Search", css: ["style.css"] });
    } else {
      res.locals.searchResult = rows;
      return res.render("search", { title: "Search", css: ["style.css"] });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/delete/:id(\\d+)", deleteFiles, async function (req, res, next) {
  var { id } = req.params;

  try {
    var [removeComment, _] = await db.execute(
      `DELETE FROM comments WHERE fk_postID = ?;`,
      [id]
    );
    var [removePost, _] = await db.execute(`DELETE FROM posts WHERE id = ?;`, [
      id,
    ]);
    if (removeComment && removePost) {
      req.flash("success", "Post deleted");
      return req.session.save(function (err) {
        if (err) next(err);
        return res.redirect(`/`);
      });
    } else {
      next(new Error("Post could not be deleted"));
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
