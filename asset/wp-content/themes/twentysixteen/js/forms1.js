/*
	form Subscribe
	used Library:
	----------------------------------------------------------------------- */
(function() {

	var init = function() {

		var $form = $('.form--subscribe').find('form').filter(':visible').filter(':not(.ready)');

		if (!$form.length) return false;

		$form.addClass('ready');

		var $inps = $form.find('input[type="email"], input[type="text"]');
		var $btn = $form.find('button[type="submit"]');


		//check enable Submit button
		var checkEnable = function() {
			var enable = true;
			$inps.filter('[required]').each(function() {
				var value = $(this).val();
				if (!value) enable = false;
			});
			$btn.attr('disabled', !enable);
		};


		//check placeholders
		var checkPlaceholders = function() {
			$inps.each(function() {
				var $inp = $(this);
				var $group = $inp.parents('.form-group');
				var value = $inp.val();
				$group.removeClass('focused').addClass( (value?'focused':'') );
			});
		};


		//send form
		var send = function() {
			var data = $form.serialize();

				 var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
			   if(reg.test($($form).find('[type=email]').val()) == false) {
			      $($form).find('[type=email]').addClass('error');
						return false;
			   }

			$form.addClass('loading');
			setTimeout(function() {
				$form
					.removeClass('loading')
					.find('[data-step="1"]').hide().end()
					.find('[data-step="2"]').show();
			}, 1000);
		};


		checkPlaceholders();
		checkEnable();

		$inps
			.on('focus', function() {
				$(this).parents('.form-group').addClass('focused');
			})
			.on('blur', function() {
				checkPlaceholders();
			});

		$inps.filter('[required]').on('input', function() {
			checkEnable();
		});

		$form.on('submit', function() {
			send();
			return false;
		});

	};

	init();

	$(document).bind('articleLoaded', function() {
		init();
	});

//    $(document).bind('gcLoaded', function() {
//		init();
//	});

})();
// ----------------------------------------------------------------------



/*
	form Proposal
	used Library:
	- https://silviomoreto.github.io/bootstrap-select/
	----------------------------------------------------------------------- */
