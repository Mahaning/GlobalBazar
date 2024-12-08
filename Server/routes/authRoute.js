import express from 'express';
import { signUpController, loginController, testController, updateProfile, getUsersController, sendOtp, verifyOtp, resetPassword } from '../controllers/authController.js';
import { isAdmin, isDeliveryPartner, requireSignIn, isShopeOwner } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/signUp', signUpController);
router.post('/login', loginController);

// Adding the user-auth route
router.get('/user-auth', requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

// Adding the deliverypartner-auth route
router.get('/deliverypartner-auth',requireSignIn,isDeliveryPartner,(req,res)=>{
  res.status(200).send({ok:true});
});

// Adding the admin-auth route
router.get('/admin-auth', requireSignIn, isAdmin,(req, res) => {
  res.status(200).send({ ok: true });
});

// Adding the shopeOwner-auth route
router.get('/shopeOwner-auth',requireSignIn,isShopeOwner,(req,res)=>{
  res.status(200).send({ok:true});
});
router.get('/all-users', requireSignIn, isAdmin, getUsersController);
router.get('/admin/login', requireSignIn, isAdmin, testController);
router.get('/shopeOwner/login', requireSignIn,isShopeOwner,testController);
router.get('/deliverypartner/login', requireSignIn, isDeliveryPartner, testController);
router.put('/user-profile',requireSignIn,updateProfile);


router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

export default router;
