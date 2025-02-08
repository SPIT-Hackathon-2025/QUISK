import Property from "../models/propertySchema.js";
import Leaser from "../models/leaserSchema.js";

 const listProperty = async (req, res) => {
  try {
    const { 
      owner, title, description, propertyType, address, pricePerMonth, securityDeposit, 
      leaseDuration, availability, amenities, images, rentalAgreementCID 
    } = req.body;

    const leaserExists = await Leaser.findById(owner);
    if (!leaserExists) {
      return res.status(404).json({ message: "Leaser (owner) not found" });
    }

    // Create a new property
    const newProperty = new Property({
      owner,
      title,
      description,
      propertyType,
      address,
      pricePerMonth,
      securityDeposit,
      leaseDuration,
      availability: availability !== undefined ? availability : true, // Default true
      amenities: amenities || [],
      images: images || [],
      rentalAgreementCID: rentalAgreementCID || null,
    });

    // Save property to DB
    await newProperty.save();

    res.status(201).json({ 
      message: "Property listed successfully", 
      property: newProperty 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default listProperty;