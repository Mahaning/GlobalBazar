import mongoose, { model, Schema, Types } from "mongoose";
import ShopeCategories from "./ShopeCategoriesSchema";

const shopLeagalDocumentsSchema= new Schema({
  
    Shop:{ type: mongoose.Schema.Types.ObjectId, ref: 'Shops', required: true },
    shopActLicenceNo:{ type: String, required: true, unique: true },
    shopActLicenceDocument:{ data: Buffer, contentType: String },
    ownerPANNo:{ type: String, required: true, require: true },
    ownerPANDocument:{ data: Buffer, contentType: String },
    ownerPhoto:{ data: Buffer, contentType: String },
    ShopeCategoryID:{type: mongoose.Schema.Types.ObjectId, ref: 'ShopeCategories', required: true},
    SubCategory:{ type: mongoose.Schema.Types.ObjectId, ref: 'ShopSubCategories' },
    ownerPhoto:{ data: Buffer, contentType: String },
    createdAt:{type: Date,default: Date.now},
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    updatedAt:{type: Date,default: Date.now},
    updatedBy:[{Type:mongoose.Schema.Types.ObjectId,ref:'User'}]
});

export const ShopLeagalDocuments= mongoose.model('ShopLeagalDocuments', shopLeagalDocumentsSchema);
