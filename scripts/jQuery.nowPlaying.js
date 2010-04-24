/**
 *
 * jQuery.nowPlaying : What are you listening to? v. 1.1
 * Copyright (c) 2010 Kyle Hotchkiss [Productions].
 * Dual licensed under the MIT and GPL licenses.
 *
 * Portions of code derived from "Last.fm Plugin for jQuery"
 * http://labs.engageinteractive.co.uk/lastfm/
 *
 */

(function($) {
 $.fn.nowPlaying = function(options) {
  var defaults = {
   apiKey:'',
   artSize:'medium',
   display:'recentTracks',
   number:5,
   username:'',
   onComplete: function() {}
  },
 
  settings = $.extend({}, defaults, options);
  
  //
  // Stupidproofing is the name of the game.
  //
  if (settings.apiKey == "" ) {
   debug("Please enter a valid API key.");
  }
  
  if (settings.username == "" ) {
   debug("Please enter a valid username.");
  }
  
  if (settings.display == "lovedTracks") {
   var lastUrl = 'http://ws.audioscrobbler.com/2.0/?method=user.getlovedtracks&user='+settings.username+'&api_key='+settings.apiKey+'&limit='+settings.number+'&format=json&callback=?';
  }
  
  else if (settings.display == "topTracks") {
   var lastUrl = 'http://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user='+settings.username+'&api_key='+settings.apiKey+'&format=json&callback=?';
  }
  
  else {
   var lastUrl = 'http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user='+settings.username+'&api_key='+settings.apiKey+'&limit='+settings.number+'&format=json&callback=?';  
  }
 
  //
  // Get some paperwork out of the way.
  //
  var $this = $(this);
  
  if ( settings.artSize == 'small' ) {
   imgSize = 0
  }
  
  else if ( settings.artSize == 'medium' ) {
   imgSize = 1
  }
  
  else if ( settings.artSize == 'large' ) {
   imgSize = 2
  }
   
  // 
  // Get that data. (Do the Dew.)
  //
  $.getJSON(lastUrl, function(data) { 
   if ( settings.display == "lovedTracks" ) {
    $.each(data.lovedtracks.track, function(i, item) {
     if( i > (settings.number - 1) ) 
      return false;
      
     var displayArt = false;
    
     if ( $(this).attr("error") ) {
      $(this).html("An error has occured");
      debug( $(this).attr("message") );
     }
      
     if ( item.image ) {
      var displayArt = true;
      art = stripslashes(item.image[imgSize]['#text']);
     }
     
     url = stripslashes(item.url);
     song = item.name;
     artist = item.artist['name'];
     //$this.append(container);
     $this.append("<div class=\"lfm_track\"></div>");
     var $current = $this.children(':eq('+i+')');
     $current.html(
      "<div class=\"lfm_art\">" +  
       "<a href=\"http:\\\\" + url +"\" title=\"Listen to " + song + " on Last.FM\" target=\"_blank\">" + "</a>" + // There is no rhyhme or reason here.
      "</div>" +
      "<div class=\"lfm_float\">" +
       "<div class=\"lfm_status loved\">" + "</div>" +       
       "<div class=\"lfm_fade\">" + "</div>" +
       "<div class=\"lfm_song\">" + song + "</div>" + 
       "<div class=\"lfm_artist\">" + "<span class=\"lfm_enlighten\">" + "by:" + "</span>" + artist + "</div>" +       
      "</div>" +
      "<div class=\"lfm_clear\">" + "</div>"
     );
      
     if ( displayArt ) {
      $current.find('[class=lfm_art]').append("<img src='" + art + "' />");
     }

     if ( i == (settings.number - 1) ) { 
      settings.onComplete.call(this);
     }
    });
   }
    
   else if ( settings.display == "topTracks" ) {
    $.each(data.toptracks.track, function(i, item) {
     if (i > (settings.number - 1) ) 
      return false; // "Top Tracks" needs this the most, it gives you 50 tracks by default.
    
     var displayArt = false;
     
     if ( $(this).attr("error") ) {
      $(this).html("An error has occured");
      debug( $(this).attr("message") );
     }
   
     if ( item.image ) {
      var displayArt = true;
      art = stripslashes(item.image[imgSize]['#text']);
     }
   
     url = stripslashes(item.url);
     song = item.name;
     artist = item.artist['name'];
     $this.append("<div class=\"lfm_track\"></div>");
     var $current = $this.children(':eq('+i+')');
     $current.html(
      "<div class=\"lfm_art\">" +  
       "<a href=\"" + url +"\" title=\"Listen to " + song + " on Last.FM\" target=\"_blank\">" + "</a>" +
      "</div>" +
      "<div class=\"lfm_float\">" +
       "<div class=\"lfm_fade\">" + "</div>" +
       "<div class=\"lfm_status\">" + "</div>" +        
       "<div class=\"lfm_song\">" + song + "</div>" + 
       "<div class=\"lfm_artist\">" + "<span class=\"lfm_enlighten\">" + "by:" + "</span>" + artist + "</div>" +       
      "</div>" +
      "<div class=\"lfm_clear\">" + "</div>"
     );
      
     if ( displayArt ) {
      $current.find('[class=lfm_art]').append("<img src='" + art + "' />");
     }

     if( i == (settings.number - 1) ) { 
       settings.onComplete.call(this);
     }
    });
   }
    
   else {
    $.each(data.recenttracks.track, function(i, item) {
     if ( i > (settings.number - 1) ) 
      return false;
     
     var nowplaying, displayArt = false;
     
     if( $(this).attr("error") ) {
      $(this).html("An error has occured");
      debug( $(this).attr("message") );
     }
     
     // This is the "Now Playing" dectector. 
     if ( $(this).attr("@attr") ) {
      var playing = true;
     }
   
     if ( !item.image[1]['#text'] == '' ) { 
      var displayArt = true;
      art = stripslashes(item.image[imgSize]['#text']);
     }
   
     url = stripslashes(item.url);
     song = item.name;
     artist = item.artist['#text'];
     album = item.album['#text'];
     $this.append("<div class=\"lfm_track\"></div>");
     var $current = $this.children(':eq('+i+')');
     $current.html(
      "<div class=\"lfm_art\">" +  
       "<a href=\"" + url +"\" title=\"Listen to " + song + " on Last.FM\" target=\"_blank\">" + "</a>" +
      "</div>" +
      "<div class=\"lfm_float\">" +
       "<div class=\"lfm_fade\">" + "</div>" +
       "<div class=\"lfm_status\">" + "</div>" +         
       "<div class=\"lfm_song\">" + song + "</div>" + 
       "<div class=\"lfm_artist\">" + "<span class=\"lfm_enlighten\">" + "by:" + "</span>" + artist + "</div>" +
       "<div class=\"lfm_album\">" + "</div>" +      
      "</div>" +
      "<div class=\"lfm_clear\">" + "</div>"
     );
     
     if ( playing == '1' ) {
      $current.find('[class=lfm_status]').addClass("playing");
     }
      
     if ( album != '' ) {
      $current.find('[class=lfm_album]').html("<span class=\"lfm_enlighten\">" + "from:" + "</span>" + album); // Lmao, this is OD, Last.fm
      }
   
     if ( displayArt ) {
      $current.find('[class=lfm_art]').append("<img src='" + art + "' />");
     }

     if( i == (settings.number - 1) ) { 
      settings.onComplete.call(this);
     }  
    });
   } 
  });
 };
 
 function stripslashes( str ) {	// Clean up the URLs
  return (str+'').replace(/\0/g, '0').replace(/\\([\\'"])/g, '$1');
 }
 
 function debug( error ) { // Production-Level debug
  if ( typeof console == 'object' )
   console.log( error );

  else if ( typeof opera == 'object' )
   opera.postError( error );
 }
})(jQuery);
