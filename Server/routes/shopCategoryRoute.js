import express from "express";
import formidable from "express-formidable";
import {
    createShopCategoryController,
    deleteShopCategoryController,
    fetchAllShopCategoryController,
    fetchShopCategoryImageController,
    fetchSingleShopCategoryController,
    updateShopCategoryController,
} from "../controllers/shopeCategoriesController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add-category", requireSignIn, isAdmin, formidable(), createShopCategoryController);
router.put("/update-category/:id", requireSignIn, isAdmin, formidable(), updateShopCategoryController);
router.get("/getall-category", fetchAllShopCategoryController);
router.get("/get-category-image/:id", fetchShopCategoryImageController);
router.get("/get-single-category/:slug", fetchSingleShopCategoryController);
router.delete("/delete-category/:id", requireSignIn, isAdmin, deleteShopCategoryController);

export default router;
