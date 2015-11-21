Notably
==================================
6.170 final project

Created by Vahid Fazel-Rezai, Alexander Luh, Akshay Ravikumar, Kimberli Zhong

URL: `mitnotably.herokuapp.com`

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
### `/api/auth`
**params**

    {
        username: {string}
        password: {string}
    }

### `/api/user`
### `/api/user/classes`
### `/api/user/subscribe`
### `/api/class/all`
### `/api/class`
### `/api/session`