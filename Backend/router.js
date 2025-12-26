import express from "express";
import Login from "./controller/login.js";
import CategoryController from "./controller/category.js";
import ProductController from "./controller/product.js";
import HeroController from "./controller/hero.js";
import DiscountController from "./controller/discount.js";
import AnnouncementController from './controller/announcement.js';
import GiveawayController from './controller/giveaway.js';
import { verifyToken } from "./middleware/auth.js";

import upload from "./middleware/upload.js"; // Import upload middleware

const router = express.Router();
const loginController = new Login();
const categoryController = new CategoryController();
const productController = new ProductController();
const heroController = new HeroController();
const discountController = new DiscountController();
const announcementController = new AnnouncementController();
const giveawayController = new GiveawayController();

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

// Discount Routes (Protected)
router.post('/add-new-discount', verifyToken, (req, res) => discountController.createDiscount(req, res));
router.post('/fetch-all-discounts', verifyToken, (req, res) => discountController.getDiscounts(req, res));
router.post('/toggle-discount-status', verifyToken, (req, res) => discountController.toggleStatus(req, res));
router.post('/remove-discount', verifyToken, (req, res) => discountController.deleteDiscount(req, res));
router.post('/execute-discount-rule', verifyToken, (req, res) => discountController.applyDiscountRule(req, res));
router.get('/fetch-public-discounts', (req, res) => discountController.getActiveDiscounts(req, res));

// Announcement Routes
// Announcement Routes
router.get('/fetch-active-announcements', (req, res) => announcementController.getActiveAnnouncements(req, res));
router.post('/fetch-all-announcements', verifyToken, (req, res) => announcementController.getAllAnnouncements(req, res));
router.post('/create-announcement', verifyToken, (req, res) => announcementController.createAnnouncement(req, res));
router.post('/update-announcement', verifyToken, (req, res) => announcementController.updateAnnouncement(req, res));
router.post('/delete-announcement', verifyToken, (req, res) => announcementController.deleteAnnouncement(req, res));

// Giveaway Routes
router.post('/giveaway/enter', (req, res) => giveawayController.createEntry(req, res));
router.get('/giveaway/entries', verifyToken, (req, res) => giveawayController.getAllEntries(req, res));
router.post('/giveaway/select-winner', verifyToken, (req, res) => giveawayController.selectWinner(req, res));

export default router;
