
const express = require("express");
const mongoose = require("mongoose");
const Vote = require("../Vote");
const Candidate = require("../Candidate");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Submit vote
router.post("/", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "voter") {
            return res.status(403).json({
                message: "Only voters can vote"
            });
        }

        const { candidateId } = req.body;

        if (!mongoose.isValidObjectId(candidateId)) {
            return res.status(400).json({
                message: "Invalid candidate"
            });
        }

        const candidate = await Candidate.findById(candidateId);

        if (!candidate) {
            return res.status(404).json({
                message: "Candidate not found"
            });
        }

        await Vote.create({
            user: req.user.id,
            candidate: candidateId
        });

        res.status(201).json({
            message: "Your vote has been submitted successfully"
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "You have already voted"
            });
        }

        res.status(500).json({ message: "Voting failed" });
    }
});

// Check voting status
router.get("/status", authMiddleware, async (req, res) => {
    try {
        const vote = await Vote.findOne({
            user: req.user.id
        });

        res.json({
            hasVoted: Boolean(vote)
        });
    } catch (error) {
        res.status(500).json({ message: "Could not check voting status" });
    }
});

// Election results
router.get("/results", async (req, res) => {
    try {
        const results = await Vote.aggregate([
            {
                $group: {
                    _id: "$candidate",
                    totalVotes: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "candidates",
                    localField: "_id",
                    foreignField: "_id",
                    as: "candidate"
                }
            },
            { $unwind: "$candidate" },
            {
                $project: {
                    _id: 0,
                    candidateId: "$candidate._id",
                    name: "$candidate.name",
                    party: "$candidate.party",
                    symbol: "$candidate.symbol",
                    totalVotes: 1
                }
            },
            { $sort: { totalVotes: -1 } }
        ]);

        res.json(results);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch results" });
    }
});

module.exports = router;

