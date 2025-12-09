 
// const express = require('express');
// const router = express.Router();
// const { 
//   getGalleries, 
//   createGallery, 
//   updateGallery, 
//   deleteGallery,
//   getGallery 
// } = require('../controllers/galleryController');
// const { protect, authorize } = require('../middleware/authMiddleware'); // Import authorize
// const upload = require('../utils/fileUpload');

// // Public Routes (Everyone can see)
// router.route('/')
//   .get(getGalleries)
//   // ONLY 'admin' can create
//   .post(protect, authorize('admin'), upload.array('images', 10), createGallery);

// router.route('/:id')
//   .get(getGallery) // Public view
//   // ONLY 'admin' can update/delete
//   .put(protect, authorize('admin'), updateGallery)
//   .delete(protect, authorize('admin'), deleteGallery);

// module.exports = router;

const express = require('express');
const router = express.Router();
const { 
  getGalleries, 
  createGallery, 
  updateGallery, 
  deleteGallery,
  getGallery 
} = require('../controllers/galleryController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../utils/fileUpload');

// Configure Upload Fields
// This allows the route to accept:
// 1. 'images': Up to 10 files (for Image Galleries)
// 2. 'thumbnail': 1 file (for Video Embed covers)
const uploadFields = upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'thumbnail', maxCount: 1 }
]);

// --- ROUTE DEFINITIONS ---

router.route('/')
  .get(getGalleries) // Public: List all content
  .post(
    protect,              // 1. Check if logged in
    authorize('admin'),   // 2. Check if role is 'admin'
    uploadFields,         // 3. Handle file uploads (images OR thumbnail)
    createGallery         // 4. Save to database
  );

router.route('/:id')
  .get(getGallery)        // Public: View single content
  .put(
    protect, 
    authorize('admin'), 
    updateGallery         // Admin: Edit details
  )
  .delete(
    protect, 
    authorize('admin'), 
    deleteGallery         // Admin: Delete content
  );

module.exports = router;