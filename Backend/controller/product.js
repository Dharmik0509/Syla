import Product from "../schema/Product.js";
import { deleteFromCloudinary } from "../utils/cloudinaryHelper.js";

export default class ProductController {
    // Create Product
    async createProduct(req, res) {
        try {
            const { title, price, category, stockQuantity, description, isNewArrival } = req.body;

            // Validate
            if (!title || !price || !category) {
                return res.status(400).json({ message: "Title, price, and category are required." });
            }

            const slug = title.toLowerCase().replace(/ /g, '-') + '-' + Date.now();

            // Handle multiple images
            let imageUrls = [];
            if (req.files && req.files.length > 0) {
                imageUrls = req.files.map(file => file.path);
            } else if (req.body.images) {
                // Fallback if strings passed (e.g. from existing URL or comma separated string)
                imageUrls = typeof req.body.images === 'string' ? req.body.images.split(',') : req.body.images;
            }

            const newProduct = new Product({
                ...req.body,
                title,
                slug,
                price,
                category,
                stockQuantity: stockQuantity || 0,
                description,
                isNewArrival: isNewArrival === 'true' || isNewArrival === true, // Handle string/boolean
                images: imageUrls
            });

            await newProduct.save();
            return res.status(201).json({ message: "Product created", product: newProduct });
        } catch (error) {
            if (req.files && req.files.length > 0) {
                for (const file of req.files) await deleteFromCloudinary(file.path);
            }
            console.error("Error creating product:", error); // Log full error to terminal
            return res.status(500).json({ message: "Error creating product", error: error.message });
        }
    }

    // Get All Products (with filters)
    async getProducts(req, res) {
        try {
            const { category, search } = req.body || {}; // Handle undefined body
            let query = { isActive: true };

            if (category) {
                query.category = category;
            }
            if (search) {
                query.title = { $regex: search, $options: 'i' };
            }

            const products = await Product.find(query).populate('category', 'name');
            return res.json(products);
        } catch (error) {
            return res.status(500).json({ message: "Error fetching products", error: error.message });
        }
    }

    // Get Single Product
    async getProductById(req, res) {
        try {
            const { id } = req.body; // Changed from req.params
            if (!id) return res.status(400).json({ message: "Product ID is required" });

            const product = await Product.findById(id).populate('category');
            if (!product) return res.status(404).json({ message: "Product not found" });
            return res.json(product);
        } catch (error) {
            return res.status(500).json({ message: "Error fetching product", error: error.message });
        }
    }

    // Update Product
    async updateProduct(req, res) {
        try {
            const { id, description, isNewArrival } = req.body; // Changed from req.params
            if (!id) return res.status(400).json({ message: "Product ID is required" });

            const updateData = { ...req.body };

            // Ensure SKU is never part of the update
            if (updateData.sku) delete updateData.sku;

            // Handle new images if uploaded
            if (req.files && req.files.length > 0) {
                const newImages = req.files.map(file => file.path);
                // Decide logic: Append or Replace? Let's Append for now, or maybe the frontend sends existing images + new file?
                // Simplest for now: User sends 'existingImages' array string + 'images' files.
                // But typically multipart form is tricky. Let's just assume we append new ones to existing?
                // Or better: Let's assume if files uploaded, we add them. 
                // Front end implementation will be tricky. Let's start with: replace is dangerous.
                // Let's rely on what we get.

                // If we want to keep existing, we need to fetch them.
                // For MVP, lets just take new ones if provided, OR if we want to combine:
                // We'd need to fetch current product. 
                // Let's start simple: If files uploaded, use them. If we want to keep old, frontend must handle logic or we fetch.
                // Actually safer: Fetch product, append new images.
                const product = await Product.findById(id);
                updateData.images = [...(product.images || []), ...newImages];
            }

            if (description) updateData.description = description;
            if (isNewArrival !== undefined) updateData.isNewArrival = isNewArrival === 'true' || isNewArrival === true;

            const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
            return res.json({ message: "Product updated", product: updatedProduct });
        } catch (error) {
            if (req.files && req.files.length > 0) {
                for (const file of req.files) await deleteFromCloudinary(file.path);
            }
            return res.status(500).json({ message: "Error updating product", error: error.message });
        }
    }

    // Delete Product
    async deleteProduct(req, res) {
        try {
            const { id } = req.body; // Changed from req.params
            if (!id) return res.status(400).json({ message: "Product ID is required" });

            const product = await Product.findById(id);
            if (!product) return res.status(404).json({ message: "Product not found" });

            // Delete images from Cloudinary
            if (product.images && product.images.length > 0) {
                for (const imageUrl of product.images) {
                    await deleteFromCloudinary(imageUrl);
                }
            }

            await Product.findByIdAndDelete(id);
            return res.json({ message: "Product deleted" });
        } catch (error) {
            return res.status(500).json({ message: "Error deleting product", error: error.message });
        }
    }
}
