import Category from "../schema/Category.js";
import { deleteFromCloudinary } from "../utils/cloudinaryHelper.js";

export default class CategoryController {
    // Create new category
    async createCategory(req, res) {
        try {
            const { name, parentCategory, description } = req.body;
            const slug = name.toLowerCase().replace(/ /g, '-');
            const image = req.file ? req.file.path : req.body.image; // Use uploaded file or existing URL

            const newCategory = new Category({
                name,
                slug,
                parentCategory: parentCategory || null,
                description,
                image
            });

            await newCategory.save();
            return res.status(201).json({ message: "Category created", category: newCategory });
        } catch (error) {
            if (req.file) await deleteFromCloudinary(req.file.path); // Cleanup on error
            return res.status(500).json({ message: "Error creating category", error: error.message });
        }
    }

    // Get all categories
    // Changed to POST compatibility: accept optional filters in body
    async getCategories(req, res) {
        try {
            const categories = await Category.find({ isActive: true }).populate('parentCategory', 'name');
            return res.json(categories);
        } catch (error) {
            return res.status(500).json({ message: "Error fetching categories", error: error.message });
        }
    }

    // Update Category
    // Expects id in body now
    async updateCategory(req, res) {
        try {
            const { id } = req.body;
            if (!id) return res.status(400).json({ message: "Category ID is required" });

            const category = await Category.findById(id);
            if (!category) return res.status(404).json({ message: "Category not found" });

            const updateData = { ...req.body };
            if (req.file) {
                console.log("File uploaded:", req.file);
                // Delete old image if it exists
                if (category.image) {
                    await deleteFromCloudinary(category.image);
                }
                updateData.image = req.file.path;
            }

            const updatedCategory = await Category.findByIdAndUpdate(id, updateData, { new: true });
            return res.json({ message: "Category updated", category: updatedCategory });
        } catch (error) {
            if (req.file) await deleteFromCloudinary(req.file.path); // Cleanup on error
            return res.status(500).json({ message: "Error updating category", error: error.message });
        }
    }

    // Delete Category
    // Expects id in body now
    async deleteCategory(req, res) {
        try {
            const { id } = req.body; // Changed from req.params
            if (!id) return res.status(400).json({ message: "Category ID is required" });

            const category = await Category.findById(id);
            if (!category) return res.status(404).json({ message: "Category not found" });

            // Delete image from Cloudinary
            if (category.image) {
                await deleteFromCloudinary(category.image);
            }

            await Category.findByIdAndDelete(id);
            return res.json({ message: "Category deleted" });
        } catch (error) {
            return res.status(500).json({ message: "Error deleting category", error: error.message });
        }
    }
}
