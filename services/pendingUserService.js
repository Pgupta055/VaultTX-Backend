const PendingUser = require("../models/PendingUser");

const createPendingUser = async (userData) => {
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    return PendingUser.findOneAndUpdate(
        { email: userData.email },
        {
            ...userData,
            expiresAt,
        },
        {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
        }
    );
};

const getPendingUser = async (email) => {
    return PendingUser.findOne({ email });
};

const deletePendingUser = async (email) => {
    return PendingUser.deleteOne({ email });
};

module.exports = {
    createPendingUser,
    getPendingUser,
    deletePendingUser,
};