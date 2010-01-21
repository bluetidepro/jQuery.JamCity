/*
 * jQuery.nowPlaying by Engage Interactive & Kyle Hotchkiss Productions
 * Copyright (c) 2009 - 2010 EI/KHP
 * Version: 1.1 (21-JAN-2010)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * Requires: jQuery v1.3 or later
 */

(function($) {
 $.fn.nowPlaying = function(options) {
  var defaults = {
   number:3,
   username:'kylehotchkiss',
   apikey:'please_insert_api',
   artSize:'medium',
   noart:'images/noart.png',
   onComplete: function() {}
  },
 
  settings = $.extend({}, defaults, options);
 
  var lastUrl = 'http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user='+settings.username+'&api_key='+settings.apikey+'&limit='+settings.number+'&format=json&callback=?';
  var $this = $(this);
 
  var container = $this.html();
  $this.children(':first').remove();
  if(settings.artSize == 'small'){imgSize = 0}
  if(settings.artSize == 'medium'){imgSize = 1}
  if(settings.artSize == 'large'){imgSize = 2}

  // This needs to be written to only run "COUNT" times.
  this.each(function() {
   $.getJSON(lastUrl, function(data) { 
    $.each(data.recenttracks.track, function(i, item) {
     if(i > (settings.number-1)) return false;
    
     // This is the "Now Playing" dectector. 
     if ($(this).attr("@attr")) {
      var playing = 1;
     }
   
     if (item.image[1]['#text'] == '') { 
      art = settings.noart;
     } else {
      art = stripslashes(item.image[imgSize]['#text']);
     }
   
     url = stripslashes(item.url);
     song = item.name;
     artist = item.artist['#text'];
     album = item.album['#text'];
     $this.append(container);
     var $current = $this.children(':eq('+i+')');
     
     $current.append("<div></div>").html("hai!");
     $current.find('[class=lfm_song]').append(song);
     $current.find('[class=lfm_artist]').append(artist);
     $current.find('[class=lfm_album]').append(album);
     if (playing == '1') {
      $current.find('[class=lfm_playing]').show();
     }
   
     $current.find('[class=lfm_art]').append("<img src='"+art+"' alt='Artwork for "+album+"'/>");
     $current.find('a').attr('href', url).attr('title', 'Listen to '+song+' on Last.FM').attr('target', '_blank');

     if(i==(settings.number-1)) { 
      settings.onComplete.call(this);
     }
    });
   });
  });
 };
 
 //Clean up the URLs
 function stripslashes( str ) {	 
  return (str+'').replace(/\0/g, '0').replace(/\\([\\'"])/g, '$1');
 }
})(jQuery);
