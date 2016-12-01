//= require_tree .

jQuery.expr[':'].contains = function(a, i, m) {
  return jQuery(a).text().toUpperCase()
      .indexOf(m[3].toUpperCase()) >= 0;
};


$(document).ready(function(){
  $.sessions = $(".sessions-content").html()
  $.impact = $("#impact_tabs").html()
  $.region = $("#region_tabs").html()
  $.action = $("#action_tabs").html()

  function activate_links(region){
    $(region).children('li').first().children('a').addClass('is-active').next().addClass('is-open').show()
  }


  function filter_section(section){
    section_tabs = "#" + section + "_tabs"
    section_title ="." + section + "_title"
    section_data = $[section]

    $(section_tabs).html(section_data)
    $(section_tabs).html($(section_title+query))
    activate_links(section_tabs)
    console.log($(section_title))

    if ($(section_title).length==0){
      $(section_tabs).html("<h3>No results found.</h4>")
    }
  }

  function build_query(keywords){
    //Query de tipo AND, para OR, usar "," para separar elementos
    query = ""
    for (index in keywords){
      query = query + ":contains('"+keywords[index]+"')"
    }
    return query
  }


  function update_elements(keywords){
    query = build_query(keywords)

    $(".sessions-content").html($.sessions)
    $(".sessions-content").html($(".session"+query))

    if ($(".session"+query).length==0){
      $(".sessions-content").html("<h3>No results found.</h4>")
    }


    filter_section("impact")
    filter_section("region")
    filter_section("action")

    bind_click()

  }

  //accordions
  function bind_click(){
    $('.js-accordion-trigger').bind('click', function(e){
      jQuery(this).parent().find('.content').slideToggle('fast');
      jQuery(this).parent().toggleClass('is-expanded');
      e.preventDefault();
    });
  }

  function build_search_sentence(keywords){
    console.log(keywords)
    text = "Showing data for"
    for (keyword in keywords){
      if (keyword > 0){
        text = text + ","
      }
      text = text + " "+ keywords[keyword]
    }
    if (keywords[0] == ""){
      text = ""
    }
    return text
  }


  keywordsSelect = $('#textsearch').selectize({
      delimiter: ',',
      persist: false,
      create: function(input) {
          return {
              value: input,
              text: input
          }
      }
  });

  var selectizeControl =  keywordsSelect[0].selectize

  selectizeControl.on('change', function() {
    selectedKeywords = selectizeControl.getValue().split(",");
    update_elements(selectedKeywords)
    $(".showing").text(build_search_sentence(selectedKeywords))
  });

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

  $('.tabs').each(function(index) {
    $(this).children('li').first().children('a').addClass('is-active').next().addClass('is-open').show();
  });
  $('.tabs').on('click', 'li > a.tab-link', function(event) {
    if (!$(this).hasClass('is-active')) {
      event.preventDefault();
      var accordionTabs = $(this).closest('.tabs');
      accordionTabs.find('.is-open').removeClass('is-open').hide();

      $(this).next().toggleClass('is-open').toggle();
      accordionTabs.find('.is-active').removeClass('is-active');
      $(this).addClass('is-active');
    } else {
      event.preventDefault();
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
    slidesToScroll: 3,
    responsive: [
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      }
    }
  ]
  });

  bind_click()

  $("#session-info").animatedModal();
});
