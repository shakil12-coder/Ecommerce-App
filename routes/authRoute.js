import express from 'express'
import { registerController , loginController , forgotPasswordController , testController, updateProfileController, getOrderController, getAllOrdersController, orderStatusController } from '../controllers/authController.js';
import { requireSignIn , isAdmin} from '../middlewares/authMiddleware.js';



//router object
const router = express.Router();
//routing

//REGISTER || METHOD POST
router.post('/register' , registerController);

//LOGIN || METHOD POST
router.post('/login' , loginController);

//test
router.get('/test' ,requireSignIn , isAdmin , testController);


//forgotPassword 
router.post('/forgot-password' , forgotPasswordController);


//protected user routes
router.get("/user-auth" , requireSignIn , (req , res)=> {
    res.status(200).send({ok : true});
})


//protected admin routes
router.get("/admin-auth" , requireSignIn , isAdmin , (req , res)=> {
    res.status(200).send({ok : true});
})

//update profile
router.put('/profile' , requireSignIn , updateProfileController);

//orders
router.get('/orders' , requireSignIn , getOrderController);


//all orders
router.get('/all-orders' , requireSignIn , getAllOrdersController);


//order status update
router.put('/order-status/:orderId' , requireSignIn , isAdmin , orderStatusController);

export default router;