const express = require('express');
const { body, validationResult } = require('express-validator');
const Category = require('../models/Category');
const router = express.Router();

// GET all categories
router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find().sort('name');
    res.json(categories);
  } catch (err) { next(err); }
});

// POST create category
router.post('/', [ body('name').notEmpty() ], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name } = req.body;
    let cat = await Category.findOne({ name });
    if (cat) return res.status(400).json({ message: 'Category exists' });

    cat = new Category({ name });
    await cat.save();
    res.status(201).json(cat);
  } catch (err) { next(err); }
});

module.exports = router;