(function() {

	var $form = $('.form--proposal').find('form');

	if (!$form.length) return false;

	var $inps = $form.find('input[type="text"], input[type="email"], input[type="tel"], select');
	var $steps = $form.find('[data-step]');
	var $btns = $form.find('.btn--next, .btn--submit');
	var $phone = $('[data-flag="phone"]');

	//custom selects
	$inps.filter('select').selectpicker({
		style: null
	});

	$form.find('.bootstrap-select').find('.filter-option').each(function() {
		var $label = $(this);
		$label.attr('data-text', $label.text());
	});

	//long-select
	var bs_select = $form.find('.bootstrap-select').find('.open');
	$(bs_select).addClass('select--overflow');

	var select_ul = $form.find('.bootstrap-select').find('.inner');
	$(select_ul).addClass('list--long');
	//end long-select

	$inps.filter('select')
		.on('show.bs.select', function (e) {
	  	$(this).parents('.form-group').addClass('open-select');
	  	$('body').addClass('show--select');
		})
		.on('hide.bs.select', function (e) {
	  	$(this).parents('.form-group').removeClass('open-select');
	  	$('body').removeClass('show--select');

		})
		.on('hidden.bs.select', function (e) {
	  	$(this).parents('.form-group').find('.dropdown-toggle').blur();
		})
		.on('changed.bs.select', function (e) {
			var $label = $(this).parents('.form-group').find('.filter-option');
			$label.attr('data-text', $label.text());
			if ($phone.is(':visible')) {
		  	$(this).parents('.form-group').addClass('open-selected');
			}
		});

	$form.find('.btn--close, .btn--apply').on('click', function() {
		$(this).parents('.form-group').removeClass('open-selected');
  	$('body').removeClass('show--select');
	});


	var change_step = function(step) {
		var $step = $steps.filter('[data-step="'+ step +'"]');
		$steps.removeClass('active').hide();
		$step.show();
		setTimeout(function() {
			$step.addClass('active');
		}, 100);
		check_available_button();
	};


	var check_available_button = function() {
		var enable = true;
		$inps.filter('[required]').filter(':visible').each(function() {
			var value = $(this).val();
			if (!value) {enable = false}
				else {$(this).parent().removeClass('error')}
		});

	};

	var check_unavailable_input = function() {
		var enable = true;
		$inps.filter('[required]').filter(':visible').each(function() {

			var value = $(this).val();

			if($(this).attr('type') === 'email'){
					 var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
				   var address = $(this).val();
				   if(reg.test(address) === false) {
				      $(this).parent().addClass('error');
							enable = false;
				   }
				}
			else if (!value) {
				$(this).parent().addClass('error');
				enable = false;
			}
			else{
				$(this).parent().removeClass('error');
			}
		});
		return enable;
	};

	var send = function() {
		var data = $form.serialize();
		$form.addClass('loading');
		setTimeout(function() {
			$form.removeClass('loading');
			change_step(4);
		}, 1000);
	};


	change_step(1);
	check_available_button();

	$inps.filter('[required]').on('keyup keypress focus blur change', function() {
		check_available_button();
	});


	$btns.filter('[data-next]').on('click', function() {
		if(check_unavailable_input()){
		var step = $(this).attr('data-next');
		change_step(step);

		//prevent-scroll
		if (step >= 2 && step <= 3) {
            $("#press, #awards, #service, #main, .home #main_footer").hide();
		}
		}
	});

        $('.header-logo, .tab--work').on('click', function() {
			location.reload();
			$("#press, #awards, #service, #main, .home #main_footer").delay(1000).show(0);
        });
        //end prevent-scroll

	$form.on('submit', function() {
		if(check_unavailable_input()){
      saveData();
			send();
			return false;
		}
	});


})();
/*
	load Article page
	used Library:
	----------------------------------------------------------------------- */
(function() {

  //load article page
  $(document).delegate('[data-load]', 'click', function() {
    var href = $(this).attr('href');
    var $target = $('[data-target="article"]');

    $('body').addClass('page--load');

    // $.get(href, function(response) {
    setTimeout(function() {
      var response = $('[data-source="article"]').html();
      $target.html(response);

      var $article = $target.find('.page-wrapper');

      setTimeout(function() {
        $('body').removeClass('page--load').addClass('page--loaded');
        $article.one('bsTransitionEnd', function() {
          $('body').addClass('page--showed');
          $('.social-likes').socialLikes();
          $(document).trigger('articleLoaded');
        });
      }, 100);

      // });
    }, 500);

    return false;
  });

  //close article page
  $(document).delegate('.articleButtonClose', 'click', function(e) {
    console.log('test', e.target);
    var $target = $('[data-target="article"]');
    $('body').removeClass('page--showed').addClass('page--hide');
    var $article = $target.find('.page-wrapper');
    $article.one('bsTransitionEnd', function() {
      $('body').removeClass('page--loaded page--hide');
      $target.empty();
    });
  });

  // ----------------------------------------------------------------------





  //load work page
  $(document).delegate('[load-work]', 'click', function() {
    var href = $(this).attr('href');
    var $target = $('[data-target="work"]');

    $('body').addClass('page--load');

    // $.get(href, function(response) {
    setTimeout(function() {
      var response = $('[data-source="work"]').html();
      $target.html(response);

      var $work = $target.find('.page-wrapper');

      setTimeout(function() {
        $('body').removeClass('page--load').addClass('page--loaded');
        $work.one('bsTransitionEnd', function() {
          $('body').addClass('page--showed');
          //$('.social-likes').socialLikes();
          $(document).trigger('articleLoaded'); ///
        });
      }, 100);

      // });
    }, 500);

    return false;
  });

  //close work page
  $(document).delegate('.workButtonClose', 'click', function() {
    var $target = $('[data-target="work"]');
    $('body').removeClass('page--showed').addClass('page--hide');
    var $work = $target.find('.page-wrapper');
    $work.one('bsTransitionEnd', function() {
      $('body').removeClass('page--loaded page--hide');
      $target.empty();
    });
  });




})();
//# sourceMappingURL=forms.js.map


