/*
 * jQuery.nowPlaying by Kyle Hotchkiss Productions.
 * Copyright (c) 2010 Kyle Hotchkiss Productions.
 * Version: 1.0 (25-JAN-2010)
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 * Portions of code derived from "Last.fm Plugin for jQuery"
 * http://labs.engageinteractive.co.uk/lastfm/
 * Requires: jQuery v1.3 or later & a Last.fm API key.
 */

(function($) {
 $.fn.nowPlaying = function(options) {
  var defaults = {
   apikey:'e2cf0e44284d27c9448a4f183e371634', // Please, PLEASE, PPLLEEAASSEE replace with your own API key.
   artSize:'medium',
   display:'recentTracks',
   number:5,
   username:'kylehotchkiss',
   onComplete: function() {}
  },
 
  settings = $.extend({}, defaults, options);
  
  if (settings.display == "lovedTracks") {
   var lastUrl = 'http://ws.audioscrobbler.com/2.0/?method=user.getlovedtracks&user='+settings.username+'&api_key='+settings.apikey+'&limit='+settings.number+'&format=json&callback=?';
  }
  
  else if (settings.display == "topTracks") {
   var lastUrl = 'http://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user='+settings.username+'&api_key='+settings.apikey+'&format=json&callback=?';
  }
  
  else {
   var lastUrl = 'http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user='+settings.username+'&api_key='+settings.apikey+'&limit='+settings.number+'&format=json&callback=?';  
  }
 
  var $this = $(this);
 
  var container = $this.html();
  $this.children(':first').remove();
  if(settings.artSize == 'small'){imgSize = 0}
  if(settings.artSize == 'medium'){imgSize = 1}
  if(settings.artSize == 'large'){imgSize = 2}

  this.each(function() {
   $.getJSON(lastUrl, function(data) { 
    if (settings.display == "lovedTracks") {
     $.each(data.lovedtracks.track, function(i, item) {
      if(i > (settings.number-1)) return false; // Does this need it?
      
      var displayArt = false;
     
      if($(this).attr("error")) {
       $(this).html("An error has occured");
      }
      
      if (item.image) {
       var displayArt = true;
       art = stripslashes(item.image[imgSize]['#text']);
      }
     
      url = stripslashes(item.url);
      song = item.name;
      artist = item.artist['name'];
      $this.append(container);
      $this.append("<div class=\"lfm_track\"></div>");
      var $current = $this.children(':eq('+i+')');
      $current.html(
       "<div class=\"lfm_art\">" +  
        "<a href=\"http:\\\\" + url +"\" title=\"Listen to " + song + " on Last.FM\" target=\"_blank\">" + "</a>" + // There is no rhyhme or reason here.
        "<div class=\"lfm_status loved\">" + "</div>" + 
       "</div>" +
       "<div class=\"lfm_float\">" +
        "<div class=\"lfm_fade\">" + "</div>" +
        "<div class=\"lfm_song\">" + song + "</div>" + 
        "<div class=\"lfm_artist\">" + "<span class=\"lfm_enlighten\">" + "by:" + "</span>" + artist + "</div>" +
       "</div>" +
       "<div class=\"lfm_clear\">" + "</div>"
      );
      
      if (displayArt) {
       $current.find('[class=lfm_art]').append("<img src='" + art + "' />");
      }

      if(i==(settings.number-1)) { 
       settings.onComplete.call(this);
      }
     });
    }
    
    else if (settings.display == "topTracks") {
     $.each(data.toptracks.track, function(i, item) {
      if(i > (settings.number-1)) return false; // "Top Tracks" needs this the most, it gives you 50 tracks by default.
     
      var displayArt = false;
      
      if($(this).attr("error")) {
       $(this).html("An error has occured");
      }
   
      if (item.image) {
       var displayArt = true;
       art = stripslashes(item.image[imgSize]['#text']);
      }
   
      url = stripslashes(item.url);
      song = item.name;
      artist = item.artist['name'];
      $this.append(container);
      $this.append("<div class=\"lfm_track\"></div>");
      var $current = $this.children(':eq('+i+')');
      $current.html(
       "<div class=\"lfm_art\">" +  
        "<a href=\"" + url +"\" title=\"Listen to " + song + " on Last.FM\" target=\"_blank\">" + "</a>" +
        "<div class=\"lfm_status\">" + "</div>" + 
       "</div>" +
       "<div class=\"lfm_float\">" +
        "<div class=\"lfm_fade\">" + "</div>" +
        "<div class=\"lfm_song\">" + song + "</div>" + 
        "<div class=\"lfm_artist\">" + "<span class=\"lfm_enlighten\">" + "by:" + "</span>" + artist + "</div>" +
       "</div>" +
       "<div class=\"lfm_clear\">" + "</div>"
      );
      
      if (displayArt) {
       $current.find('[class=lfm_art]').append("<img src='" + art + "' />");
      }

      if(i==(settings.number-1)) { 
       settings.onComplete.call(this);
      }
     });
    }
    
    else {
     $.each(data.recenttracks.track, function(i, item) {
      if(i > (settings.number-1)) return false; // Take the "Number" setting more literally. 
     
      var nowplaying, displayArt = false;
      
      if($(this).attr("error")) {
       $(this).html("An error has occured");
      }
     
      // This is the "Now Playing" dectector. 
      if ($(this).attr("@attr")) { // Note that this is a specific hack for the "recenttracks"
       var playing = true;
      }
   
      if (!item.image[1]['#text'] == '') { 
       var displayArt = true;
       art = stripslashes(item.image[imgSize]['#text']);
      }
   
      url = stripslashes(item.url);
      song = item.name;
      artist = item.artist['#text'];
      album = item.album['#text'];
      $this.append(container);
      $this.append("<div class=\"lfm_track\"></div>");
      var $current = $this.children(':eq('+i+')');
      $current.html(
       "<div class=\"lfm_art\">" +  
        "<a href=\"" + url +"\" title=\"Listen to " + song + " on Last.FM\" target=\"_blank\">" + "</a>" +
        "<div class=\"lfm_status\">" + "</div>" + 
       "</div>" +
       "<div class=\"lfm_float\">" +
        "<div class=\"lfm_fade\">" + "</div>" +
        "<div class=\"lfm_song\">" + song + "</div>" + 
        "<div class=\"lfm_artist\">" + "<span class=\"lfm_enlighten\">" + "by:" + "</span>" + artist + "</div>" +
        "<div class=\"lfm_album\">" + "</div>" +
       "</div>" +
       "<div class=\"lfm_clear\">" + "</div>"
      );
      
      if (playing == '1') {
       $current.find('[class=lfm_status]').addClass("playing");
      }
      
      if (album != '') {
       $current.find('[class=lfm_album]').html("<span class=\"lfm_enlighten\">" + "from:" + "</span>" + album); // Lmao, this is OD Last.fm
      }
   
      if (displayArt) {
       $current.find('[class=lfm_art]').append("<img src='" + art + "' />");
      }

      if(i==(settings.number-1)) { 
       settings.onComplete.call(this);
      }
     });
    }
   });
  });
 };
 
 //Clean up the URLs
 function stripslashes( str ) {	 
  return (str+'').replace(/\0/g, '0').replace(/\\([\\'"])/g, '$1');
 }
})(jQuery);
