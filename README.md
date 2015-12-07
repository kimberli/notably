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

To install:
* `sudo npm install`

To run:
* `npm run db` in one terminal window (or `mongod`)
* `npm run start` in another terminal window  (or `node bin/www`)

For dev:
* `npm run db` in one terminal window (or `mongod`)
* `npm run gulp` in another terminal window (or `gulp`)
* `npm run dev` in another terminal window (or `nodemon bin/www`)

To test:
* `npm run db` in one terminal window (or `mongod`)
* `npm run test` in another terminal window (or `mocha`)

To update table of contents:
* `gulp readme` (or `doctoc README.md`)

To add data to database:
* `npm run db` in one terminal window (or `mongod`)
* `npm run setup` in another terminal window (or `node bin/setup`)

To run mongo shell:
* `mongo notably`
* `db.courses.find()`

To run Heroku shell:
* `heroku run bash`

To test API routes:
* Use [Postman](https://www.getpostman.com/)


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

* `"joined session"`
  * Fired when a user joins a session
    * Content: `{"sessionId" : (string - sessionId), "courseNumber" : (string - course number)}`
  * Joins a room based on that session Id and username
  * Response: `"session data loaded"` sent to the course page corresponding to the session
    * Content: ` {"occupancy" : {(string - sessionId) : (integer - occupancy)}`
* `"left session"`
  * Fired when a user leaves a session
    * Content: `{"sessionId" : (string - sessionId), "courseNumber" : (string - course number)}`
  * leaves the corresponding session room
* `"joined course page"`
  * Fired when a user joins a course's home page
    * Content: `{"courseNumber" : (string - course number)}`
  * Joins a room based on the course name and username
  * Response: `"session data loaded"` event to the corresponding room
    * Content: ` {"occupancy" : {(string - sessionId) : (integer - occupancy)}`
* `"left course page"`
  * Fired when a user leaves a course's home page
    * Content: `{"courseNumber" : (string - course number)}`
  * leaves the corresponding course room
* `"new session"`
  * Fired when a user creates a new session
    * Content: `{"session" : (Session), "courseNumber" : (string - course number)}`
  * Creates the session and adds it to the corresponding course
  * Response: `"new session"` event sent to the room corresponding to the session's course
    * Content: ` {"session" : (Session)}`
* `"joined home page"`
  * Fired when a user joins a home page
    * Content: `{"username" : (string - username)}`
  * Joins a room based on the username
  * Response: `"session data loaded"` event sent to the corresponding room
    * Content: ` {"occupancy" : {(string - sessionId) : (integer - occupancy)}`
* `"left home page"`
  * Fired when a user leaves a course's home page
    * Content: `{"username" : (string - username)}`
  * leaves the corresponding course room
* `"added snippet"`
  * Fired when a user adds a snippet
    * Content: `{"content" : (string - snippet content), "sessionId" : (string - sessionId), "username" :  (string - username)}`
  * adds the snippet to the corresponding session's feed
  * Response: `"added snippet"` sent to every user in the session
    * Content: `{"snippet" : (Snippet)}`
  * On Error: `error` event sent only to the sender
    * Content: `{"message" : (string - error message)}`
* `"saved snippet"`
  * Fired when a user saves a snippet
    * Content: `{"snippetId" : (string - snippetId), "sessionId" : (string - sessionId), "stashId" : (string - stashId), "username" :  (string - username)}`
  * increments the save count of the snippet
  * Response: `"saved snippet"` sent to every user in the session
    * Content: `{"snippetId" : (string - snippetId), "username" : (string - username)}`
  * On Error: `error` event sent only to the sender
    * Content: `{"message" : (string - error message)}`
* `"removed snippet"`
  * Fired when a user removes a snippet
    * Content: `{"snippetId" : (string - snippetId), "sessionId" : (string - sessionId), "stashId" : (string - stashId), "username" :  (string - username)}`
  * decrements the save count of the snippet
  * Response: `"removed snippet"` sent to every user in the session
    * Content: `{"snippetId" : (string - snippetId), "username" : (string - username)}`
  * On Error: `error` event sent only to the sender
    * Content: `{"message" : (string - error message)}`
* `"flagged snippet"`
  * Fired when a user flags a snippet
    * Content: `{"snippetId" : (string - snippetId), "sessionId" : (string - sessionId), "username" :  (string - username)}`
  * increments the flag count of the snippet
  * Response: `"flagged snippet"` sent to every user in the session
    * Content: `{"snippetId" : (string - snippetId), "username" : (string - username)}`
  * On Error: `error` event sent only to the sender
    * Content: `{"message" : (string - error message)}`
* `"disconnect"`
  * Fired when a user exits the website (a standard socket.io call)
  * Response: `"session data loaded"` sent to the course page corresponding to the session
    * Content: ` {"occupancy" : {(string - sessionId) : (integer - occupancy)}`
