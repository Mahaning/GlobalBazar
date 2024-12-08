import mongoose, { model, Schema, Types } from "mongoose";
import ShopeCategories from "./ShopeCategoriesSchema";

const PaymentCredentialsSchema= new Schema({
    Shop:{ type:mongoose.Schema.Types.ObjectId,ref:'Shops',required:true,unique:true },
    paymentGatwayName:{ type:String,required:true },
    merchentID:{ type:String,required:true },
    publicKey:{type:String,required:true},
    privateKey:{type:String,required:true},
    createdAt:{type: Date,default: Date.now},
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    updatedAt:{type: Date,default: Date.now},
    updatedBy:[{Type:mongoose.Schema.Types.ObjectId,ref:'User'}]
});

export const PaymentCredentials= mongoose.model('PaymentCredentials', PaymentCredentialsSchema);
