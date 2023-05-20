var validator = require("validator");
var db = require("../conf/database");

module.exports = {
  usernameCheck: function (req, res, next) {
    var { username } = req.body;
    username = username.trim();
    if (!validator.isLength(username, { min: 3 })) {
      req.flash("error", "Username must be 3 OR MORE CHARACTERS");
    }
    if (!/[a-zA-z]/.test(username.charAt(0))) {
      req.flash("error", "Username must BEGIN WITH A LETTER");
    }

    if (req.session.flash.error) {
      res.redirect("/register");
    } else {
      next();
    }
  },
  passwordCheck: function (req, res, next) {
    var { password } = req.body;
    password = password.trim();
    var specialChar = new RegExp("(?=.*[/*\\-+!@#$^&()\\[\\]~])");
    var upperCase = new RegExp("(?=.*[A-Z])");
    var number = new RegExp("(?=.*[0-9])");

    if (!validator.isLength(password, { min: 8 })) {
      req.flash("error", "Password must be 8 OR MORE CHARACTERS");
    }
    if (!specialChar.test(password)) {
      req.flash(
        "error",
        "Password must contain AT LEAST 1 SPECIAL CHARACTER: / * - + ! @ # $ ^ & ~ [ ]"
      );
    }
    if (!upperCase.test(password)) {
      req.flash("error", "Password must contain AT LEAST 1 UPPER CASE LETTER");
    }
    if (!number.test(password)) {
      req.flash("error", "Password must contain AT LEAST 1 NUMBER");
    }

    if (req.session.flash.error) {
      res.redirect("/register");
    } else {
      next();
    }
  },
  emailCheck: function (req, res, next) {
    var { email } = req.body;
    email = email.trim();
    var emailFormat =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (!emailFormat.test(email)) {
      req.flash("error", "Invalid e-mail format");
    }

    if (req.session.flash.error) {
      res.redirect("/register");
    } else {
      next();
    }
  },
  tosCheck: function (req, res, next) {
    var { agreeTOS } = req.body;
    if (agreeTOS == null) {
      req.flash(
        "error",
        "Must agree to the Terms of Service and Privacy Rules"
      );
    }
    if (req.session.flash.error) {
      res.redirect("/register");
    } else {
      next();
    }
  },
  ageCheck: function (req, res, next) {
    var { ageCheck } = req.body;
    if(ageCheck == null){
      req.flash(
        "error",
        "You are not 13+ years of age"
      );
    }
    if (req.session.flash.error) {
      res.redirect("/register");
    } else {
      next();
    }
  },
  isUsernameUnique: async function (req, res, next) {
    var { username } = req.body;
    try {
      var [rows, _] = await db.execute(
        `select id from users where username=?;`,
        [username]
      );
      if (rows && rows.length > 0) {
        req.flash("error", "Username is already taken");
        return req.session.save(function () {
          return res.redirect("/register");
        });
      } else {
        next();
      }
    } catch (error) {
      next(error);
    }
  },
  isEmailUnique: async function (req, res, next) {
    var { email } = req.body;
    try {
      var [rows, _] = await db.execute(`select id from users where email=?;`, [
        email,
      ]);
      if (rows && rows.length > 0) {
        req.flash("error", "Email has already been used");
        return res.redirect("/register");
      } else {
        next();
      }
    } catch (error) {
      next(error);
    }
  },
};
