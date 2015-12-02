Notably
==================================
6.170 final project

Created by Vahid Fazel-Rezai, Alexander Luh, Akshay Ravikumar, Kimberli Zhong

URL: `mitnotably.herokuapp.com`

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

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
  - [`/api/course/newsession` - POST](#apicoursenewsession---post)
  - [`/api/session` - GET](#apisession---get)
  - [`/api/session/newstash` - POST](#apisessionnewstash---post)
  - [`/api/session/newsnippet` - POST](#apisessionnewsnippet---post)
  - [`/api/stash` - GET](#apistash---get)
  - [`/api/stash/save` - POST](#apistashsave---post)
  - [`/api/stash/remove` - POST](#apistashremove---post)
  - [`/api/snippet` - GET](#apisnippet---get)
  - [`/api/snippet/flag` - POST](#apisnippetflag---post)


<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Instructions

To install:
* `sudo npm install` in root

To run:
* `npm run db` in one terminal window (or `mongod`)
* `npm run start` in another terminal window  (or `node bin/www`)

For dev:
* `npm run db` in one terminal window (or `mongod`)
* `npm run gulp` in another terminal window (or `gulp`)
* `npm run dev` in another terminal window (or `nodemon bin/www`)

To test:
* `npm run test` (or `mocha`)

To update table of contents:
* `doctoc README.md`

To add data to database:
* `node data/script.js`

Run mongo shell:
* `mongo`
* `use notably`
* `db.courses.find()`


## API

### Snippet
The snippet object looks like this:
```javascript
{
  "author": (string - username),
  "text": (string - snippet text),
  "timestamp": (string - timestamp),
  "saveCount": (number - number of saves),
  "hidden": (bool - true if should be hidden, false otherwise),
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
    "title": (string - session title),
    "createdAt": (string - timestamp),
    "number": (string - course number),
    "activeUsers": (number - number of active users)
  }]
}
```

### `/api/user/auth` - GET
* Check whether a user is authenticated

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
{ }
```

**content**

```javascript
{
  "username": (string - username of user just logged out)
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
  }
  "sessions": [{
    "_id": (string - session id),
    "title": (string - session title),
    "createdAt": (string - timestamp),
    "activeUsers": (number - number of active users)
  }]
}
```

### `/api/course/newsession` - POST
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
  "meta": {
    "number": (string - course number),
    "title": (string - session title)
  },
  "feed": [(Snippet)],
  "stash": [(Snippet)]
}
```

### `/api/session/newstash` - POST
* Add a new user's stash; will return error if user already has a stash
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
  "createdAt": (string - timestamp),
  "creator": (string - username),
  "snippets": []
}
```

### `/api/session/newsnippet` - POST
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
  "snippets": [(Snippet)]
}
```

### `/api/stash/save` - POST
* Save a snippet to a stash
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
  "snippets": [(Snippet)]
}
```

### `/api/stash/remove` - POST
* Get snippet info
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

### `/api/snippet/flag` - POST
* Flag a snippet  
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
