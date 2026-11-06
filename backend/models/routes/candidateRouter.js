
const express = require("express");
const Candidate = require("../Candidate");
const {
    authMiddleware,
    adminMiddleware
} = require("../middleware/authMiddleware");

const router = express.Router();

// Read all candidates
router.get("/", async (req, res) => {
    try {
        const candidates = await Candidate.find().sort({ createdAt: -1 });
        res.json(candidates);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch candidates" });
    }
});

// Add candidate - Admin only
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { name, party, symbol, description } = req.body;

        if (!name?.trim() || !party?.trim()) {
            return res.status(400).json({
                message: "Candidate name and party are required"
            });
        }

        const candidate = await Candidate.create({
            name: name.trim(),
            party: party.trim(),
            symbol,
            description
        });

        res.status(201).json(candidate);
    } catch (error) {
        res.status(500).json({ message: "Failed to add candidate" });
    }
});

// Update candidate - Admin only
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const candidate = await Candidate.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!candidate) {
            return res.status(404).json({
                message: "Candidate not found"
            });
        }

        res.json(candidate);
    } catch (error) {
        res.status(400).json({ message: "Failed to update candidate" });
    }
});

// Delete candidate - Admin only
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);

        if (!candidate) {
            return res.status(404).json({
                message: "Candidate not found"
            });
        }

        const Vote = require("../Vote");
        const votesExist = await Vote.exists({ candidate: candidate._id });

        if (votesExist) {
            return res.status(409).json({
                message: "Cannot delete a candidate who has received votes"
            });
        }

        await candidate.deleteOne();

        res.json({ message: "Candidate deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: "Failed to delete candidate" });
    }
});

module.exports = router;

