import Leaser from "../models/leaserSchema.js";
import bcrypt from "bcrypt";

const leaserSignup = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: "Phone and password are required." });
    }

    const existingLeaser = await Leaser.findOne({ phone });
    if (existingLeaser) {
      return res.status(400).json({ message: "Leaser with this phone number already exists." });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newLeaser = new Leaser({
      phone,
      password: hashedPassword,
      properties: [], 
    });

    await newLeaser.save();

    return res.status(201).json({ message: "Leaser registered successfully!", leaserId: newLeaser._id });

  } catch (error) {
    console.error("Leaser Signup Error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export default leaserSignup;
