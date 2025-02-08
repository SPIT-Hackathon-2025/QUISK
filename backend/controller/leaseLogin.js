import Leaser from "../models/leaserSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const leaserLogin = async (req, res) => {
  try {
    const { phone, password } = req.body;

   
    if ( !phone) {
      return res.status(400).json({ message: "Phone is required" });
    }

    const leaser = await Leaser.findOne({phone});

    if (!leaser) {
      return res.status(404).json({ message: "Leaser not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, leaser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials, password incorrect" });
    }

    const token = jwt.sign(
      { id: leaser._id, phone: leaser.phone },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      leaser: { id: leaser._id, email: leaser.email, phone: leaser.phone },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default leaserLogin;