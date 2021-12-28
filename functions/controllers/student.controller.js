'use strict'

const firebase = require('../db');
const firestore = firebase.firestore();

exports.getAllStudents = async (req, res) => {

}

exports.createStudent = async (req, res) => {
    const student = {
        qrCodeLink: req.body.qrCodelink,
        dateOfBirth: req.body.dateOfBirth,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        major: req.body.major,
        registeredCourses: [{
            id: req.body.registeredCourses.id,
            courseCode: req.body.registeredCourses.courseCode
        }]
    };
    try {
        await firestore.collection('students').doc().create(student);
        console.log(`student with the name ${student.firstname} added to databse`);
        return res.status(201).json(student);

    } catch (error) {
        console.log("there is an error : " +error);
        return res.status(500).send(error);
    }
}

exports.getOneSudent = async (req, res) => {
    try {
        const studentId = req.params.id;
        const studentREf = firestore.collection('students');
        const student = studentREf.where('id' == studentId).get();
        return res.status(200).json(student);
    } catch (error) {
        console.log("there is an error : " +error);
        return res.status(500).send(error);
    }
}
exports.getAllStudents = async (req, res) => {

}