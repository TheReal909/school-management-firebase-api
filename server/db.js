'use strict';
// const firebase = require('firebase-admin');
// const config = require('./config')

// const db = firebase.initializeApp(config.firebaseConfig);
var admin = require("firebase-admin");

var serviceAccount = require("./permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
