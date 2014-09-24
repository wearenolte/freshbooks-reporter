/**
 * Authentication Controller
 */

var AuthController = {

  /**
   * Log out a user and return them to the homepage
   *
   * Passport exposes a logout() function on req (also aliased as logOut()) that
   * can be called from any route handler which needs to terminate a login
   * session. Invoking logout() will remove the req.user property and clear the
   * login session (if any).
   *
   * For more information on logging out users in Passport.js, check out:
   * http://passportjs.org/guide/logout/
   *
   * @param {Object} req
   * @param {Object} res
   */
  logout: function (req, res) {
    req.logout();
    res.redirect('/');
  },

  /**
   * Create a authentication callback endpoint
   *
   * This endpoint handles everything related to creating and verifying Pass-
   * ports and users, both locally and from third-aprty providers.
   *
   * Passport exposes a login() function on req (also aliased as logIn()) that
   * can be used to establish a login session. When the login operation
   * completes, user will be assigned to req.user.
   *
   * For more information on logging in users in Passport.js, check out:
   * http://passportjs.org/guide/login/
   *
   * @param {Object} req
   * @param {Object} res
   */
  callback: function (req, res) {
    function tryAgain () {
      // If an error was thrown, redirect the user to the login which should
      // take care of rendering the error messages.
      req.flash('form', req.body);
      res.redirect(req.param('action') === 'register' ? '/register' : '/login');
    }

    passport.callback(req, res, function (err, user) {
      if (err) return tryAgain();

      req.login(user, function (loginErr) {
        if (loginErr) return tryAgain();

        // Upon successful login, send the user to the homepage were req.user
        // will available.
        res.redirect('/');
      });
    });
  }
};

module.exports = AuthController;
