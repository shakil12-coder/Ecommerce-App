import express from 'express'
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import {createProductController, deleteProductController, getProductController, getSingleProductController, productPhotoController, updateProductController} from '../controllers/productController.js';
import formidable from 'express-formidable';
const router = express.Router();

//create products
router.post('/create-product' , requireSignIn , isAdmin , formidable() , createProductController);

//get all products
router.get('/get-product' , getProductController);


//get single product 
router.get('/get-product/:slug' , getSingleProductController);


//get photo
router.get('/product-photo/:pid' , productPhotoController)


//delete product
router.delete('/delete-product/:pid' ,requireSignIn , isAdmin , deleteProductController)


//update product
router.put('/update-product/:pid' , requireSignIn , isAdmin , formidable() , updateProductController);


export default router;