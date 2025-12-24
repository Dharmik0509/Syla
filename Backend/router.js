import express from "express";
import Login from "./controller/login.js";
import CategoryController from "./controller/category.js";
import ProductController from "./controller/product.js";
import HeroController from "./controller/hero.js";
import { verifyToken } from "./middleware/auth.js";

import upload from "./middleware/upload.js"; // Import upload middleware

const router = express.Router();
const loginController = new Login();
const categoryController = new CategoryController();
const productController = new ProductController();
const heroController = new HeroController();

// Server Health Check (GET - Browser Friendly)
router.get("/", (req, res) => {
    res.json({
        message: "Syla E-commerce Backend is Running",
        time: new Date().toISOString(),
        endpoints: "Use POST for all functional API calls"
    });
});

// Auth Routes (Public)
router.post("/login", loginController.authenticate);
router.post("/signup", loginController.createuser);

// Category Routes (Protected)
router.post("/create-category", verifyToken, upload.single('image'), categoryController.createCategory);
router.post("/get-categories", categoryController.getCategories);
router.post("/update-category", verifyToken, upload.single('image'), categoryController.updateCategory);
router.post("/delete-category", verifyToken, categoryController.deleteCategory);

// Product Routes (Protected actions, Public read)
router.post("/create-product", verifyToken, upload.array('images', 5), productController.createProduct);
router.post("/get-products", productController.getProducts);
router.post("/get-product-by-id", productController.getProductById);
router.post("/update-product", verifyToken, upload.array('images', 5), productController.updateProduct);
router.post("/delete-product", verifyToken, productController.deleteProduct);

// Hero Section Routes (Protected actions, Public read)
router.post("/create-hero-slide", verifyToken, upload.single('image'), heroController.createSlide);
router.post("/get-hero-slides", heroController.getSlides);
router.post("/update-hero-slide", verifyToken, upload.single('image'), heroController.updateSlide);
router.post("/delete-hero-slide", verifyToken, heroController.deleteSlide);

export default router;
