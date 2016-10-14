# instagram-api

NodeJS Library for Instagram.

## Installation

`npm install instagram-api`

## Setting up a connection

```javascript
var accessToken = '23612221.3fcb46b.348431486f3a4fb85081d5242db9ca1c';
var InstagramAPI = require('instagram-api');
var instagramAPI = new InstagramAPI(accessToken);
```
## Promises

This package uses promises to control async control-flow. If you are unfamiliar with how promises work, now might be a good time to brush up on them, [here](https://github.com/wbinnssmith/awesome-promises) and [here](http://bluebirdjs.com/docs/why-promises.html)

Basically a promise represents a value which will be present at some point - "I promise you I will give you a result or an error at some point". This means that

```javascript
// DON'T DO THIS
user = instagramAPI.userSelf()
console.log(user);
```

will never work! This is because user is a promise object, not a data from Instagram. The right way to do it is:

```javascript
instagramAPI.userSelf().then(function(result) {
    console.log(result.data); // user info
    console.log(result.limit); // api limit
    console.log(result.remaining) // api request remaining
}, function(err){
	console.log(err); // error info
});
```

## API Methods

### userSelf()
Get information about the owner of the access_token.

__Permission Requirements:__ `basic`

### user(userId)
Get information about a user. This endpoint requires the public_content scope if the user-id is not the owner of the access_token.

__Permission Requirements:__ `public_content`

### userSelfMedia(params)
 Get the most recent media published by the owner of the access_token.

__Permission Requirements:__ `basic`

### userMedia(userId, options)
Get the most recent media published by a user. This endpoint requires the public_content scope if the user-id is not the owner of the access_token.

__Permission Requirements:__ `public_content`

### userSelfMediaLiked(options)
Get the list of recent media liked by the owner of the access_token.

__Permission Requirements:__  `public_content`

### userSearch(term, options)
Get a list of users matching the query.

__Permission Requirements:__ `public_content`

### userSelfFollows(options)
Get the list of users this user follows.

__Permission Requirements:__ `follower_list`

### userSelfFollowedBy(options)
 Get the list of users this user is followed by.

__Permission Requirements:__ `follower_list`

### userSelfRequestedBy()
 List the users who have requested this user's permission to follow.

__Permission Requirements:__ `follower_list`

### userRelationship(userId)
Get information about a relationship to another user. Relationships are expressed using the following terms in the response:
* __outgoing_status:__ Your relationship to the user. Can be 'follows', 'requested', 'none'.
* __incoming_status:__ A user's relationship to you. Can be 'followed_by', 'requested_by', 'blocked_by_you', 'none'.

__Permission Requirements:__ `follower_list`

### setUserRelationship(userId, action)
Modify the relationship between the current user and the target user. You need to include an action parameter to specify the relationship action you want to perform. Valid actions are: 'follow', 'unfollow' 'approve' or 'ignore'. Relationships are expressed using the following terms in the response:
* __outgoing_status:__ Your relationship to the user. Can be 'follows', 'requested', 'none'.
* __incoming_status:__ A user's relationship to you. Can be 'followed_by', 'requested_by', 'blocked_by_you', 'none'.

__Permission Requirements:__ `relationships`

### media(mediaId)
Get information about a media object. Use the type field to differentiate between image and video media in the response. You will also receive the user_has_liked field which tells you whether the owner of the access_token has liked this media.
The public_content permission scope is required to get a media that does not belong to the owner of the access_token.

__Permission Requirements:__ `basic, public_content`

### mediaByShortcode(shortcode)
This endpoint returns the same response as GET /media/media-id.
A media object's shortcode can be found in its shortlink URL. An example shortlink is http://instagram.com/p/tsxp1hhQTG/. Its corresponding shortcode is tsxp1hhQTG.

__Permission Requirements:__ `basic, public_content`

### mediaSearch(params)
Search for recent media in a given area.

__Permission Requirements:__ `public_content`

### mediaComments(mediaId)
Get a list of recent comments on a media object. The public_content permission scope is required to get comments for a media that does not belong to the owner of the access_token.

__Permission Requirements:__ `basic, public_content`

### postMediaComment(mediaId, text)
Create a comment on a media object with the following rules:
* The total length of the comment cannot exceed 300 characters.
* The comment cannot contain more than 4 hashtags.
* The comment cannot contain more than 1 URL.
* The comment cannot consist of all capital letters.

The public_content permission scope is required to create comments on a media that does not belong to the owner of the access_token.

__Permission Requirements:__ `comments`

### removeMediaComment(mediaId, commentId)
Remove a comment either on the authenticated user's media object or authored by the authenticated user.

__Permission Requirements:__ `comments`

### mediaLikes(mediaId)
Get a list of users who have liked this media.

__Permission Requirements:__ `basic, public_content`

### postMediaLike(mediaId)
Set a like on this media by the currently authenticated user. The public_content permission scope is required to create likes on a media that does not belong to the owner of the access_token.

__Permission Requirements:__ `likes`

### removeMediaLike(mediaId)
Remove a like on this media by the currently authenticated user. The public_content permission scope is required to delete likes on a media that does not belong to the owner of the access_token.

__Permission Requirements:__ `likes`

### getTag(tagName)
Get information about a tag object.

__Permission Requirements:__ `public_content`

### getMediasByTag(tagName, params)
Get a list of recently tagged media.

__Permission Requirements:__ `public_content`

### searchTags(tagName)
Search for tags by name.

__Permission Requirements:__ `public_content`

### getLocation(locationId)
Get information about a location.

__Permission Requirements:__ `public_content`

### getMediasByLocation(locationId, params)
Get a list of recent media objects from a given location.

__Permission Requirements:__ `public_content`

### searchLocations(params)
Search for a location by geographic coordinate.

__Permission Requirements:__ `public_content`



## Changelog
* Version 1.0.3 - 14/10/2016
  * Small fixes
* Version 1.0.2 - 27/05/2016
  * Pagination fix
  * Documentation enhacement
* Version 1.0.1 - 18/05/2016
  * Adding docs in README
* Version 1.0.0 - 17/05/2016
  * Library working.

## License
MIT.
