import { Shops } from "../models/ShopSchema.js";
import { ShopLeagalDocuments } from "../models/shopLeagalDocumentsSchema.js";
import { ShopContactDetails } from "../models/ShopContactDetailsSchema.js";
import { PaymentCredentials } from "../models/PaymentCredentialsSchema.js";

export const registerShopController = async (req, res) => {
    try {
        const {
            ShopName,
            ShopeCategory,
            SubCategory,
            Discription,
            city,
            state,
            country,
            pinCode,
            shopContactDetail,
            shopLeagalDocuments,
            paymentCredentials,
        } = req.body;

        const OwnerId = req.user._id;

        // Create and save shop legal documents
        const legalDoc = new ShopLeagalDocuments({
            Shop: null,
            shopActLicenceNo: shopLeagalDocuments.shopActLicenceNo,
            shopActLicenceDocument: shopLeagalDocuments.shopActLicenceDocument,
            ownerPANNo: shopLeagalDocuments.ownerPANNo,
            ownerPANDocument: shopLeagalDocuments.ownerPANDocument,
            ownerPhoto: shopLeagalDocuments.ownerPhoto,
            createdBy: req.user._id,
        });
        await legalDoc.save();

        // Create and save shop contact details
        const contactDetails = new ShopContactDetails({
            Shop: null,
            email: shopContactDetail.email,
            emailPass: shopContactDetail.emailPass,
            contactNo: shopContactDetail.contactNo,
            createdBy: req.user._id,
        });
        await contactDetails.save();

        // Create and save payment credentials
        const paymentDetails = new PaymentCredentials({
            Shop: null,
            paymentGatwayName: paymentCredentials.paymentGatwayName,
            merchentID: paymentCredentials.merchentID,
            publicKey: paymentCredentials.publicKey,
            privateKey: paymentCredentials.privateKey,
            createdBy: req.user._id,
        });
        await paymentDetails.save();

        // Create and save the shop
        const newShop = new Shops({
            OwnerId,
            ShopName,
            ShopeCategory,
            SubCategory,
            Discription,
            city,
            state,
            country,
            pinCode,
            shopContactDetail: contactDetails._id,
            shopLeagalDocuments: legalDoc._id,
            paymentCredentials: paymentDetails._id,
            createdBy: req.user._id,
        });
        await newShop.save();

        // Update the related documents with the shop's ID
        legalDoc.Shop = newShop._id;
        contactDetails.Shop = newShop._id;
        paymentDetails.Shop = newShop._id;
        await legalDoc.save();
        await contactDetails.save();
        await paymentDetails.save();

        res.status(201).send({
            success: true,
            message: "Shop registered successfully",
            shop: newShop,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error registering the shop",
            error: error.message,
        });
    }
};


export const updateShopController = async (req, res) => {
    try {
        const { shopId } = req.params;
        const updateData = req.body;

        const updatedShop = await Shops.findByIdAndUpdate(shopId, updateData, { new: true });

        if (!updatedShop) {
            return res.status(404).send({ success: false, message: "Shop not found" });
        }

        res.status(200).send({
            success: true,
            message: "Shop updated successfully",
            shop: updatedShop,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error updating shop",
            error: error.message,
        });
    }
};


export const updateShopContactDetailsController = async (req, res) => {
    try {
        const { contactId } = req.params;
        const updateData = req.body;

        const updatedContact = await ShopContactDetails.findByIdAndUpdate(contactId, updateData, { new: true });

        if (!updatedContact) {
            return res.status(404).send({ success: false, message: "Contact details not found" });
        }

        res.status(200).send({
            success: true,
            message: "Contact details updated successfully",
            contactDetails: updatedContact,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error updating contact details",
            error: error.message,
        });
    }
};


