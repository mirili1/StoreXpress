import mongoose from 'mongoose';
import { Product, productValidator } from '../models/product.js';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const getcountOfProducts=async (req,res)=>{
    try{
        let sumProd = await Product.countDocuments();
        res.status(200).send(String(sumProd));
    }
    catch(err){
        res.status(400).send("problem: " + err.message);
    }
}
export const getcountOfProductsInCategory=async (req,res)=>{
    try{  
        let countProducts = await Product.countDocuments({ category });
        res.status(200).send(String(countProducts));
    }
    catch(err){
        res.status(400).send("problem: " + err.message);
    }
}
export const getAllProducts = async (req, res) => {
    try {
        let { productsInScreen, numOfScreen, textToSearch, minPrice, maxPrice } = req.query;
        if (!productsInScreen)
            productsInScreen = 30;
        if (!numOfScreen)
            numOfScreen = 1;
        let search = {};
        if (textToSearch) {
            search = {
                $or: [{ model: { $regex: `.*${textToSearch}.*`, $options: 'i' } },
                { description: { $regex: `.*${textToSearch}.*`, $options: 'i' } }]
            };
        }
        if (minPrice || maxPrice) {
            search.price = {};
            if (minPrice) {
                search.price.$gte = parseFloat(minPrice);
            }
            if (maxPrice) {
                search.price.$lte = parseFloat(maxPrice);
            }
        }
        let products = await Product.find(search).sort({ updatedAt: -1 }).skip((numOfScreen - 1) * productsInScreen).limit(productsInScreen);
        res.json(products);
    } catch (err) {
        res.status(400).send("problem: " + err.message);
    }
};
export const getProductsInCategoty = async (req, res) => {
    try {
        let {category}=req.params;
        let { productsInScreen, numOfScreen, textToSearch, minPrice, maxPrice } = req.query;
        if (!productsInScreen)
            productsInScreen = 30;
        if (!numOfScreen)
            numOfScreen = 1;
        let search = {category};
        if (textToSearch) {
            search = {
                $or: [{ model: { $regex: `.*${textToSearch}.*`, $options: 'i' } },
                { description: { $regex: `.*${textToSearch}.*`, $options: 'i' } }]
            };
        }
        if (minPrice || maxPrice) {
            search.price = {};
            if (minPrice) {
                search.price.$gte = parseFloat(minPrice);
            }
            if (maxPrice) {
                search.price.$lte = parseFloat(maxPrice);
            }
        }
        let products = await Product.find(search).sort({ updatedAt: -1 }).skip((numOfScreen - 1) * productsInScreen).limit(productsInScreen);
        res.json(products);
    } catch (err) {
        res.status(400).send("problem: " + err.message);
    }
};
export const getProductById = async (req, res) => {
    try {
        let { id } = req.params;
        if (!mongoose.isValidObjectId(id))
            return res.status(400).send("id ins`t valid");
        let product = await Product.findById(id);
        if (!product)
            return res.status(404).send("no such product");
        res.json(product);
    }
    catch (err) {
        res.status(400).send("problem " + err.message);
    }
}
export const addNewProduct = async (req, res) => {
    try {
        let introducer = req.user._id;
        let validate = productValidator({ ...req.body, introducer });
        // if (validate.error) {
        //     validate.error.details.forEach((err) => {
        //         console.log(err.message);
        //     })
        //     return res.status(400).send(validate.error.details);
        // };
        if (validate.error) {
            let errorMessages = [];
            validate.error.details.forEach((errorDetail) => {
                const { message, path } = errorDetail;
                const errorMessage = `${path.join('.')} ${message}`;
                errorMessages.push(errorMessage);
            });
            return res.status(400).send(errorMessages);
        };
        let sameProduct = await Product.find(validate);
        if (sameProduct.length > 0)
            return res.status(409).send("this product already exists");
        let newProduct = await Product.create(validate.value)
        res.json(newProduct)
    }
    catch (err) {
        res.status(400).send("problem " + err.message);
    }
}
export const deleteProductById = async (req, res) => {
    try {
        let { id } = req.params;
        if (!mongoose.isValidObjectId(id))
            return res.status(400).send("id ins`t valid");
        let product = await Product.findById(id);
        if (!product)
            return res.status(404).send("no such product");
        let introducer = req.user._id;
        console.log(product.introducer);
        console.log(introducer);
        if (product.introducer != introducer)
            return res.status(404).send("You are not authorized");
        product = await Product.findByIdAndDelete(id);
        res.json(product)
    }
    catch (err) {
        res.status(400).send("problem " + err.message);
    }
}
export const updateProductById = async (req, res) => {
    try {
        let { id } = req.params;
        if (!mongoose.isValidObjectId(id))
            return res.status(400).send("id ins`t valid");
        let { category, model, manufacturer, price, description, size, color, warrantyConditions, imgUrl } = req.body;
        let product = await Product.findById(id);
        if (!product)
            return res.status(404).send("no such product");
        let introducer = req.user._id;
        if (product.introducer != introducer)
            return res.status(403).send("You are not authorized");
        product.category = category || product.category;
        product.model = model || product.model;
        product.manufacturer = manufacturer || product.manufacturer;
        product.price = price || product.price;
        product.description = description || product.description;
        product.size = size || product.size;
        product.color = color || product.color;
        product.warrantyConditions = warrantyConditions || product.warrantyConditions;
        product.imgUrl = imgUrl || product.imgUrl;
        await product.save();
        res.json(product)
    }
    catch (err) {
        res.status(400).send("problem" + err.message);
    }
}
// Set storage engine for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/'); // Path to save the uploaded images
    },
    filename: function (req, file, cb) {
        // Rename the file with a unique identifier (UUID) and its original extension
        cb(null, uuidv4() + path.extname(file.originalname));
    }
});

// Initialize multer upload with the storage engine
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 } // Limit file size if needed
}).single('image'); // 'image' should match the name attribute in your form input

// Route to handle image upload
export const uploadProductImage = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.status(400).send("An error occurred while uploading the image.");
        } else {
            if (req.file) {
                res.status(200).send("Image uploaded successfully: " + req.file.filename);
            } else {
                res.status(400).send("No image uploaded");
            }
        }
    });
};
