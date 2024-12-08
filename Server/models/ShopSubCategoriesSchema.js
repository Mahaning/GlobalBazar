import mongoose from 'mongoose';

const ShopSubCategoriesShcema = new mongoose.Schema({
    shopeSubCategoryName:{ type: String, require: true },
    ShopeCategoryID:{type: mongoose.Schema.Types.ObjectId, ref: 'ShopeCategories', required: true},
    description: { type: String, required: true},
    image: { data: Buffer, contentType: String, },
    slug: { type: String, lowercase: true, required: true, },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const ShopSubCategories = mongoose.model('ShopSubCategories', ShopSubCategoriesShcema);

export default ShopSubCategories;
