import fs from 'fs'
import productModel from '../models/productModel.js';
import slugify from 'slugify';
import stripe from 'stripe';
import categoryModel from '../models/categoryModel.js';
import orderModel from '../models/orderModel.js';
import dotenv from 'dotenv'
dotenv.config();
const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

export const createProductController = async (req, res) => {
    try {
        const { name, slug, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;
        switch (true) {
            case !name:
                return res.status(500).send({ error: 'Name is Required' })
            case !description:
                return res.status(500).send({ error: 'description is Required' })
            case !price:
                return res.status(500).send({ error: 'price is Required' })
            case !category:
                return res.status(500).send({ error: 'category is Required' })
            case !quantity:
                return res.status(500).send({ error: 'quantity is Required' })
            case photo && photo > 1000000:
                return res.status(500).send({ error: 'Photo is Required and should be less than 1MB' })
        }


        const products = new productModel({ ...req.fields, slug: slugify(name) })
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }

        await products.save();
        res.status(201).send({
            success: true,
            message: "Product Created successfully",
            products
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            succcess: false,
            message: "Error while creating product",
            error
        })
    }
};


export const getProductController = async (req, res) => {
    try {
        const products = await productModel.find({})
            .select("-photo")
            .populate('category')
            .limit(12)
            .sort({ createdAt: -1 });
        res.status(200).send({
            succcess: true,
            TotalProducts: products.length,
            message: "All Products fetched",
            products
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            succcess: false,
            message: "Error while getting all products",
            error
        })
    }
};


export const getSingleProductController = async (req, res) => {
    try {
        const product = await productModel.findOne({ slug: req.params.slug })
            .select("-photo")
            .populate('category')
        res.status(200).send({
            succcess: true,
            message: "Single Product fetched",
            product
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            succcess: false,
            message: "Error while getting single product",
            error
        })
    }
};

export const productPhotoController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid)
            .select("photo");
        if (product.photo.data) {
            res.set('Content-type', product.photo.contentType);
            return res.status(200).send(product.photo.data);
        }
    } catch (error) {
        res.status(400).send({
            succcess: false,
            message: "Error while fetching photo ",
            error
        })
    }
};


export const deleteProductController = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.pid).select("-photo")
        res.status(200).send({
            succcess: true,
            message: "Product Deleted Successfully"
        })
    } catch (error) {
        res.status(400).send({
            succcess: false,
            message: "Error while fetching single product",
            error
        })
    }
};


export const updateProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } =
            req.fields;
        const { photo } = req.files;
        //validation
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is Required" });
            case !description:
                return res.status(500).send({ error: "Description is Required" });
            case !price:
                return res.status(500).send({ error: "Price is Required" });
            case !category:
                return res.status(500).send({ error: "Category is Required" });
            case !quantity:
                return res.status(500).send({ error: "Quantity is Required" });
            case photo:
                return res
                    .status(500)
                    .send({ error: "photo is Required and should be less then 1mb" });
        }

        const products = await productModel.findByIdAndUpdate(
            req.params.pid,
            { ...req.fields, slug: slugify(name) },
            { new: true }
        )
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
            success: true,
            message: "Product Updated Successfully",
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in Updte product",
        });
    }
};

export const productFilterController = async (req, res) => {
    try {
        console.log("Hii ")
        const { checked, radio } = req.body;
        let args = {}

        if (checked.length > 0) {
            args.category = checked;
        }
        if (radio.length) {
            args.price = {
                $gte: radio[0],
                $lte: radio[1]
            }
        }
        const products = await productModel.find(args);
        res.status(200).send({
            success: true,
            message: "filtered products found",
            products
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error whilte filtering products",
            error
        })
    }
};

export const productCountController = async (req, res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount();
        console.log(total);
        res.status(200).send({
            success: true,
            message: "You got total count product api",
            total
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error in product count",
            error
        })
    }
};

//product list based on page

export const productListController = async (req, res) => {
    try {
        const perPage = 6;
        const page = req.params.page ? req.params.page : 1;
        const products = await productModel
            .find({})
            .select("-photo")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            message: "You got product per page",
            products
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error in getting per page",
            error
        })
    }
};

//search product controller

export const productSearchController = async (req, res) => {
    try {
        const { keyword } = req.params;
        const results = await productModel.find({
            $or: [
                {
                    name: { $regex: keyword, $options: "i" }
                },
                {
                    description: { $regex: keyword, $options: "i" }
                }
            ]
        }).select("-photo");
        res.status(200).send({
            success: true,
            message: "you got the products based on search ",
            results
        })

    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error in search product api"
        })
    }
};


export const relatedProductController = async (req, res) => {
    try {
        const { pid, cid } = req.params;
        const products = await productModel.find({
            category: cid,
            _id: { $ne: pid },
        })
            .select("-photo")
            .limit(3)
            .populate("category")
        res.status(200).send({
            success: true,
            message: "you got the similar products",
            products
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error whilte getting similar product",
            error
        })
    }
}

export const productCategoryController = async (req, res) => {

    try {
        const category = await categoryModel.find({ slug: req.params.slug })
        const products = await productModel.find(({ category })).populate('category');
        res.status(200).send({
            success: true,
            message: "you got the products based on category",
            category,
            products
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: "Error while getting product based on category",
            error
        })
    }

}

export const paymentController = async (req, res) => {
    try {
        let { cart } = req.body;
        console.log(cart);
        let total = 0;
        cart.map((p) => {
            total += p.price
        })
        const orders = new orderModel({
            products: cart,
            payment: total,
            buyer: req.user._id,
        })
        await orders.save();
        const session = await stripeInstance.checkout.sessions.create({
            payment_method_types:["card"],
            line_items : cart.map((p)=>{
                return {
                    price_data : {
                        currency : "usd",
                        product_data:{
                            name:p.name
                        },
                        unit_amount :(p.price)*100
                    },
                    quantity : p.quantity
                }
            }),
            mode:"payment",
            success_url:'http://localhost:3000/dashboard/user/orders',
            cancel_url:'http://youtube.com'
        })
        res.status(200).send({
            success: true,
            message: "Checkout session created successfully",
            sessionId: session.id,
            orders,
            url:session.url
        });

    } catch (error) {
        console.log(error);
    }
}