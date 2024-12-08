import mongoose, { model, Schema, Types } from "mongoose";
import ShopeCategories from "./ShopeCategoriesSchema";

const ShopSchema= new Schema({
    OwnerId:{type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true},
    ShopName:{type:String,required:true,unique:true},
    ShopeCategory:{ type: mongoose.Schema.Types.ObjectId, ref: 'ShopeCategories', required: true },
    SubCategory:{ type: mongoose.Schema.Types.ObjectId, ref: 'ShopSubCategories', required: true },
    Discription:{type:String},
    city:{type:String,required:true},
    state:{type:String,required:true},
    country:{type:String,required:true},
    pinCode:{type:String,required:true},
    shopContactDetail:{type:mongoose.Schema.Types.ObjectId,ref:'ShopContactDetails',required:true},
    shopLeagalDocuments:{type:mongoose.Schema.Types.ObjectId,ref:'ShopLeagalDocuments',required:true},
    paymentCredentials:{type:mongoose.Schema.Types.ObjectId,ref:'PaymentCredentials',required:true},
    image:{ data: Buffer, contentType: String, },
    createdAt:{type: Date,default: Date.now},
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    updatedAt:{type: Date,default: Date.now},
    updatedBy:[{Type:mongoose.Schema.Types.ObjectId,ref:'User'}]
});

export const Shops= mongoose.model('Shops', ShopSchema);
