const mongoose = require('mongoose');

const waitlistSchema = new mongoose.Schema({
    solAddress: {
        type: String,
        required: true,
        match: /^[1-9A-HJ-NP-Za-km-z]{44}$/, // Basic Base58 validation
    },
    email: {
        type: String,
        required: true,
        match: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, // Email regex
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Waitlist', waitlistSchema);