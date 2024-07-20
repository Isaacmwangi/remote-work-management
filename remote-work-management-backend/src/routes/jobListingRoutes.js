const express = require("express");
const {
  createJobListing,
  getJobListings,
  getJobListingById,
  updateJobListing,
  deleteJobListing,
} = require("../controllers/jobListingController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createJobListing);
router.get("/", getJobListings);
router.get("/:id", getJobListingById);
router.put("/:id", authMiddleware, updateJobListing);
router.delete("/:id", authMiddleware, deleteJobListing);

module.exports = router;
