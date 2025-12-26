
import Discount from "../schema/Discount.js";
import Product from "../schema/Product.js";

export default class DiscountController {

    // Create Discount
    async createDiscount(req, res) {
        try {
            const { name, type, AOvalue, appliesTo, targetValues, startDate, endDate } = req.body;

            const newDiscount = new Discount({
                name,
                type,
                value: req.body.value, // Fix typo in destructuring if any
                appliesTo,
                targetValues,
                startDate,
                endDate
            });

            await newDiscount.save();
            return res.status(201).json({ message: "Discount created", discount: newDiscount });
        } catch (error) {
            console.error("Error creating discount:", error);
            return res.status(500).json({ message: "Error creating discount", error: error.message });
        }
    }

    // Get All Discounts (Admin)
    async getDiscounts(req, res) {
        try {
            const discounts = await Discount.find().sort({ createdAt: -1 });
            return res.json(discounts);
        } catch (error) {
            return res.status(500).json({ message: "Error fetching discounts", error: error.message });
        }
    }

    // Get Active Discounts (Public)
    async getActiveDiscounts(req, res) {
        try {
            const discounts = await Discount.find({ isActive: true }).sort({ createdAt: -1 });
            return res.json(discounts);
        } catch (error) {
            return res.status(500).json({ message: "Error fetching active discounts", error: error.message });
        }
    }

    // Toggle Active Status
    async toggleStatus(req, res) {
        try {
            const { id } = req.body;
            const discount = await Discount.findById(id);
            if (!discount) return res.status(404).json({ message: "Discount not found" });

            discount.isActive = !discount.isActive;
            await discount.save();
            return res.json({ message: "Discount status updated", discount });
        } catch (error) {
            return res.status(500).json({ message: "Error updating status", error: error.message });
        }
    }

    // Delete Discount
    async deleteDiscount(req, res) {
        try {
            const { id } = req.body;
            await Discount.findByIdAndDelete(id);
            return res.json({ message: "Discount deleted" });
        } catch (error) {
            return res.status(500).json({ message: "Error deleting discount", error: error.message });
        }
    }

    // Apply Discount to Products (Batch Operation)
    // This updates the 'discountPercentage' field in the Product collection based on this rule.
    async applyDiscountRule(req, res) {
        try {
            const { id } = req.body;
            const discount = await Discount.findById(id);
            if (!discount) return res.status(404).json({ message: "Discount rule not found" });

            if (!discount.isActive) return res.status(400).json({ message: "Discount is not active" });

            let filter = {};
            if (discount.appliesTo === 'CATEGORY') {
                filter = { category: { $in: discount.targetValues } };
            } else if (discount.appliesTo === 'PRODUCT') {
                filter = { _id: { $in: discount.targetValues } };
            } else if (discount.appliesTo === 'ALL') {
                filter = {};
            }

            console.log("Applying Discount Rule:", discount.name);
            console.log("Applies To:", discount.appliesTo);
            console.log("Target Values:", discount.targetValues);
            console.log("Filter Generated:", JSON.stringify(filter));

            // Only support percentage application to the field for now

            // Only support percentage application to the field for now
            if (discount.type !== 'PERCENTAGE') {
                return res.status(400).json({ message: "Only PERCENTAGE discounts can be auto-applied to products currently." });
            }

            const updateResult = await Product.updateMany(filter, {
                $set: {
                    discountPercentage: discount.value,
                    discountStartDate: discount.startDate,
                    discountEndDate: discount.endDate
                }
            });

            return res.json({
                message: "Discount applied to products",
                modifiedCount: updateResult.modifiedCount
            });

        } catch (error) {
            console.error("Error applying discount:", error);
            return res.status(500).json({ message: "Error applying discount", error: error.message });
        }
    }
}
