import Deal from "../models/Deal.js";

export const getDeals = async (req, res) => {
  try {
    const deals = await Deal.find();

    res.status(200).json({
      success: true,
      data: deals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};