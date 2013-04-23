/*
 * Explore / Search pages
 * Author: Dali Zheng
 * Requires: jQuery, Mustache
 */

( function () {

	var _root = this;

	// follow & unfollow
	$( document ).on( 'click', '.follow', function () {
		var $this = $( this );
		if ( !$this.hasClass( 'disabled' ) ) {
			$this.addClass( 'disabled' );
			$.ajax( {
				url: $( '#meta-info' ).attr( 'data-follow' ) + '?categoryName=' + $( '#meta-info' ).attr( 'data-category' ),
				type: 'get',
				success: function ( res ) {
					$this.removeClass( 'disabled follow' ).addClass( 'unfollow' )
						.html( '<i class="icon-star-empty"></i>Unfollow' );
				}
			} );
		}
	} );
	$( document ).on( 'click', '.unfollow', function () {
		var $this = $( this );
		if ( !$this.hasClass( 'disabled' ) ) {
			$this.addClass( 'disabled' );
			$.ajax( {
				url: $( '#meta-info' ).attr( 'data-unfollow' ),
				type: 'post',
				data: 'authenticityToken=' + $( '#meta-info' ).attr( 'data-authenticity-token' ) +
					'&categoryName=' + $( '#meta-info' ).attr( 'data-category' ),
				success: function ( res ) {
					$this.removeClass( 'disabled unfollow' ).addClass( 'follow' )
						.html( '<i class="icon-star"></i>Follow' );
				}
			} );
		}
	} );

} ).call( this );

$( function () {

	// Title links
	$( '[title]' ).each( function () {
		$( this ).attr( 'data-title', $( this ).attr( 'title' ) ).removeAttr( 'title' ).justTheTip().arrow( 11 );
	} );

	// get consumer/follower counts
	var ids;
	try {
		ids = new FormData();
	} catch ( e ) {
		throw new Error( 'Native FormData object doesn\'t exist.' );
	}
	$( '.api[id]' ).each( function () {
		ids.append( 'ids', $(this).attr( 'id' ) );
	});
	ids.append( 'authenticityToken', $( '#meta-info' ).attr( 'data-authenticity-token' ) );

	// var currentPage = 1;
	// 
	// $(document).on('click', '.more',function () {
	// 	if (!$(this).hasClass('disabled')) {
	// 		Mashape.core.loadFeed({
	// 			uri: '/explore/' + $(this).attr('data-category'),
	// 			page: currentPage,
	// 			loadText: $(this).text(),
	// 			notices: true,
	// 			template: $('[data-template]').html()
	// 		});

	// 		currentPage++;
	// 	}
	// });

	// $('.more').click();

	$.ajax( {
		url: $( '#meta-info' ).attr( 'data-stats-url' ),
		type: 'post',
		cache : false,
		contentType : false,
		processData: false,
		dataType: 'json',
		data: ids,
		success: function ( res ) {
			var i = 0, $api;
			for( i; i < res.length; i++ ) {
				$api = $( '#' + res[i].id );
				$api.find( '.right span' ).first().text( res[i].consumers );
				$api.find( '.right span' ).last().text( res[i].followers );
			}
		}
	} );

} );