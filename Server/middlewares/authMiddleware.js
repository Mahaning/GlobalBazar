import JWT from "jsonwebtoken";
import usersModel from "../models/UserSchema.js";

export const requireSignIn = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; // Extract Bearer token
        if (!token) {
            return res.status(401).send({
                success: false,
                message: "Token is missing or invalid. Unauthorized access.",
            });
        }
        const decode = JWT.verify(token, process.env.JWT_SECRET); // Verify token
        req.user = decode; // Attach user details to the request
        next();
    } catch (error) {
        console.log("Authentication Error:", error);
        return res.status(401).send({
            success: false,
            message: "Unauthorized access",
            error,
        });
    }
};

export const isAdmin = async (req, res, next) => {
    try {
        const user = await usersModel.findById(req.user._id); // Fetch user details
        if (!user || user.Role !== 0) { // Role 0 is assumed to be Admin
            return res.status(403).send({
                success: false,
                message: "Admin access denied. Unauthorized access.",
            });
        }
        next();
    } catch (error) {
        console.log("Admin Middleware Error:", error);
        return res.status(500).send({
            success: false,
            message: "Error verifying admin access",
            error,
        });
    }
};

export const isShopeOwner = async (req, res, next) => {
    try {
        const user = await usersModel.findById(req.user._id); // Fetch user details
        if (!user || user.Role !== 1) { // Role 1 is assumed to be Shop Owner
            return res.status(403).send({
                success: false,
                message: "Shop Owner access denied. Unauthorized access.",
            });
        }
        next();
    } catch (error) {
        console.log("Shop Owner Middleware Error:", error);
        return res.status(500).send({
            success: false,
            message: "Error verifying shop owner access",
            error,
        });
    }
};

export const isDeliveryPartner = async (req, res, next) => {
    try {
        const user = await usersModel.findById(req.user._id); // Fetch user details
        if (!user || user.Role !== 3) { // Role 3 is assumed to be Delivery Partner
            return res.status(403).send({
                success: false,
                message: "Delivery Partner access denied. Unauthorized access.",
            });
        }
        next();
    } catch (error) {
        console.log("Delivery Partner Middleware Error:", error);
        return res.status(500).send({
            success: false,
            message: "Error verifying delivery partner access",
            error,
        });
    }
};
