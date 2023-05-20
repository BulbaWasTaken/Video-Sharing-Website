var express = require("express");
const { isLoggedIn } = require("../middleware/auth");
var router = express.Router();
var db = require("../conf/database");

router.post("/create", isLoggedIn, async function (req, res, next) {
  var { userID, username } = req.session.user;
  var { postId, comment } = req.body;
  try {
    var [insertResult, _] = await db.execute(
      `INSERT INTO comments (fk_authorID, fk_postID, text) VALUE (?,?,?);`,
      [userID, postId, comment]
    );
    if (insertResult && insertResult.affectedRows == 1) {
      return res.status(201).json({
        username: username,
        comment:comment,
        insertResult:insertResult.insertId
      });
    } 
  } catch (error) {
    next(error);
  }
});

module.exports = router;

/*
var { userID } = req.session.user;
  var { text } = req.body;
  var { id } = req.params;

  try {
    var [insertResult, _] = await db.execute(
      `INSERT INTO comments (fk_authorID, fk_postID, text) VALUE (?,?,?);`,
      [userID, id, text]
    );
    if (insertResult && insertResult.affectedRows) {
      req.flash("success", "Comment posted");
      return req.session.save(function (err) {
        if (err) next(err);
        return res.redirect(`/posts/${id}`);
      });
    } else {
      next(new Error("Post could not be posted"));
    }
  } catch (error) {
    next(error);
  }
*/



/*
 ` <div class="comments-list">
                <div class="comment-info">
                  <div class = "comment-author-date">
                    <div class="comment-author">${data.username}</div>
                    <div class="comment-date">${(new Date()).toLocaleString("en-us", { dateStyle: "long", timeStyle: "medium" })}</div>
                  </div>
                  <div class="comment-text">${data.commentText}</div>
                </div>
              </div>`
*/
