const Gallery = require('../models/Gallery');

// @desc    Get all galleries with Pagination & Search
// @route   GET /api/galleries?page=1&limit=12&search=blonde
exports.getGalleries = async (req, res) => {
  try {
    // 1. Setup Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 16; // Default to 16 for grid layout
    const startIndex = (page - 1) * limit;
    
    // 2. Setup Search
    const searchTerm = req.query.search;
    let query = {};

    if (searchTerm && searchTerm.trim() !== '') {
      // Create a case-insensitive regex (e.g., /asian/i)
      const searchRegex = new RegExp(searchTerm, 'i');
      
      // Search in Title OR Tags
      query = {
        $or: [
          { title: { $regex: searchRegex } },
          { tags: { $regex: searchRegex } } // Mongo automatically searches inside arrays
        ]
      };
      console.log(`🔎 Searching for: "${searchTerm}"`);
    }

    // 3. Count Total (for pagination buttons)
    const total = await Gallery.countDocuments(query);

    // 4. Fetch Data
    const galleries = await Gallery.find(query)
      .sort({ createdAt: -1 }) // Newest first
      .skip(startIndex)
      .limit(limit);

    // 5. Send Response
    res.status(200).json({
      success: true,
      count: galleries.length,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasMore: startIndex + galleries.length < total
      },
      data: galleries
    });

  } catch (err) {
    console.error("❌ Error in getGalleries:", err.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Create a new gallery
// @route   POST /api/galleries
// @access  Public (We will secure this later)
// exports.createGallery = async (req, res) => {
//   try {
//     let galleryData = {
//       title: req.body.title,
//       tags: req.body.tags ? req.body.tags.split(',') : [],
//       contentType: req.body.contentType,
//       embedCode: req.body.embedCode
//     };

//     // If files were uploaded, format them correctly
//     if (req.files && req.files.length > 0) {
//       galleryData.images = req.files.map(file => ({
//         // If using S3 (production), file.location is the URL
//         // If using Local (dev), file.filename is the name. We prepend 'uploads/'
//         url: file.location || `uploads/${file.filename}`,
//         altText: req.body.title
//       }));
//     }

//     const gallery = await Gallery.create(galleryData);

//     res.status(201).json({
//       success: true,
//       data: gallery
//     });
//   } catch (err) {
//     console.error(err); // Log error to see what happened
//     res.status(400).json({ success: false, error: err.message });
//   }
// };

// exports.createGallery = async (req, res) => {
//   try {
//     let galleryData = {
//       title: req.body.title,
//       tags: req.body.tags ? req.body.tags.split(',') : [],
//       contentType: req.body.contentType,
//       embedCode: req.body.embedCode,
//       thumbnail: req.body.thumbnail // <--- ADD THIS LINE (To save the URL)
//     };

//     // If files were uploaded (Hosted Mode), use the first file as thumbnail
//     if (req.files && req.files.length > 0) {
//       const files = req.files.map(file => ({
//         url: file.location || `uploads/${file.filename}`,
//         altText: req.body.title
//       }));
//       galleryData.images = files;
//       // Auto-set thumbnail from the first uploaded image
//       galleryData.thumbnail = files[0].url; 
//     }

//     const gallery = await Gallery.create(galleryData);

//     res.status(201).json({
//       success: true,
//       data: gallery
//     });
//   } catch (err) {
//     console.error(err); 
//     res.status(400).json({ success: false, error: err.message });
//   }
// };

exports.createGallery = async (req, res) => {
  try {
    let galleryData = {
      title: req.body.title,
      tags: req.body.tags ? req.body.tags.split(',') : [],
      contentType: req.body.contentType,
      embedCode: req.body.embedCode
      // Note: We don't set thumbnail here yet, we do it below
    };

    // 1. HANDLE EMBED THUMBNAIL UPLOAD
    if (req.files && req.files['thumbnail']) {
      const file = req.files['thumbnail'][0];
      // Save path (S3 URL or Local Path)
      galleryData.thumbnail = file.location || `uploads/${file.filename}`;
    }

    // 2. HANDLE GALLERY IMAGES UPLOAD
    if (req.files && req.files['images']) {
      const files = req.files['images'].map(file => ({
        url: file.location || `uploads/${file.filename}`,
        altText: req.body.title
      }));
      galleryData.images = files;
      
      // If no specific thumbnail was uploaded, use the first gallery image
      if (!galleryData.thumbnail && files.length > 0) {
        galleryData.thumbnail = files[0].url;
      }
    }

    // Create DB Entry
    const gallery = await Gallery.create(galleryData);

    res.status(201).json({
      success: true,
      data: gallery
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update a gallery (Title, Tags, etc)
// @route   PUT /api/galleries/:id
exports.updateGallery = async (req, res) => {
  try {
    let gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({ success: false, error: 'Gallery not found' });
    }

    // Update the gallery with new data
    gallery = await Gallery.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: gallery });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Delete a gallery
// @route   DELETE /api/galleries/:id
exports.deleteGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({ success: false, error: 'Gallery not found' });
    }

    // Delete from database
    await gallery.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get single gallery
// @route   GET /api/galleries/:id
exports.getGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({ success: false, error: 'Gallery not found' });
    }

    // OPTIONAL: Increment View Count automatically
    gallery.views += 1;
    await gallery.save();

    res.status(200).json({ success: true, data: gallery });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};