"use strict";
const express = require("express");
const controller = require("../controllers/classes.controller");

const router = express.Router();

router
  .post("/", controller.createClass)
  .put("/:id", controller.addNewStudentToClass)
  .delete("/:id", controller.removeStudentFromClass);

module.exports = router;
