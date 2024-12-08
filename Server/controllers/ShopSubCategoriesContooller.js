import slugify from "slugify";
import ShopSubCategories from '../models/ShopSubCategoriesSchema.js';
import fs from 'fs';

export const createShopSubCategoryController = async (req, res) => {
    try {
        const { shopeSubCategoryName, ShopeCategoryID, description } = req.fields; // Fixed typo
        const { image } = req.files;

        if (!shopeSubCategoryName) return res.status(400).send({ message: "Shop Sub Category Name is required" });
        if (!ShopeCategoryID) return res.status(400).send({ message: "Shop Category is required" });
        if (!description) return res.status(400).send({ message: "Shop subcategory description is required" });

        const newShopSubCategory = new ShopSubCategories({
            shopeSubCategoryName,
            ShopeCategoryID,
            description,
            slug: slugify(shopeSubCategoryName),
            createdBy: req.user._id,
            updatedBy: req.user._id,
        });

        if (image) {
            newShopSubCategory.image.data = fs.readFileSync(image.path);
            newShopSubCategory.image.contentType = image.type;
        }

        await newShopSubCategory.save();
        res.status(201).send({ success: true, message: "Shop subcategory created", newShopSubCategory });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error in creating Shop subcategory", error });
    }
};



export const updateShopSubCategoryController=async(req,res)=>{
    try {
        const id=req.params.id;
        const {shopeSubCategoryName,ShopeCategoryID,description}=req.fields;
        const { image }=req.files;

        const existingSubCategory = await ShopSubCategories.findById(id);
        if(!existingSubCategory){
            return res.status(404).send({success:false, message:"Shop Category not found"});
        }

        if(shopeSubCategoryName) existingSubCategory.shopeSubCategoryName=shopeSubCategoryName;
        if(ShopeCategoryID) existingSubCategory.ShopeCategoryID=ShopeCategoryID;
        if(description) existingSubCategory.description=description;
        if(shopeSubCategoryName) existingSubCategory.slug=slugify(shopeSubCategoryName);
        existingSubCategory.updatedBy=req.user._id;

        if(image){
            existingSubCategory.image.data=fs.readFileSync(image.path);
            existingSubCategory.image.contentType=image.type;
        }

        const updateShopSubCategory= await existingSubCategory.save();

        res.status(200).send({
            success:true,
            message: "Sub Category updated successfully",
            updateShopSubCategory:updateShopSubCategory
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error updating Shop Sub Category",error});
    }
};

export const fetchAllShopSubCategoryController=async(req,res)=>{
    try {
        const allData= await ShopSubCategories.find({}).populate("createdBy").sort("shopeSubCategoryName");
        res.status(200).send({success:true,message: "Subcategory List",allData});

    } catch (error) {
        console.error(error);
        res.status(500).send({success:false,message:"Error in fetching sub categories",error});
    }
};

export const fetchSingleShopSubCategoryController = async (req, res) => {
    try {
        const providedSlug = req.params.slug;
        console.log("Provided Slug:", providedSlug);

        const shopSubCategory = await ShopSubCategories.findOne({ slug: req.params.slug });
        console.log("Fetched Subcategory:", shopSubCategory);

        if (!shopSubCategory) {
            return res.status(404).send({ success: false, message: "Shop Sub Category not found" });
        }

        res.status(200).send({ success: true, message: "Shop Sub Category found", shopSubCategory });
    } catch (error) {
        console.error("Error fetching Shop Sub Category:", error);
        res.status(500).send({ success: false, message: "Error fetching Shop Sub Category", error });
    }
};


export const deleteShopSubCategoryController = async (req, res) => {
    try {
        const id = req.params.id;
        const shopSubCategory = await ShopSubCategories.findByIdAndDelete(id);

        if (!shopSubCategory) {
            return res.status(404).send({ success: false, message: "Shop sub Category not found" });
        }
        res.status(200).send({ success: true, message: "Shop sub Category deleted", shopSubCategory });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error deleting Shop sub Category", error });
    }
};

export const fetchShopCategoryImageController = async (req, res) => {
    try {
        const id = req.params.id;
        const shopSubCategory = await ShopSubCategories.findById(id).select("image");

        if (!shopSubCategory || !shopSubCategory.image || !shopSubCategory.image.data) {
            return res.status(404).send({ success: false, message: "Sub Category image not found" });
        }

        res.set("Content-Type", shopSubCategory.image.contentType);
        res.status(200).send(shopSubCategory.image.data);
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error fetching image", error });
    }
};
