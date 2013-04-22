/*global define: true, Mustache: true, moment: true */
/*jshint sub: true */
/**
 * Mashape Namespace Check
 *
 * Here we check to see whether Mashape Namespace exists, if it does not we create it. Otherwise
 * we set the variable and keep going.
 *
 * @type {Object}
 */
var Mashape = (typeof Mashape === 'undefined' || typeof Mashape !== 'object') ? {} : Mashape;

/**
 * Mashape Module
 * @author Nijiko Yonskai
 * @copyright 2013 Mashape
 * @param {String} name Module name that will be placed onto the `context` object.
 * @param {Functon} definition Module definition
 * @param {Object} context Module context
 */
(function (name, definition, context) {
  if (typeof context['module'] !== 'undefined' && context['module']['exports']) context['module']['exports'] = definition();
  else if (typeof context['define'] !== 'undefined' && context['define'] === 'function' && context['define']['amd']) define(name, definition);
  else context[name] = definition();
})('meta', function () {
  var $self = {};

  /**
   * Meta-Info DOM Element
   * @type Dom Node
   */
  $self.info = document.getElementById('meta-info');

  /**
   * Sugar for accessing meta information attributes
   *
   * @param  {String} attr Attribute name excluding data- prefix
   * @return {Object}      Attribute value or null
   */
  $self.get = function (attr) {
    return $self.info.getAttribute('data-' + attr) || null;
  };

  /**
   * Sugar for checking whether an attribute exists on meta-information dom element
   *
   * @param  {String} attr Attribute name excluding data- prefix
   * @return {Boolean}
   */
  $self.has = function (attr) {
    return $self.info.hasAttribute('data-' + attr);
  };

  /**
   * API Constructor
   * @type {Object}
   */
  $self.api = {};

  /**
   * Returns API Identifier
   * @return {String}
   */
  $self.api.getId = function () {
    return $self.get('api-id');
  };

  $self.api.getName = function () {
    return $self.get('api-name');
  };

  /**
   * Returns API Owner Name
   * @return {String}
   */
  $self.api.getOwner = function () {
    return $self.get('api-owner');
  };

  /**
   * Returns API Base Url
   * @return {String}
   */
  $self.api.getBaseUrl = function () {
    return $self.get('base-url');
  };

  /**
   * User Class
   * @type {Object}
   */
  $self.user = function () {
    var $self = {};

    $self.loggedIn = $self.user.loggedIn();
    $self.username = $self.user.getUsername();
    $self.gravatar = $self.user.getGravatar();
    $self.key = $self.user.getKey();
    $self.token = $self.user.getToken();

    return $self;
  };

  /**
   * Returns whether user is logged in or not
   * @return {Boolean}
   */
  $self.user.loggedIn = function () {
    return $self.has('user-name') && $self.has('user-gravatar');
  };

  /**
   * Returns the currently logged in users username
   * @return {Boolean}
   */
  $self.user.getUsername = function () {
    return $self.user.loggedIn() ? $self.get('user-name') : null;
  };

  /**
   * Returns the currently logged in users gravatar
   */
  $self.user.getGravatar = function () {
    return $self.user.loggedIn() ? $self.get('user-gravatar') : null;
  };

  /**
   * Returns currently logged in users public key
   * @return {Object}
   */
  $self.user.getKey = function () {
    return $self.user.loggedIn() ? $self.get('mashape-key') : null;
  };

  /**
   * Get user token
   * @return {[type]} [description]
   */
  $self.user.getToken = function () {
    return $self.user.loggedIn() ? $self.get('user-token') : null;
  };

  return $self;
}, Mashape);