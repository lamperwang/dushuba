( function ( window, undefined ) {

  // mixpanel
  if ( !document.domain.match( 'localhost' ) ) {
  (function(c,a){var b,d,h,e;b=c.createElement("script");b.type="text/javascript";b.async=!0;b.src=("https:"===c.location.protocol?"https:":"http:")+'//api.mixpanel.com/site_media/js/api/mixpanel.2.js';d=c.getElementsByTagName("script")[0];d.parentNode.insertBefore(b,d);a._i=[];a.init=function(b,c,f){function d(a,b){var c=b.split(".");2==c.length&&(a=a[c[0]],b=c[1]);a[b]=function(){a.push([b].concat(Array.prototype.slice.call(arguments,0)))}}var g=a;"undefined"!==typeof f?g=
  a[f]=[]:f="mixpanel";g.people=g.people||[];h="disable track track_pageview track_links track_forms register register_once unregister identify name_tag set_config people.set people.increment".split(" ");for(e=0;e<h.length;e++)d(g,h[e]);a._i.push([b,c,f])};a.__SV=1.1;window.mixpanel=a})(document,window.mixpanel||[]);
      mixpanel.init("edc12ad5d46d05edf411234b39e09d3f");

      // report errors to mixpanel
      window.onerror = function ( e, url, line ) {
          if(url.match("mashape")) mixpanel.track( "error", {
            "errormsg" : e,
            "url" : url,
            "page" : window.location.pathname,
            "userAgent" : window.navigator.userAgent
          });
      };
  } else {
    // dummy mixpanel to stop errors
    var dummy = function () {};
    dummy.prototype = {
      track:dummy, name_tag:dummy, register:dummy, track_forms:dummy, identify:dummy, people:{set:dummy}
    };
    window.mixpanel = new dummy();
  }

} )( window );

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-8499472-1']);
_gaq.push(['_trackPageview']);

( function() {
 var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
 ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
 var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
} )();