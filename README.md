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
  - [`/api/user/courses` - GET](#apiusercourses---get)
  - [`/api/user/subscribe` - PUT](#apiusersubscribe---put)
  - [`/api/course/all` - GET](#apicourseall---get)
  - [`/api/course` - GET](#apicourse---get)
  - [`/api/session` - GET](#apisession---get)
  - [`/api/session` - POST](#apisession---post)
  - [`/api/session` - PUT](#apisession---put)

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


## API
Generic result format:

```javascript
{
  "success": (boolean),
  "error": (string - error message when not successful),
  "content": (object - when successful, contains content of API call)
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
    "id": (string - session id),
    "title": (string - session title),
    "createdAt": (string - timestamp),
    "activeUsers": (number - number of active users)
  }] 
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
* Gets all of a user's courses
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
  "courses": [{
      "number": (string - course number),
      "name": (string - course name)
  }]
}
```

### `/api/user/subscribe` - PUT
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
  "meta": {
    "number": (string - course number),
    "name": (string - course name),
    "desc": (string - course description),
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
    "number": (string - course number),
    "name": (string - course name)
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
    "number": (string - course number),
    "name": (string - course name),
    "sessionId": (string - session id)
  },
  "author": (string - snippet author),
  "text": (string - snippet text),
  "flaggedBy": [(string - usernames of flaggers)],
  "savedBy": [(string - usernames of savers)]
}
```
