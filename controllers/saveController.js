const Save = require("../model/saveModel");
const User = require("../model/userModel");

const addToSaved = async (req, res) => {
    try {
        const { userId, collegeId } = req.body;

        if (!userId || !collegeId) {
            return res.json({
                success: false,
                message: "User ID and College ID are required fields",
            });
        }

        let save = await Save.findOne({ user: userId });

        if (!save) {
            save = new Save({ user: userId, savedItems: [] });
        }

        // Check if the college is already in the saved list
        const existingCollege = save.savedItems.findIndex(
            (item) => item.college.toString() === collegeId
        );

        if (existingCollege !== -1) {
            // If the college is already in save list, inform the user
            return res.json({
                success: false,
                message: "College is already saved",
            });
        }

        // If the college is not in save list, add it
        save.savedItems.push({ college: collegeId });

        await save.save();
        res.status(201).json({
            success: true,
            message: "College saved successfully!",
            save,
        });
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ success: false, message: "Failed to save college" });
    }
};

const getUserSaves = async (req, res) => {
    const userId = req.params.id;

    try {
        const save = await Save.findOne({ user: userId }).populate({
            path: "savedItems.college",
            select: "collegeName location collegeNumber collegeImageUrl",
        });

        if (!save) {
            return res.json({
                success: true,
                message: "User saved list is empty",
                save: [],
            });
        }

        res.json({
            success: true,
            message: "User saves fetched successfully",
            save: save.savedItems,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json("Server error");
    }
};

const removeFromSaves = async (req, res) => {
    try {
        const savedItemId = req.params.id;
        const save = await Save.findOneAndUpdate(
            { "savedItems._id": savedItemId },
            { $pull: { savedItems: { _id: savedItemId } } },
            { new: true }
        );

        if (!save) {
            return res.status(404).json({
                success: false,
                message: "College not found in saved list",
            });
        }

        res.status(200).json({
            success: true,
            message: "College removed from saved list successfully",
            save: save.savedItems,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


module.exports = {
    addToSaved,
    getUserSaves,
    removeFromSaves,
};