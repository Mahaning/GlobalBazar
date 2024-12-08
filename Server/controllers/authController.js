
import { comparePassword, hashPassword, hashCredentials, compareCredentials} from '../helpers/authHelper.js';
import JWT from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import User from "../models/UserSchema.js";
import dotenv from 'dotenv';

dotenv.config();

export const signUpController = async (req, res) => {
    console.log(req.body);
    try {
        console.log(req.body);
        const {fullName,email,password,addresses,phoneNumber,Role,street,city,state,country,pincode}=req.body;
        if (!fullName) return res.send({ message: "Full Name is required" });
        if (!email) return res.send({ message: "Email is required" });
        if (!Role) return res.send({ message: "Role is required" });
        if (!password) return res.send({ message: "Password is required" });
        if (!phoneNumber) return res.send({ message: "Contact number is required" });
        if (!street) return res.send({ message: "street is required" });
        if (!city) return res.send({ message: "city is required" });
        if (!state) return res.send({ message: "state is required" });
        if (!country) return res.send({ message: "country is required" });
        if (!pincode) return res.send({ message: "pincode is required" });

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.send({
                success: false,
                message: "User already exists, please try to sign up with diffrent email"
            });
        }

        const hashedPassword = await hashPassword(password);
        const user = await new User({ fullName, email, password: hashedPassword, phoneNumber, street,city,state,country,pincode, Role:Role});
        
        await user.save();

        res.send({
            success: true,
            message: "User Signup successful",
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Signup',
            error
        });
    }
};

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: "Invalid email or password",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Email is not registered"
            });
        }

        const passwordMatch = await comparePassword(password, user.password);
        if (!passwordMatch) {
            return res.status(200).send({
                success: false,
                message: "Invalid password"
            });
        }

        const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.status(200).send({
            success: true,
            message: "Login Successful",
            user: {
                email: user.email,
                fullName: user.fullName,
                password: user.password,
                phoneNumber: user.phoneNumber,
                addresses: user.addresses,
                isActive: user.isActive,
                Role: user.Role
            },
            token,
        });

    } catch (error) {
        console.log(error);
        res.send({
            success: false,
            message: "Login Failed",
            error
        });
    }
}

export const updateProfile = async(req, res) => {
    try {
        console.log(req.body);
        const { email, fullName, password, phoneNumber, addresses } = req.body;
        const user=await  User.findById(req.user._id);
        
            
            
            const updateUser= await User.findByIdAndUpdate(req.user._id,{
              fullName:fullName || user.fullName,
              password:password || user.password,
                email:email || user.email,
                phoneNumber:phoneNumber || user.phoneNumber,
                addresses:addresses || user.addresses,
            },{new:true})
            res.status(200).send({
                success: true,
                message: "Update Successful",
               updateUser,
            });
            

    } catch (error) {
        console.log(error);
        res.send({
            success: false,
            message: "Update Failed",
            error
        });
    }
}

export const testController = (req, res) => {
    console.log("Test Controller");
    res.send("Protected route");
}
export const getUsersController=async(req,res)=>{
    try {
        const allUsers= await User.find({}).sort({"createdAt":-1})
        res.json(allUsers)
    } catch (error) {
        console.log(error);
        res.send({
            success: false,
            message: "Getting Orders list failed",
            error
        });
    }
}

//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });
  

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send OTP
export const sendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    user.otp = otp;
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for Password Reset',
      text: `Your OTP is ${otp}. It is valid for 10 minutes.`
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Error in sendOtp:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    user.otp = '';
    await user.save();
    res.json({ success: true, message: 'OTP verified' });
  } catch (error) {
    console.error('Error in verifyOtp:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Reset Password
// export const resetPassword = async (req, res) => {
//   const { email, newPassword } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ success: false, message: 'User not found' });
//     }

//     user.password = await bcrypt.hash(newPassword, 10);
//     await user.save();

//     res.json({ success: true, message: 'Password reset successful' });
//   } catch (error) {
//     console.error('Error in resetPassword:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// };

export const resetPassword=async(req,res)=>{
  try {
    const { email,newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "Emai is required" });
    }
    
    if (!newPassword) {
      res.status(400).send({ message: "New Password is required" });
    }
    //check
    const user = await User.findOne({ email});
    //validation
    if (!user) {
      // return res.status(404).send({
      //   success: false,
      //   message: "Wrong Email ",
      // });
      return res.status(400).json({ success: false, message: 'User not found' });
    }
    const hashed = await hashPassword(newPassword);
    await User.findByIdAndUpdate(user._id, { password: hashed });
    // res.status(200).send({
    //   success: true,
    //   message: "Password Reset Successfully",
    // });
    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
}