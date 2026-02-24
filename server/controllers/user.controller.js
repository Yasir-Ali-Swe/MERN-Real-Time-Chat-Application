import User from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";

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

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { fullName, email } = req.body;
        let imageUrl = undefined;

        // Validate email format basic
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }

        if (req.file) {
            const streamUpload = (req) => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        {
                            folder: "avatars",
                        },
                        (error, result) => {
                            if (result) {
                                resolve(result);
                            } else {
                                reject(error);
                            }
                        }
                    );
                    streamifier.createReadStream(req.file.buffer).pipe(stream);
                });
            };

            const result = await streamUpload(req);
            imageUrl = result.secure_url;
        }

        const updatedData = {};
        if (fullName) updatedData.fullName = fullName;
        if (email) updatedData.email = email;
        if (imageUrl) updatedData.profilePicture = imageUrl;

        const user = await User.findByIdAndUpdate(userId, updatedData, {
            new: true,
        }).select("-password");

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};
