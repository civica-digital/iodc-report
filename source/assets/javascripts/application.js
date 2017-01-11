//= require_tree .

jQuery.expr[':'].contains = function(a, i, m) {
  return jQuery(a).text().toUpperCase()
      .indexOf(m[3].toUpperCase()) >= 0;
};

function UpdateQueryString(key, value, url) {
    if (!url) url = window.location.href;
    var re = new RegExp("([?&])" + key + "=.*?(&|#|$)(.*)", "gi"),
        hash;

    if (re.test(url)) {
        if (typeof value !== 'undefined' && value !== null)
            return url.replace(re, '$1' + key + "=" + value + '$2$3');
        else {
            hash = url.split('#');
            url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
            if (typeof hash[1] !== 'undefined' && hash[1] !== null)
                url += '#' + hash[1];
            return url;
        }
    }
    else {
        if (typeof value !== 'undefined' && value !== null) {
            var separator = url.indexOf('?') !== -1 ? '&' : '?';
            hash = url.split('#');
            url = hash[0] + separator + key + '=' + value;
            if (typeof hash[1] !== 'undefined' && hash[1] !== null)
                url += '#' + hash[1];
            return url;
        }
        else
            return url;
    }
}

function fill_data(json_file){
  $.getJSON("assets/javascripts/data/"+json_file, function(json) {

    description = json["session"]["description"]
    notes = json["notes"]
    speakers = json["session"]["speakers"]
    youtube_id = json["youtube"]
    photos = json["photos"]
    tweets = json["tweets"]

    description_section = "<h4>Description: </h4><h5>"+description+"</h5><a href='"+notes+"'>Go to Notes</a>"

    youtube_section = '<iframe allowfullscreen="" frameborder="0" src="https://www.youtube.com/embed/'+youtube_id+'"></iframe>'
    image_sections = ['','','','']
    var photoCount = 0;
    for (i in photos){
      image_sections[i] = '<a href="'+photos[i]["url"]+'"><img src="https://' + photos[i]["file"] + '"></a>'
      photoCount ++;
    }

    speakers_section = ""

    if (speakers.length > 0) {
      speakers_section = "<h4>Speakers:</h4>"
    }
    for (i in speakers) {
      speakers_section = speakers_section + "<a href='https://internationalopendataconfer2016.sched.org"+speakers[i]["profile"]+"'>"+speakers[i]["speaker"]+"</a>"
    }

    $( ".session-description" ).html(description_section);
    $( ".speaker-section" ).html(speakers_section)
    if(youtube_id != ""){
      $(".video-embebed").show()
      $( ".video-embebed").html(youtube_section)
    }else {
      $(".video-embebed").hide()
    }
    if(photoCount > 0) {
      $(".mini-gallery").show()
      $( ".top-left-img" ).html(image_sections[0])
      $( ".top-right-img" ).html(image_sections[1])
      $( ".bottom-left-img" ).html(image_sections[2])
      $( ".bottom-right-img" ).html(image_sections[3])
    }else {
      $(".mini-gallery").hide()
    }
    $('.slider-two').slick('removeSlide', null, null, true);

    for (i in tweets) {
      $( ".slider-two" ).slick('slickAdd','<div class="item"><div class="twitter-icon"><img src= "assets/images/icons/twitter-red.png"></img></div><div class="item-info">'+tweets[i]["content"]+'</div></div>')
    }

    $('#animatedModal')
      .removeClass('animatedModal-off')
      .addClass('animated animatedModal-on zoomIn')
      .css({"z-index":"9999","opacity":"1"})

    window.history.pushState("", "", "?talk="+json_file.split(".json")[0]);

  })
};

function close_modal(){
  window.history.pushState("", "", "?");
}

$(document).ready(function(){
  $.sessions = $(".sessions-content").html()
  $.impact = $("#impact_tabs").html()
  $.region = $("#region_tabs").html()
  $.action = $("#action_tabs").html()
  $.community = $("#community_tabs").html()

  function activate_links(region){
    $(region).children('li')
      .first()
      .children('a')
      .addClass('tab-active')
      .next()
      .addClass('tab-open')
      .show()
  }

  function filter_section(section){
    section_tabs = "#" + section + "_tabs"
    section_title ="." + section + "_title"
    section_data = $[section]

    $(section_tabs).html(section_data)
    $(section_tabs).html($(section_title+query))

    if ($(section_title).length==0){
      $(section_tabs).html("<h3>No results found.</h3>")
    }
    activate_links(section_tabs)
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
      $(".sessions-content").html("<h3>No results found.</h3>")
    }


    filter_section("impact")
    filter_section("region")
    filter_section("action")
    filter_section("community")

    setTimeout(function(){
      console.log("Filter Timeout Flag.")
      $(".session-info").animatedModal();
      $("#impact_tabs").animatedModal();
      $("#region_tabs").animatedModal();
      $("#action_tabs").animatedModal();
      $("#community_tabs").animatedModal();
    },0)
    //$(".session-info").animatedModal();
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


  $(".slider-two").slick({
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  });

  $(".session-info").animatedModal();
  $("#impact_tabs").animatedModal();
  $("#region_tabs").animatedModal();
  $("#action_tabs").animatedModal();
  $("#community_tabs").animatedModal();

  var url = window.location.href; // or window.location.href for current url
  var captured = /talk=([^&]+)/.exec(url)[1]; // Value is in [1] ('384' in our case)
  var result = captured ? captured : 'defaultValue';

  if (captured != 'defaultValue'){
    fill_data(captured+".json")
  }

});
