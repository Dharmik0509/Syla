import express from "express";
import Login from "./controller/login.js";
import CategoryController from "./controller/category.js";
import ProductController from "./controller/product.js";
import HeroController from "./controller/hero.js";
import DiscountController from "./controller/discount.js";
import AnnouncementController from './controller/announcement.js';
import GiveawayController from './controller/giveaway.js';
import SubscriberController from './controller/subscriber.js';
import { verifyToken } from "./middleware/auth.js";

import upload from "./middleware/upload.js"; // Import upload middleware

import ModelController from './controller/model.js';

const router = express.Router();
const loginController = new Login();
const categoryController = new CategoryController();
const productController = new ProductController();
const heroController = new HeroController();
const discountController = new DiscountController();
const announcementController = new AnnouncementController();
const giveawayController = new GiveawayController();
const subscriberController = new SubscriberController();
const modelController = new ModelController();

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
router.post("/forgot-password", (req, res) => loginController.forgotPassword(req, res));
router.post("/reset-password", (req, res) => loginController.resetPassword(req, res));

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

// Bulk Product Operations
router.post("/bulk-create-products", verifyToken, upload.array('images', 50), productController.bulkCreateProducts);
router.post("/bulk-delete-products", verifyToken, productController.bulkDeleteProducts);
router.post("/bulk-update-products", verifyToken, productController.bulkUpdateProducts);

// Hero Section Routes (Protected actions, Public read)
router.post("/create-hero-slide", verifyToken, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'mobileImage', maxCount: 1 }]), heroController.createSlide);
router.post("/get-hero-slides", heroController.getSlides);
router.post("/update-hero-slide", verifyToken, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'mobileImage', maxCount: 1 }]), heroController.updateSlide);

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
router.post('/giveaway/delete-entry', verifyToken, (req, res) => giveawayController.deleteEntry(req, res));
router.post('/giveaway/bulk-delete', verifyToken, (req, res) => giveawayController.bulkDeleteEntries(req, res));

// Subscriber Routes
router.post('/add-subscriber', (req, res) => subscriberController.addSubscriber(req, res));
router.post('/get-subscribers', verifyToken, (req, res) => subscriberController.getSubscribers(req, res));
router.post('/delete-subscriber', verifyToken, (req, res) => subscriberController.deleteSubscriber(req, res));

// Our Models Routes
// Preview endpoint — try to fetch Instagram DP without credentials
router.get('/models/fetch-dp', async (req, res) => {
    const { username } = req.query;
    if (!username) return res.status(400).json({ url: null });

    const headers = {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'X-IG-App-ID': '936619743392459',
        'Referer': 'https://www.instagram.com/',
        'Origin': 'https://www.instagram.com',
    };

    try {
        // Try official-ish web_profile_info endpoint
        const igRes = await fetch(
            `https://www.instagram.com/api/v1/users/web_profile_info/?username=${encodeURIComponent(username)}`,
            { headers }
        );
        if (igRes.ok) {
            const data = await igRes.json();
            const user = data?.data?.user;
            const url = user?.profile_pic_url_hd || user?.profile_pic_url || null;
            if (url) return res.json({ url });
        }
    } catch (_) {}

    try {
        // Fallback: scrape og:image from profile page
        const pageRes = await fetch(`https://www.instagram.com/${encodeURIComponent(username)}/`, { headers });
        if (pageRes.ok) {
            const html = await pageRes.text();
            const match = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/);
            if (match?.[1]) return res.json({ url: match[1] });
        }
    } catch (_) {}

    return res.json({ url: null }); // Caller handles fallback
});

router.post('/models/apply', upload.single('photo'), (req, res) => modelController.apply(req, res));  // Public — form submission
router.get('/models/approved', (req, res) => modelController.getApproved(req, res));  // Public — homepage section
router.get('/models/all', verifyToken, (req, res) => modelController.getAll(req, res));      // Admin
router.post('/models/approve', verifyToken, (req, res) => modelController.approve(req, res)); // Admin
router.post('/models/reject', verifyToken, (req, res) => modelController.reject(req, res));   // Admin
router.post('/models/delete', verifyToken, (req, res) => modelController.remove(req, res));   // Admin

export default router;
