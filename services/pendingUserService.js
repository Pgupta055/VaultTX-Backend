const PendingUser = require("../models/PendingUser");

const createPendingUser = async (userData) => {
    await PendingUser.deleteMany({
        email: userData.email,
    });

    const expiresAt = new Date(
        Date.now() + 5 * 60 * 1000
    );

    return PendingUser.create({
        ...userData,
        expiresAt,
    });
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