// Copyright Guilherme Farias. and other Contributors
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation
// files (the "Software"), to deal in the Software without
// restriction, including without limitation the rights to use,
// copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following
// conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.

module.exports = function(accessToken) {
	var q = require('q');
	var https = require('https');
	var query = require('querystring');
	var host = 'api.instagram.com';
	var port = 443;

	function call(method, path, params, requestOptions, callback) {
		var req;
		var data = null;

		if (!params) {
			params = {};
		}

		if (!requestOptions) {
			requestOptions = {};
		}

		params.access_token = accessToken;

		requestOptions.host = host;
		requestOptions.port = port;
		requestOptions.method = method;
		requestOptions.path = '/v1' + path + (method === 'GET' || method === 'DELETE' ? '?' + query.stringify(params) : '');
		requestOptions.headers = requestOptions.headers || {};

		if (method !== 'GET' && method !== 'DELETE') {
			data = query.stringify(params);
			requestOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded';
			requestOptions.headers['Content-Length'] = data.length;
		}

		req = https.request(requestOptions, function(res) {
			var body = '';

			res.setEncoding('utf8');

			res.on('data', function(chunk) {
				body += chunk;
			});

			res.on('end', function() {
				var result;
				var limit = parseInt(res.headers['x-ratelimit-limit'], 10) || 0;
				var remaining = parseInt(res.headers['x-ratelimit-remaining'], 10) || 0;

				try {
					result = JSON.parse(body);
				} catch (err) {
					err.details = body;
					callback(err);
					return;
				}

				callback(null, result, remaining, limit);
			});
		});

		req.on('error', function(err) {
			return callback(err);
		});

		if (data !== null) {
			req.write(data);
		}

		req.end();
	};

	function requestHandler(deferred) {
		return function(err, result, remaining, limit) {
			if (err) {
				deferred.reject(err);
				return;
			}

			if (result && result.meta && result.meta.code === 200) {
				return deferred.resolve({
					data: result.data,
					pagination: result.pagination,
					limit: limit,
					remaining: remaining
				});
			} else if (result && result.meta) {
				deferred.reject(result.meta);
			} else {
				deferred.reject(result);
			}
		}
	};

	function userSelf(requestOptions) {
		var deferred = q.defer();
		var params = {};

		call('GET', '/users/self', params, requestOptions, requestHandler(deferred));

		return deferred.promise;
	};

	function user(userId, requestOptions) {
		var deferred = q.defer();
		var params = {};

		call('GET', '/users/' + userId, params, requestOptions, requestHandler(deferred));

		return deferred.promise;
	};

	function userSelfMedia(options, requestOptions) {
		var deferred = q.defer();
		var params = {
			count: 50
		};

		if(options && options.count){
			params.count = options.count;
		}

		if(options && options.min_id){
			params.min_id = options.min_id;
		}

		if(options && options.max_id){
			params.max_id = options.max_id;
		}

		call('GET', '/users/self/media/recent/', params, requestOptions, requestHandler(deferred));

		return deferred.promise;
	};

	function userMedia(userId, options, requestOptions) {
		var deferred = q.defer();
		var params = {
			count: 50
		};

		if(options && options.count){
			params.count = options.count;
		}

		if(options && options.min_id){
			params.min_id = options.min_id;
		}

		if(options && options.max_id){
			params.max_id = options.max_id;
		}

		call('GET', '/users/' + userId + '/media/recent/', params, requestOptions, requestHandler(deferred));

		return deferred.promise;
	};

	function userSelfMediaLiked(options, requestOptions) {
		var deferred = q.defer();
		var params = {
			count: 50
		};

		if(options && options.count){
			params.count = options.count;
		}

		if(options && options.max_like_id){
			params.max_like_id = options.max_like_id;
		}

		call('GET', '/users/self/media/liked/', params, requestOptions, requestHandler(deferred));

		return deferred.promise;
	};

	function userSearch(term, options, requestOptions) {
		var deferred = q.defer();
		var params = {
			q: term,
			count: 50
		};

		if(options && options.count){
			params.count = options.count;
		}

		call('GET', '/users/search', params, requestOptions, requestHandler(deferred));

		return deferred.promise;
	};

	function userSelfFollows(options, requestOptions) {
		var deferred = q.defer();
		var params = {};

		if(options && options.cursor){
			params.cursor = options.cursor;
		}

		call('GET', '/users/self/follows/', params, requestOptions, requestHandler(deferred));

		return deferred.promise;
	};

	function userSelfFollowedBy(options, requestOptions) {
		var deferred = q.defer();
		var params = {};

		if(options && options.cursor){
			params.cursor = options.cursor;
		}

		call('GET', '/users/self/followed-by/', params, requestOptions, requestHandler(deferred));
		return deferred.promise;
	};

	function userSelfRequestedBy(requestOptions) {
		var deferred = q.defer();
		var params = {};

		call('GET', '/users/self/requested-by/', params, requestOptions, requestHandler(deferred));

		return deferred.promise;
	};

	function userRelationship(userId, requestOptions) {
		var deferred = q.defer();
		var params = {};

		call('GET', '/users/' + userId + '/relationship', params, requestOptions, requestHandler(deferred));

		return deferred.promise;
	};

	function setUserRelationship(userId, action, requestOptions) {
		var deferred = q.defer();
		var params = {
			action: action
		};

		call('POST', '/users/' + userId + '/relationship', params, requestOptions, requestHandler(deferred));

		return deferred.promise;
	};

	function media(mediaId, requestOptions) {
		var deferred = q.defer();
		var params = {};

		call('GET', '/media/' + mediaId, params, requestOptions, requestHandler(deferred));

		return deferred.promise;
	};

	function mediaByShortcode(shortcode, requestOptions) {
		var deferred = q.defer();
		var params = {};

		call('GET', '/media/shortcode/' + shortcode, params, requestOptions, requestHandler(deferred));

		return deferred.promise;
	};

	function mediaSearch(options, requestOptions) {
		var deferred = q.defer();
		var params = {
			lat: options.lat,
			lng: options.lng,
			distance: options.distance
		};

		call('GET', '/media/search', params, requestOptions, requestHandler(deferred));

		return deferred.promise;
	};

	function mediaComments(mediaId, requestOptions) {
		var deferred = q.defer();
		var params = {};

		call('GET', '/media/' + mediaId + '/comments', params, requestOptions, requestHandler(deferred));

		return deferred.promise;
	};

	function postMediaComment(mediaId, text, requestOptions) {
		var deferred = q.defer();
		var params = {
			text: text
		};

		call('POST', '/media/' + mediaId + '/comments', params, requestOptions, requestHandler(deferred));

		return deferred.promise;
	};

	function removeMediaComment(mediaId, commentId, requestOptions) {
		var deferred = q.defer();
		var params = {};

		call('DELETE', '/media/' + mediaId + '/comments/' + commentId, params, requestOptions, requestHandler(deferred));

		return deferred.promise;
	};

	function mediaLikes(mediaId, requestOptions) {
		var deferred = q.defer();
		var params = {};

		call('GET', '/media/' + mediaId + '/likes', params, requestOptions, requestHandler(deferred));

		return deferred.promise;
	};

	function postMediaLike(mediaId, requestOptions) {
		var deferred = q.defer();
		var params = {};

		call('POST', '/media/' + mediaId + '/likes', params, requestOptions, requestHandler(deferred));

		return deferred.promise;
	};

	function removeMediaLike(mediaId, requestOptions) {
		var deferred = q.defer();
		var params = {};

		call('DELETE', '/media/' + mediaId + '/likes', params, requestOptions, requestHandler(deferred));

		return deferred.promise;
	};

	function getTag(tagName, requestOptions) {
		var deferred = q.defer();
		var params = {};

		call('GET', '/tags/' + tagName, params, requestOptions, requestHandler(deferred));

		return deferred.promise;
	};

	function getMediasByTag(tagName, options, requestOptions) {
		var deferred = q.defer();
		var params = {
			count: 50
		};

		if(options && options.count){
			params.count = options.count;
		}

		if(options && options.min_tag_id){
			params.min_tag_id = options.min_tag_id;
		}

		if(options && options.max_tag_id){
			params.max_tag_id = options.max_tag_id;
		}

		call('GET', '/tags/' + tagName + '/media/recent', params, requestOptions, requestHandler(deferred));

		return deferred.promise;
	};

	function searchTags(tagName, requestOptions) {
		var deferred = q.defer();
		var params = {
			q: tagName
		};

		call('GET', '/tags/search', params, requestOptions, requestHandler(deferred));

		return deferred.promise;
	};

	function getLocation(locationId, requestOptions) {
		var deferred = q.defer();
		var params = {};

		call('GET', '/locations/' + locationId, params, requestOptions, requestHandler(deferred));

		return deferred.promise;
	};

	function getMediasByLocation(locationId, options, requestOptions) {
		var deferred = q.defer();

		var params = {};

		if(options && options.min_id){
			params.min_id = options.min_id;
		}

		if(options && options.max_id){
			params.max_id = options.max_id;
		}

		call('GET', '/locations/' + locationId + '/media/recent', params, requestOptions, requestHandler(deferred));

		return deferred.promise;
	};

	function searchLocations(options, requestOptions) {
		var deferred = q.defer();
		var params = {};

		if(options && options.lat){
			params.lat = options.lat;
		}

		if(options && options.lng){
			params.lng = options.lng;
		}

		if(options && options.distance){
			params.distance = options.distance;
		}

		if(options && options.facebook_places_id){
			params.facebook_places_id = options.facebook_places_id;
		}

		call('GET', '/locations/search', params, requestOptions, requestHandler(deferred));

		return deferred.promise;
	};

	return {
		userSelf: userSelf,
		user: user,
		userSelfMedia: userSelfMedia,
		userMedia: userMedia,
		userSelfMediaLiked: userSelfMediaLiked,
		userSearch: userSearch,
		userSelfFollows: userSelfFollows,
		userSelfFollowedBy: userSelfFollowedBy,
		userSelfRequestedBy: userSelfRequestedBy,
		userRelationship: userRelationship,
		setUserRelationship: setUserRelationship,
		media: media,
		mediaByShortcode: mediaByShortcode,
		mediaSearch: mediaSearch,
		mediaComments: mediaComments,
		postMediaComment: postMediaComment,
		removeMediaComment: removeMediaComment,
		mediaLikes: mediaLikes,
		postMediaLike: postMediaLike,
		removeMediaLike: removeMediaLike,
		getTag: getTag,
		getMediasByTag: getMediasByTag,
		searchTags: searchTags,
		getLocation: getLocation,
		getMediasByLocation: getMediasByLocation,
		searchLocations: searchLocations
	};
};
