import { Router } from "express";
const router = Router();

// Controllers
import leaserSignup from "../controller/leaseSignup";
import leaserLogin  from "../controller/leaseLogin";
import listProperty from "../controller/listProperty";

// Lease Routes
router.post("/signup", leaserSignup);
router.post("/login", leaserLogin);
router.post("/list",listProperty);


export default router;