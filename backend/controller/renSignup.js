import Renter from "../models/renterSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const renterSignup = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const renterExists = await Renter.findOne({phone});
    if (renterExists) {
      return res.status(400).json({ message: "Renter already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newRenter = new Renter({phone, password: hashedPassword });
    await newRenter.save();

    const token = jwt.sign({ id: newRenter._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ message: "Signup successful", token, renter: newRenter });
  } catch (error) {
    console.error("Error in renter signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default renterSignup;
