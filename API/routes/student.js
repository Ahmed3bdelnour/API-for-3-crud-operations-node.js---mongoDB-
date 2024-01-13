const express = require("express");
const router = express.Router();

const studentController = require("../controllers/student");

const { check } = require("express-validator/check");

router.post(
  "/",
  [
    check("name").exists().withMessage("name is required"),
    check("age")
      .exists()
      .withMessage("age is required")
      .isInt()
      .withMessage("age must be an integer number"),
    check("department")
      .isMongoId()
      .withMessage("department id must be in mongoId format"),
  ],
  studentController.postStudent
);

router.get("/", studentController.getStudents);
router.get("/:id", studentController.getStudent);

router.put(
  "/:id",
  [
    check("name").exists().withMessage("name is required"),
    check("age")
      .exists()
      .withMessage("age is required")
      .isInt()
      .withMessage("age must be an integer number"),
    check("department")
      .isMongoId()
      .withMessage("department id must be in mongoId format"),
  ],
  studentController.putStudent
);

router.delete("/:id", studentController.deleteStudent);

module.exports = router;
