"use strict";

const firebase = require("../db");
const db = firebase.firestore();
const admin = require("firebase-admin");
const { json } = require("express");
const FieldValue = admin.firestore.FieldValue;

function toYear(timestamp) {
  var date = new Date(timestamp);
  return date.getFullYear();
}

//licence 1/2/3 ou master 1/2, annee also
exports.createClass = async (req, res) => {
  let classObject = {
    levelCode: req.body.levelCode,
    className: req.body.className,
    yearOfAttendance: toYear(req.body.date), // should convert req.body.date to timestamp in the view
  };

  try {
    let classesRef = db.collection("classes").doc();
    await classesRef.set(classObject);
    await db
      .collection("students")
      .where("studentLevel", "==", classObject.levelCode)
      .get()
      .then((actualStudent) => {
        actualStudent.forEach(function (student) {
          db.collection("classes")
            .doc(classesRef.id)
            .update({
              currentStudents: FieldValue.arrayUnion(...student),
            });
        });
      });
    console.log(
      `the class with the name ${classObject.className} and code ${classObject.levelCode} has been added to the database`
    );
    return res.status(201).send();
  } catch (error) {
    res.status(500).send(error);
  }
};

// this will take the id of the document and update the field
exports.addNewStudentToClass = async (req, res) => {
  console.log("gooooo");
  // get the selected user from the view
  const { studentId } = req.body;
  //   const student = (await db.collection("students").doc(studentId).get()).data();
  // add this student to the currentStudent field on the database document.
  try {
    const student = (
      await db.collection("students").doc(studentId).get()
    ).data();
    console.log("student retrieved here" + student);
    const updatedClass = db.collection("classes").doc(req.params.id);

    await updatedClass.update({
      currentStudents: FieldValue.arrayUnion(student),
    });
    console.log("student added to class");
    return res.status(200).send();
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.removeStudentFromClass = async (req, res) => {
  console.log("gooooo");
  // get the selected user from the view
  const { studentId } = req.body;
  //   const student = (await db.collection("students").doc(studentId).get()).data();
  // add this student to the currentStudent field on the database document.
  try {
    const student = (
      await db.collection("students").doc(studentId).get()
    ).data();
    console.log("student retrieved here" + student);
    await db
      .collection("classes")
      .doc(req.params.id)
      .update({
        currentStudents: FieldValue.arrayRemove(student),
      });
    console.log("student added to class");
    return res.status(200).send(student);
  } catch (error) {
    res.status(500).send(error);
  }
};
