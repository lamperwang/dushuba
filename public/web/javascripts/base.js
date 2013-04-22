/*
 * Mashape4 web
 * base.js - requires jQuery 1.8+, Mustache
 * Author: Dali Zheng, [insert author here]
 */

$( function () {

/* message for the IE8 and below lumpenproletariats */
	if ( $.browser.msie && parseInt( $.browser.version, 10 ) < 9 ) {
		$( 'body' ).prepend( "<div id='lamerBox'>Internet Explorer 8 and below is unsupported. <a href='http://www.google.com/chrome'>Please upgrade your browser</a>.</div>" );
	}

/* usermenu dropdown */
( function () {
var dropdown = $( "#dropdown" ),
	dropdownMenu = $( "#dropdownMenu" ),
	dropdownSpace = $( "#dropdownSpace" ),
	dropdownDuration = 200;
dropdown.children( "a" ).click( function ( e ) {
	e.preventDefault();
	dropdownMenu.slideToggle( {
		duration:dropdownDuration,
		step : function () { $( window ).resize(); }
	} );
	dropdownSpace.slideToggle(dropdownDuration);
	dropdownMenu.promise().done( function () {
		dropdown.toggleClass( "pressed" );
		$( window ).resize();
	} );
} );
$( "footer,section:not(#dropdownMenu)" ).click( function () {
	dropdownMenu.slideUp( {
		duration:dropdownDuration,
		step : function () { $( window ).resize(); }
	} );
	$( ".dropdown > a" ).removeClass( "focus" );
	dropdownSpace.slideUp(dropdownDuration);
	dropdownMenu.promise().done( function () {
		dropdown.removeClass( "pressed" );
		$( window ).resize();
	} );
} );
})();

/* other dropdown */
( function () {
	var dropdown = $( ".dropdown" ), items = dropdown.find( ".item a" ), _index = 0;
	if( dropdown.length ) {
		dropdown.find( ".filter" ).on( "click", function ( e ) {
			e.stopPropagation();
		} );
		dropdown.find( ".filter input" ).on( "keyup", function ( e ) {
			if ( e.keyCode == 27 ) {
				$("footer").click();
			} else if ( e.keyCode == 40 ) { // going up
				if ( _index < items.filter(':visible').length - 1 ) _index++;
			} else if ( e.keyCode == 38 ) { // going down
				if ( _index > 0 ) _index--;
			} else if ( e.keyCode == 13 ) {
				items.filter( ':visible' ).eq( _index ).click();
			} else {
				_index = 0;
				var val = new RegExp( $( this ).val(), "i" );
				dropdown.find( ".item a" ).each( function () {
					if( !$( this ).text().match( val ) ) {
						$( this ).parent().addClass( 'hidden' );
					} else {
						$( this ).parent().removeClass( 'hidden' );
					}
				} );
			}
			items.removeClass( 'selected' );
			items.filter(':visible').eq( _index ).addClass( 'selected' );
		} );
		dropdown.children( "a" ).on( "click",function ( e ) {
			e.stopPropagation();
			$( this ).addClass( "focus" );
			dropdown.find( '.filter input' ).focus();
		} );
		items.on( "click", function ( e ) {
			if ($( this ).attr( "href" ) != "#" ) { window.location = $( this ).attr( "href" ); }
		} );
	}
})();

/* tooltips */
$( "[title]" ).each( function () { $( this ).proTip(); } );

/* external links */
$( "[rel='external']" ).each( function () {
	$( this ).attr( "target","_blank" );
} );

/* layout magic on pricing page */
if ($( "#pricing:not(.admin,.sideMenu)" ).length) {
	if ($( "#pricing:not(.admin) .plan" ).length < 4) {
		//$( "#pricing .plan" ).css( "width",(100/$( "#pricing .plan" ).length)+ "%" );
		$( "#pricing .plan" ).css( "width","25%" );
		$( "#pricing .plan" ).first().css( "margin-left",(100/8)* (4-$( "#pricing .plan" ).length)+ "%" );
	} else {
		$( "#pricing .plan" ).css( "width","25%" );
	}
	$( "#pricing .plan.popular" ).prepend( "<span class='mostPopular'>Most Popular</span>" ).css( "height",$( "#pricing" ).height()-28+ "px" );
	$( "#pricing .plan:not(.popular)" ).css( "height",$( "#pricing" ).height()-28+ "px" );
	}

/* activity feed: JSON + Mustache */
function loadFeed (template) {
	$.getJSON(
		$( ".activity" ).attr( "data-link" ),function (data) {
		$( "a.more" ).css( "visibility","visible" );
		wrapper.feed = data;
		output = Mustache.render(template,wrapper);

		if (output.length === 0 || output.length == 1) {
			$( ".activity" ).addClass( "apis" );
			output="<li><h5>No recent activity :(</h5></li>";
			$( "a.more" ).remove();
		}

		if (data.length < perPage) $( "a.more" ).html( "No more activity" ).addClass( "disabled" );
		$( ".activity" ).html(output);

		setTimeout( function () {
			$( "li.new" ).removeClass( 'new' );
		}, 2000 );
	});
}

if ($( ".activity" ).length) {
	if (window.localStorage) {
		if (localStorage.getItem( "gettingStarted" ) != "false" )
			$( "#activityBox" ).show();

		$( "#activityBox .deleteButton" ).click( function ( e ) {
			mixpanel.track( "gettingStarted-hide" );
			$( "#activityBox" ).hide();
			localStorage.setItem( "gettingStarted", "false" );
		} );
	}

var output, feedTemplate = $( "#feed-template" ).html(), page = 1, perPage = 10, wrapper = {};
loadFeed(feedTemplate);

$( "a.more" ).click( function () {
	if (!$( this ).hasClass( "disabled" )) {
		var txt = $( this ).text();
		$( this ).addClass( "disabled" ).text( "Loading..." );
		$.getJSON(
			$( ".activity" ).attr( "data-link" )+$( "a.more" ).attr( "data-link" ) + ( page + 1 ), function ( data ) {
			wrapper.feed = data;
			output = Mustache.render(feedTemplate, wrapper );
			$( "a.more" ).removeClass( "disabled" ).text(txt);
			$( ".activity" ).append( output );
			if (output.length === 0 || output.length == 1 || data.length < perPage) {$( "a.more" ).html( "No more activity" ).addClass( "disabled" );}
			page++;
			setTimeout( function () { $( "li.new" ).removeClass( 'new' ); }, 2000 );
		} );
	}
	} );
}

/* horizontal scroller */
if ($( "#scroller" ).length) {
( function () {
	var drag, slide, slidePosition, initial, move, pageX, outerBorder, innerBorder, max, scrollLength, moveSlider,
		x = 0,
		visibleItems = 3,
		scrollbar = $( "#scroller" ),
		scroller = $( "#scroller span" ),
		container = $( "#slider .container" ),
		prefixes = [ "-webkit-", "-moz-", "-ms-", "-o-", "" ],
		doSlide = function () {
			slide = true;
			x+=1;
			$( window ).trigger( "mousemove", x);
		},
		scroll = function ( scrollerX, containerX ) {
			for ( var i = 0, k = prefixes.length - 1; i < k; i++ ) {
				scroller.css( prefixes[ i ] + "transform", "translate(" + scrollerX + "px, 0)" );
				container.css( prefixes[ i ] + "transform", "translate(" + containerX + "px, 0)" );
			}
		};

	$( "#slider" ).css( "overflow", "hidden" );
	if ($( "#slider .container .item" ).length > visibleItems) { scrollbar.show(); }

	scrollbar.mousedown( function ( e ) {
		clearInterval( moveSlider );
		initial = scroller.outerWidth() / 2;
		$( window ).trigger( "mousemove", e.pageX );
	} );
	scroller.on( "mousedown", function ( e ) {
		clearInterval( moveSlider );
		drag = true;
		$( this ).addClass( "drag" );
		initial = e.pageX-$( this ).offset().left;
		e.stopPropagation();
		e.preventDefault();
	} );
	$( "#slider" ).on( "mousedown",function ( e ) {
		clearInterval( moveSlider );
		slide = true;
		initial = e.pageX;
		slidePosition = -(move/max)*scrollLength;
		$( "body" ).addClass( "slide" );
		e.preventDefault();
	} );
	$( window ).on( "mousemove", function ( e, x ) {
		pageX = e.pageX || x;
		if (drag) {
			move = pageX-scrollbar.offset().left-outerBorder-innerBorder-initial;
			move = move > max ? max : move;
			move = move < 0 ? 0 : move;
			scroll( move, -( move / max ) * scrollLength );
		} else if ( slide ) {
			if ( !x ) { move = -( slidePosition + pageX - initial) * max / scrollLength; }
			else { move = x * max / scrollLength; }
			move = move > max ? max : move;
			move = move < 0 ? 0 : move;
			scroll( move, -( move / max ) * scrollLength );
		}
	} );
	$( window ).on( "mouseup",function () {
		drag = false; slide = false;
		scroller.removeClass( "drag" );
		$( "body" ).removeClass( "slide" );
	} );
	$( window ).resize( function () {
		scrollLength = ($( "#slider" ).width()/visibleItems)* ($( "#slider .container .item" ).length-visibleItems);
		scrollLength = scrollLength < 0 ? 0 : scrollLength;
		outerBorder = (scrollbar.outerWidth()-scrollbar.width())/2;
		innerBorder = (scroller.outerWidth()-scroller.width())/2;
		max = scrollbar.innerWidth()-scroller.outerWidth()-outerBorder-innerBorder;
		move = scroller.position().left-outerBorder;
		if (move>max) {
			scroll( max, -scrollLength );
		}
	} );
	$( window ).resize();

	moveSlider = setInterval(doSlide,50);

})();
}

/* check for blank required form fields */
$( "form" ).submit( function ( e ) {
	var error;
	$( this ).find( "[placeholder='Required'],[required]" ).each( function () {
		$( this ).removeClass( "error" );
		enabledInput = $( this ).parent().parent().children( "input[type='hidden']" ).attr( "value" ) || "true";
		if (!(enabledInput == "true" || enabledInput == "false" )) {
			enabledInput = "true";
		}
		if ($( this ).val() === "" && enabledInput == "true" ) {
			$( this ).addClass( "error" ).focus();
			$( this ).on( "keyup blur",function () {
				$( this ).removeClass( "error" );
			} );
			error = true;
			return false;
		}
	} );
	if (error) {
		e.preventDefault();
		var destination = $( ".error" ).first().offset().top;
		$( "html:not(:animated),body:not(:animated)" ).animate( { scrollTop: destination-97}, 400 );
	}
	return error ? false : true;
} );

/* show private key */
$( "#viewPrivateKey" ).click( function () {
	if (!$( this ).hasClass( "disabled" )) {
		$( this ).addClass( "disabled" );
		$( ".privateKey" ).toggle();
		$( this ).hide();
		}
	} );

/* signup validation */
$( ".signup" ).find( "input[type='submit']" ).focus( function () {
	$( this ).parents( "form" ).find( "input[name='isHuman']" ).attr( "value","true" );
} );
$( ".popup.add" ).find( "input[type='submit']" ).focus( function () {
	$( this ).parents( "form" ).find( "input[name='isHuman']" ).attr( "value","true" );
} );

/* homepage logos */
if ($( "#home" ).length) {
( function () {
	var init = "", img = [], opacity,
		apiCount = 64, rows = 4, randomness = Math.floor( Math.random() * apiCount );
		api_ids = $( "header" ).attr( "data-apis" ).split( "," );
	$( "header" ).prepend( "<div class='apiWrapper'><div class='apiContainer'><div class='wrapper'></div></div></div>" );
	for( var x = 0; x < apiCount; x++ ) {
		opacity = 40 * ( Math.floor( x * rows / apiCount ) / rows ) / 100;
		img[x] = api_ids[ ( x + randomness ) % api_ids.length ];
		init += "<div class='api' id='api-" + x + "'><img style='opacity: " +(0.25+opacity)+ ";' src='https://s3.amazonaws.com/mashape-fs-production/apis/" + img[x] + "/logo.png' id='api-logo-" + x + "'></div>";
	}
	$( "header .apiContainer .wrapper" ).append( init );
} )();
}

/* header popup links */
$( "#headerLogin" ).click( function ( e ) {
	$( ".popup" ).not( ".login" ).hide();
	$( ".popup.login" ).fadeToggle( 200 );
	$( ".popup.login input.first" ).focus();
	e.preventDefault();
	e.stopPropagation();
} );
$( "#headerSignup" ).click( function ( e ) {
	if ( !$( ".popup.signup" ).is( ":visible" ) && !localStorage.getItem( 'clickedSignup' ) ) {
		localStorage.setItem( 'clickedSignup', true );
		mixpanel.track( "button-signup" ); //analytics
	}
	$( ".popup" ).not( ".signup" ).hide();
	$( ".popup.signup" ).fadeToggle( 200 );
	$( ".popup.signup input.first" ).focus();
	e.preventDefault();
	e.stopPropagation();
} );
$( "#addButton" ).click( function ( e ) {
	if (!$( ".popup.addAPI" ).is( ":visible" )) mixpanel.track( "addAPI-click" ); // analytics
	$( ".popup.addAPI" ).fadeToggle( 200 );
	$( ".popup.addAPI input.first" ).focus();
	e.preventDefault();
	e.stopPropagation();
} );
$( "html,body" ).click( function () {
	$( ".popup" ).fadeOut( 200 );
} );
$( ".popup" ).click( function ( e ) {
	e.stopPropagation();
	$( this ).stop( true, true ).show();
} );
$( "#reportIssue" ).click( function () {
	mixpanel.track( "report-issue" );
} );

/* addAPI input tooltip */
$( ".addAPI .tooltip input" ).focus( function () {
	$( this ).parent().mouseover().find( ".tooltipContainer" ).css( "visibility","visible" );
} );
$( ".addAPI .tooltip input" ).blur( function () {
	$( this ).parent().find( ".tooltipContainer" ).css( "visibility","hidden" );
} );

/* intro page layout magic */
if ($( "#intro" ).length) {
	$( "html" ).css( "height", "100%" );
}

/* inbox page layout magic */
if ($( ".sideMenu" ).length) {
	$( ".sideMenu" ).css( "height", $( ".inbox .container" ).innerHeight() - $( ".inbox h2" ).outerHeight() + 1 + "px" );
}

/* explore page layout magic */
window.minHeightFix = function () {
	var minHeight = $( ".selectorSection .container" ).height();
	minHeight = $.browser.mozilla ? minHeight - parseInt($( ".selectorSection .container > .content" ).css( "padding-top" ),0) - parseInt($( ".selectorSection .container > .content" ).css( "padding-bottom" ),0)
		: minHeight;
	if ( navigator.userAgent.match( /AppleWebKit/ig ) ) minHeight++;
	$( ".selectorSection .container > .content" ).css( "min-height", minHeight + 64 + "px" );
};
$( window ).load( minHeightFix );

/* textarea char limit */
window.bindLimit = function ( limit ) {
	var txt = $( ".conversation textarea" ).length ? $( ".conversation textarea" ) : $( "#modalContainer textarea" );
	var counter = $( ".conversation textarea" ).length ? $( ".conversation form p" ) : $( "#modalContainer .counter" );
	txt.change( function () {
		if (txt.val().length > limit) {
			txt.val(txt.val().substring(0,limit));
			}
		counter.text(limit-txt.val().length+ " characters remaining" );
		} );
	txt.keyup( function () {$( this ).change();} );
	txt.change();
	};
if ($( ".conversation textarea" ).length) {
	bindLimit( 1000 );
}

/* profile change avatar: HTML5 File API */
if ($( "#changeAvatar" ).length) {
	$( "#changeAvatar" ).click( function () {
		$( "input[type=file]" ).click();
		} );
	$( "input[type=file]" ).on( "change",function ( e ) {
		var file = e.target.files[0];
		if ( file.type.match( "image.*" )) {
			var reader = new FileReader();
			reader.onload = ( function (theFile) {
				return function ( e ) {
					$( ".profileSettings img" ).attr( "src",e.target.result);
					};
				})( file);
			reader.readAsDataURL( file);
			}
		} );
	}

/* checkboxes */
$( "input[type=checkbox]:not(.notFancy)" ).each( function () {
	var classes = "";
	if ($( this ).attr( "class" ) !== undefined) { classes = " " +$( this ).attr( "class" ); }
	$( this ).wrap( "<a href='#' class='fancyCheck" + classes + "' />" ).hide();
	$( this ).parent().click( function () { toggle( $( this ) ); } );
	function toggle ( obj ) {
		obj.toggleClass( "checked" );
		obj.children( "input" ).attr( "checked",function ( i, e ) { return !e; } );
		}
	if ($( this ).is( ":checked" )) {$( this ).parent().addClass( "checked" );}
	} );

/* update credit card */
$( "#updateCard" ).click( function () {
	$( ".creditCard" ).slideToggle( function () {
		$( ".subscribe" ).toggle();
		$( "#updateCard" ).toggleClass( "inverted" );
		$( ".sideMenu" ).css( "height",$( ".inbox .container" ).innerHeight()-$( ".inbox h2" ).outerHeight() + 1 + "px" );
	} );
} );

/* dashboard filter */
$( ".box input.filter" ).on( "keyup", function ( e ) {
	var val = new RegExp( $( this ).val(), "i" );
	$( this ).parent().find( '.no-match' ).remove();
	$( this ).parent().find( "li" ).each( function () {
		if( !$( this ).find( 'a:not(.admin)' ).text().match( val ) ) {
			$( this ).addClass( 'hidden' );
		} else {
			$( this ).removeClass( 'hidden' );
		}
	} );
	if ( !$( this ).parent().find( "li:not(.hidden)" ).length ) {
		$( this ).parent().children( 'ul' ).append( "<li class='nothing no-match'><h5>No matches.</h5></li>" );
	}
} );

/* simple tab filter */
$( ".showAll" ).click( function () { $( this ).tabFilter( "li" ); } );
$( ".showConsumed" ).click( function () { $( this ).tabFilter( ".consumedAPI" ); } );
$( ".stat .showConsumed" ).click( function () { $( ".sortBy .showConsumed" ).click(); } );
$( ".showPublished" ).click( function () { $( this ).tabFilter( ".publishedAPI" ); } );
$( ".stat .showPublished" ).click( function () { $( ".sortBy .showPublished" ).click(); } );
$( ".showFollowed" ).click( function () { $( this ).tabFilter( ".followedAPI" ); } );
$( ".stat .showFollowed" ).click( function () { $( ".sortBy .showFollowed" ).click(); } );
$( ".showPublic" ).click( function () { $( this ).tabFilter( ".publicAPI" ); } );
$( ".showPrivate" ).click( function () { $( this ).tabFilter( ".privateAPI" ); } );

/* Shorten API description */
$( ".APIdescription" ).each( function () {
	var cutoff = 320;
	if ($( this ).text().length > cutoff) {
		var desc = $( this ).html();
		$( this ).html(desc.slice(0,cutoff)+ "<a href='#' class='readMore'>more</a>" );
		$( this ).append( "<span style='display:none;'>" +desc.slice(cutoff)+ "</span>" );
		$( this ).find( ".readMore" ).click( function () {
			$( this ).parent().find( "span" ).show();
			$( this ).remove();
		} );
	}
} );

/* Semi-fixed sidebar */
if ( $( ".selectorSection .selector" ).length ) {
( function () {
	var top,scroll,max,position;
	var section = $( ".selectorSection .container" );
	var sidebar = $( ".selectorSection .selector" );
	var sidebarHeight = sidebar.outerHeight();
	var sidebarWidth = sidebar.width()/section.outerWidth();
	var dropdown = $( "#dropdownSpace" );
	var initial = sidebar.offset().top;
	var headerHeight = $( "#header" ).outerHeight();
	$( window ).on( "scroll resize",function () {
		max = initial+section.height();
		scroll = $( window ).scrollTop();
		if (initial+sidebarHeight-headerHeight>$( window ).height()) {
			top = 0;
			position = "relative";
		} else if (scroll+headerHeight+sidebarHeight>max) {
			top = max-sidebarHeight-initial;
			position = "relative";
		} else if (scroll+headerHeight>initial) {
			top = headerHeight;
			top += dropdown.is( ":visible" ) ? dropdown.height() : 0;
			position = "fixed";
		} else {
			top = 0;
			position = "relative";
		}
		sidebar.css( {
			'top':top,
			'position':position,
			'width':sidebarWidth*section.width()-1
		} );
	} );
	$( window ).resize();
})();
}

/* API documentation */
$( "[data-link] > a,[data-model] span" ).bindAPIclick();
$( 'a[href^=#]' ).bindScrollClick();

if ( location.hash ) {
	if ( location.hash.match( /model/ ) ) {
		$( ".modelBox > a[data-model='" + location.hash.slice( 1 ) + "'] span" ).trigger( 'click', [ true ] );
	} else {
		var _sel = $( ".action[data-link='" + location.hash.slice( 1 ) + "'] > a" );
		if ( _sel.length ) { _sel.click(); } else {
			$(window).load(function(){
				if ( $( location.hash ).length )
					$('html,body').scrollTop( $( location.hash ).offset().top - ( $('header').height() + 10 ) );
			});
		}
	}
} else {
	$( '.action > a' ).first().trigger( 'click', [ true ] );
}

/* show oauth */
$( ".show-oauth" ).click( function () {
	$( ".oauth-url" ).show();
	$( this ).hide();
} );

/* bind daliModal */
$( ".importDoc" ).click( function () {
	daliModal( {
		title: "Import Documentation",
		content: $( "#modal-import-documentation" ).html()
	} );
} );
$( ".message:not(.apiCount)" ).click( function () {
	if ( $( '#guest' ).length === 0 ) {
		daliModal( {
			title: "Send Message",
			content: $( "#modal-message" ).html(),
			init: function () {
				$( '#modalContainer form' ).submit( function ( e ) {
					$( 'input[type="submit"]' ).addClass( 'disabled' );
				} );
			}
		} );
		bindLimit( 1000 );
	}
} );
$( "#reportIssue" ).click( function () {
	daliModal( {
		title: "Report an Issue",
		content: $( "#modal-report" ).html()
	} );
	bindLimit( 1000 );
} );
$( "#showCard" ).click( function () {
	daliModal( {
		title: "Credit Card Information",
		content: $( "#modal-billing-info" ).html()
	} );
} );
$( "#showAddon" ).click( function () {
	daliModal( {
		title: "Choose an API",
		content: $( "#modal-choose-api" ).html()
	} );
} );
$( "#dropdownMenu .invite a" ).click( function () {
	daliModal( {
		title: "Invite Fellow Hackers",
		content: $( "#modal-invite" ).html()
	} );
	mixpanel.track( "invite-click" );
} );
$( ".viewTransaction" ).click( function () {
	daliModal( {
		title: "Transaction Details",
		content: $( this ).parent().parent().find( ".modal-transaction-info" ).html()
	} );
} );

// api status check
window.getApiStatus = function ( path, ids ) {
	$.ajax( {
		url: path,
		type: 'POST',
		cache : false,
		contentType : false,
		processData: false,
		data: ids,
		success: function ( data ) {
			var cls, txt, status;
			for( var k = 0; k < data.length; k++ ) {
				txt = data[k].status;
				color = data[k].color;
				if ( color === 0 ) {
					cls = "inactive";
				} else if ( color === 1 ) {
					cls = "active";
				} else {
					cls = "warning";
				}
				$( ".api-" +data[k].id+ " a:not(.button)" ).removeClass().addClass(cls);
				$( ".api-" +data[k].id+ " .availability .tooltipText" ).text(txt);
				$( "#" +data[k].id+ " .status" ).show().addClass(cls).find('.inner-text').text(data[k].status).end()
					.find('.tooltipText').text( "Checked on " + data[k].lastCheck );
			}
		}
	} );
};

/* remove API from dashboard */
$( '.remove-api' ).click( function () {
	var url = $( this ).parent().children( 'form' ).attr( 'action' );
	var token = $( this ).parent().children( 'form' ).children( 'input' ).val();
	$.ajax( {
		url: url,
		type: 'post',
		data: 'authenticityToken=' + token,
		success : function ( res ) {
			var newToken = $(res).find( 'input[name="authenticityToken"]' ).val();
			$( 'input[name="authenticityToken"]' ).val( newToken );
		}
	} );
	var counter = $( this ).parents( '.box' ).find( '.light' );
	var num = parseInt( counter.text().replace('(','').replace(')',''), 0 );
	counter.text( "(" + ( num - 1 ) + ")" );
	$( this ).parent().remove();
} );

/* Documentation table of contents */
if ( $( ".doc:not(.static) h1:not(.noTOC)" ).length ) {
	var docPage = $( "div.doc" ),
		toc = '<div id="toc"><h3>Table of Contents</h3><ol>';
	docPage.find( "h2" ).each( function () {
		toc += '<li><a href="#' + $( this ).attr('id') + '">' + $( this ).text() + '</a></li>';
	});
	toc += "</ol></div>";
	docPage.find("h1").first().after(toc);
	$( "#toc a" ).bindScrollClick();
}

//end document ready
} );


