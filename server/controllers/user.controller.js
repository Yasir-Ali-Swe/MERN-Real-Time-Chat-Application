import User from "../models/user.model.js";

export const getUsers = async (req, res) => {
    try {
        const currentUserId = req.user._id;

        // Fetch all users except the current one, and exclude passwords.
        const users = await User.find({ _id: { $ne: currentUserId } }).select("-password");

        res.status(200).json({
            success: true,
            users,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};
