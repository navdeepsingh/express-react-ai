module.exports = {

  capitalizeFirstLetter : (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
  },

  getCookie : (cookiename) => {
    // Get name followed by anything except a semicolon
    var cookiestring=RegExp(""+cookiename+"[^;]+").exec(document.cookie);
    // Return everything after the equal sign, or an empty string if the cookie name not found
    return unescape(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./,"") : "");
  }

}
