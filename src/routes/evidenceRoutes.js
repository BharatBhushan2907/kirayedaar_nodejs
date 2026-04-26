const express = require('express');
const { uploadEvidence, listEvidence } = require('../controllers/evidenceController');
const { authenticate } = require('../middlewares/auth');
const upload = require('../config/multer');
const AppError = require('../utils/AppError');

const router = express.Router();

router.use(authenticate);

router.post('/upload', upload.array('files', 10), (req, res, next) => {
  if (!req.body.tenancyId) return next(new AppError('tenancyId is required', 400));
  if (!req.body.type) return next(new AppError('type is required (move-in | move-out)', 400));
  next();
}, uploadEvidence);

router.get('/list', (req, res, next) => {
  if (!req.query.tenancyId) return next(new AppError('tenancyId query param is required', 400));
  next();
}, listEvidence);

module.exports = router;
