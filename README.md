Notably
==================================
6.170 final project

Created by Vahid Fazel-Rezai, Alexander Luh, Akshay Ravikumar, Kimberli Zhong

URL: [mitnotably.herokuapp.com](http://mitnotably.herokuapp.com)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Features](#features)
- [Instructions](#instructions)
- [API](#api)
  - [Snippet](#snippet)
  - [`/api/user` - GET](#apiuser---get)
  - [`/api/user/auth` - GET](#apiuserauth---get)
  - [`/api/user/create` - POST](#apiusercreate---post)
  - [`/api/user/login` - POST](#apiuserlogin---post)
  - [`/api/user/logout` - POST](#apiuserlogout---post)
  - [`/api/user/courses` - GET](#apiusercourses---get)
  - [`/api/user/subscribe` - POST](#apiusersubscribe---post)
  - [`/api/user/unsubscribe` - POST](#apiuserunsubscribe---post)
  - [`/api/course/all` - GET](#apicourseall---get)
  - [`/api/course` - GET](#apicourse---get)
  - [`/api/session` - GET](#apisession---get)
  - [`/api/session/create` - POST](#apisessioncreate---post)
  - [`/api/session/visit` - POST](#apisessionvisit---post)
  - [`/api/stash` - GET](#apistash---get)
  - [`/api/stash/save` - POST](#apistashsave---post)
  - [`/api/stash/remove` - POST](#apistashremove---post)
  - [`/api/snippet` - GET](#apisnippet---get)
  - [`/api/snippet` - POST](#apisnippet---post)
  - [`/api/snippet/flag` - POST](#apisnippetflag---post)
- [Socket.io Events](#socketio-events)
  - [`"joined session"`](#joined-session)
  - [`"left session"`](#left-session)
  - [`"joined course page"`](#joined-course-page)
  - [`"left course page"`](#left-course-page)
  - [`"new session"`](#new-session)
  - [`"joined home page"`](#joined-home-page)
  - [`"left home page"`](#left-home-page)
  - [`"added snippet"`](#added-snippet)
  - [`"saved snippet"`](#saved-snippet)
  - [`"removed snippet"`](#removed-snippet)
  - [`"flagged snippet"`](#flagged-snippet)
  - [`"disconnect"`](#disconnect)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Features
Notably is a collaborative note-taking app for MIT students!

You can:
* Search for a class
* Create sessions for a class (e.g. for a lecture)
* Take notes with peers in your class

After some discussion, we decided to remove two features listed in our design document: viewing other users' feeds and hiding feeds when users haven't submitted enough snippets. Both these features were what we considered "reach" features, so removing them does not affect the application's main functionality.

Viewing other users' stashes is a privacy concern, and we don't want students to arbitrarily see what snippets other users have saved. Additionally, it adds additional complexity when the user's stash you're viewing changes state (e.g. upon adding, saving, or flagging a snippet). Hiding feeds when users haven't submitted enough snippets would also require slight modifications in the model, but we ultimately deemed it unnecessary in the spirit of openness.

## Instructions

All commands should be run in the root folder.
* To run server: `node bin/www`
* To run everything (dev mode): `npm run dev` (or `gulp`)
* To populate database: `npm run setup`
* To update packages: `npm run update`
* To test: `npm test`
* To run mongo shell: `mongo notably` then e.g. `db.courses.find()`
* To run Heroku shell: `heroku run bash`
* To test API routes: use [Postman](https://www.getpostman.com/)


## API

### Snippet
The snippet object looks like this:
```javascript
{
  "author": (string - username),
  "text": (string - snippet text),
  "timestamp": (string - timestamp),
  "saveCount": (number - number of saves),
  "flagCount": (number - number of flags),
  "savedBy": [(string - usernames)],
  "flaggedBy": [(string - usernames)],
  "sessionId": (string - session id it belongs to)
}
```

### `/api/user` - GET
* Get a user's profile information
* Must be authenticated

**params**

```javascript
{
  "username": (string)
}
```

**content**

```javascript
{
  "username": (string),
  "name": (string),
  "stats": {
      "numSubmitted": (int - number of snippets submitted),
      "numSaved": (int - number of snippets saved),
      "numSubscribed": (int - number of courses subscribed to)
  },
  "courses": [{
      "number": (string - course number),
      "name": (string - course name)
  }],
  "recentSessions": [{
    "_id": (string - session id),
    "createdAt": (string - creation timestamp)
    "index": (number - position of session in recentSessions array; 0 is most recent),
    "meta": {
        "title": (string - session title),
        "number": (string - course number),
    }
  }]
}
```

### `/api/user/auth` - GET
* Check whether a user is authenticated; checks request's session username and verifies that it's valid

**params**

```javascript
{}
```

**content**

```javascript
{
  "username": (string - username)
}
```

### `/api/user/create` - POST
* Creates a user

**params**

```javascript
{
  "username": (string),
  "password": (string),
  "email": (string),
  "name": (string)
}
```

**content**

```javascript
{
  "username": (string - username of user just created)
}
```

### `/api/user/login` - POST
* Authenticates a user

**params**

```javascript
{
  "username": (string),
  "password": (string)
}
```

**content**

```javascript
{
  "username": (string - username of user just logged in)
}
```

### `/api/user/logout` - POST
* Logs out a user

**params**

```javascript
{}
```

**content**

```javascript
{
  "username": (string - username of user just logged in)
}
```

### `/api/user/courses` - GET
* Gets all of logged in user's courses
* Must be authenticated

**params**

```javascript
{ }
```

**content**

```javascript
{
  "courses": [{
      "number": (string - course number),
      "name": (string - course name)
  }]
}
```

### `/api/user/subscribe` - POST
* Subscribes a user to a course
* Must be authenticated
* Returns all of user's courses

**params**

```javascript
{
  "course": (string - course number)
}
```

**content**

```javascript
{
  "courses": [{
      "number": (string - course number),
      "name": (string - course name)
  }]
}
```

### `/api/user/unsubscribe` - POST
* Unsubscribes a user from a course
* Must be authenticated
* Returns all of user's courses

**params**

```javascript
{
  "course": (string - course number)
}
```

**content**

```javascript
{
  "courses": [{
      "number": (string - course number),
      "name": (string - course name)
  }]
}
```

### `/api/course/all` - GET
* Returns all course numbers and names
* Must be authenticated

**params**

```javascript
{ }
```

**content**

```javascript
{
  "courses": [{
      "number": (string - course number),
      "name": (string - course name)
  }]
}
```

### `/api/course` - GET
* Get course info and sessions
* Must be authenticated

**params**

```javascript
{
  "number": (string - course number)
}
```

**content**

```javascript
{
  "_id": (string),
  "meta": {
    "number": (string - course number),
    "name": (string - course name),
    "description": (string - course description),
    "lectureTime": (string - lecture time),
    "location": (string - lecture location)
  },
  "sessions": [{
    "_id": (string - session id),
    "title": (string - session title),
    "createdAt": (string - timestamp)
  }]
}
```

### `/api/session` - GET
* Get session info and snippets
* Must be authenticated

**params**

```javascript
{
    "sessionId": (string - session id)
}
```

**content**

```javascript
{
  "_id": (string - session id),
  "createdAt": (string - creation timestamp),
  "meta": {
    "number": (string - course number),
    "title": (string - session title)
  },
  "feed": [(Snippet)],
  "stash": [(Snippet)]
}
```

### `/api/session/create` - POST
* Add new session to a course
* Must be authenticated

**params**

```javascript
{
  "number": (string - course number),
  "title": (string - session title)
}
```

**content**

```javascript
{
  "_id": (string - session id),
  "number": (string - course number),
  "title": (string - session title),
  "createdAt": (string - timestamp of creation time)
}
```

### `/api/session/visit` - POST
* Register current user's visit to session
* Must be authenticated

**params**

```javascript
{ }
```

**content**

```javascript
{
  "recentSessions": [{
    "_id": (string - session id),
    "createdAt": (string - creation timestamp)
    "index": (number - position of session in recentSessions array; 0 is most recent),
    "meta": {
        "title": (string - session title),
        "number": (string - course number),
    }
  }]
}
```

### `/api/stash` - GET
* Get stash info
* Must be authenticated

**params**

```javascript
{
  "stashId": (string - stash id),
}
```

**content**

```javascript
{
  "_id": (string - session id),
  "createdAt": (string - timestamp),
  "creator": (string - username),
  "sessionTitle": (string - title session stash belongs to),
  "courseNumber": (string - course number associated with stash),
  "session": (string - id of associated session),
  "snippets": [(Snippet)]
}
```

### `/api/stash/save` - POST
* Save a snippet to a stash
* Snippet and stash should have same session ID and should be valid
* Must be authenticated

**params**

```javascript
{
  "snippetId": (string - snippet id),
  "stashId": (string - stash id)
}
```

**content**

```javascript
{
  "_id": (string - session id),
  "createdAt": (string - timestamp),
  "creator": (string - username),
  "sessionTitle": (string - title session stash belongs to),
  "courseNumber": (string - course number associated with stash),
  "session": (string - id of associated session),
  "snippets": [(Snippet)]
}
```

### `/api/stash/remove` - POST
* Get snippet info
* Will send error if snippet not in stash
* Must be authenticated

**params**

```javascript
{
  "snippetId": (string - snippet id),
  "stashId": (string - stash id)
}
```

**content**

```javascript
{
  "_id": (string - session id),
  "createdAt": (string - timestamp),
  "creator": (string - username),
  "sessionTitle": (string - title session stash belongs to),
  "courseNumber": (string - course number associated with stash),
  "session": (string - id of associated session),
  "snippets": [(Snippet)]
}
```

### `/api/snippet` - GET
* Get snippet info
* Must be authenticated

**params**

```javascript
{
  "snippetId": (string - snippet id)
}
```

**content**

```javascript
(Snippet)
```

### `/api/snippet` - POST
* Add a new user's stash; will return error if user already has a stash
* Must be authenticated

**params**

```javascript
{
  "sessionId": (string - session id),
  "text": (string - snippet text)
}
```

**content**

```javascript
(Snippet)
```


### `/api/snippet/flag` - POST
* Flag a snippet  
* Will send error if user tries to flag own snippet or if snippet is already flagged
* Must be authenticated

**params**

```javascript
{
  "snippetId": (string - snippet id)
}
```

**content**

```javascript
(Snippet)
```

## Socket.io Events

###  `"joined session"`

* Fired when a user joins a session
* Joins a room based on that session Id and username

**params**

```javascript
{
"sessionId" : (string - sessionId),
"courseNumber" : (string - course number)
}
```

* Response: `"session data loaded"` event emitted to the course page corresponding to the session
* Sends an `occupancy` Object showing the number of active sockets in each session

**content**

```javascript
{
"occupancy" : {(string - sessionId) : (integer - occupancy)}
}
```

### `"left session"`

* Fired when a user leaves a session
* Leaves the corresponding session room

**params**

```javascript
{
"sessionId" : (string - sessionId),
"courseNumber" : (string - course number)
}
```

### `"joined course page"`

* Fired when a user joins a course's home page
* Joins a room based on the course name and username

**params**

```javascript
{
"courseNumber" : (string - course number)
}
```

* Response: `"session data loaded"` event emitted to the course room

**params**

```javascript
{
"occupancy" : {(string - sessionId) : (integer - occupancy)}
}
```

### `"left course page"`

* Fired when a user leaves a course's home page
* Leaves the corresponding course room

**params**

```javascript
{
"courseNumber" : (string - course number)
}
```

### `"new session"`

* Fired when a user creates a new session
* Creates the session and adds it to the corresponding course

**params**

```javascript
{
"session" : (Session),
"courseNumber" : (string - course number)
}
```

* Response: `"new session"` event emitted to the course room  

**content**

```javascript
{
"session" : (Session)
}
```

### `"joined home page"`

* Fired when a user joins a home page
* Joins a room based on the username

**params**

```javascript
{
"username" : (string - username)
}
```

* Response: `"session data loaded"` event sent to the corresponding room

**content**

```javascript
{
"occupancy" : {(string - sessionId) : (integer - occupancy)}
}
```
### `"left home page"`

* Fired when a user leaves the home page
* Leaves the corresponding room

**params**

```javascript
{
"username" : (string - username)
}
```
### `"added snippet"`

* Fired when a user adds a snippet
* Adds the snippet to the corresponding session's feed

**params**

```javascript
{
"content" : (string - snippet content),
"sessionId" : (string - sessionId),
"username" :  (string - username)
}
```

* Response: `"added snippet"` event emitted to every user in the session

**content**

```javascript
{
"snippet" : (Snippet)
}
```

* On Error: `error` event emitted only to the sender

**content**

```javascript
{
"message" : (string - error message)
}
```

### `"saved snippet"`

* Fired when a user saves a snippet
* Increments the save count of the snippet

**params**

```javascript
{
"snippetId" : (string - snippetId),
"sessionId" : (string - sessionId),
"stashId" : (string - stashId),
"username" :  (string - username)
}
```

* Response: `"saved snippet"` event emitted to every user in the session

**content**

```javascript
{
"snippetId" : (string - snippetId),
"username" : (string - username)
}
```

* On Error: `error` event emitted only to the sender

**content**

```javascript
{
"message" : (string - error message)
}
```
### `"removed snippet"`

* Fired when a user removes a snippet
* Decrements the save count of the snippet


**params**

```javascript
{
"snippetId" : (string - snippetId),
"sessionId" : (string - sessionId),
"stashId" : (string - stashId),
"username" :  (string - username)
}
```
* Response: `"removed snippet"` emitted to every user in the session

**content**

```javascript
{
"snippetId" : (string - snippetId),
"username" : (string - username)
}
```
* On Error: `error` event emitted only to the sender

**content**

```javascript
{
"message" : (string - error message)
}
```

### `"flagged snippet"`

* Fired when a user flags a snippet
* Increments the flag count of the snippet

**params**

```javascript
{
"snippetId" : (string - snippetId),
"sessionId" : (string - sessionId),
"username" :  (string - username)
}
```

* Response: `"flagged snippet"` emitted to every user in the session

**content**

```javascript
{
"snippetId" : (string - snippetId),
"username" : (string - username)
}
```  
* On Error: `error` event emitted only to the sender

**content**

```javascript
{
"message" : (string - error message)
}
```

### `"disconnect"`

* Fired when a user leaves the website (a standard socket.io call)
* Updates occupancy for all course and home pages
* Response: `"session data loaded"` emitted to the course page corresponding to the session

**content**

```javascript
{
"occupancy" : {(string - sessionId) : (integer - occupancy)}
}
```
