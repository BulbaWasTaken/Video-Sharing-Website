let username = document.getElementById("username");
let password = document.getElementById("password");
let email = document.getElementById("email");
let confirmPass = document.getElementById("confirmPassword");
let submitId = document.getElementById("reg-form");
let ageCheck = document.getElementById("ageCheck");
let privacyCheck = document.getElementById("agreeTOSAndPrivacyRules");
let errorMessage = document.getElementById("error-message");

var specialChar = new RegExp("(?=.*[/*\\-+!@#$^&()\\[\\]~])");
var upperCase = new RegExp("(?=.*[A-Z])");
var number = new RegExp("(?=.*[0-9])");
var letter = /^[a-z].*/i;
var emailFormat =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

var validUsername = false;
var validPassword = false;
var validEmail = false;
var validConfirmPass = false;

username.addEventListener("click", function () {
  document.getElementById("username-validation").style.display = "flex";
  document.getElementById("lengthReq").style.color = "red";
  document.getElementById("firstChar").style.color = "red";
  document.getElementById("lengthReq").innerHTML = "At least 3 Characters";
  document.getElementById("firstChar").innerHTML = "Begins with a letter";
});
username.addEventListener("input", function (ev) {
  let userInput = ev.currentTarget;
  let userName = userInput.value;

  if (userName.length >= 3) {
    document.getElementById("lengthReq").style.color = "green";
    document.getElementById("lengthReq").innerHTML = "At least 3 Characters";
  } else {
    document.getElementById("lengthReq").style.color = "red";
    document.getElementById("lengthReq").innerHTML = "At least 3 Characters";
  }

  if (letter.test(userName)) {
    document.getElementById("firstChar").style.color = "green";
    document.getElementById("firstChar").innerHTML = "Begins with a letter";
  } else {
    document.getElementById("firstChar").style.color = "red";
    document.getElementById("firstChar").innerHTML = "Begins with a letter";
  }

  if (
    document.getElementById("lengthReq").style.color == "green" &&
    document.getElementById("firstChar").style.color == "green"
  ) {
    return (validUsername = true);
  } else {
    document.getElementById("username-validation").style.display = "flex";
    return (validUsername = false);
  }
});

username.addEventListener("focusout", function () {
  document.getElementById("username-validation").style.display = "none";
});

password.addEventListener("click", function () {
  document.getElementById("password-validation").style.display = "flex";
  document.getElementById("length").style.color = "red";
  document.getElementById("length").innerHTML = "At least 8 Characters";
  document.getElementById("special").style.color = "red";
  document.getElementById("special").innerHTML =
    "At least 1 special Character: / * - + ! @ # $ ^ & ~[ ]";
  document.getElementById("upper").style.color = "red";
  document.getElementById("upper").innerHTML = "At least 1 Upper Case Letter";
  document.getElementById("number").style.color = "red";
  document.getElementById("number").innerHTML = "At least 1 Number";
});

password.addEventListener("input", function (ev) {
  let passwordInput = ev.currentTarget;
  let passWord = passwordInput.value;

  if (passWord.length >= 8) {
    document.getElementById("length").style.color = "green";
    document.getElementById("length").innerHTML = "At least 8 Characters";
  } else {
    document.getElementById("length").style.color = "red";
    document.getElementById("length").innerHTML = "At least 8 Characters";
  }

  if (specialChar.test(passWord)) {
    document.getElementById("special").style.color = "green";
    document.getElementById("special").innerHTML =
      "At least 1 special Character: / * - + ! @ # $ ^ & ~ [ ]";
  } else {
    document.getElementById("special").style.color = "red";
    document.getElementById("special").innerHTML =
      "At least 1 special Character: / * - + ! @ # $ ^ & ~[ ]";
  }

  if (upperCase.test(passWord)) {
    document.getElementById("upper").style.color = "green";
    document.getElementById("upper").innerHTML = "At least 1 Upper Case Letter";
  } else {
    document.getElementById("upper").style.color = "red";
    document.getElementById("upper").innerHTML = "At least 1 Upper Case Letter";
  }

  if (number.test(passWord)) {
    document.getElementById("number").style.color = "green";
    document.getElementById("number").innerHTML = "At least 1 Number";
  } else {
    document.getElementById("number").style.color = "red";
    document.getElementById("number").innerHTML = "At least 1 Number";
  }

  if (
    document.getElementById("length").style.color == "green" &&
    document.getElementById("special").style.color == "green" &&
    document.getElementById("upper").style.color == "green" &&
    document.getElementById("number").style.color == "green"
  ) {
    return (validPassword = true);
  } else {
    document.getElementById("password-validation").style.display = "flex";
    return (validPassword = false);
  }
});

password.addEventListener("focusout", function () {
  document.getElementById("password-validation").style.display = "none";
});

email.addEventListener("click", function () {
  document.getElementById("email-validation").style.display = "flex";
  document.getElementById("validEmail").style.color = "red";
  document.getElementById("validEmail").innerHTML = "Invalid Email";
});

email.addEventListener("input", function (ev) {
  let emailInput = ev.currentTarget;
  let eMail = emailInput.value;

  if (emailFormat.test(eMail)) {
    document.getElementById("validEmail").style.color = "green";
    document.getElementById("validEmail").innerHTML = "Valid Email";
  } else {
    document.getElementById("validEmail").style.color = "red";
    document.getElementById("validEmail").innerHTML = "Invalid Email";
  }

  if (document.getElementById("validEmail").style.color == "green") {
    document.getElementById("email-validation").style.display = "flex";
    return (validEmail = true);
  } else {
    return (validEmail = false);
  }
});

email.addEventListener("focusout", function () {
  document.getElementById("email-validation").style.display = "none";
});

confirmPass.addEventListener("click", function () {
  document.getElementById("confirmPass-validation").style.display = "flex";
  document.getElementById("passConfirm").style.color = "red";
  document.getElementById("passConfirm").innerHTML = "Password does not Match";
});

confirmPass.addEventListener("input", function (ev) {
  let confirmPassInput = ev.currentTarget;
  let confirmPW = confirmPassInput.value;

  if (password.value == confirmPW) {
    document.getElementById("passConfirm").style.color = "green";
    document.getElementById("passConfirm").innerHTML = "Password Match";
  } else {
    document.getElementById("passConfirm").style.color = "red";
    document.getElementById("passConfirm").innerHTML =
      "Password does not Match";
  }
  if (document.getElementById("passConfirm").style.color == "green") {
    return (validConfirmPass = true);
  } else {
    document.getElementById("confirmPass-validation").style.display = "flex";
    return (validConfirmPass = false);
  }
});
confirmPass.addEventListener("focusout", function () {
  document.getElementById("confirmPass-validation").style.display = "none";
});

submitId.addEventListener("submit", function (ev) {
  ev.preventDefault();
  if (validUsername && validPassword && validEmail && validConfirmPass) {
    ev.currentTarget.submit();
  } else {
    errorMessage.setAttribute("class", "invalid-format");
    errorMessage.innerHTML = "Invalid Form Format";
  }
});
