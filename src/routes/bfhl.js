import express from 'express';
import { processArray, processFile } from '../utils/helpers.js';
import { auth } from '../middleware/auth.js';

export const router = express.Router();

// POST /bfhl - Protected route
router.post('/', auth, async (req, res) => {
  try {
    const { data, file_b64 } = req.body;
    
    // Process the array data
    const processedData = processArray(data);
    
    // Process the file
    const fileInfo = processFile(file_b64);

    // Construct response based on file validity
    const response = {
      is_success: true,
      user_id: req.user.getUserId(),
      email: req.user.email,
      roll_number: req.user.roll_number,
      ...processedData,
      file_valid: fileInfo.file_valid
    };

    // Only include file details if file is valid
    if (fileInfo.file_valid) {
      response.file_mime_type = fileInfo.file_mime_type;
      response.file_size_kb = fileInfo.file_size_kb;
    }

    res.json(response);
  } catch (error) {
    res.status(400).json({
      is_success: false,
      error: error.message
    });
  }
});

// GET /bfhl
router.get('/', (req, res) => {
  res.status(200).json({
    operation_code: 1
  });
});