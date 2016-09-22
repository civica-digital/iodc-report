//= require_tree .

$(document).ready(function(){
  $(".slider").slick({
    dots: false,
    infinite: false,
    slidesToShow: 3,
    slidesToScroll: 3
  });

  $('.js-accordion-trigger').bind('click', function(e){
    jQuery(this).parent().find('p').slideToggle('fast');
    jQuery(this).parent().toggleClass('is-expanded');
    e.preventDefault();
  });

});