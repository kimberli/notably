Notably
==================================
6.170 final project

Created by Vahid Fazel-Rezai, Alexander Luh, Akshay Ravikumar, Kimberli Zhong

URL: `mitnotably.herokuapp.com`

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Notably](#notably)
  - [Instructions](#instructions)
  - [API](#api)
    - [`/api/auth` - POST](#apiauth---post)
    - [`/api/user`](#apiuser)
    - [`/api/user/classes`](#apiuserclasses)
    - [`/api/user/subscribe`](#apiusersubscribe)
    - [`/api/class/all`](#apiclassall)
    - [`/api/class`](#apiclass)
    - [`/api/session`](#apisession)

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

```json
{
    "success": (boolean),
    "error": (string - error message if not successful),
    "result": (object - if successful, contains result of API call if any)
}
```

### `/api/auth` - POST
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
    username: (string - username of user just logged in)
}
```

### `/api/user` - GET
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
    "classes": [(string - class number)],
    "recentSessions": [(string - session IDs)]
}
```

### `/api/user/classes`
### `/api/user/subscribe`
### `/api/class/all`
### `/api/class`
### `/api/session`