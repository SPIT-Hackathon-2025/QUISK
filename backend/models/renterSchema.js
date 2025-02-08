import mongoose from "mongoose";
import bcrypt from "bcryptjs"; // For hashing passwords

const renterSchema = new mongoose.Schema({
  phone: {
    type: String,
    unique: true,
    validate: {
      validator: function (value) {
        return !value || /^\d{10}$/.test(value);
      },
      message: "Invalid phone number",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
}, { timestamps: true });


const Renter = mongoose.model("Renter", renterSchema);
export default Renter;
