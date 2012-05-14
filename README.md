# jQuery.JamCity (1.0)

* * *

 jQuery.JamCity : v. 1.0  
 Copyright (c) 2012 Zach Reed [Blue Tide Productions, LLC].  
 Dual licensed under the MIT and GPL licenses.  

* * *

## jQuery.JamCity // Information

jQuery.JamCity uses the API from [Last.Fm](http://www.last.fm/api) to get your Last.Fm account top albums (*Last.Fm api:* `getTopAlbums`), loved tracks (*Last.Fm api:* `getLovedTracks`), top tracks (*Last.Fm api:* `getTopTracks`), new releases (*Last.Fm api:* `getNewReleases`), or recent tracks (*Last.Fm api:* `getRecentTracks`). It then takes that information and displays a **beautiful** layout using CSS3, jQuery, etc. Enjoy showing off your music on your blog or website!

## jQuery.JamCity // Getting Started

First, include the jQuery library, jQuery.JamCity javascript (<em>jQuery.JamCity.js</em> or <em>jQuery.JamCity.min.js</em>) and the jQuery.JamCity CSS (<em>jmc_styles.css</em>) on the page(s) where you want to use jQuery.JamCity.

		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js" type="text/javascript"></script>
		<script src="jQuery.JamCity.js" type="text/javascript"></script>
		<link rel="stylesheet" href="css/jmc_styles.css" type="text/css">

Then, add a container div with an ID to your HTML so we can output jQuery.JamCity somewhere.

		<div id="JMC_Container"></div>

Then, initialize jQuery.JamCity. Put the following code before the closing tag of your body ().

		<script type="text/javascript" charset="utf-8">
			$(document).ready(function(){
				$("#JMC_Container").JamCity({ 
					apiKey: '',
					username: 'bluetidepro' 
				});
			});
		</script>

## jQuery.JamCity // Usage

		$("#demo1").JamCity(
			{ 
				apiKey: '',
				username: '',
				contentType: '',
				artSize: '',
      			artQuality: 'normal',
				number: 5,
				tooltips: true,
				nowPlayingIcon: true,
				_blankLinks: true,
				noAlbumArtImg:'http://placehold.it/126x126&text=No Art',
				cssWrapperID: 'jmc_wrap',
				cssThemeClass: 'jmc_dark_theme',
				noLovedTracks: 'Sorry, No loved tracks...',
				noTopAlbums: 'Sorry, No top albums...',
				noTopTracks: 'Sorry, No top tracks...',
				noNewReleases: 'Sorry, No new releases...',
				noRecentTracks: 'Sorry, No recent tracks...',
				onComplete: function () {
				}
		});

## jQuery.JamCity // Configuration Settings

*   **`apiKey`**

    Your Last.fm API key. You can get this easily setup here: [http://www.last.fm/api/account](http://www.last.fm/api/account).

*   **`username`**

    Your Last.fm username.

*   **`contentType`**

    Content to display. Defaults to `recentTracks`. Variables: `lovedTracks` (Your Loved Tracks), `topAlbums` (Your Top Albums), `topTracks` (Your Top Tracks), `newReleases` (Your New Releases), `recentTracks` (Your Recent Tracks).

*   **`artSize`**

    Output album art size. Defaults to `medium`. Variables: `sm` or `small`, `md` or `medium`, `lg` or `large`.

*   **`artQuality`** - ***Default:** 'normal'*

    Output album art quality. Defaults to `normal`. Variables: `normal`, `high`, or `extreme`. (NOTE: Choosing `high` or `extreme` may slow load speed)

*   **`number`** - ***Default:** '5'*

    Number of tracks to display. Defaults to 5.

*   **`tooltips`** - ***Default:** 'true'*

    Do you want to use tooltips? Defaults to `true`. Variables: `true` or `false`.

*   **`nowPlayingIcon`** - ***Default:** 'true'*

    Do you want to see the "Now Playing" equalizer icon if that value exists? Defaults to `true`. Variables: `true` or `false`.

*   **`_blankLinks`** - ***Default:** 'true'*

    Do you want links to open in a new window? Defaults to `true`. Variables: `true` or `false`.

*   **`noAlbumArtImg`** - ***Default:** 'http://placehold.it/126x126&text=No Art'*

    Default image to use if there is no album art for the track.

*   **`cssWrapperID`** - ***Default:** 'jmc_wrap'*

    CSS ID for `UL` wrapper. Defaults to `jmc_wrap`. (NOTE: If you change this, be sure to update your CSS file.)

*   **`cssThemeClass`** - ***Default:** 'jmc_dark_theme'*

    CSS theme to use. Defaults to `jmc_dark_theme`. Variables: `jmc_dark_theme` or `jmc_light_theme`. (NOTE: If you change this, be sure to update your CSS file.)

*   **`noLovedTracks`** - ***Default:** 'Sorry, No loved tracks...'*

    Text to display when there is no loved tracks.

*   **`noTopAlbums`** - ***Default:** 'Sorry, No top albums...'*

    Text to display when there is no top albums.

*   **`noTopTracks`** - ***Default:** 'Sorry, No top tracks...'*

    Text to display when there is no top tracks.

*   **`noNewReleases`** - ***Default:** 'Sorry, No new releases...'*

    Text to display when there is no new releases.

*   **`noRecentTracks`** - ***Default:** 'Sorry, No recent tracks...'*

    Text to display when there is no recent tracks.

*   **`onComplete`**

    On complete, fun a function or do something else.

## jQuery.JamCity // Each Item HTML Output

		<li class="jmc_track">
			<a href="{Track Link}" title="{name} by {artist}" target="_blank">
			  <span class="jmc_album_art"><img src="{album art}" alt="{name} by {artist}">></span>
			  <span class="jmc_vinyl_case"></span>
			  <span class="jmc_vinyl_slip"></span>
			  <span class="jmc_vinyl"></span>
			  <div class="jmc_tooltip_wrap">{name} by {artist}<span class="jmc_tooltip_arrow_down"></span></div>
			</a>
		</li>

## jQuery.JamCity // FAQ

*   **Where do I get a Last.FM api key?**

	It's very easy. Simply signup for an API key (be sure to be logged into Last.FM) [here (http://www.last.fm/api/account)](http://www.last.fm/api/account).

*   **I don't use Last.FM, can I get this working for Spotify?**

    Yes! What you can do is connect your Spotify account to "scrobble" what you play from Spotify to Last.FM (this is built into Spotify already). You will still need to create a Last.FM account to connect everything but once you do that, everything you play on Spotify will automatically be sent to your Last.FM account, then used by jQuery.JamCity!

*   **Where should I report any bugs?**
	
	Please report all jQuery.JamCity bugs on the [github 'Issues' page](https://github.com/bluetidepro/jQuery.JamCity/issues). Thanks!

*   **I have a feature request, what do I do?**
	
	You can [Email me](mailto:zreed@bluetideproductions.com) ([@bluetidepro](https://twitter.com/#!/bluetidepro)) or post it on the jQuery.JamCity [github 'Issues' page](https://github.com/bluetidepro/jQuery.JamCity/issues). Thanks!

## jQuery.JamCity // Coming Soon

*   More themes

## jQuery.JamCity // More info, and contact
 *Portions of the code derived/forked from "[Last.fm Plugin for jQuery](http://labs.engageinteractive.co.uk/lastfm/)" and "[jQuery.nowPlaying](https://github.com/kylehotchkiss/jQuery.nowPlaying)"*   
 *Original .PSD for some design elements by [Tobias Wiedenmann](http://dribbble.com/thyraz) - [Music Album Cover PSD](http://365psd.com/day/267/)*   
 *jQuery.JamCity has [hoverIntent r6 (2011.02.26)](http://cherne.net/brian/resources/jquery.hoverIntent.html) built-in for tooltips to work properly.*

[Email me](mailto:zreed@bluetideproductions.com) ([@bluetidepro](https://twitter.com/#!/bluetidepro)) if you have any questions about jQuery.JamCity.