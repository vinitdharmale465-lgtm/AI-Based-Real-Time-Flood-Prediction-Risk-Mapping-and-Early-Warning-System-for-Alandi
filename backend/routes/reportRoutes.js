

const express = require("express");
const Report = require("../models/Report");

const router = express.Router();

// POST: Submit report
router.post("/", async (req, res) => {
    try {
        const { name, location, issue, description } = req.body;

        if (!name || !location || !issue) {
            return res.status(400).json({
                message: "Name, location and issue are required"
            });
        }

        const report = await Report.create({
            name,
            location,
            issue,
            description
        });

        res.status(201).json({
            message: "Report submitted successfully",
            report
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// GET: All reports
router.get("/", async (req, res) => {
    try {
        const reports = await Report.find().sort({
            createdAt: -1
        });

        res.json(reports);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;
