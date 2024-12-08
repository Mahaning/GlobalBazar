import bcrypt from 'bcrypt';

export const hashPassword = async (password) => {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.log(error);
    }
};

export const comparePassword = (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
};


export const hashCredentials = async(credentials)=>{
    try {
        const saltRounds=10;
        const hashedCredential= await bcrypt.hash(credentials,saltRounds);
        return hashedCredential;
    } catch (error) {
        console.log(error);
    }
};

export const compareCredentials= async(credentials,hashCredentials)=>{
    return bcrypt.compare(credentials,hashCredentials);
};