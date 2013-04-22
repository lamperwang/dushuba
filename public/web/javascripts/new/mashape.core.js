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
})('core', function () {
  var $self = {};

  /**
   * Show a popup model
   * @param  {String} type Pop-up element prefix
   */
  $self.showPopup = function (type) {
    $('#' + (type == 'signup' ? 'login' : 'signup') + '-popup').hide();
    $('#' + type + '-popup').show().find('input[type="text"]').first().focus();
    return true;
  };

  /**
   * Show notification bar in a given area with a specific type and message.
   *
   * Supports HTML messages.
   *
   * @param  {Object} el      Class, identifier to pass to jQuery
   * @param  {String} type    Notification type, usually a color: green, red, blue
   * @param  {String} message Notification message body
   * @return {Object}         Returns specific notification added to dom for you to manipulate
   */
  $self.showNotification = function (el, type, message) {
    var notification = $('<div class="notification ' + type + '"></div>').css({ 'display': 'none' }).html(message);
    $(el).prepend(notification);
    notification.fadeIn();
    return notification;
  };

  /**
   * Decouple ajax request GET method
   *
   * @param  {String}   uri      URI to be requested on.
   * @param  {Function} callback Callback to be called upon sucess.
   * @return {this}
   */
  $self.get = function (uri, callback) {
    $.ajax(uri, {
      dataType: 'json',
      statusCode: {
        403: function () { if (typeof callback === 'function') callback(undefined, 403); },
        404: function () { if (typeof callback === 'function') callback(undefined, 404); }
      },
      success: function (data, status, xhr) {
        if (typeof callback === 'function') callback(data, parseFloat(xhr.status));
      }
    });
    return $self;
  };

  /**
   * Decouple ajax request POST method
   *
   * @param  {String}   uri      URI to be requested on.
   * @param  {Function} callback Callback to be called upon sucess.
   * @return {this}
   */
  $self.put = function (uri, o, callback) {
    $.ajax(uri, {
      type: 'PUT',
      dataType: 'json',
      data: o,
      statusCode: {
        403: function () { if (typeof callback === 'function') callback(undefined, 403); },
        404: function () { if (typeof callback === 'function') callback(undefined, 404); },
        500: function () { if (typeof callback === 'function') callback(undefined, 500); }
      },
      success: function (data, status, xhr) {
        if (typeof callback === 'function') callback(data, parseFloat(xhr.status));
      }
    });

    return $self;
  };

  /**
   * Decouple ajax request DELETE method, remove because javascript
   *
   * @param  {String}   uri      URI to be requested on.
   * @param  {Function} callback Callback to be called upon sucess.
   * @return {this}
   */
  $self.remove = function (uri, o, callback) {
    $.ajax(uri, {
      type: 'DELETE',
      dataType: 'json',
      data: o,
      statusCode: {
        403: function () { if (typeof callback === 'function') callback(undefined, 403); },
        404: function () { if (typeof callback === 'function') callback(undefined, 404); },
        500: function () { if (typeof callback === 'function') callback(undefined, 500); }
      },
      success: function (data, status, xhr) {
        if (typeof callback === 'function') callback(data, parseFloat(xhr.status));
      }
    });

    return $self;
  };

  /**
   * Decouple ajax request POST method
   *
   * @param  {String}   uri      URI to be requested on.
   * @param  {Function} callback Callback to be called upon sucess.
   * @return {this}
   */
  $self.post = function (uri, o, callback) {
    $.ajax(uri, {
      type: 'POST',
      dataType: 'json',
      data: o,
      statusCode: {
        403: function () { if (typeof callback === 'function') callback(undefined, 403); },
        404: function () { if (typeof callback === 'function') callback(undefined, 404); },
        500: function () { if (typeof callback === 'function') callback(undefined, 500); }
      },
      success: function (data, status, xhr) {
        if (typeof callback === 'function') callback(data, parseFloat(xhr.status));
      }
    });

    return $self;
  };

  /**
   * Attach copy functionality to any element
   * @param  {Object} el     jQuery or Dom Element
   * @param  {Boolean} copied Should this element's text be replaced with 'copied!'
   */
  $self.attachClipboard = function (el, copied) {
    var clip = new ZeroClipboard(el, { moviePath: "/embed/ZeroClipboard.swf" });
    if (copied) {
      clip.on( 'complete', function(client, args) {
        var $this = $(this), $orig = $this.text(); $this.text('Copied!');
        setTimeout(function () { $this.html($orig); }, 1500);
      });
    }

    return clip;
  };

  /**
   * Load specific feed uri based on input options.
   *
   * Details:
   *
   *     Template should iterate through "feed" variable for details
   *
   * Options:
   *
   * - uri          String, Feed uri to be called
   * - page         Number, Current page to load
   * - perPage      Number, amount shown on each request, default is ten
   * - loadingText  String, Loading text to show on 'more' button, default 'Loading...'
   * - loadText     String, Text when done, default 'Load More'
   * - button       jQuery Element, for button controls, default .more class
   * - template     String, mustache template
   * - output       jQuery Element, output will be appended to, default .activity class
   * - notices      Boolean, Should we iterate and clear new class from elements
   *
   * @param  {Object} opts Feed options
   */
  $self.loadFeed = function (opts) {
    opts.perPage = opts.perPage || 10;
    opts.page = opts.page || 1;
    opts.button = opts.button || $('.more');
    opts.output = opts.output || $('.activity');
    opts.delay = opts.delay || 1000;
    opts.button.addClass('disabled').text(opts.loadingText || 'Loading...');

    function clearNew (item, delay) {
      setTimeout(function () {
        item.removeClass('new');
      }, delay);
    }

    $.ajax({
      url: opts.uri + '?page=' + opts.page,
      type: 'GET',
      cache: false,
      dataType: 'json',
      success: function (res) {
        var output, delay = opts.delay, inc = 500, template = opts.template, $this;

        opts.button.removeClass('hidden').text(opts.loadText || 'Load More').removeClass('disabled');
        output = Mustache.render(template, { feed: res });

        if (res.length < opts.perPage) opts.button.text('No more activity').addClass('disabled');
        opts.output.find('.nothing').remove().end().append(output);

        if (opts.notices) opts.output.find('.new').each(function () {
          $this = $(this); delay += inc; clearNew($this, delay);
        });
      }
    });
  };

  return $self;
}, Mashape);