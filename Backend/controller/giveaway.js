import Giveaway from "../schema/Giveaway.js";

export default class GiveawayController {

    // Enter Giveaway (Public)
    async createEntry(req, res) {
        try {
            const { firstName, lastName, email, contactNo, instagramId } = req.body;

            // Simple validation
            if (!firstName || !lastName || !email || !contactNo || !instagramId) {
                return res.status(400).json({ message: "All fields are required" });
            }

            // Check for duplicate entry (optional, by email)
            const existingEntry = await Giveaway.findOne({ email });
            if (existingEntry) {
                return res.status(400).json({ message: "You have already entered the giveaway!" });
            }

            const newEntry = new Giveaway({
                firstName,
                lastName,
                email,
                contactNo,
                instagramId
            });

            await newEntry.save();
            return res.status(201).json({ message: "Entry submitted successfully!", entry: newEntry });
        } catch (error) {
            console.error("Error creating giveaway entry:", error);
            return res.status(500).json({ message: "Error submitting entry", error: error.message });
        }
    }

    // Get All Entries (Admin)
    async getAllEntries(req, res) {
        try {
            const entries = await Giveaway.find().sort({ createdAt: -1 });
            return res.json(entries);
        } catch (error) {
            return res.status(500).json({ message: "Error fetching entries", error: error.message });
        }
    }

    // Select Winner (Admin)
    async selectWinner(req, res) {
        try {
            const { id } = req.body; // If ID is provided, select that specific user

            // Reset previous winners if needed (assuming single winner for now, or allow multiple)
            // await Giveaway.updateMany({}, { isWinner: false });

            let winner;
            if (id) {
                winner = await Giveaway.findById(id);
            } else {
                // Random selection
                const count = await Giveaway.countDocuments({ isWinner: false });
                if (count === 0) return res.status(400).json({ message: "No eligible entries found" });

                const random = Math.floor(Math.random() * count);
                winner = await Giveaway.findOne({ isWinner: false }).skip(random);
            }

            if (!winner) return res.status(404).json({ message: "Winner could not be selected" });

            winner.isWinner = true;
            await winner.save();

            return res.json({ message: "Winner selected!", winner });

        } catch (error) {
            return res.status(500).json({ message: "Error selecting winner", error: error.message });
        }
    }
}
