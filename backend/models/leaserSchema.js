import mongoose from "mongoose";

const leaserSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    sparse: true, 
    validate: {
      validator: function (value) {
        return !value || /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
      },
      message: "Invalid email format",
    },
  },
  phone: {
    type: String,
    unique: true,
    sparse: true, 
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
  properties: {
    type: Array,   
    default: [], //_id store karega property tables ka .
  },
}, { timestamps: true }); 
const Leaser = mongoose.model("Leaser",leaserSchema);
export default Leaser;