$('input[type="tel"]').on('input keyup', function() {
	var r = $(this).val().replace((/\D|\+/ig), '');
	$(this).val(r);
});

	if( document.querySelector("#messForm")){
	 document.querySelector("#messForm").addEventListener("submit", function (e) {
	 		e.preventDefault();
      return false;
    });
	}
function saveData(e) {
    var category = document.getElementsByName("Category")[0].value,
        goal = document.getElementsByName("Goal")[0].value,
        budget = document.getElementsByName("Budget")[0].value,
        name = document.getElementsByName("Name")[0].value,
vercode = document.getElementsByName("vercode")[0].value,
        email = document.getElementsByName("Email")[0].value,
        phone = document.getElementsByName("Phone")[0].value,
        utm_s = document.getElementsByName("utm_source")[0].value,
        utm_m = document.getElementsByName("utm_medium")[0].value,
        utm_n = document.getElementsByName("utm_name")[0].value,
        utm_t = document.getElementsByName("utm_term")[0].value,
        utm_c = document.getElementsByName("utm_content")[0].value,
				full_name = name.split(' '),
				first_name = full_name[0],
       	last_name = full_name[1];

	window.uetq = window.uetq || [];

	if(budget == '$0 - Looking for funding'){
  	fbq('track', 'Lead', {
          value: 0,
          currency: 'USD',
          });
	dataLayer.push({'event': 'application_0'});
	window.uetq.push ('event', 'formsubmit', {'event_category': 'lead', 'event_label': '0-l4f', 'event_value': '1'});
	}
else if(budget == '$0 - $15,000'){
	 fbq('track', 'Lead', {
          value: 15000,
          currency: 'USD',
          });
	dataLayer.push({'event': 'application_0-15'});
	window.uetq.push ('event', 'formsubmit', {'event_category': 'lead', 'event_label': '0-15', 'event_value': '10000'});
}
else if(budget == '$15,000 - $40,000'){
	 fbq('track', 'Lead', {
          value: 40000,
          currency: 'USD',
          });
	dataLayer.push({'event': 'application_15-40'});
	window.uetq.push ('event', 'formsubmit', {'event_category': 'lead', 'event_label': '15-40', 'event_value': '15000'});
}
else if(budget == '$40,000 - $80,000'){
	fbq('track', 'Lead', {
          value: 80000,
          currency: 'USD',
          });
	dataLayer.push({'event': 'application_40-80'});
	window.uetq.push ('event', 'formsubmit', {'event_category': 'lead', 'event_label': '40-80', 'event_value': '40000'});
}
else if(budget == '$80,000 - $120,000'){
	fbq('track', 'Lead', {
          value: 120000,
          currency: 'USD',
          });
	dataLayer.push({'event': 'application_80-120'});
	window.uetq.push ('event', 'formsubmit', {'event_category': 'lead', 'event_label': '80-120', 'event_value': '80000'});
}
else if(budget == '$120,000+'){
	fbq('track', 'Lead', {
          value: 120001,
          currency: 'USD',
          });
	dataLayer.push({'event': 'application_120'});
	window.uetq.push ('event', 'formsubmit', {'event_category': 'lead', 'event_label': '120', 'event_value': '120000'});
}

      var data = {
	formType: 'offer',
				Budget: budget,
				Goal: goal,
				Category: category,
				Name: name,
				Email: email,
				Phone: phone,
				'First Name': first_name,
				'Last Name': last_name,
'vercode': vercode,        
'UTM Source': utm_s,
        'UTM Medium': utm_m,
        'UTM Name': utm_n,
        'UTM Term': utm_t,
        'UTM Content': utm_c,
				Date: Date(),
				URL: window.location['origin'] + window.location['pathname']

      };
      var category_href = '/';
      switch (category) {
      	case 'Education':
	      	category_href = '/education-training-apps/';
	      	category = 'education & training apps' ;
	      	break;
      	case 'Entertainment':
	      	category_href = '/entertainment-apps/';
	      	category = 'entertainment apps' ;
	      	break;
      	case 'Finance':
	      	category_href = '/industries/';
	      	category = 'view all industries' ;
	      	break;
      	case 'Food & Drink':
	      	category_href = '/industries/';
	      	category = 'view all industries' ;
	      	break;
      	case 'Health & Fitness':
	      	category_href = '/healthcare-app-development/';
	      	category = 'healthcare app development' ;
	      	break;
      	case 'Music':
	      	category_href = '/entertainment-apps/';
	      	category = 'entertainment apps' ;
	      	break;
      	case 'Travel':
	      	category_href = '/travel-hospitality-app-development/';
	      	category = 'travel & hospitality app development' ;
	      	break;
      	case 'Other':
	      	category_href = '/industries/';
	      	category = 'view all industries' ;
	      	break;
	      default:
   				category_href = '/industries/';
	      	category = 'view all industries' ;
      }

      $('.form_end_link').attr('href', category_href).text(category);

      //Sheetsu.write("https://sheetsu.com/apis/v1.0bu/bb7cf7acd2ab/", data, {}).then(function(x) {console.log(x);}, function(e) {console.log(e);});

            $.ajax({
      	url:'/formlog.php',
      	data:data,
      	success: function(json) {
						console.log(json);
  				},
  			error:function(er) {
						console.log(json);
  			}
      });
}

