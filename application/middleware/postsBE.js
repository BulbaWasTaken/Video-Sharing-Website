var pathToFFMPEG = require("ffmpeg-static");
var exec = require("child_process").exec;
var db = require("../conf/database");
var fs = require('fs');

module.exports = {
  makeThumbnail: function (req, res, next) {
    if (!req.file) {
      next(new Error("File upload failed"));
    } else {
      try {
        var destinationOfThumbnail = `public/images/uploads/thumbnail-${
          req.file.filename.split(".")[0]
        }.png`;
        var thumbnailCommand = `${pathToFFMPEG} -ss 00:00:01 -i ${req.file.path} -y -s 1280x720 -vframes 1 -f image2 ${destinationOfThumbnail}`;
        exec(thumbnailCommand);
        req.file.thumbnail = destinationOfThumbnail;
        next();
      } catch (error) {
        next(error);
      }
    }
  },
  getPostsForUserByID: async function (req, res, next) {
    var { userID } = req.session.user;
    var [rows, _] = await db.execute(
      `select id, title, description, video, thumbnail,createdAt from posts where fk_userID=? order by createdAt DESC;`,
      [userID]
    );
    res.locals.postsByUser = rows;
    next();
  },
  getPostById: async function (req, res, next) {
    var { id } = req.params;
    try {
      var [rows, _] = await db.execute(
        `select u.username, p.createdAt, p.video, p.title, p.description, p.id from posts p join users u on p.fk_userID = u.id where p.id = ?;`,
        [id]
      );
      res.locals.currentPost = rows[0];
      next();
    } catch (error) {
      next(error);
    }
  },
  getCommentsForPostById: async function (req, res, next) {
    var { id } = req.params;
    try {
      var [rows, _] = await db.execute(
        `select u.username, c.text, c.createdAt from comments c join users u on c.fk_authorID = u.id where c.fk_postID = ? order by c.createdAt DESC;`,
        [id]
      );
      res.locals.commentsInPost = rows; 
      next();
    } catch (error) {
      next(error);
    }
  },
  getRecentPosts: async function (req, res, next) {
    var [rows, _] = await db.execute(
      `select u.id, u.username, p.id, p.fk_userID, p.title, p.description, p.thumbnail, p.createdAt from users u join posts p on u.id = p.fk_userID order by p.createdAt DESC;`
    );
    res.locals.recentPosts = rows;
    next();
  },
  deleteFiles: async function (req, res, next) {
    var{id} =req.params;
    var [getPost, _] = await db.execute(
      `SELECT video, thumbnail FROM posts WHERE id = ?;`,
      [id]
    );
    fs.unlink(getPost[0].video, (err) => {
      if(err){
        throw err
      }
    });
    fs.unlink(getPost[0].thumbnail, (err) => {
      if(err){
        throw err
      }
    });
    next();
  },
};
