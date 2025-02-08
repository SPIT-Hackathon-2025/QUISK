import Property from "../models/propertySchema";

const getLeaserProperties = async (req, res) => {
  try {
    const { _id } = req.params; 

    
    const properties = await Property.find({ owner: _id });

    // no properties found
    if (properties.length === 0) {
      return res.status(404).json({ message: "No properties found for this leaser" });
    }

    res.status(200).json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export default getLeaserProperties;
