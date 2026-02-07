import express from "express";
import { createWave, getWavePosts, getLocation } from "../controller/wave.controller.js";
import { 
  createWaveSchema, 
  getWavePostSchema, 
  getLocationSchema, 
  getWaves, 
  SearchWave, 
  deleteWave, 
  getMembers 
} from "../validation/wave.validation.js";
import auth from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const Router = express.Router();

// Create wave
Router.post("/create", auth, validate(createWaveSchema), createWave);

// Get posts of a wave
// Example: /waves/123/posts?page=1
Router.get("/:waveId/posts", validate(getWavePostSchema), getWavePosts);

// Update location
Router.patch("/:waveId/location", auth, validate(getLocationSchema), getLocation);

// Get waves joined by user
Router.get("/user-wave", auth, validate(), getWaves);

// Search waves
// Example: /waves/search?q=wave-name
Router.get("/search", validate(), SearchWave);

// Delete wave (SHOULD be DELETE, not GET)
Router.delete("/:waveId", auth, validate(), deleteWave);

// Get members with filters
// Example:
// /waves/123/members?page=1&limit=20&role=moderator&status=active&search=ankit
Router.get("/:waveId/members", validate(), getMembers);

export default Router;
