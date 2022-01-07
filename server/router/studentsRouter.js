'use strict';
const express = require('express');
const controller = require('../controllers/student.controller');

const router = express.Router();

router
    .get('/', controller.getAllStudents)
    .get('/:id', controller.getOneStudent)
    .post('/', controller.createStudent)
    .put('/:id', controller.editStudent)
    .delete('/:id', controller.deleteStudent);

    
module.exports = router;