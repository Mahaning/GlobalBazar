import mongoose, { model, Schema, Types } from "mongoose";

const shopContactDetailsSchema= new Schema({
    Shop:{type:mongoose.Schema.Types.ObjectId,ref:'Shops',required:true,unique:true},
    email:{type:String,require:true,unique:true,default:mongoose.Schema.Types.ObjectId,ref:'User'},
    emailPass:{ type: String },
    contactNo:{ type:String, required:true},
    createdAt:{type: Date,default: Date.now},
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    updatedAt:{type: Date,default: Date.now},
    updatedBy:[{Type:mongoose.Schema.Types.ObjectId,ref:'User'}]
});

export const ShopContactDetails= mongoose.model('ShopContactDetails', shopContactDetailsSchema);
