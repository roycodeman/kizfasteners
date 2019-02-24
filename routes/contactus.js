const express = require('express');
const router = express.Router();
const {
  check
} = require('express-validator/check');

const contactusController = require('../controllers/contactus')

// POST /api/contactus
router.post('/contactus', [

  // title
  check('title')
    .not().isEmpty()
    .withMessage('Field cannot be empty!')
    .isLength({
      min: 5,
      max: 30
    })
    .withMessage('must be between 5 and 30 chars long')
    .matches(/[a-zA-Z]/)
    .withMessage("Username field should only contain alphabets!")
    .trim(),

  // email
  check('email')
    .not().isEmpty()
    .withMessage('Field cannot be empty!')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail()
    .trim(),

  // phone number
  check('phone')
    .not().isEmpty()
    .withMessage('Field cannot be empty!')
    .isMobilePhone(['en-IN'])
    .withMessage('must be 10 chars long')
    .trim(),

  // comment
  check('comment')
    .not().isEmpty()
    .withMessage('Field cannot be empty!')
    .isLength({
      min: 5,
      max: 2000
    })
    .withMessage('must be between 5 and 30 chars long')
    .matches(/[a-zA-Z]/)
    .withMessage("Comment field should only contain alphabets!")
    .trim()

], contactusController.post);

module.exports = router;