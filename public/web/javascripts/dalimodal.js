( function ( window, $, undefined ) {

	/* daliModal */
	$.fn.daliModal = function ( options ) {
		if ( !$( "#modalContainer" ).length ) {
			var defaults = {
					title : 'Dialog',
					content : '<p>Hello</p>'
				},
				body = $( "body" ).prepend( '<div id="modalOverlay" /><div id="modalContainer" />' ),
				overlay = $( "#modalOverlay" ),
				container = $( "#modalContainer" ),
				confirm = "",
				escape = function ( e ) {
					if ( e.which ==27 ) overlay.click();
					if ( e.which == 32 && container.find( ".accept" ).is( ":focus" ) ) container.find( ".accept" ).click();
				},
				resize = function () {
					container.css( "left", $( window ).width() / 2 - container.width() / 2 );
					container.css( "top", $( window ).height() / 2.3 - container.height() / 2 );
				};

			options.title = options.title || defaults.title;
			options.content = options.content || defaults.content;

			overlay.hide().fadeIn( 200 );
			overlay.click( function () {
				$( window ).unbind( ".daliModal" );
				container.remove();
				$( this ).remove();
			} );
			container.append( "<h2 /><div class='content' />" );
			container.children( "h2" ).html( options.title ).append( "<span class='cancel' />" );
			container.children( ".content" ).html( options.content );

			if ( options.callback || options.close ) {
				confirm += "<div class='confirm'>";
				if ( options.callback ) {
					confirm += "<a href='#' class='button grey cancel'><span>Cancel</span></a>";
					confirm += "<a href='#' class='button accept'><span>OK</span></a>";
				} else {
					confirm += "<a href='#' class='button grey cancel'><span>Close</span></a>";
				}
				confirm += "</div>";
				container.children( ".content" ).append( confirm );
				container.find( ".accept" ).focus().click( function ( e ) {
					if ( options.callback ) options.callback();
					overlay.click();
					e.preventDefault();
				} );
			}
			if ( typeof options.init == "function" ) { options.init(); }
			if ( typeof options.close == "function" ) {
				overlay.click( function () { options.close(); } );
			}
			container.find( ".cancel" ).click( function ( e ) {
				overlay.click();
				e.preventDefault();
			} );
			$( window ).bind( "keyup.daliModal", escape ).bind( "resize.daliModal", resize );
			$( window ).resize();
		}
	};

	window.daliModal = $.fn.daliModal;

} )( window, jQuery );