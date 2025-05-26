import express from "express";
import {
  login,
  logout,
  signup,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
  updateUser,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import fetch from "node-fetch";
import { config } from '../config.js';

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth);
router.get("/user/profile", verifyToken, checkAuth);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);

// Update reset password route to match frontend request
router.post("/reset-password/:token", resetPassword);

// Update user route - match frontend endpoint
router.put("/update", verifyToken, updateUser);

// Proxy route for Hugging Face API
router.post("/generate-image", verifyToken, async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const huggingFaceToken = config.HUGGINGFACE_API_TOKEN;
    if (!huggingFaceToken) {
      console.error('[ERROR] Hugging Face API token not found in config');
      return res.status(500).json({ error: "API configuration error" });
    }

    console.log('[DEBUG] Proxying request to Hugging Face:', {
      prompt,
      url: 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2',
      tokenPrefix: huggingFaceToken.substring(0, 3) + '...'
    });

    const response = await fetch(
      'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${huggingFaceToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('[ERROR] Hugging Face API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        tokenPresent: !!huggingFaceToken,
        tokenLength: huggingFaceToken?.length
      });
      return res.status(response.status).json(errorData);
    }

    const buffer = await response.buffer();
    res.setHeader('Content-Type', 'image/jpeg');
    res.send(buffer);

  } catch (error) {
    console.error('[ERROR] Image generation proxy error:', error);
    res.status(500).json({ 
      error: "Failed to generate image",
      details: error.message 
    });
  }
});

export default router;
