	$( document ).ready( function() {

		$(document).scroll(function() {
			if ($('.page_section').length) {
				projectsScroll();				
			}

		});

		
		function projectsScroll()  {
				$('.page_section').each(function() {
					var doc_top = $(window).scrollTop();
					var the_setcion_top = $(this).offset();
					var the_setcion_height = $(this).height();
					if (doc_top + 300 > the_setcion_top.top  && doc_top < the_setcion_top.top + the_setcion_height - 300) {
						if(!$(this).hasClass('active')){
							$('.page_section.active').removeClass('active');
							$(this).addClass('active');				

							$('body').removeClass('section-'+$('body').attr('data-section'));

							$('body').addClass('section-'+$(this).attr('data-section')).attr('data-section',$(this).attr('data-section'));

						}
						if(doc_top >= the_setcion_top.top - 50){
							if (!$(this).hasClass('show_images')) {
								$(this).addClass('show_images');											
							}
						}else{
							if ($(this).hasClass('show_images')) {
							$(this).removeClass('show_images');			
						}
						}
					}
				});
		}
		projectsScroll();


		$('.navigation .next_section ').click(function() {
				var next_section = $('.page_section.active').next('.page_section');
				$('html, body').animate({
	        scrollTop: $(next_section).offset().top - 100
	    	}, 1000);
		});

		$('.navigation .pre_section ').click(function() {
				var next_section = $('.page_section.active').prev('.page_section');
				$('html, body').animate({
	        scrollTop: $(next_section).offset().top - 100
	    	}, 1000);
		});


		function switchView(viewType)  {
		    if (!viewType) {
		        return;
		    }

	    	localStorage.setItem("viewType", viewType);

		    if (viewType==="regular_type") {
				$('#projects .container').removeClass('grid_type');
				$('#projects .container').addClass('regular_type');
				$('.type_switcher').each(function(i,el) {
					$(el).toggleClass('active');
				});

			    $('.type_switchers .switch_regular_type').addClass('active'); 
			    $('.type_switchers .switch_grid_type').removeClass('active'); 

				projectsScroll();
		    }	

		    if (viewType==="grid_type") {

				$('#projects .container').addClass('grid_type');
				$('#projects .container').removeClass('regular_type');

				$('.type_switcher').each(function(i,el) {
					$(el).toggleClass('active');
				});

			    $('.type_switchers .switch_grid_type').addClass('active'); 
			    $('.type_switchers .switch_regular_type').removeClass('active'); 

				$('.page_section').removeClass('active');
				$('body').removeClass('section-'+$('body').attr('data-section'));
		    
            }
		}


		$('.type_switchers .switch_regular_type ').click(function() { switchView('regular_type');});

		$('.type_switchers .switch_grid_type').click(function() { switchView('grid_type');});

		switchView(localStorage.getItem('viewType'));


	});