import { Router } from "express";
const router = Router();

// Controllers
import renterSignup from "../controller/renterSignup.js";
import renterLogin from "../controller/renterLogin.js";
// import { getRenterProfile, updateRenterProfile } from "../controller/renterProfile.js";


// Auth Routes
router.post("/signup", renterSignup);
router.post("/login", renterLogin);

// router.get("/profile/:_id", authMiddleware, getRenterProfile);

export default router;
