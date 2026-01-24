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

            const products = await Product.find(query).sort({ createdAt: -1 }).populate('category', 'name');
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

    // Bulk Create Products (Supports both Simple Image Upload & Structured Batch Entry)
    async bulkCreateProducts(req, res) {
        try {
            // MODE A: Structured Batch Entry (Frontend sends 'products' JSON + mapped 'images')
            if (req.body.products) {
                let productsData = [];
                try {
                    productsData = JSON.parse(req.body.products);
                } catch (e) {
                    return res.status(400).json({ message: "Invalid products JSON data" });
                }

                const createdProducts = [];

                // Check for image mismatch
                const totalExpectedImages = productsData.reduce((acc, item) => acc + (item.imageIndices ? item.imageIndices.length : 0), 0);
                const totalReceivedImages = req.files ? req.files.length : 0;

                let warningMessage = null;
                if (totalExpectedImages > 0 && totalReceivedImages === 0) {
                    warningMessage = "Products created, but NO images were received by the server.";
                    console.warn("[Bulk] Mismatch: Expected", totalExpectedImages, "images, but got 0.");
                } else if (totalExpectedImages !== totalReceivedImages) {
                    warningMessage = `Products created, but image count mismatch (Exp: ${totalExpectedImages}, Got: ${totalReceivedImages}).`;
                    console.warn("[Bulk] Mismatch:", warningMessage);
                }

                for (const item of productsData) {
                    let imageUrls = [];

                    if (item.imageIndices) {
                        console.log(`[Bulk] Item "${item.title}" Indices:`, item.imageIndices);
                    }

                    // Map files by indices if provided (Multiple Images Support)
                    if (item.imageIndices && Array.isArray(item.imageIndices)) {
                        imageUrls = item.imageIndices
                            .map(idx => {
                                const file = req.files[idx];
                                if (!file) {
                                    console.log(`[Bulk] Warning: File at index ${idx} is undefined. Req.files length: ${req.files ? req.files.length : 0}`);
                                    return null;
                                }
                                return file.path;
                            })
                            .filter(path => path !== null);
                    }
                    // Fallback for single image index
                    else if (item.imageIndex !== undefined && item.imageIndex !== null && req.files && req.files[item.imageIndex]) {
                        imageUrls = [req.files[item.imageIndex].path];
                    }

                    const slug = (item.title || 'Product').toLowerCase().replace(/[^\w\s-]/g, '').replace(/ /g, '-') + '-' + Date.now() + '-' + Math.floor(Math.random() * 1000);

                    const newProduct = new Product({
                        title: item.title || 'Untitled Product',
                        slug,
                        price: item.price || 0,
                        stockQuantity: item.stockQuantity || 0,
                        category: item.category,
                        description: item.description || '',
                        isNewArrival: item.isNewArrival || false,
                        images: imageUrls,
                        isActive: true
                    });

                    await newProduct.save();
                    createdProducts.push(newProduct);
                }

                return res.status(201).json({
                    message: `Successfully created ${createdProducts.length} products.`,
                    products: createdProducts,
                    warning: warningMessage
                });
            }

            // MODE B: Simple Bulk (Auto-generate from Images)
            const { price, stockQuantity, category, description, isNewArrival, titlePrefix } = req.body;

            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ message: "No images uploaded for bulk creation." });
            }
            if (!category || !price) {
                return res.status(400).json({ message: "Category and Price are required." });
            }

            const createdProducts = [];

            for (const [index, file] of req.files.entries()) {
                const baseTitle = titlePrefix || 'New Product';
                // Unique title: Prefix + Index + Timestamp
                const title = `${baseTitle} ${index + 1}`;
                const slug = `${title.toLowerCase().replace(/ /g, '-')}-${Date.now()}-${index}`;

                const newProduct = new Product({
                    title,
                    slug,
                    price,
                    stockQuantity: stockQuantity || 1, // Default to 1 if not set
                    category,
                    description: description || '',
                    isNewArrival: isNewArrival === 'true' || isNewArrival === true,
                    images: [file.path], // One image per product
                    isActive: true
                });

                await newProduct.save();
                createdProducts.push(newProduct);
            }

            return res.status(201).json({
                message: `Successfully created ${createdProducts.length} products.`,
                products: createdProducts
            });

        } catch (error) {
            // Cleanup uploaded files on error (best effort)
            if (req.files && req.files.length > 0) {
                for (const file of req.files) await deleteFromCloudinary(file.path);
            }
            console.error("Error in bulk create:", error);
            return res.status(500).json({ message: "Bulk create error", error: error.message });
        }
    }

    // Bulk Delete Products
    async bulkDeleteProducts(req, res) {
        try {
            const { ids } = req.body;
            if (!ids || !Array.isArray(ids) || ids.length === 0) {
                return res.status(400).json({ message: "No product IDs provided." });
            }

            // Optional: Delete images from Cloudinary for these products
            const productsToDelete = await Product.find({ _id: { $in: ids } });

            for (const product of productsToDelete) {
                if (product.images && product.images.length > 0) {
                    for (const imageUrl of product.images) {
                        await deleteFromCloudinary(imageUrl);
                    }
                }
            }

            const result = await Product.deleteMany({ _id: { $in: ids } });

            return res.json({
                message: "Bulk delete successful",
                deletedCount: result.deletedCount
            });
        } catch (error) {
            console.error("Error in bulk delete:", error);
            return res.status(500).json({ message: "Error performing bulk delete", error: error.message });
        }
    }

    // Bulk Update Products
    async bulkUpdateProducts(req, res) {
        try {
            const { ids, updates } = req.body;
            if (!ids || !Array.isArray(ids) || ids.length === 0) {
                return res.status(400).json({ message: "No product IDs provided." });
            }
            if (!updates || Object.keys(updates).length === 0) {
                return res.status(400).json({ message: "No update data provided." });
            }

            // Remove potentially dangerous fields
            delete updates._id;
            delete updates.slug;

            // Update
            const result = await Product.updateMany(
                { _id: { $in: ids } },
                { $set: updates }
            );

            return res.json({
                message: "Bulk update successful",
                modifiedCount: result.modifiedCount
            });

        } catch (error) {
            console.error("Error in bulk update:", error);
            return res.status(500).json({ message: "Error performing bulk update", error: error.message });
        }
    }
}
