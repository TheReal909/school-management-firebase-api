"use strict";

const firebase = require("../db");
const db = firebase.firestore();
const admin = require("firebase-admin");
const FieldValue = admin.firestore.FieldValue;

exports.getAllStudents = async (req, res) => {
  try {
    let students = db.collection("students");
    let studentsArray = [];
    await students.get().then((querySnapshot) => {
      let docs = querySnapshot.docs;
      // for (let doc in docs) {
      querySnapshot.forEach((doc) => {
        console.log(doc.data().courses);
        const student = {
          studentId: doc.data().studentId,
          QrCodeLink: doc.data().QrCodeLink,
          dateOfBirth: doc.data().dateOfBirth,
          firstname: doc.data().firstname,
          lastname: doc.data().lastname,
          major: doc.data().major,
          studentLevel: doc.data().studentLevel,
          // for the semester
          courses: doc.data().courses,
        };
        studentsArray.push(student);
      });
      // }
      return studentsArray;
    });
    return res.status(200).json(studentsArray);
  } catch (error) {
    console.log("there is an error getting records: " + error);
    return res.status(500).send(error);
  }
};

exports.createStudent = async (req, res) => {
  try {
    const studentRef = db.collection("students").doc();
    await studentRef.set({
      studentId: req.body.studentId,
      QrCodeLink: req.body.QrCodeLink,
      dateOfBirth: req.body.dateOfBirth,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      major: req.body.major,
      studentLevel: req.body.studentLevel,
    });
    let major = req.body.major;
    let csCourses = [
      {
        courseCode: "CS-1212",
        courseName: "Intro to web dev",
      },
      {
        courseCode: "CS-1414",
        courseName: "Algorithms and data structure",
      },
    ];

    let busCourses = [
      {
        courseCode: "BUS-1100",
        courseName: "Selling strategies",
      },
      {
        courseCode: "BUS-1220",
        courseName: "Business Tools",
      },
    ];

    switch (major) {
      case (major = "CS"):
        await db
          .collection("students")
          .where("studentId", "==", req.body.studentId)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach(function (doc) {
              db.collection("students")
                .doc(doc.id)
                .update({
                  courses: FieldValue.arrayUnion(...csCourses),
                });
              console.log(doc.id);
            });
          });
        break;
      case (major = "BUS"):
        await db
          .collection("students")
          .where("studentId", "==", req.body.studentId)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach(function (doc) {
              db.collection("students")
                .doc(doc.id)
                .update({
                  courses: FieldValue.arrayUnion(...busCourses),
                });
            });
          });
        break;
      default:
        break;
    }
    console.log(
      `student with the name ${req.body.firstname} added to the database`
    );
    return res.status(201).send();
  } catch (error) {
    console.log();
    console.log("there is an error creating students: " + error);
    return res.status(500).send(error);
  }
};

exports.getOneStudent = async (req, res) => {
  try {
    const docId = req.params.id;
    // const studentREf = db.collection("students");
    // const student = studentREf.where("id" == studentId).get();
    const student = await db.doc("students/" + docId).get();
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
