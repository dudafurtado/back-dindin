const categoryModel = require('../models/categoryModel');

const listingAllTheCategories = async (req, res) => {
    try {
        const categories = await categoryModel.allCategories();
        return res.status(200).json(categories);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

module.exports = {
    listingAllTheCategories
};