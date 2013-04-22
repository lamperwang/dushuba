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
})('events', function () {
  var topics = {}, subUid = -1, $self = {};

  $self.subscribe = function(topic, func) {
    if (!topics[topic]) topics[topic] = [];
    var token = (++subUid).toString();

    topics[topic].push({
      token: token,
      func: func
    });

    return token;
  };

  $self.publish = function(topic, args) {
    if (!topics[topic]) return false;

    setTimeout(function() {
      var subscribers = topics[topic], len = subscribers ? subscribers.length : 0;

      while (len--) subscribers[len].func(topic, args);
    }, 0);

    return true;
  };

  $self.unsubscribe = function(token) {
    for (var m in topics)
      if (topics.indexOf(m))
        for (var i = 0, j = topics[m].length; i < j; i++)
          if (topics[m][i].token === token && topics[m].splice(i, 1))
            return token;

    return false;
  };

  return $self;
}, Mashape);