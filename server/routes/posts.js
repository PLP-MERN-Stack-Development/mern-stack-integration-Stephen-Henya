const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const Category = require('../models/Category');

const router = express.Router();

// GET all posts (with optional pagination ?page=1&limit=10)
router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find()
        .populate('author', 'name email')
        .populate('categories', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Post.countDocuments()
    ]);

    res.json({ posts, total, page, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
});

// GET single post
router.get('/:id', async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email')
      .populate('categories', 'name');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) { next(err); }
});

// POST create post
router.post(
  '/',
  auth,
  [
    body('title').notEmpty(),
    body('body').notEmpty()
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const { title, body: content, categories = [], featuredImage } = req.body;

      // validate categories exist
      const validCatIds = [];
      for (const c of categories) {
        const found = await Category.findById(c);
        if (found) validCatIds.push(found._id);
      }

      const post = new Post({
        title,
        body: content,
        featuredImage,
        categories: validCatIds,
        author: req.user.id
      });
      await post.save();
      res.status(201).json(post);
    } catch (err) { next(err); }
  }
);

// PUT update post
router.put('/:id', auth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    const { title, body: content, categories, featuredImage } = req.body;
    if (title !== undefined) post.title = title;
    if (content !== undefined) post.body = content;
    if (featuredImage !== undefined) post.featuredImage = featuredImage;
    if (categories !== undefined) {
      // validate categories
      const validCatIds = [];
      for (const c of categories) {
        const found = await Category.findById(c);
        if (found) validCatIds.push(found._id);
      }
      post.categories = validCatIds;
    }

    await post.save();
    res.json(post);
  } catch (err) { next(err); }
});

// DELETE post
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    await post.remove();
    res.json({ message: 'Post removed' });
  } catch (err) { next(err); }
});

module.exports = router;
