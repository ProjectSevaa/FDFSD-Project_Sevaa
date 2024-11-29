import express from "express";
import {
  getDonorPosts,
  addDonor,
  getDonorHomePage,
  getDonors,
  toggleBan,
} from "../controllers/donorController.js";

const router = express.Router();

router.get("/donor_homepage", getDonorHomePage);
router.get("/getDonors", getDonors);

router.get("/getDonorPosts", getDonorPosts);

router.post("/addDonor", addDonor);
router.post("/toggleBan/:donorId", toggleBan);

export default router;
