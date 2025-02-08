import { Router } from "express";
const router = Router();

// Import Controllers
import leaserSignup from "../controller/leaseSignup";

// Lease Routes
router.post("/signup", leaserSignup);
router.post("/login", leaseLogin);
// router.post("/signup", leaseSignup);



export default router;