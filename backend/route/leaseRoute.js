import { Router } from "express";
const router = Router();

// Controllers
import leaserSignup from "../controller/leaseSignup.js";
import leaserLogin  from "../controller/leaseLogin.js";
import listProperty from "../controller/listProperty.js";
import ownedProperties from "../controller/ownedProperties.js";
// Lease Routes
router.post("/signup", leaserSignup);
router.post("/login", leaserLogin);
router.post("/list",listProperty);
router.get("/properties/:_id",ownedProperties);


export default router;