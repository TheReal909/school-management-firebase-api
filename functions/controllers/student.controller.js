"use strict";

const firebase = require("../db");
const db = firebase.firestore();

exports.getAllStudents = async (req, res) => {
  try {
    let students = db.collection("students");
    let studentsArray = [];
    await students.get().then((querySnapshot) => {
      let docs = querySnapshot.docs;
      for (let doc in docs) {
        console.log(doc);
        const student = {
          studentId: doc.data().studentId,
          QrCodeLink: doc.data().QrCodeLink,
          dateOfBirth: doc.data().dateOfBirth,
          firstname: doc.data().firstname,
          lastname: doc.data().lastname,
          major: doc.data().major,
          // for the semester
          registeredCourses: [
            {
              id: doc.data().registeredCourses.id,
              courseCode: doc.data().registeredCourses.courseCode,
            },
          ],
        };
        studentsArray.push(student);
      }
      return studentsArray;
    });
    return res.status(200).json(studentsArray);
  } catch (error) {
    console.log("there is an error getting records: " + error);
    return res.status(500).send(error);
  }
};

exports.createStudent = async (req, res) => {
  const student = {
    studentId: req.body.studentId,
    QrCodeLink: req.body.qrCodelink,
    dateOfBirth: req.body.dateOfBirth,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    major: req.body.major,
    registeredCourses: [
      {
        id: req.body.registeredCourses.id,
        courseCode: req.body.registeredCourses.courseCode,
      },
    ],
  };
  try {
    await db.collection("students").doc().create(student);
    console.log(
      `student with the name ${student.firstname} added to the database`
    );
    return res.status(201).json(student);
  } catch (error) {
    console.log("there is an error creating students: " + error);
    return res.status(500).send(error);
  }
};

exports.getOneSudent = async (req, res) => {
  try {
    const studentId = req.params.id; 
    // const studentREf = db.collection("students");
    // const student = studentREf.where("id" == studentId).get();
    const student = await db.doc("students/" + studentId).get();
    if (!student.exists) {
      return res.status(404).send("The student with this id does not exists");
    }
    return res.status(200).json(student.data());
  } catch (error) {
    console.log("there is an error : " + error);
    return res.status(500).send(error);
  }
};
exports.editStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    const editedStudent = await db
      .collection("students")
      .doc(studentId)
      .update(req.body);
    return res.status(200).json(editedStudent);
  } catch (error) {
    console.log("there is an error updating records: " + error);
    return res.status(500).send(error);
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const studentToDelete = db.collection("students").doc(req.params.id);
    await studentToDelete.delete();
    return res.status(200).send();
  } catch (error) {
    console.log("there is an error deleting the student: " + error);
    return res.status(500).send(error);
  }
};
