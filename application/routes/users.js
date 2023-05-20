var express = require("express");
var router = express.Router();
var db = require("../conf/database");
var bcrypt = require("bcrypt");
var { isLoggedIn, isMyProfile } = require("../middleware/auth");
var {
  usernameCheck,
  passwordCheck,
  emailCheck,
  tosCheck,
  ageCheck,
  isUsernameUnique,
  isEmailUnique,
} = require("../middleware/validationBE");
const { getPostsForUserByID } = require("../middleware/postsBE");

router.post(
  "/register",
  usernameCheck,
  passwordCheck,
  emailCheck,
  tosCheck,
  ageCheck,
  isUsernameUnique,
  isEmailUnique,
  async function (req, res, next) {
    const { username, email, password } = req.body;
    try {
      var hashedPassword = await bcrypt.hash(password, 3);

      var [resultObject, _] = await db.execute(
        `INSERT INTO users (username, email, password) value (?,?,?);`,
        [username, email, hashedPassword]
      );
      if (resultObject && resultObject.affectedRows == 1) {
        req.flash("success", "Register Successful!");
        return res.redirect("/login");
      } else {
        return res.redirect("/register");
      }
    } catch (error) {
      next(error);
    }
  }
);

router.post("/login", async function (req, res, next) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.redirect("/login");
  } else {
    var [rows, fields] = await db.execute(
      `select id,username,password,email from users where username=?`,
      [username]
    );
    var user = rows[0];
    if (!user) {
      req.flash("error", "Login Failed: Invalid username and/or password");
      req.session.save(function (err) {
        return res.redirect("/login");
      });
    } else {
      var passwordsMatch = await bcrypt.compare(password, user.password);
      if (passwordsMatch) {
        req.session.user = {
          userID: user.id,
          email: user.email,
          username: user.username,
        };
        req.flash("success", "You are now logged in");
        return res.redirect("/");
      } else {
        req.flash("error", "Login Failed: Invalid username and/or password");
        req.session.save(function (err) {
          return res.redirect("/login");
        });
      }
    }
  }
});

router.get("/profile/:id(\\d+)", isLoggedIn, isMyProfile, getPostsForUserByID, function (req, res) {
  res.render("profile", {
    title: req.session.user.username,
    css: ["style.css"],
  });
});

router.post("/logout", isLoggedIn, async function (req, res, next) {
  req.session.destroy(function (err) {
    if (err) {
      next(err);
    }
    return res.redirect("/");
  });
});

module.exports = router;
