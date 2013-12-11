/**
*
*	jquery.JamCity : v. 2.0.0
*	https://github.com/bluetidepro/jquery.JamCity
*	Copyright (c) 2012 Zach Reed (http://iamzachreed.com).
*	MIT licensed
*
*/
;(function($,window,document,undefined) {
	'use strict';

	/*
	*	@params
	*
	*	Required params:
	*		- [string] apiKey: Your Last.fm API key (easily setup free: http://www.last.fm/api/account )
	*		- [string] username: Your Last.fm username (ie. http://www.last.fm/user/(USERNAME) )
	*
	*	Optional params:
	*		- [integer] fetch: The number of tracks to fetch/display. Default is 5.
	*		- [string] contentType: The content to display, accepted values are recentTracks, lovedTracks, topAlbums, topTracks, topArtists, weeklyArtistChart, weeklyAlbumChart, and weeklyTrackChart. Default is recentTracks.
	*		- [string] artSize: The album art size to use, accepted values are small, medium, and large. Default is medium.
	*		- [boolean] cssTooltips: Display the content name/plays/etc. in a CSS tooltip. Default is true.
	*		- [string] cssThemeClass: The CSS class attached to the displayed content, accepted value is jamCityTheme_whiteVinyl if you want the built in white theme. This can be changed to something custom. Default is null (a dark theme). (NOTE: If you change this to something custom, be sure to update your CSS file)
	*		- [boolean] _blankLinks: Open all links in the content in a new window/tab. Default is true.
	*		- [boolean] refreshResults: Auto refresh the content for new results without reloading the page. Default is true.
	*		- [integer] refreshResultsInterval: If refreshResults is true, how often do you want to pull new results (in milliseconds). Default is 600000 (60 seconds). (NOTE: For your protection against the Last.FM API, this number can't be below 10000)
	*		- [string] noAlbumArtImg: The default image to use if there is no album art for the track. Default is http://placehold.it/250x250&text=No Art.
	*		- [string] noResults: Text to display when no results are found. Default is 'Sorry, nothing was found...'.
	*		- [function] songsFetched: On complete of fetching the songs, run a function or do something else.
	*		- [function] htmlBuilt: On complete of building the HTML, run a function or do something else.
	*/

	var $JamCity = "JamCity",
	defaults = {
		apiKey: '',
		username: '',
		fetch: 5,
		contentType: 'recentTracks',
		artSize: 'medium',
		cssTooltips: true,
		cssThemeClass: null,
		_blankLinks: true,
		refreshResults: true,
		refreshResultsInterval: 600000,
		noAlbumArtImg: 'http://placehold.it/250x250&text=No Art',
		noResults: 'Sorry, nothing was found...',
		songsFetched: function () {},
		htmlBuilt: function () {}
	};

	// The actual plugin constructor
	function JamCity_Construct ( element, options ) {
		this.element = element;
		this.settings = $.extend( {}, defaults, options );
		this._defaults = defaults;
		this._name = $JamCity;
		this.init();
	}

	JamCity_Construct.prototype = {
		init: function () {
			var options = this.settings,
				el = this.element;
			this.validate(options);
			this.fetchSongs(el, options);
		},
		validate: function (options) {
			if (!options.apiKey) {
				this.debug("Please enter a valid API key.");
				return false;
			}
			if (!options.username) {
				this.debug("Please enter a valid username.");
				return false;
			}
			return true;
		},
		buildLastfmUrl: function (options) {
			var apiUrl = 'http://ws.audioscrobbler.com/2.0/?method=user.get' + options.contentType + '&user=' + options.username + '&api_key=' + options.apiKey + '&limit=' + options.fetch + '&format=json';
			return apiUrl;
		},
		buildInfoUrl: function (type, options, mbid) {
			var InfoUrl = 'http://ws.audioscrobbler.com/2.0/?method=' + type + '.getinfo&api_key=' + options.apiKey + '&mbid=' + mbid + '&format=json';
			return InfoUrl;
		},
		fetchSongs: function (el, options) {
			var jamCity = this,
				contentTypeNames = {
					'recentTracks': 'track',
					'lovedTracks': 'track',
					'topAlbums': 'album',
					'topTracks': 'track',
					'topArtists': 'artist',
					'weeklyAlbumChart': 'album',
					'weeklyArtistChart': 'artist',
					'weeklyTrackChart': 'track'
				},
				items = [],
				contentTypeShortName = contentTypeNames[options.contentType],
				contentType = options.contentType.toLowerCase(),
				apiUrl = 'http://ws.audioscrobbler.com/2.0/?method=user.get' + options.contentType + '&user=' + options.username + '&api_key=' + options.apiKey + '&limit=' + options.fetch + '&format=json';
			$.ajax({
				url: apiUrl,
				type: "GET",
				context: this,
				async: false,
				error: function () {},
				dataType: 'json',
				success : function (response) {
					if(response[contentType] && response[contentType].total === "0") {
						items.push('jamCityError'); // render no results
					} else {
						var data = response[contentType][contentTypeShortName],
							track_Count = data.length - 1;
						$(data).each(function(i, el) {
							var item = jamCity.templateData(options, el);
							items.push(item);
							if (item.item_nowplaying) { track_Count = track_Count - 1; }
							if (i === track_Count) { return false; }
						});
					}
					// songsFetched Callback
					if ($.isFunction(options.songsFetched)){
						options.songsFetched.call(this);
						jamCity.buildHTML(items, el, options);
					}
					// Refresh Results
					if (options.refreshResults) {
						if (options.refreshResultsInterval < 10000) { options.refreshResultsInterval = 10000; }
						setTimeout(function() {
							$(el).find('#jamCityWrapper').remove();
							jamCity.fetchSongs(el, options);
						}, options.refreshResultsInterval);
					}
				}
			});
		},
		templateData: function (options, json_item) {
			var o = [];
			o.item = json_item;
			o.item_url = json_item.url;
			o.item_mbid = json_item.mbid;
			o.item_nowplaying = null;
			o.item_playcount = null;
			switch (options.contentType) {
				case 'recentTracks':
					if(json_item['@attr']) {
						o.item_nowplaying = json_item['@attr']['nowplaying'];
					}
					o.item_name = '\'' + json_item.name + '\'  by ' + json_item.artist['#text'];
					o.item_album = json_item.album;
					o.item_image = json_item.image;
					break;
				case 'lovedTracks':
					o.item_name = '\'' + json_item.name + '\'  by ' + json_item.artist.name;
					o.item_album = json_item.album; // undefined
					o.item_image = json_item.image;
					break;
				case 'topAlbums':
					o.item_name = '\'' + json_item.name + '\'  by ' + json_item.artist.name;
					o.item_playcount = json_item.playcount;
					o.item_image = json_item.image;
					break;
				case 'topTracks':
					o.item_playcount = json_item.playcount;
					o.item_image = json_item.image;
					o.item_name = '\'' + json_item.name + '\'  by ' + json_item.artist.name;
					break;
				case 'topArtists':
					o.item_image = json_item.image;
					o.item_name = json_item.name;
					o.item_playcount = json_item.playcount;
					break;
				case 'weeklyAlbumChart':
					o.item_name = '\'' + json_item.name + '\'  by ' + json_item.artist['#text'];
					o.item_playcount = json_item.playcount;
					if(o.item_mbid) {
						var getAlbumInfo = this.buildInfoUrl('album', options, o.item_mbid);
						$.ajax({ url: getAlbumInfo, type: "GET", async: false, dataType: 'json',
							success : function (response) { o.item_image = response.album.image; }
						});
					}
					break;
				case 'weeklyArtistChart':
					o.item_playcount = json_item.playcount;
					if(o.item_mbid) {
						var getArtistInfo = this.buildInfoUrl('artist', options, o.item_mbid);
						$.ajax({ url: getArtistInfo, type: "GET", async: false, dataType: 'json',
							success : function (response) { o.item_image = response.artist.image; }
						});
					}
					o.item_name = json_item.name;
					break;
				case 'weeklyTrackChart':
					o.item_image = json_item.image;
					o.item_name = '\'' + json_item.name + '\' by ' + json_item.artist['#text'];
					o.item_playcount = json_item.playcount;
					break;
				default:
			}
			return o;
		},
		buildHTML: function (items, el, options) {
			var jamcity = this,
				item_image = null;
			$(el).append('<ul id="jamCityWrapper" class="' + options.cssThemeClass + ' jamCitySize_' + options.artSize + '"></ul>');
			if (items == 'jamCityError') {
				$(el).find('#jamCityWrapper').addClass('jamCityError').append('<li>' + options.noResults + '</li>');
			} else {
				$.each(items, function (i, item) {
					if (item.item_image) {
						if (item.item_image[4]) {
							item_image = item.item_image[4]['#text'];
						} else if (item.item_image[3]) {
							item_image = item.item_image[3]['#text'];
						} else if (item.item_image[2]) {
							item_image = item.item_image[2]['#text'];
						} else if (item.item_image[1]) {
							item_image = item.item_image[1]['#text'];
						} else {
							item_image = options.noAlbumArtImg;
						}
					} else {
						item_image = options.noAlbumArtImg;
					}
					$(el).find('#jamCityWrapper').append(
						'<li style="z-index: ' + (500 - i) +'">' +
							'<a href="' + item.item_url + '" ' +
								((options.cssTooltips && item.item_name) ? 'data-tip="' + item.item_name + (item.item_playcount ? ' (' + item.item_playcount + ' plays)' : '') + '"' : '') +
								'class="case' + (item.item_nowplaying ? ' nowplaying' : '') + '"' + (options._blankLinks ? ' target="_blank"' : '') + '>' +
								'<div class="overlay"></div>' +
								'<div class="cover"><img src="' + item_image + '"/></div>' +
								'<div class="vinyl"></div>' +
							'</a>' +
						'</li>'
					);
					if (i === (options.fetch - 1)) { return false; }
				});
			}
			// htmlBuilt Callback
			if ($.isFunction(options.htmlBuilt)){
				options.htmlBuilt.call(this);
			}
		},
		debug: function (error) {
			if (typeof console == 'object') {
				console.log(error);
			} else if (typeof opera == 'object') {
				opera.postError(error);
			}
		}
	};

	$.fn[$JamCity] = function ( options ) {
		return this.each(function() {
			if ( !$.data( this, "plugin_" + $JamCity ) ) {
				$.data( this, "plugin_" + $JamCity, new JamCity_Construct( this, options ) );
			}
		});
	};

})(jQuery, window, document);