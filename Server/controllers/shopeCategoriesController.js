import slugify from "slugify";
import ShopeCategories from "../models/ShopeCategoriesSchema.js";
import fs from "fs";

export const createShopCategoryController = async (req, res) => {
    try {
        const { shopeCategoryName, description } = req.fields;
        const { image } = req.files;

        if (!shopeCategoryName) return res.status(400).send({ message: "Shop Category Name is required" });
        if (!description) return res.status(400).send({ message: "Description is required" });

        const newShopCategory = new ShopeCategories({
            shopeCategoryName,
            description,
            slug: slugify(shopeCategoryName),
            createdBy: req.user._id,
            updatedBy: req.user._id
        });

        if (image) {
            newShopCategory.image.data = fs.readFileSync(image.path);
            newShopCategory.image.contentType = image.type;
        }

        await newShopCategory.save();
        res.status(201).send({ success: true, message: "Shop Category created", newShopCategory });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error creating Shop Category", error });
    }
};

export const updateShopCategoryController = async (req, res) => {
    try {
        const id = req.params.id;
        const { shopeCategoryName, description } = req.fields;
        const { image } = req.files;

        // Fetch existing category
        const existingCategory = await ShopeCategories.findById(id);
        if (!existingCategory) {
            return res.status(404).send({ success: false, message: "Shop Category not found" });
        }

        // Update fields only if they are provided
        if (shopeCategoryName) existingCategory.shopeCategoryName = shopeCategoryName;
        if (description) existingCategory.description = description;
        if (shopeCategoryName) existingCategory.slug = slugify(shopeCategoryName);
        existingCategory.updatedBy = req.user._id;

        // Update image if provided
        if (image) {
            existingCategory.image.data = fs.readFileSync(image.path);
            existingCategory.image.contentType = image.type;
        }

        // Save updated category
        const updatedCategory = await existingCategory.save();

        res.status(200).send({
            success: true,
            message: "Category updated successfully",
            category: updatedCategory,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error updating Shop Category", error });
    }
};


export const fetchAllShopCategoryController = async (req, res) => {
    try {
        const allData = await ShopeCategories.find({}).populate("createdBy").sort("shopeCategoryName");
        res.status(200).send({ success: true, message: "Category List", allData });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error fetching categories", error });
    }
};

export const fetchSingleShopCategoryController = async (req, res) => {
    try {
        const shopCategory = await ShopeCategories.findOne({ slug: req.params.slug });
        if (!shopCategory) {
            return res.status(404).send({ success: false, message: "Shop Category not found" });
        }
        res.status(200).send({ success: true, message: "Shop Category found", shopCategory });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error fetching Shop Category", error });
    }
};

export const deleteShopCategoryController = async (req, res) => {
    try {
        const id = req.params.id;
        const shopCategory = await ShopeCategories.findByIdAndDelete(id);

        if (!shopCategory) {
            return res.status(404).send({ success: false, message: "Shop Category not found" });
        }

        res.status(200).send({ success: true, message: "Shop Category deleted", shopCategory });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error deleting Shop Category", error });
    }
};

export const fetchShopCategoryImageController = async (req, res) => {
    try {
        const id = req.params.id;
        const category = await ShopeCategories.findById(id).select("image");

        if (!category || !category.image || !category.image.data) {
            return res.status(404).send({ success: false, message: "Category image not found" });
        }

        res.set("Content-Type", category.image.contentType);
        res.status(200).send(category.image.data);
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error fetching image", error });
    }
};
