
const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        location: {
            type: String,
            required: true
        },

        issue: {
            type: String,
            required: true
        },

        description: {
            type: String,
            default: ""
        },

        status: {
            type: String,
            default: "Pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Report", reportSchema);
