# instagram-node

NodeJS driver for the Instagram API.

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

will never work! This is because user is a promise object, not a data row from the DB. The right way to do it is:

```javascript
instagramAPI.userSelf().then(function(user, remaining, limit) {
    console.log(user);
}, function(err){
	console.log(err);
});
```
