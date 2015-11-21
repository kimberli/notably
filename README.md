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

## API
### `/api/auth` - POST
**params**

    {
        "username": (string)
        "password": (string)
    }

**result**

    {
        "success": (bool - true if authentication successful, false otherwise)
        "error": (string - the error message)
        "result": {
            username: (string - username of user just logged in)
        }
    }

### `/api/user`
### `/api/user/classes`
### `/api/user/subscribe`
### `/api/class/all`
### `/api/class`
### `/api/session`