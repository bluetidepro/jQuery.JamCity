
 jQuery.nowPlaying : What are you listening to? v. 1.12
 Copyright (c) 2010 Kyle Hotchkiss [Productions].
 Dual licensed under the MIT and GPL licenses.

 Portions of code derived from "Last.fm Plugin for jQuery"
 http://labs.engageinteractive.co.uk/lastfm/

 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

 As a disclaimer, jQuery.nowPlaying isn't as simple as it 
 could be, but nonetheless here is a quick rundown on 
 installation:

 1. Include jQuery and jQuery.nowPlaying in your page.
    
     <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
     <script type="text/javascript" src="scripts/jQuery.nowPlaying"></script>
     
 2. Initialize it.  

     <script type="text/javascript"> 
      $(document).ready(function() { 
       $(".nowplaying").nowPlaying({ 
        apiKey:'your-api-key', // You'll have to get it off Last.FM.
        username:'your-last.fm-username' 
       }); 
      }); 
     </script> 
  
3. Put the container div in your page.
   
     <div class="nowplaying"></div> 

 3. Have fun styling it! Here is the structure of it (It's strange, I know, but allows for
    some cool designs if you take advantage of it.):

     <div class="lfm_track">
      <div class=\"lfm_art\">
       <!-- Artwork -->
      </div>
      <div class=\"lfm_float\">
       <div class=\"lfm_fade\"></div>
       <div class=\"lfm_status\">
        <!-- Shows if a song is loved or currently playing -->
       </div>
       <div class=\"lfm_song\">
        <!-- The name of the song -->
       </div>
       <div class=\"lfm_artist\">
        <!-- Artist -->
       </div>       
      </div>
      <div class=\"lfm_clear\"></div>
     </div>
   
 4. Enjoy your guests reactions to your inevitable love
    for Miley Cyrus and Brittany Spears.
 
 


