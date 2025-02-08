const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Leaser", 
    required: true
  },
  
  title: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    required: true,
    trim: true
  },

  propertyType: {
    type: String,
    enum: ["Residential", "Commercial", "Industrial", "Land", "Other"],
    required: true
  },

  address: {
    type:String
  },

  pricePerMonth: {
    type: Number,
    required: true
  },

  securityDeposit: {
    type: Number,
    required: true
  },

  leaseDuration: {
    type: Number, // MAHINE
    required: true
  },

  availability: {
    type: Boolean,
    default: true
  },

  amenities: {
    type: [String],
    enum: [
      "Parking", "WiFi", "Furnished", "Unfurnished", "Security", "Swimming Pool",
      "Gym", "Garden", "Power Backup", "CCTV", "Elevator", "Pet Friendly", "Laundry"
    ],
    default: []
  },

  images: {
    type: [String], // Array of image URLs (stored on IPFS)
    default: []
  },

  rentalAgreementCID: {
    type: String, // IPFS CID for rental agreement document
    default: null
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Property = mongoose.model("Property", propertySchema);
export default Property;
