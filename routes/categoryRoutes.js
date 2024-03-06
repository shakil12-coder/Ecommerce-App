import expres from 'express'

import { isAdmin , requireSignIn } from '../middlewares/authMiddleware.js'
import { categoryController, createCategoryController, deleteCategoryController, singleCategoryController, updateCategoryController } from '../controllers/categoryController.js';

const router = expres.Router();


//create category
router.post('/create-category' , requireSignIn , isAdmin , createCategoryController)


//update category
router.put('/update-category/:id' , requireSignIn , isAdmin , updateCategoryController);


//get all category
router.get('/get-categories' , categoryController);

//get single category
router.get('/single-category/:slug' , singleCategoryController)

//delete single category 
router.delete('/delete-category/:id' ,requireSignIn , isAdmin ,  deleteCategoryController)


export default router;
