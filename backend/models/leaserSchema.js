import mongoose from "mongoose";

const leaserSchema = new mongoose.Schema({
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
  properties: {
    type: Array,   
    default: [], //_id store karega property tables ka .
  },
}, { timestamps: true }); 
const Leaser = mongoose.model("Leaser",leaserSchema);
export default Leaser;
