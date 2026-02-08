var form = document.getElementById("registerForm");

var fullName = document.getElementById("fullName");
var email = document.getElementById("email");
var phone = document.getElementById("phone");
var password = document.getElementById("password");
var confirmPassword = document.getElementById("confirmPassword");
var agree = document.getElementById("agree");

var successMsg = document.getElementById("successMsg");

function setCookie(name, value, days) {
  var maxAge = days * 24 * 60 * 60;
  document.cookie = name + "=" + encodeURIComponent(value) + "; max-age=" + maxAge + "; path=/";
}

function getCookie(name) {
  var all = document.cookie;
  if (!all) return "";

  var parts = all.split(";");
  for (var i = 0; i < parts.length; i++) {
    var p = parts[i].trim();
    if (p.indexOf(name + "=") === 0) {
      return decodeURIComponent(p.substring((name + "=").length));
    }
  }
  return "";
}

function makeUserId() {
  var rand = Math.floor(Math.random() * 1000000);
  return "U" + new Date().getTime() + "_" + rand;
}

function looksLikeEmail(value) {
  if (value.indexOf("@") === -1) return false;
  if (value.indexOf(".") === -1) return false;
  return true;
}

function validate() {
  var errors = [];

  var nameVal = fullName.value.trim();
  var emailVal = email.value.trim();
  var passVal = password.value;
  var confirmVal = confirmPassword.value;

  if (nameVal.length < 2) errors.push("Full Name must be at least 2 characters.");
  if (!looksLikeEmail(emailVal)) errors.push("Enter a valid email address.");
  if (passVal.length < 8) errors.push("Password must be at least 8 characters.");
  if (passVal !== confirmVal) errors.push("Passwords do not match.");
  if (!agree.checked) errors.push("You must agree to the Privacy Notice.");

  return errors;
}

function showMessage(text, good) {
  successMsg.textContent = text;
  if (good) {
    successMsg.style.color = "#8dffb3";
    successMsg.style.fontWeight = "700";
  } else {
    successMsg.style.color = "#ff8a8a";
    successMsg.style.fontWeight = "700";
  }
}

function ensureUserCookie() {
  var existing = getCookie("otaku_uid");
  if (existing === "") {
    var id = makeUserId();
    setCookie("otaku_uid", id, 30);
    return id;
  }
  return existing;
}

ensureUserCookie();

form.addEventListener("submit", function (e) {
  e.preventDefault();

  var errs = validate();

  if (errs.length > 0) {
    showMessage(errs[0], false);
    return;
  }

  var uid = ensureUserCookie();
  showMessage("Registered successfully! Your demo ID: " + uid, true);

  form.reset();
});
phone.addEventListener("input", function () {
  var digits = "";

  for (var i = 0; i < phone.value.length; i++) {
    var ch = phone.value[i];
    if (ch >= "0" && ch <= "9") {
      digits += ch;
    }
  }

  if (digits.indexOf("254") === 0) {
    digits = digits.substring(3);
  }

  digits = digits.substring(0, 9);

  var formatted = "+254 ";

  if (digits.length > 0) formatted += digits.substring(0, 3);
  if (digits.length > 3) formatted += "-" + digits.substring(3, 6);
  if (digits.length > 6) formatted += "-" + digits.substring(6, 9);

  phone.value = formatted;
});
