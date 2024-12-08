import mongoose from 'mongoose';

const ShopeCategoriesShcema = new mongoose.Schema({
    shopeCategoryName:{ type: String, require: true, unique: true },
    description: { type: String, required: true },
    image: { data: Buffer, contentType: String, },
    slug: { type: String, lowercase: true, required: true, },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const ShopeCategories = mongoose.model('ShopCategories', ShopeCategoriesShcema);

export default ShopeCategories;

