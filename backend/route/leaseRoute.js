import { Router } from "express";
const router = Router();

// Import Controllers
import leaserSignup from "../controller/leaseSignup";
import { leaserLogin } from "../controller/leaseLogin";
// Lease Routes
router.post("/signup", leaserSignup);
router.post("/login", leaserLogin);
// router.post("/signup", leaseSignup);



export default router;