//jQuery extended methods
( function ( window, $, undefined ) {

/* tooltips */
$.fn.proTip = function () {
	if ($( this ).attr( "title" ) !== "" ) {
		var tooltipText = $( this ).attr( "title" );
		$( this ).attr( "title","" ).addClass( "tooltip" );
		$( this ).append( "<span class='tooltipContainer'><span class='arrow'></span><span class='tooltipText'>" + tooltipText + "</span></span>" );
		var txt = $( this ).find( ".tooltipText" );
		txt.hide();
		$( this ).on( 'mouseover', function () {
			$( 'body' ).addClass( 'no-scroll' );
			txt.css( "left",-txt.outerWidth() / 2 + "px" );
			txt.show();
		} );
		$( this ).on( 'mouseout', function() {
			$( 'body' ).removeClass( 'no-scroll' );
		} );
	}
};

/* click on endpoint or model */
$.fn.bindAPIclick = function () {
	this.click( function ( e, suppress ) {
		if ( $( this ).parent().attr( "data-link" ) !== undefined ||
			!$( "#" +$( this ).parent().attr( "data-model" )).is( ":visible" ) ) {
			var endpointName = $( this ).parent().attr( "data-link" ),
				destination = $( "#content" ).offset().top;
			$( ".action" ).removeClass( "open" );
			$( this ).parent().addClass( "open" );
			$( "#content > div" ).hide();
			$( "#" + endpointName ).show();
			$( "#content [data-endpoint='" + endpointName + "']" ).show();
			$( "#" +$( this ).parent().attr( "data-model" )).show();
			$( "#" +$( this ).parent().attr( "data-model" )).find( ".model-name" ).css( "padding-left","0px" );
			if ($( this ).parent().attr( "data-model-array" ) == "true" ) {
				$( "#" +$( this ).parent().attr( "data-model" )).find( "span.array" ).show();
				$( "#" +$( this ).parent().attr( "data-model" )).find( ".model-name" ).css( "padding-left","50px" );
			} else {
				$( "#" +$( this ).parent().attr( "data-model" )).find( "h3 span.array" ).hide();
			}
			if ( !suppress ) {
				$( "html:not(:animated), body:not(:animated)" ).animate( { scrollTop : destination - 77 }, 400 );
				if ( history.replaceState !== undefined )
					history.replaceState( {}, "", "#" + ( endpointName || $( this ).parent().attr( "data-model" ) ) );
			}
		} else if ( $( this ).parent().attr( "data-model" ) !== undefined && suppress ) {
			$( "#content > div" ).hide();
			$( "#" + $( this ).parent().attr( "data-model" ) ).show();
		}
		e.preventDefault();
	} );
};

/* click on any hash link */
$.fn.bindScrollClick = function () {
	this.click( function ( e ) {
		if ( $( $( this ).attr( "href" ) ).length && !$( this ).parent().attr('data-link') ) {
			var destination = $( $( this ).attr( "href" ) ).offset().top;
			$( "html:not(:animated),body:not(:animated)" ).animate( { scrollTop : destination - 77 }, 400 );
			if ( history.replaceState !== undefined )
				history.replaceState( {}, "", $( this ).attr( "href" ) );
		}
		e.preventDefault();
    } );
};

/* tab filter */
$.fn.tabFilter = function ( param ) {
	$( this ).parent().find( "a" ).removeClass( "current" );
	$( this ).addClass( "current" );
	var parent = $( this ).parent().parent().parent();
	parent.find( "li" ).hide();
	parent.find( param + ":not(.nothing)" ).show();
	if ( !parent.find( "li" ).is( ":visible" ) ) {
		parent.find( "ul" ).append( "<li class='nothing'><h5>Nothing here.</h5></li>" );
	}
};

} )( window, jQuery );