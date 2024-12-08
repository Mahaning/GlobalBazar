import express from 'express';
import formidable from 'express-formidable';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';

import { createShopSubCategoryController,deleteShopSubCategoryController,fetchAllShopSubCategoryController,fetchShopCategoryImageController,fetchSingleShopSubCategoryController,updateShopSubCategoryController, } from '../controllers/ShopSubCategoriesContooller.js';

const router = express.Router();

router.post("/add-sub-category",requireSignIn,isAdmin,formidable(),createShopSubCategoryController);
router.put("/update-sub-category/:id",requireSignIn,isAdmin,formidable(),updateShopSubCategoryController);
router.get("/get-all-sub-category",fetchAllShopSubCategoryController);
router.get("/get-sub-category-image/:id",fetchShopCategoryImageController);
router.get("/get-single-sub-category/:slug",fetchSingleShopSubCategoryController);
router.delete("/delete-sub-category/:id",requireSignIn,isAdmin,deleteShopSubCategoryController);

export default router;