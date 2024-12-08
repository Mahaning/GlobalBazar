export const validateShopData = (data) => {
    const requiredFields = [
        "ShopName",
        "ShopeCategory",
        "SubCategory",
        "city",
        "state",
        "country",
        "pinCode",
    ];
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
        return { isValid: false, message: `Missing fields: ${missingFields.join(", ")}` };
    }

    return { isValid: true };
};

export const validateShopLegalDocuments = (documents) => {
    const requiredFields = ["shopActLicenceNo", "ownerPANNo"];
    const missingFields = requiredFields.filter((field) => !documents[field]);

    if (missingFields.length > 0) {
        return { isValid: false, message: `Missing legal document fields: ${missingFields.join(", ")}` };
    }

    return { isValid: true };
};

export const validateShopContactDetails = (details) => {
    const requiredFields = ["email", "contactNo"];
    const missingFields = requiredFields.filter((field) => !details[field]);

    if (missingFields.length > 0) {
        return { isValid: false, message: `Missing contact detail fields: ${missingFields.join(", ")}` };
    }

    return { isValid: true };
};

export const validatePaymentCredentials = (credentials) => {
    const requiredFields = ["paymentGatwayName", "merchentID", "publicKey", "privateKey"];
    const missingFields = requiredFields.filter((field) => !credentials[field]);

    if (missingFields.length > 0) {
        return { isValid: false, message: `Missing payment credential fields: ${missingFields.join(", ")}` };
    }

    return { isValid: true };
};
