/* global screenReaderText */
/**
 * Theme functions file.
 *
 * Contains handlers for navigation and widget area.
 */

( function( $ ) {
	var body, masthead, menuToggle, siteNavigation, socialNavigation, siteHeaderMenu, resizeTimer;

	function initMainNavigation( container ) {

		// Add dropdown toggle that displays child menu items.
		var dropdownToggle = $( '<button />', {
			'class': 'dropdown-toggle',
			'aria-expanded': false
		} ).append( $( '<span />', {
			'class': 'screen-reader-text',
			text: screenReaderText.expand
		} ) );

		container.find( '.menu-item-has-children > a' ).after( dropdownToggle );

		// Toggle buttons and submenu items with active children menu items.
		container.find( '.current-menu-ancestor > button' ).addClass( 'toggled-on' );
		container.find( '.current-menu-ancestor > .sub-menu' ).addClass( 'toggled-on' );

		// Add menu items with submenus to aria-haspopup="true".
		container.find( '.menu-item-has-children' ).attr( 'aria-haspopup', 'true' );

		container.find( '.dropdown-toggle' ).click( function( e ) {
			var _this            = $( this ),
				screenReaderSpan = _this.find( '.screen-reader-text' );

			e.preventDefault();
			_this.toggleClass( 'toggled-on' );
			_this.next( '.children, .sub-menu' ).toggleClass( 'toggled-on' );

			// jscs:disable
			_this.attr( 'aria-expanded', _this.attr( 'aria-expanded' ) === 'false' ? 'true' : 'false' );
			// jscs:enable
			screenReaderSpan.text( screenReaderSpan.text() === screenReaderText.expand ? screenReaderText.collapse : screenReaderText.expand );
		} );
	}
	initMainNavigation( $( '.main-navigation' ) );

	masthead         = $( '#masthead' );
	menuToggle       = masthead.find( '#menu-toggle' );
	siteHeaderMenu   = masthead.find( '#site-header-menu' );
	siteNavigation   = masthead.find( '#site-navigation' );
	socialNavigation = masthead.find( '#social-navigation' );

	// Enable menuToggle.
	( function() {

		// Return early if menuToggle is missing.
		if ( ! menuToggle.length ) {
			return;
		}

		// Add an initial values for the attribute.
		menuToggle.add( siteNavigation ).add( socialNavigation ).attr( 'aria-expanded', 'false' );

		menuToggle.on( 'click.twentysixteen', function() {
			$( this ).add( siteHeaderMenu ).toggleClass( 'toggled-on' );

			// jscs:disable
			$( this ).add( siteNavigation ).add( socialNavigation ).attr( 'aria-expanded', $( this ).add( siteNavigation ).add( socialNavigation ).attr( 'aria-expanded' ) === 'false' ? 'true' : 'false' );
			// jscs:enable
		} );
	} )();

	// Fix sub-menus for touch devices and better focus for hidden submenu items for accessibility.
	( function() {
		if ( ! siteNavigation.length || ! siteNavigation.children().length ) {
			return;
		}

		// Toggle `focus` class to allow submenu access on tablets.
		function toggleFocusClassTouchScreen() {
			if ( window.innerWidth >= 910 ) {
				$( document.body ).on( 'touchstart.twentysixteen', function( e ) {
					if ( ! $( e.target ).closest( '.main-navigation li' ).length ) {
						$( '.main-navigation li' ).removeClass( 'focus' );
					}
				} );
				siteNavigation.find( '.menu-item-has-children > a' ).on( 'touchstart.twentysixteen', function( e ) {
					var el = $( this ).parent( 'li' );

					if ( ! el.hasClass( 'focus' ) ) {
						e.preventDefault();
						el.toggleClass( 'focus' );
						el.siblings( '.focus' ).removeClass( 'focus' );
					}
				} );
			} else {
				siteNavigation.find( '.menu-item-has-children > a' ).unbind( 'touchstart.twentysixteen' );
			}
		}

		if ( 'ontouchstart' in window ) {
			$( window ).on( 'resize.twentysixteen', toggleFocusClassTouchScreen );
			toggleFocusClassTouchScreen();
		}

		siteNavigation.find( 'a' ).on( 'focus.twentysixteen blur.twentysixteen', function() {
			$( this ).parents( '.menu-item' ).toggleClass( 'focus' );
		} );
	} )();

	// Add the default ARIA attributes for the menu toggle and the navigations.
	function onResizeARIA() {
		if ( window.innerWidth < 910 ) {
			if ( menuToggle.hasClass( 'toggled-on' ) ) {
				menuToggle.attr( 'aria-expanded', 'true' );
			} else {
				menuToggle.attr( 'aria-expanded', 'false' );
			}

			if ( siteHeaderMenu.hasClass( 'toggled-on' ) ) {
				siteNavigation.attr( 'aria-expanded', 'true' );
				socialNavigation.attr( 'aria-expanded', 'true' );
			} else {
				siteNavigation.attr( 'aria-expanded', 'false' );
				socialNavigation.attr( 'aria-expanded', 'false' );
			}

			menuToggle.attr( 'aria-controls', 'site-navigation social-navigation' );
		} else {
			menuToggle.removeAttr( 'aria-expanded' );
			siteNavigation.removeAttr( 'aria-expanded' );
			socialNavigation.removeAttr( 'aria-expanded' );
			menuToggle.removeAttr( 'aria-controls' );
		}
	}

	// Add 'below-entry-meta' class to elements.
	function belowEntryMetaClass( param ) {
		if ( body.hasClass( 'page' ) || body.hasClass( 'search' ) || body.hasClass( 'single-attachment' ) || body.hasClass( 'error404' ) ) {
			return;
		}

		$( '.entry-content' ).find( param ).each( function() {
			var element              = $( this ),
				elementPos           = element.offset(),
				elementPosTop        = elementPos.top,
				entryFooter          = element.closest( 'article' ).find( '.entry-footer' ),
				entryFooterPos       = entryFooter.offset(),
				entryFooterPosBottom = entryFooterPos.top + ( entryFooter.height() + 28 ),
				caption              = element.closest( 'figure' ),
				newImg;

			// Add 'below-entry-meta' to elements below the entry meta.
			if ( elementPosTop > entryFooterPosBottom ) {

				// Check if full-size images and captions are larger than or equal to 840px.
				if ( 'img.size-full' === param ) {

					// Create an image to find native image width of resized images (i.e. max-width: 100%).
					newImg = new Image();
					newImg.src = element.attr( 'src' );

					$( newImg ).on( 'load.twentysixteen', function() {
						if ( newImg.width >= 840  ) {
							element.addClass( 'below-entry-meta' );

							if ( caption.hasClass( 'wp-caption' ) ) {
								caption.addClass( 'below-entry-meta' );
								caption.removeAttr( 'style' );
							}
						}
					} );
				} else {
					element.addClass( 'below-entry-meta' );
				}
			} else {
				element.removeClass( 'below-entry-meta' );
				caption.removeClass( 'below-entry-meta' );
			}
		} );
	}

	$( document ).ready( function() {
		body = $( document.body );

		$( window )
			.on( 'load.twentysixteen', onResizeARIA )
			.on( 'resize.twentysixteen', function() {
				clearTimeout( resizeTimer );
				resizeTimer = setTimeout( function() {
					belowEntryMetaClass( 'img.size-full' );
					belowEntryMetaClass( 'blockquote.alignleft, blockquote.alignright' );
				}, 300 );
				onResizeARIA();
			} );

		belowEntryMetaClass( 'img.size-full' );
		belowEntryMetaClass( 'blockquote.alignleft, blockquote.alignright' );
	} );

	$( document ).ready( function() {

		var changeMuted = (function () {
				var methods = {},
						sound_lable = $('.turn_sound'),
						video_mute = $('.viewport video').get(0);

						methods.is_muted = function(muted){
							video_mute = $('.viewport video').get(0);
							if(!muted){ muted = $(video_mute).prop('muted')}
								return muted
						}

						methods.changeText = function (muted) {
							(this.is_muted(muted))? sound_lable.html('Turn the sound <b>ON</b>') : sound_lable.html('Turn the sound off');
						}

						methods.turnSound = function(muted){
							(this.is_muted(muted))?video_mute.muted = false : video_mute.muted = true;
						}
						methods.switch = function(muted){
							this.turnSound(muted);
							this.changeText(muted);

						}

				return methods;

		}());

		$('.turn_sound').click(function () {
			changeMuted.switch();
		})


		$('section.section').each(function (i,e) {
			new Waypoint({
				element: $(e).find('[data-marker="section-bottom"]')[0],
				handler: function() {
					setTimeout(changeMuted.changeText(),0);
				}
			})
		})


    $(".menu-li-6").hover(function() {
        $("body").removeClass("ardarts-page runon-page grc-page cakemix-page halsa-page a-la-card-page carpo-page la-colombe-page mentissana-page reefill-page skate-page snap-tour-page throw-back-page"),
        $("body").addClass("a-la-card-page"),
        $(".work-side-text p").html("A La Card"),
        $(this).children().addClass("active")
    })
    $(".menu-li-7").hover(function() {
        $("body").removeClass("ardarts-page runon-page grc-page cakemix-page halsa-page a-la-card-page carpo-page la-colombe-page mentissana-page reefill-page skate-page snap-tour-page throw-back-page"),
        $("body").addClass("carpo-page"),
        $(".work-side-text p").html("Carpo"),
        $(this).children().addClass("active")
    })
    $(".menu-li-8").hover(function() {
        $("body").removeClass("ardarts-page runon-page grc-page cakemix-page halsa-page a-la-card-page carpo-page la-colombe-page mentissana-page reefill-page skate-page snap-tour-page throw-back-page"),
        $("body").addClass("la-colombe-page"),
        $(".work-side-text p").html("<span class='md-t--size'>La Colombe</span>"),
        $(this).children().addClass("active")
    })
    $(".menu-li-9").hover(function() {
        $("body").removeClass("ardarts-page runon-page grc-page cakemix-page halsa-page a-la-card-page carpo-page la-colombe-page mentissana-page reefill-page skate-page snap-tour-page throw-back-page"),
        $("body").addClass("mentissana-page"),
        $(".work-side-text p").html("<span class='md-t--size'>Mentissana</span>"),
        $(this).children().addClass("active")
    })
    $(".menu-li-10").hover(function() {
        $("body").removeClass("ardarts-page runon-page grc-page cakemix-page halsa-page a-la-card-page carpo-page la-colombe-page mentissana-page reefill-page skate-page snap-tour-page throw-back-page"),
        $("body").addClass("reefill-page"),
        $(".work-side-text p").html("Reefill"),
        $(this).children().addClass("active")
    })
    $(".menu-li-11").hover(function() {
        $("body").removeClass("ardarts-page runon-page grc-page cakemix-page halsa-page a-la-card-page carpo-page la-colombe-page mentissana-page reefill-page skate-page snap-tour-page throw-back-page"),
        $("body").addClass("skate-page"),
        $(".work-side-text p").html("Skate"),
        $(this).children().addClass("active")
    })
    $(".menu-li-12").hover(function() {
        $("body").removeClass("ardarts-page runon-page grc-page cakemix-page halsa-page a-la-card-page carpo-page la-colombe-page mentissana-page reefill-page skate-page snap-tour-page throw-back-page"),
        $("body").addClass("snap-tour-page"),
        $(".work-side-text p").html("Snap Tour"),
        $(this).children().addClass("active")
    })
    $(".menu-li-13").hover(function() {
        $("body").removeClass("ardarts-page runon-page grc-page cakemix-page halsa-page a-la-card-page carpo-page la-colombe-page mentissana-page reefill-page skate-page snap-tour-page throw-back-page"),
        $("body").addClass("throw-back-page"),
        $(".work-side-text p").html("<span class='md-t--size'>Throw Back</span>"),
        $(this).children().addClass("active")
    })


    var workList = (function(){

    	if($('.work-list').length > 0){
    	var methods = {},
    			list = $('.work-list li'),
    			os_list = $('.work-list').offset().top,
    			height_list = list.length * 42.61,
    			skrolled = list.first().offset().top;

    	methods.checkOffSet = function(){
    		skrolled = list.first().offset().top;
    		this.addOpacity();
    	}
    	methods.addOpacity = function(){
    		for(var i = 0; i < list.length; i++){

    			var position = $(list.get(i)).offset().top;


    			if((os_list + 200) < position )
    				{
    					if(i <= (list.length - 4) ){
    						$(list.get(i)).css('opacity','0.3');
    						$(list.get(i+1)).css('opacity','0.2');
    						$(list.get(i+2)).css('opacity','0.1');
    						break
    					}
    					else{
    						$(list.get(i)).css('opacity','1');
    						$(list.get(i+1)).css('opacity','1');
    						$(list.get(i+2)).css('opacity','1');
    						break
    					}

    				}
    			else if(position < os_list && position > (os_list - 43.61)){
    				$(list.get(i)).css('opacity','0.1');
    				$(list.get(i+1)).css('opacity','0.2');
    				$(list.get(i+2)).css('opacity','0.3');
    				i += 2;
    			}
    			else{
    				$(list.get(i)).css('opacity','1');
    			}
    		}
    	}

    	return methods;
    }})()

		if($('.work-list').length > 0){
    $('.work-list').scroll(function(){
    		workList.checkOffSet();
    })
    workList.checkOffSet();
}
	var oldName;
	var oldNum;

$('#synonyms_form').submit(function(e){

	var word = $('#synonyms_form .selected_word').val();
	$('.generator_container .icon_refresh').toggle();

	$.ajax({
		  url: 'https://wordsapiv1.p.mashape.com/words/'+ word + '/synonyms',
		  headers: {
      'X-Mashape-Key' : 'pFlMAk3oBVmshXwQdXq47ZaHK6wVp1TPwsXjsnt7iNUpN9Pe6O',
      'X-Mashape-Host' : 'wordsapiv1.p.mashape.com'
   		}

		})

			.done(function(el){
				var number = 	Math.floor((Math.random() * el.synonyms.length) ),
				 	name = el.synonyms[number]

				if(!oldNum && oldNum != 0){
					oldName = el.word;
					oldNum = number;
				}
				if(oldName == el.word){
					if(oldNum < el.synonyms.length){
						name = el.synonyms[oldNum];
						oldNum++;
					}else{
						oldNum = 0;
						name = el.synonyms[oldNum];
						oldNum++;
					}
				}else{
					oldName = el.word;
					oldNum = number;
				}
				$('#result').text(name + ' app');
				$('.generator_container .section.active').removeClass('active');
				$('.generator_container .section.result').addClass('active');
				$('.generator_container .icon_refresh').toggle();

			})

			.error(function(el){
				$('.generator_container .section.active').removeClass('active');
				$('.generator_container .section.error').addClass('active');
				$('.generator_container .icon_refresh').toggle();
			});


			return false;
});

$('.work-view .work-list li').hover(function(el){
	var link = $(this).find('a');
	if($(link).attr('href')){
		var element = $("<a></a>").text('Click to view work or swipe to view more').attr('href',$(link).attr('href'));
		$('.work-link-wrapper').html(element);
	}
	else{
		$('.work-link-wrapper').html('');
	}
});


// 		var prevh = 0;
// $(window).scroll(function() {
// 	var contacts = $('#contacts');



// 	if(contacts.length && ($(window).width() > 768 ) ){
// 		var wp = window.pageYOffset;
// 		var wh = $(window).height();
// 		var ep = $(contacts).offset();

// 		if( ( ep.top + wh/2 - 50) > wp + wh/2  ){


// 		}
// 		}


// });
var lastScrollTop = 0;

 $(function(){

changeSection();

    $(window).scroll(function(){
			changeSection();
    });

    $(window).resize(function(){
			changeSection();
    });
    function changeSection() {

        var scrollTop = $(document).scrollTop() + ($(window).height() / 2);
        var positions = [];


        $('.section').each(function(){
            positions.push({position:$(this).position().top + $(this).height() / 2, element: $(this)});
        });

        var getClosest = closest(positions,scrollTop);

        // if (!getClosest) {
        // 	return false;
        // }
        $('.section.active').each(function(e) {

        if(!$(this).is(getClosest)){
        	$(this).removeClass("active");
        	$(getClosest).addClass("active");
        		$('body').attr('data-show',$(getClosest).attr("data-page"));

        		if ($(getClosest).attr("data-page") == 'main') {
        			$('.page-viewport .viewport video').html('<source src="'+$(getClosest).find('[data-source="video"]').attr('data-mp4')+'" type="video/mp4"></source>' );

        			$(".page-viewport .viewport video")[0].load();
        			$(".page-viewport .viewport video")[0].play();
        		}

        	var background = $(getClosest).attr("data-colour");
        	$('body').attr('data-colour',background);
        }else{

        	var section_background = $(getClosest).attr("data-colour") || '';
        	var body_background = $('body').attr("data-colour");
        	if(section_background !== body_background){
        		$('body').attr('data-colour',section_background);
        	}

        	var section_page = $(getClosest).attr("data-page") || '';
        	var body_page = $('body').attr("data-page");
        	if(section_page !== body_page){
						$('body').attr('data-show',section_page);
        	}
        }

        });
        if (!$('.section.active').length) {
        	$(getClosest).addClass("active");

        		$('body').attr('data-show',$(getClosest).attr("data-page"));

        	var background = $(getClosest).attr("data-colour");
        	$('body').attr('data-colour',background);

        }

         // the element closest to the middle of the screen
    }

    // finds the nearest position (from an array of objects) to the specified number
    function closest(array, number) {
    	if (array.length) {
				var num = 0;
				// st = window.pageYOffset || document.documentElement.scrollTop;
				for (var i = array.length - 1; i >= 0; i--) {

					if (Math.abs(number - array[i].position) < Math.abs(number - array[num].position)) {
						num = i;
					}

				}

				return array[num].element;
			}
    }
});

 $(document).ready(function () {

 	var general_mobile_image = $('.general_mobile_image');

 	if (general_mobile_image.length) {

		general_mobile_image.find('video source').attr('src','/wp-content/themes/twentysixteen/samples/messapps1.mp4');
		general_mobile_image.find('video').get(0).load();

		$('.general_mobile_image').click(function() {
			var video = $(this).find('video').get(0);
			video.currentTime = 0;

			if (video.requestFullscreen) {
				video.requestFullscreen();
			} else if (video.mozRequestFullScreen) { /* Firefox */
				video.mozRequestFullScreen();
			} else if (video.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
				video.webkitRequestFullscreen();
			} else if (video.msRequestFullscreen) { /* IE/Edge */
				video.msRequestFullscreen();
			}

			video.play();

		});
	}


	 var whiteScreen = $('.preloadScreen');

	 if (whiteScreen.length) {
		 whiteScreen.remove();
	 }
 });


$('body').on('click','.page-viewport.active .close_video', function() {

	$('body').removeClass('off_overflow');
	$('.page-viewport.active').removeClass('active');


});


$('.title-1').text($('.title-1').text().replace('#', ''));

$('.toggleMainMenu').click(function() {

$('#site-navigation').toggleClass('active');
$('.toggleMainMenu').toggleClass('active');
});

});
})( jQuery );


