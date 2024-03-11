// import React from 'react'
import categoryModel from '../models/categoryModel.js';
import slugify from 'slugify';

export const createCategoryController =async (req , res)=> {
    try {
        const {name} = req.body;
        if(!name){
            return res.status(401).send({
                message : "Name is Required"
            })
        }
        const existingCategory = await categoryModel.findOne({name})
        if(existingCategory){
            res.status(200).send({
                message : "Category Already Exists"
            })
        }
        const category = await new categoryModel({name , slug : slugify(name)}).save()
        res.status(201).send({
            success : true,
            message : "New Category Added",
            category
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success : false,
            error,
            message : "Error in category"
        })
    }
}

export const updateCategoryController = async(req , res) => {
    try {
        
        const {name} = req.body;
        const {id} = req.params
        // console.log(name, " " , id);
        const category = await categoryModel.findByIdAndUpdate( 
            id , 
            {name , slug : slugify(name)},
            {new : true}
        )
        res.status(200).send({
            success : true,
            message : "Category Updated sucessfully",
            category
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success : false,
            message : "Error while updating category",
            error
        })
    }
}

export const categoryController = async (req ,res) => {
    try {
        const categories = await categoryModel.find({});
        res.status(200).send({
            success : true,
            message : "All Category List",
            categories
        })

    } catch (error) {
        console.log(error);
        res.status(400).send({
            success : false,
            message : "Error while getting all category",
            error
        })
    }
}

export const singleCategoryController = async(req ,res)=>{
    try {
        const {id} = req.params;
        const category =await categoryModel.findOne({slug : req.params.slug});
        res.status(200).send({
            success : true,
            message : "single Category List found",
            category
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success : false,
            message : "Error while getting single category",
            error
        })
    }
}


export const deleteCategoryController = async(req , res) => {
    try {
        const {id} = req.params;
        const category = await categoryModel.findByIdAndDelete(id);
        res.status(200).send({
            success : true,
            message : "single Category List deleted",
            category
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success : false,
            message : "Error while deleting single category",
            error
        })
    }
}