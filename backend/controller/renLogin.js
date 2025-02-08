import Renter from "../models/Renter.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const renterLogin = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const renter = await Renter.findOne({phone});

    if (!renter) {
      return res.status(404).json({ message: "Renter not found" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, renter.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: renter._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({ message: "Login successful", token, renter });
  } catch (error) {
    console.error("Error in renter login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default renterLogin;
