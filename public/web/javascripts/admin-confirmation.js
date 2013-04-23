$( function () {
	
	$( "a:not(.fancyCheck)" ).click( function ( e ) {
		$this = $( this );
		$( "section" ).find( "input, filter, select" ).not( '.filter-input' ).each( function () {
			if ( $( this ).data( "changed" ) ) {
				e.preventDefault();
				daliModal( {
					title:		'Unsaved Changes',
					content:	'<p>You have unsaved changes. Are you sure you want to leave this page?</p>',
					callback:	function () { window.location = $this.attr( "href" ); }
				} );
				return false;
			}
		} );
	} );
	
	$( 'input, textarea, select' ).focus( function () {
		if ( !$( this ).data( "oldValue" ) ) {
			var type = $( this ).attr( "type" );
			if (type && type.toLowerCase() == "checkbox" ) {
				$( this ).data( "oldValue", $( this ).is( ':checked' ) );
			} else {
				$( this ).data( "oldValue", $( this ).val() );
			}
		}
	} );
	
	$( 'input, textarea, select' ).change( function () {
		var type = $( this ).attr( "type" ),
			val = $( this ).val();
		if ( type && type.toLowerCase() == "checkbox" ) {
			val = $( this ).is( ':checked' );
		}
		if( $( this ).data( "oldValue" ) != val ) {
			$( this ).data( "changed", true);
		} else {
			$( this ).data( "changed", false );
		}
	} );

	$( '.fancyCheck' ).find( 'input' ).trigger( 'focus' ).end().click( function () {
		$( this ).find( 'input' ).trigger( 'change' );
	} );
} );