if( document.querySelector("#subscribeForm")){
 document.querySelector("#subscribeForm").addEventListener("submit", function (e) {
 		subscribe(e);
    return false;
  });
}
function subscribe(e) {
var interests =  $('#subscribeForm').find('[name=interested]').val() ,
    email = $('#subscribeForm').find('[name=email]').val() ;



  var data = {
    formType: 'subscribe',
    Interests: interests,
    Email: email
  };

  //Sheetsu.write("https://sheetsu.com/apis/v1.0bu/ba6edd80f22c/", data, {}, function (result) {
 //   console.log(result);
 // });
        $.ajax({
            url:'/formlog.php',
            data:data,
            success: function(json) {
                console.log(json);
            },
            error:function(er) {
                console.log(json);
            }
        });
}

if( document.querySelector("#send_error_messages")){
 document.querySelector("#send_error_messages").addEventListener("submit", function (e) {
 		errorForm(e);
    return false;
  });
}
function errorForm(e) {
	$('#send_error_messages').hide();
	$('.thanks_screen').show();

	var messages = document.getElementsByName("messages")[0].value,
    email = document.getElementsByName("email")[0].value ;


	var data = {
		formType: 'error',
		email: email,
		messages: messages
	}
//	Sheetsu.write("https://sheetsu.com/apis/v1.0bu/2635e4a8973c/", data, {}, function (result) {
//    console.log(result);
//  });
        $.ajax({
            url:'/formlog.php',
            data:data,
            success: function(json) {
                console.log(json);
            },
            error:function(er) {
                console.log(json);
            }
        });
}
$('.toggle_form_popup_wrapper').click(function(){
	$('.form_popup_wrapper').slideToggle();
})

		$('.fill_checker input.check_input, .fill_checker select.check_input').change(function() {
			var all_filled = true;
			$(this).closest('.fill_checker').find('input.check_input, select.check_input').each(function() {
				var as = $(this).val();
				if(!$.trim(as)){
					all_filled = false;
				}
			});

			if (all_filled) {
				$(this).closest('.fill_checker').find('.checker_button').addClass('all_filled');
			}else if($(this).closest('.fill_checker').find('.checker_button').hasClass('all_filled')){
				$(this).closest('.fill_checker').find('.checker_button').removeClass('all_filled');
			}

		});