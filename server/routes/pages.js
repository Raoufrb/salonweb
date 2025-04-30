import express from 'express';

const router = express.Router();

// Example route for the home page
router.get('/', (req, res) => {
  res.render('index', { title: 'Home Page' });
});

export default router;