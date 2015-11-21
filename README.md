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
  - [`/api/snippet` - GET](#apisnippet---get)

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
    "result": (object - when successful, contains result of API call)
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

**result**

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

**result**

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
    "recentSessions": [(string - session IDs), up to 10]
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

**result**

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

**result**

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

**result**

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
    "number": 
}
```

**result**

```javascript
{
    "number": (string - class number),
    "name": (string - class name),

}
```

### `/api/session` - GET
### `/api/session` - POST
### `/api/snippet` - GET

