/**
 *
 * jQuery.JamCity : v. 1.1
 * https://github.com/bluetidepro/jQuery.JamCity
 * Copyright (c) 2012 Zach Reed (Blue Tide Productions, LLC).
 * Dual licensed under the MIT and GPL licenses.
 *
 */ (function ($) {

  // Start JamCity (JMC)!
  $.fn.JamCity = function (options) {

    // Default JMC Options
    var defaults = {
      apiKey: '', // Your Last.fm API key. You can get this easily setup here: http://www.last.fm/api/account.
      username: '', // Your Last.fm username.
      contentType: '', // Content to display. Defaults to `recentTracks`. Variables: `lovedTracks` (Your Loved Tracks), `topAlbums` (Your Top Albums), `topTracks` (Your Top Tracks), `newReleases` (Your New Releases), `recentTracks` (Your Recent Tracks).
      artSize: '', // Output album art size. Defaults to `medium`. Variables: `sm` or `small`, `md` or `medium`, `lg` or `large`.
      artQuality: 'normal', // Output album art quality. Defaults to `normal`. Variables: `normal`, `high`, or `extreme`. (NOTE: Choosing `high` or `extreme` may slow load speed)
      number: 5, // Number of tracks to display. Defaults to 5.
      refreshResults: true, // Do you want to auto refresh for new results without reloading the page (Good for contentType `recentTracks`)? Defaults to `true`.
      refreshResultsInt: 45000, // How often do you want to pull new results? Int, in milliseconds. Defaults to `45000` (every 45 seconds).
      tooltips: true, // Do you want to use tooltips? Defaults to `true`. Variables: `true` or `false`.
      nowPlayingIcon: true, // Do you want to see the "Now Playing" equalizer icon if that value exists? Defaults to `true`. Variables: `true` or `false`.
      _blankLinks: true, // Do you want links to open in a new window? Defaults to `true`. Variables: `true` or `false`.
      noAlbumArtImg: 'http://placehold.it/126x126&text=No Art', // Default image to use if there is no album art for the track.
      cssWrapperID: 'jmc_wrap', // CSS ID for `UL` wrapper. Defaults to `jmc_wrap`. (NOTE: If you change this, be sure to update your CSS file.)
      cssThemeClass: 'jmc_dark_theme', // CSS theme to use. Defaults to `jmc_dark_theme`. Variables: `jmc_dark_theme` or `jmc_light_theme`. (NOTE: If you change this, be sure to update your CSS file.)
      noLovedTracks: 'Sorry, No loved tracks...', // Text to display when there is no loved tracks.
      noTopAlbums: 'Sorry, No top albums...', // Text to display when there is no top albums.
      noTopTracks: 'Sorry, No top tracks...', // Text to display when there is no top tracks.
      noNewReleases: 'Sorry, No new releases...', // Text to display when there is no new releases.
      noRecentTracks: 'Sorry, No recent tracks...', // Text to display when there is no recent tracks.
      onComplete: function () {} // On complete, fun a function or do something else.
    },

    settings = $.extend({}, defaults, options);

    if (settings.apiKey == "") {
      jmc_debug("Please enter a valid API key.");
    }
    if (settings.username == "") {
      jmc_debug("Please enter a valid username.");
    }
    if (settings.contentType == "lovedTracks" || settings.contentType == "lovedtracks") {
      var contentOutputType = "lovedTracks";
    }
    else if (settings.contentType == "topAlbums" || settings.contentType == "topalbums") {
      var contentOutputType = "topAlbums";
    }
    else if (settings.contentType == "topTracks" || settings.contentType == "toptracks") {
      var contentOutputType = "topTracks";
    }
    else if (settings.contentType == "newReleases" || settings.contentType == "newreleases") {
      var contentOutputType = "newReleases";
    }
    else if (settings.contentType == "recentTracks" || settings.contentType == "recenttracks" || settings.contentType == '') {
      var contentOutputType = "recentTracks";
    }
    if (contentOutputType == "lovedTracks") {
      var lastUrl = 'http://ws.audioscrobbler.com/2.0/?method=user.getLovedTracks&user=' + settings.username + '&api_key=' + settings.apiKey + '&limit=' + settings.number + '&format=json&callback=?';
    }
    else if (contentOutputType == "topAlbums") {
      var lastUrl = 'http://ws.audioscrobbler.com/2.0/?method=user.getTopAlbums&user=' + settings.username + '&api_key=' + settings.apiKey + '&format=json&callback=?';
    }
    else if (contentOutputType == "topTracks") {
      var lastUrl = 'http://ws.audioscrobbler.com/2.0/?method=user.getTopTracks&user=' + settings.username + '&api_key=' + settings.apiKey + '&format=json&callback=?';
    }
    else if (contentOutputType == "newReleases") {
      var lastUrl = 'http://ws.audioscrobbler.com/2.0/?method=user.getNewReleases&user=' + settings.username + '&api_key=' + settings.apiKey + '&format=json&callback=?';
    }
    else if (contentOutputType == "recentTracks") {
      var lastUrl = 'http://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=' + settings.username + '&api_key=' + settings.apiKey + '&limit=' + settings.number + '&format=json&callback=?';
    }
    else {
      var lastUrl = 'http://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=' + settings.username + '&api_key=' + settings.apiKey + '&limit=' + settings.number + '&format=json&callback=?';
    }

    //jmc_debug(lastUrl);

    // Variables
    var $this = $(this);
    var lastSongPlayed = null;
    if (settings.artSize == 'small' || settings.artSize == 'sm') {
      var imgSize = 0
    }
    else if (settings.artSize == 'medium' || settings.artSize == 'md' || settings.artSize == '') {
      var imgSize = 1
    }
    else if (settings.artSize == 'large' || settings.artSize == 'lg') {
      var imgSize = 2
    }

    // Set up `UL` wrapper
    $this.append("<ul id=\"" + settings.cssWrapperID + "\" class=\"" + settings.cssThemeClass + " jmc_size" + imgSize + "\"></ul>");
    var $this = $this.find("#" + settings.cssWrapperID);

    // Get the data
    var fetchSongs = function(){
      $.getJSON(lastUrl, function (data) {
        // Content type is lovedTracks
        if (contentOutputType == "lovedTracks") {
          // Check to see if there is any loved tracks
          if (data.lovedtracks.track) {
            if ($.isArray(data.lovedtracks.track)) {}
            else {
              data.lovedtracks.track = [data.lovedtracks.track];
            }
            var songLoop = function(){
              $.each(data.lovedtracks.track, function (i, track) {
                if (i > (settings.number - 1)) return false;
                var displayArt = false;
                if ($(this).attr("error")) {
                  $(this).html("An error has occurred");
                  jmc_debug($(this).attr("message"));
                }
                if (settings.artQuality != '' & settings.artQuality == 'high') {
                  imgSize = 2;
                } else if (settings.artQuality != '' & settings.artQuality == 'extreme') {
                  imgSize = 3;
                }
                if (track.image) {
                  displayArt = true;
                  var art = stripslashes(track.image[imgSize]['#text']);
                  if(track.image[imgSize]['#text'] == ''){
                    displayArt = false;
                  }
                }
                var url = stripslashes(track.url);
                var song = track['name'].replace(/"/g, '');
                var artist = track.artist['name'].replace(/"/g, '');
                $this.append("<li class=\"jmc_track\">" + "<a href=\"" + url + "\" title=\"" + song + " by " + artist + "\"" + ((settings._blankLinks) ? 'target=\"_blank\"' : 'target=\"_self\"') + ">" +
                //"<span class=\"jmc_vinyl_case_overlay\"></span>" +
                "<span class=\"jmc_album_art\">" + '<img src="' + ((displayArt == true) ? art : settings.noAlbumArtImg) + '" alt="' + song + ' by ' + artist + '" />' + "</span>" + "<span class=\"jmc_vinyl_case\"></span><span class=\"jmc_vinyl_slip\"></span><span class=\"jmc_vinyl\"></span>" + "</a>" + "</li>");
                if (i == (settings.number - 1)) {
                  settings.onComplete.call(this);
                }
              });
              if (settings.tooltips) {
                var jmc_itemWrap = $this;
                jmc_tooltip(jmc_itemWrap);
              }
            }
            var currentSongPlayed = data.lovedtracks.track[0]["name"];
            if(lastSongPlayed != currentSongPlayed){
              lastSongPlayed = currentSongPlayed;
              $this.find('li.jmc_track').remove();
              songLoop();
            } else {}
          }
          else {
            // There is not loved tracks...
            $this.find('span.jmc_message').remove();
            $this.append("<span class=\"jmc_message\">" + settings.noLovedTracks + "</span>");
            jmc_debug("No loved tracks...");
          }
        }
        // Content type is topAlbums
        else if (contentOutputType == "topAlbums") {
          // Check to see if there is any top albums
          if (data.topalbums.album) {
            if ($.isArray(data.topalbums.album)) {}
            else {
              data.topalbums.album = [data.topalbums.album];
            }
            var songLoop = function(){
              $.each(data.topalbums.album, function (i, album) {
                if (i > (settings.number - 1)) return false;
                var displayArt = false;
                if ($(this).attr("error")) {
                  $(this).html("An error has occurred");
                  jmc_debug($(this).attr("message"));
                }
                if (settings.artQuality != '' & settings.artQuality == 'high') {
                  imgSize = 2;
                } else if (settings.artQuality != '' & settings.artQuality == 'extreme') {
                  imgSize = 3;
                }
                if (album.image) {
                  displayArt = true;
                  var art = stripslashes(album.image[imgSize]['#text']);
                  if(album.image[imgSize]['#text'] == ''){
                    displayArt = false;
                  }
                }
                var url = stripslashes(album.url);
                var song = album['name'].replace(/"/g, '');
                var artist = album.artist['name'].replace(/"/g, '');
                $this.append("<li class=\"jmc_track\">" + "<a href=\"" + url + "\" title=\"" + song + " by " + artist + "\"" + ((settings._blankLinks) ? 'target=\"_blank\"' : 'target=\"_self\"') + ">" +
                //"<span class=\"jmc_vinyl_case_overlay\"></span>" +
                "<span class=\"jmc_album_art\">" + '<img src="' + ((displayArt == true) ? art : settings.noAlbumArtImg) + '" alt="' + song + ' by ' + artist + '" />' + "</span>" + "<span class=\"jmc_vinyl_case\"></span><span class=\"jmc_vinyl_slip\"></span><span class=\"jmc_vinyl\"></span>" + "</a>" + "</li>");
                if (i == (settings.number - 1)) {
                  settings.onComplete.call(this);
                }
              });
              if (settings.tooltips) {
                var jmc_itemWrap = $this;
                jmc_tooltip(jmc_itemWrap);
              }
            }
            var currentSongPlayed = data.topalbums.album[0]["name"];
            if(lastSongPlayed != currentSongPlayed){
              lastSongPlayed = currentSongPlayed;
              $this.find('li.jmc_track').remove();
              songLoop();
            } else {}
          }
          else {
            // There is not any top albums...
            $this.find('span.jmc_message').remove();
            $this.append("<span class=\"jmc_message\">" + settings.noLovedTracks + "</span>");
            jmc_debug("No loved tracks...");
          }
        }
        // Content type is topTracks
        else if (contentOutputType == "topTracks") {
          // Check to see if there is any top tracks
          if (data.toptracks.track) {
            if ($.isArray(data.toptracks.track)) {}
            else {
              data.toptracks.track = [data.toptracks.track];
            }
            var songLoop = function(){
              $.each(data.toptracks.track, function (i, track) {
                if (i > (settings.number - 1)) return false;
                var displayArt = false;
                if ($(this).attr("error")) {
                  $(this).html("An error has occurred");
                  jmc_debug($(this).attr("message"));
                }
                if (settings.artQuality != '' & settings.artQuality == 'high') {
                  imgSize = 2;
                } else if (settings.artQuality != '' & settings.artQuality == 'extreme') {
                  imgSize = 3;
                }
                if (track.image) {
                  displayArt = true;
                  var art = stripslashes(track.image[imgSize]['#text']);
                  if(track.image[imgSize]['#text'] == ''){
                    displayArt = false;
                  }
                }
                var url = stripslashes(track.url);
                var song = track['name'].replace(/"/g, '');
                var artist = track.artist['name'].replace(/"/g, '');
                $this.append("<li class=\"jmc_track\">" + "<a href=\"" + url + "\" title=\"" + song + " by " + artist + "\"" + ((settings._blankLinks) ? 'target=\"_blank\"' : 'target=\"_self\"') + ">" +
                //"<span class=\"jmc_vinyl_case_overlay\"></span>" +
                "<span class=\"jmc_album_art\">" + '<img src="' + ((displayArt == true) ? art : settings.noAlbumArtImg) + '" alt="' + song + ' by ' + artist + '" />' + "</span>" + "<span class=\"jmc_vinyl_case\"></span><span class=\"jmc_vinyl_slip\"></span><span class=\"jmc_vinyl\"></span>" + "</a>" + "</li>");
                if (i == (settings.number - 1)) {
                  settings.onComplete.call(this);
                }
              });
              if (settings.tooltips) {
                var jmc_itemWrap = $this;
                jmc_tooltip(jmc_itemWrap);
              }
            }
            var currentSongPlayed = data.toptracks.track[0]["name"];
            if(lastSongPlayed != currentSongPlayed){
              lastSongPlayed = currentSongPlayed;
              $this.find('li.jmc_track').remove();
              songLoop();
            } else {}
          }
          else {
            // There is not top tracks...
            $this.find('span.jmc_message').remove();
            $this.append("<span class=\"jmc_message\">" + settings.noLovedTracks + "</span>");
            jmc_debug("No loved tracks...");
          }
        }
        // Content type is newReleases
        else if (contentOutputType == "newReleases") {
          // Check to see if there is any new releases
          if (data.albums.album) {
            if ($.isArray(data.albums.album)) {}
            else {
              data.albums.album = [data.albums.album];
            }
            var songLoop = function(){
              $.each(data.albums.album, function (i, album) {
                if (i > (settings.number - 1)) return false;
                var displayArt = false;
                if ($(this).attr("error")) {
                  $(this).html("An error has occurred");
                  jmc_debug($(this).attr("message"));
                }
                if (settings.artQuality != '' & settings.artQuality == 'high') {
                  imgSize = 2;
                } else if (settings.artQuality != '' & settings.artQuality == 'extreme') {
                  imgSize = 3;
                }
                if (album.image) {
                  displayArt = true;
                  var art = stripslashes(album.image[imgSize]['#text']);
                  if(album.image[imgSize]['#text'] == ''){
                    displayArt = false;
                  }
                }
                var url = stripslashes(album.url);
                var song = album['name'].replace(/"/g, '');
                var artist = album.artist['name'].replace(/"/g, '');
                $this.append("<li class=\"jmc_track\">" + "<a href=\"" + url + "\" title=\"" + song + " by " + artist + "\"" + ((settings._blankLinks) ? 'target=\"_blank\"' : 'target=\"_self\"') + ">" +
                //"<span class=\"jmc_vinyl_case_overlay\"></span>" +
                "<span class=\"jmc_album_art\">" + '<img src="' + ((displayArt == true) ? art : settings.noAlbumArtImg) + '" alt="' + song + ' by ' + artist + '" />' + "</span>" + "<span class=\"jmc_vinyl_case\"></span><span class=\"jmc_vinyl_slip\"></span><span class=\"jmc_vinyl\"></span>" + "</a>" + "</li>");
                if (i == (settings.number - 1)) {
                  settings.onComplete.call(this);
                }
              });
              if (settings.tooltips) {
                var jmc_itemWrap = $this;
                jmc_tooltip(jmc_itemWrap);
              }
            }
            var currentSongPlayed = data.albums.album[0]["name"];
            if(lastSongPlayed != currentSongPlayed){
              lastSongPlayed = currentSongPlayed;
              $this.find('li.jmc_track').remove();
              songLoop();
            } else {}
          }
          else {
            // There is not any new releases...
            $this.find('span.jmc_message').remove();
            $this.append("<span class=\"jmc_message\">" + settings.noLovedTracks + "</span>");
            jmc_debug("No loved tracks...");
          }
        }
        else {
          if (data.recenttracks.track) {
            if ($.isArray(data.recenttracks.track)) {}
            else {
              data.recenttracks.track = [data.recenttracks.track];
            }
            var songLoop = function(){
              $.each(data.recenttracks.track, function (i, track) {
                if (i > (settings.number - 1)) return false;
                var nowPlaying, displayArt = false;
                if ($(this).attr("error")) {
                  $(this).html("An error has occurred");
                  jmc_debug($(this).attr("message"));
                }
                if (settings.artQuality != '' & settings.artQuality == 'high') {
                  imgSize = 2;
                } else if (settings.artQuality != '' & settings.artQuality == 'extreme') {
                  imgSize = 3;
                }
                if (track.image) {
                  displayArt = true;
                  var art = stripslashes(track.image[imgSize]['#text']);
                  if(track.image[imgSize]['#text'] == ''){
                    displayArt = false;
                  }
                }
                if ($(this).attr("@attr")) {
                  nowPlaying = true;
                }
                var url = stripslashes(track.url);
                var song = track['name'].replace(/"/g, '');
                var artist = track.artist['#text'].replace(/"/g, '');
                $this.append("<li class=\"jmc_track" + ((nowPlaying == true) ? ' jmc_nowplaying' : '') + "\">" + "<a href=\"" + url + "\" title=\"" + song + " by " + artist + "\"" + ((settings._blankLinks) ? 'target=\"_blank\"' : 'target=\"_self\"') + ">" +
                //"<span class=\"jmc_vinyl_case_overlay\"></span>" +
                ((nowPlaying == true & settings.nowPlayingIcon == true) ? '<span class=\"jmc_nowplaying\"></span>' : '') + "<span class=\"jmc_album_art\">" + '<img src="' + ((displayArt == true) ? art : settings.noAlbumArtImg) + '" alt="' + song + ' by ' + artist + '" />' + "</span>" + "<span class=\"jmc_vinyl_case\"></span><span class=\"jmc_vinyl_slip\"></span><span class=\"jmc_vinyl\"></span>" + "</a>" + "</li>");
                if (i == (settings.number - 1)) {
                  settings.onComplete.call(this);
                }
              });
              if (settings.tooltips) {
                var jmc_itemWrap = $this;
                jmc_tooltip(jmc_itemWrap);
              }
            }
            var currentSongPlayed = data.recenttracks.track[0]["name"];
            if(lastSongPlayed != currentSongPlayed){
              lastSongPlayed = currentSongPlayed;
              $this.find('li.jmc_track').remove();
              songLoop();
            } else {}
          }
          else {
            $this.find('span.jmc_message').remove();
            $this.append("<span class=\"jmc_message\">" + settings.noLovedTracks + "</span>");
            jmc_debug("No recent tracks...");
          }
        }
        if (settings.refreshResults) {
          setTimeout(fetchSongs, settings.refreshResultsInt);
        }
      });
    }
    fetchSongs();
  };

  // JMC Tooltip function
  function jmc_tooltip(jmc_itemWrap) {
    // hoverIntent r6 // 2011.02.26 // jQuery 1.5.1+ <http://cherne.net/brian/resources/jquery.hoverIntent.html> @author Brian Cherne brian(at)cherne(dot)net
    $.fn.hoverIntent=function(f,g){var cfg={sensitivity:7,interval:100,timeout:0};cfg=$.extend(cfg,g?{over:f,out:g}:f);var cX,cY,pX,pY;var track=function(ev){cX=ev.pageX;cY=ev.pageY};var compare=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);if((Math.abs(pX-cX)+Math.abs(pY-cY))<cfg.sensitivity){$(ob).unbind("mousemove",track);ob.hoverIntent_s=1;return cfg.over.apply(ob,[ev])}else{pX=cX;pY=cY;ob.hoverIntent_t=setTimeout(function(){compare(ev,ob)},cfg.interval)}};var delay=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);ob.hoverIntent_s=0;return cfg.out.apply(ob,[ev])};var handleHover=function(e){var ev=jQuery.extend({},e);var ob=this;if(ob.hoverIntent_t){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t)}if(e.type=="mouseenter"){pX=ev.pageX;pY=ev.pageY;$(ob).bind("mousemove",track);if(ob.hoverIntent_s!=1){ob.hoverIntent_t=setTimeout(function(){compare(ev,ob)},cfg.interval)}}else{$(ob).unbind("mousemove",track);if(ob.hoverIntent_s==1){ob.hoverIntent_t=setTimeout(function(){delay(ev,ob)},cfg.timeout)}}};return this.bind('mouseenter',handleHover).bind('mouseleave',handleHover)}
    // Each Tooltip
    var jmc_itemWrap = jmc_itemWrap.find('.jmc_track a');
    jmc_itemWrap.each(function () {
      var getText = $(this).attr('title');
      var $wrapper = '<div class="jmc_tooltip_wrap">' + getText + '<span class="jmc_tooltip_arrow_down"></span></div>';
      $(this).append($wrapper);
      var $tooltip = $('.jmc_tooltip_wrap', this);
      var widthP = $tooltip.width();
      var widthP2 = $tooltip.outerWidth() / 2 + 2;
      var heightP = $tooltip.height();
      var widthT = $(this).width();
      var heightT = $(this).height();
      var marginTop = heightT;
      $tooltip.css({
        bottom: marginTop + 'px',
        marginLeft: '-' + widthP2 + 'px'
      });
      $tooltip.css('opacity', 0);
      var $tooltip_arrow = $('.jmc_tooltip_arrow_down', this);
      $tooltip_arrow.css({
        marginTop: heightP + 8 + 'px',
        marginLeft: widthP / 2 + 'px'
      });
      $(this).removeAttr("title");
      var config = {
        sensitivity: 1,
        interval: 10,
        over: linkOver,
        timeout: 125,
        out: linkOut
      };
      $(this).hoverIntent(config);

      function linkOver() {
        $tooltip.show().css({
          bottom: marginTop - 10 + 'px'
        }).animate({
          bottom: marginTop,
          opacity: 1
        }, 75);
      }

      function linkOut() {
        $('.jmc_tooltip_wrap', this).animate({
          bottom: (5 * 1.5) + marginTop,
          opacity: 0
        }, 150, function () {
          $(this).hide();
        });
      }
    });
  }

  // JMC Helpers
  function stripslashes(str) {
    return (str + '').replace(/\0/g, '0').replace(/\\([\\'"])/g, '$1');
  }
  function jmc_debug(error) {
    if (typeof console == 'object') console.log(error);
    else if (typeof opera == 'object') opera.postError(error);
  }
})(jQuery);
