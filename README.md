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
  - [`/api/auth` - POST](#apiauth---post)
  - [`/api/user` - GET](#apiuser---get)
  - [`/api/user/classes` - GET](#apiuserclasses---get)
  - [`/api/user/subscribe` - PUT](#apiusersubscribe---put)
  - [`/api/class/all` - GET](#apiclassall---get)
  - [`/api/class` - GET](#apiclass---get)
  - [`/api/session` - GET](#apisession---get)
  - [`/api/session` - POST](#apisession---post)
  - [`/api/session` - PUT](#apisession---put)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Instructions

To install:
* `sudo npm install` in root

To run:
* `npm run db` in one terminal window (or `mongod`)
* `npm run start` in another terminal window  (or `node run.js`)

For dev:
* `npm run db` in one terminal window (or `mongod`)
* `npm run gulp` in another terminal window (or `gulp`)
* `npm run dev` in another terminal window (or `nodemon run.js`)

To test:
* `npm run test` (or `mocha`)

To update table of contents:
* `doctoc README.md`

## API
Generic result format:

```javascript
{
  "success": (boolean),
  "error": (string - error message when not successful),
  "content": (object - when successful, contains content of API call)
}
```

### `/api/auth` - POST
* Authenticates a user

**params**

```javascript
{
  "username": (string)
  "password": (string)
}
```

**content**

```javascript
{
  "username": (string - username of user just logged in)
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
  "stats": {
      "numSubmitted": (int - number of snippets submitted),
      "numSaved": (int - number of snippets saved), 
      "numSubscribed": (int - number of classes subscribed to)
  },
  "classes": [{
      "number": (string - class number),
      "name": (string - class name)
  }],
  "recentSessions": [{
    "id": (string - session id),
    "title": (string - session title),
    "createdAt": (string - timestamp),
    "activeUsers": (number - number of active users)
  }] 
}
```

### `/api/user/classes` - GET
* Gets all of a user's classes
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
  "classes": [{
      "number": (string - class number),
      "name": (string - class name)
  }]
}
```

### `/api/user/subscribe` - PUT
* Subscribes a user to a class
* Must be authenticated

**params**

```javascript
{
  "class": (string - class number)
} 
```

**content**

```javascript
{
  "classes": [{
      "number": (string - class number),
      "name": (string - class name)
  }]
}
```

### `/api/class/all` - GET
* Returns all class numbers and names
* Must be authenticated

**params**

```javascript
{ }
```

**content**

```javascript
{
  "classes": [{
      "number": (string - class number),
      "name": (string - class name)
  }]
}
```

### `/api/class` - GET
* Get class info and sessions
* Must be authenticated

**params**

```javascript
{ 
  "number": (string - class number)
}
```

**content**

```javascript
{
  "meta": {
    "number": (string - class number),
    "name": (string - class name),
    "desc": (string - class description),
  }
  "sessions": [{
    "id": (string - session id),
    "title": (string - session title),
    "createdAt": (string - timestamp),
    "activeUsers": (number - number of active users)
  }]
}
```

### `/api/session` - GET
* Get session info and snippets
* Must be authenticated

**params**

```javascript
{ 
    "id": (string - session id)
}
```

**content**

```javascript
{
  "meta": {
    "number": (string - class number),
    "name": (string - class name)
  }
  "snippets": [{
    "author": (string - snippet author),
    "text": (string - snippet text),
    "flaggedBy": [(string - usernames of flaggers)],
    "savedBy": [(string - usernames of savers)]
  }]

}
```

### `/api/snippet` - GET
* Get snippet info
* Must be authenticated

**params**

```javascript
{ 
  "id": (string - snippet id)
}
```

**content**

```javascript
{
  "meta": {
    "number": (string - class number),
    "name": (string - class name),
    "sessionId": (string - session id)
  },
  "author": (string - snippet author),
  "text": (string - snippet text),
  "flaggedBy": [(string - usernames of flaggers)],
  "savedBy": [(string - usernames of savers)]
}
```