export const updateShopLegalDocumentsController = async (req, res) => {
    try {
        const { legalDocId } = req.params;
        const updateData = req.body;

        const updatedLegalDoc = await ShopLeagalDocuments.findByIdAndUpdate(legalDocId, updateData, { new: true });

        if (!updatedLegalDoc) {
            return res.status(404).send({ success: false, message: "Legal documents not found" });
        }

        res.status(200).send({
            success: true,
            message: "Legal documents updated successfully",
            legalDocuments: updatedLegalDoc,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error updating legal documents",
            error: error.message,
        });
    }
};

export const getShopByIdController = async (req, res) => {
    try {
        const { shopId } = req.params;

        const shop = await Shops.findById(shopId)
            .populate("shopContactDetail")
            .populate("shopLeagalDocuments")
            .populate("paymentCredentials");

        if (!shop) {
            return res.status(404).send({ success: false, message: "Shop not found" });
        }

        res.status(200).send({ success: true, shop });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error fetching shop",
            error: error.message,
        });
    }
};


export const getAllShopsForUserController = async (req, res) => {
    try {
        const userId = req.user._id;

        const shops = await Shops.find({ OwnerId: userId })
            .populate("shopContactDetail")
            .populate("shopLeagalDocuments")
            .populate("paymentCredentials");

        res.status(200).send({ success: true, shops });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error fetching shops",
            error: error.message,
        });
    }
};

import { Shops } from "../models/ShopSchema.js";


export const deleteShopController = async (req, res) => {
    try {
        const { shopId } = req.params;

        const shop = await Shops.findById(shopId);
        if (!shop) {
            return res.status(404).send({ success: false, message: "Shop not found" });
        }

        // Delete related documents
        await ShopContactDetails.findByIdAndDelete(shop.shopContactDetail);
        await ShopLeagalDocuments.findByIdAndDelete(shop.shopLeagalDocuments);
        await PaymentCredentials.findByIdAndDelete(shop.paymentCredentials);

        // Delete the shop
        await Shops.findByIdAndDelete(shopId);

        res.status(200).send({ success: true, message: "Shop deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error deleting shop",
            error: error.message,
        });
    }
};

export const deleteShopContactDetailsController = async (req, res) => {
    try {
        const { contactId } = req.params;

        const contactDetails = await ShopContactDetails.findById(contactId);
        if (!contactDetails) {
            return res.status(404).send({ success: false, message: "Contact details not found" });
        }

        await ShopContactDetails.findByIdAndDelete(contactId);

        res.status(200).send({ success: true, message: "Contact details deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error deleting contact details",
            error: error.message,
        });
    }
};


export const deleteShopLegalDocumentsController = async (req, res) => {
    try {
        const { legalDocId } = req.params;

        const legalDocuments = await ShopLeagalDocuments.findById(legalDocId);
        if (!legalDocuments) {
            return res.status(404).send({ success: false, message: "Legal documents not found" });
        }

        await ShopLeagalDocuments.findByIdAndDelete(legalDocId);

        res.status(200).send({ success: true, message: "Legal documents deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error deleting legal documents",
            error: error.message,
        });
    }
};


export const deletePaymentCredentialsController = async (req, res) => {
    try {
        const { paymentId } = req.params;

        const paymentCredentials = await PaymentCredentials.findById(paymentId);
        if (!paymentCredentials) {
            return res.status(404).send({ success: false, message: "Payment credentials not found" });
        }

        await PaymentCredentials.findByIdAndDelete(paymentId);

        res.status(200).send({ success: true, message: "Payment credentials deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error deleting payment credentials",
            error: error.message,
        });
    }
};

export const searchShopsController = async (req, res) => {
    try {
        const { query } = req.query;

        const shops = await Shops.find({
            $or: [
                { ShopName: { $regex: query, $options: "i" } },
                { city: { $regex: query, $options: "i" } },
                { state: { $regex: query, $options: "i" } },
            ],
        })
            .populate("shopContactDetail")
            .populate("shopLeagalDocuments")
            .populate("paymentCredentials");

        if (!shops.length) {
            return res.status(404).send({ success: false, message: "No shops found" });
        }

        res.status(200).send({ success: true, shops });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error searching shops",
            error: error.message,
        });
    }
};


