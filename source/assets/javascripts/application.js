//= require_tree .

$(document).ready(function(){

  //navbar fixed
  var navbar = $('.navbar-static-top'),
      distance = navbar.offset().top,
      $window = $(window);

  $window.scroll(function() {
      if ($window.scrollTop() > distance) {
          navbar.removeClass('navbar-fixed-top').addClass('navbar-fixed-top');
          $(".nav-bar li a").css("color", "#fff");
      } else {
          navbar.removeClass('navbar-fixed-top');
          $("body").css("padding-top", "0px");
      }
  });

  //nav scroll on page
  (function (jQuery) {
    jQuery.mark = {
      jump: function (options) {
        var defaults = {
          selector: 'a.scroll-on-page-link'
        };
        if (typeof options == 'string') {
          defaults.selector = options;
        }

        options = jQuery.extend(defaults, options);
        return jQuery(options.selector).click(function (e) {
          var jumpobj = jQuery(this);
          var target = jumpobj.attr('href');
          var thespeed = 1000;
          var offset = jQuery(target).offset().top;
          jQuery('html,body').animate({
            scrollTop: offset
          }, thespeed, 'swing');
          e.preventDefault();
        });
      }
    };
  })(jQuery);

  jQuery(function(){
    jQuery.mark.jump();
  });

  //slider
  $(".slider").slick({
    dots: false,
    infinite: false,
    slidesToShow: 3,
    slidesToScroll: 3
  });

  //accordions
  $('.accordion .js-accordion-trigger').bind('click', function(e){
    jQuery(this).parent().find('p').slideToggle('fast');
    jQuery(this).parent().toggleClass('is-expanded');
    e.preventDefault();
  });
  $('.wide-accordion .js-accordion-trigger').bind('click', function(e){
    jQuery(this).parent().find('.content').slideToggle('fast');
    jQuery(this).parent().toggleClass('is-expanded');
    e.preventDefault();
  });

});