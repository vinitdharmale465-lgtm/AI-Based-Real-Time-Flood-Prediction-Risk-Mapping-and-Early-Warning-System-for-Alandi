
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verify login token
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies?.adminToken;

        if (!token) {
            return res.status(401).json({
                message: "Please login first"
            });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                message: "JWT_SECRET is not configured"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        req.user = user;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired login session"
        });
    }
};

// Allow only admins
const adminMiddleware = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({
            message: "Admin access required"
        });
    }

    next();
};

module.exports = {
    authMiddleware,
    adminMiddleware
};
