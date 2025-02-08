import { Router } from "express";
const router = Router();

// Controllers
import leaserSignup from "../controller/leaseSignup";
import leaserLogin  from "../controller/leaseLogin";
import listProperty from "../controller/listProperty";
import ownedProperties from "../controller/ownedProperties";
// Lease Routes
router.post("/signup", leaserSignup);
router.post("/login", leaserLogin);
router.post("/list",listProperty);
router.get("/properties/:_id",ownedProperties);


export default router;