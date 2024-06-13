const Users = require("../model/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
// const { resetCode, mailConfig } = require("../utils/resetPassword");
const cloudinary = require("cloudinary");
const { resetCode, mailConfig } = require("../utils/resetPassword");
const ResetCode = require("../model/resetCodeModel");


const createUser = async (req, res) => {
    // step 1 : Check if data is coming or not
    console.log(req.body);

    // step 2 : Destructure the data
    const { firstName, lastName, email, password} = req.body;

    // step 3 : validate the incomming data
    if (!firstName || !lastName || !email || !password) {
        return res.json({
            success: false,
            message: "Please enter all the fields."
        })
    }

    // step 4 : try catch block
    try {
        // step 5 : Check existing user
        const existingUser = await Users.findOne({ email: email })
        if (existingUser) {
            return res.json({
                success: false,
                message: "User already exists."
            })
        }

        // password encryption
        const randomSalt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, randomSalt)

        // step 6 : create new user
        const newUser = new Users({
            // fieldname : incomming data name
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: encryptedPassword,
        })

        // step 7 : save user and response
        await newUser.save();
        res.status(200).json({
            success: true,
            message: "User created successfully."
        })


    } catch (error) {
        console.log(error);
        res.status(500).json("Server Error")
    }


}

const loginUser = async (req, res) => {
    // step 1: Check incomming data
    console.log(req.body);

    // destructuring
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
        return res.json({
            success: false,
            message: "Please enter all fields."
        })
    }

    // try catch block
    try {
        // finding user
        const user = await Users.findOne({ email: email })
        if (!user) {
            return res.json({
                success: false,
                message: "User does not exists."
            })
        }

        // user exists:  {FirstName, LastName, Email, Password} user.password
        // Comparing password
        const databasePassword = user.password;
        const isMatched = await bcrypt.compare(password, databasePassword);

        if (!isMatched) {
            return res.json({
                success: false,
                message: "Invalid Credentials."
            })
        }

        // create token
        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET
        )

        // response
        res.status(200).json({
            success: true,
            message: "User logged in successfully.",
            token: token,
            userData: user,
            isAdmin: user.isAdmin
        })

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Server Error",
            error: error
        })
    }
}

const resetPassword = async (req, res) => {
    const UserData = req.body;
    console.log(UserData)
    const user = await Users.findOne({ email: UserData?.email });
    const OTP = resetCode;
    console.log(user.id);
    console.log(OTP);
    await ResetCode.findOneAndUpdate({
        userId: user.id
    }, {
        resetCode: OTP
    }, { upsert: true })
    console.log(user);
    const MailConfig = mailConfig();

    const mailOptions = {
        from: 'College Seek', // Replace with your email
        to: UserData?.email,
        subject: 'Password Reset Code',
        text: `Your password reset code is: ${OTP}`
    };

    try {
        await MailConfig.sendMail(mailOptions);
        return res.json({
            success: true,
            message: "Reset code email sent successfully!"
        })
        // console.log('Reset code email sent successfully!');
    } catch (error) {
        console.log(error)
        return res.json({
            success: false,
            message: 'Error sending reset code email:' + error.message,
        })
    }
}

const verifyResetCode = async (req, res) => {

    const { resetCode, email } = req.body;
    try {
        const user = await Users.findOne({ email });
        if (!user) {
            return res.json({
                success: false,
                message: "User not found with the provided email."
            });
        } else {
            const savedResetCode = await ResetCode.findOne({ userId: user._id });
            if (!savedResetCode || savedResetCode.resetCode != resetCode) {
                return res.json({
                    success: false,
                    message: "Invalid reset code."
                });
            } else {
                return res.json({
                    success: true,
                    message: "Reset code verified successfully."
                });
            }
        }
    } catch (error) {
        console.error("Error in verifyResetCode:", error);
        return res.json({
            success: false,
            message: 'Server Error: ' + error.message,
        });
    }    //set opt code null
};


const updatePassword = async (req, res) => {
    const { email, password } = req.body;
    // console.log(email, password);

    try {
        // Update the user's password
        const randomSalt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, randomSalt);

        await Users.findOneAndUpdate({ email }, { password: encryptedPassword });

        return res.json({
            success: true,
            message: "Password reset successfully."
        });

    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: 'Server Error: ' + error.message,
        });
    }
};

const getUsers = async (req, res) => {
    try {
        const allUsers = await User.find({});
        res.json({
            success: true,
            message: "All users fetched successfully!",
            products: allUsers,
        });
    } catch (error) {
        console.log(error);
        res.send("Internal server error");
    }
};
const getSingleUser = async (req, res) => {
    const userId = req.params.id;
    try {
        const singleUser = await User.findById(userId);
        res.json({
            success: true,
            message: "Single user fetched successfully!",
            product: singleUser,
        });
    } catch (error) {
        console.log(error);
        res.send("Internal server error");
    }
};
const changePassword = async (req, res) => {
    try {
        // Step 1: Check incoming data
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Please enter both current and new passwords.",
            });
        }

        const user = await Users.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Step 3: Compare current password with the one stored in the database
        const isMatched = await bcrypt.compare(currentPassword, user.password);
        if (!isMatched) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect.",
            });
        }
        // Step 4: Encrypt and update the password
        const newSalt = await bcrypt.genSalt(10);
        const newEncryptedPassword = await bcrypt.hash(newPassword, newSalt);

        user.password = newEncryptedPassword;
        await user.save();

        // Step 5: Response
        res.status(200).json({
            success: true,
            message: "Password changed successfully.",
        });
    } catch (error) {
        console.error("Error in changePassword:", error);
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token",
            });
        }
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
//Profile

const getUserProfile = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const userId = decodedToken.id;
        const user = await Users.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "User profile retrieved successfully",
            userProfile: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                contact: user.contact,
                location: user.location,
                profileImage: user.profileImage,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }
};

const updateUserProfile = async (req, res) => {
    console.log(req.files);
    try {
        // Check if user object exists in the request
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not authenticated.",
            });
        }

        const user = await Users.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const { firstName, lastName, email, contact, location, profileImage } = req.body;

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (email) user.email = email;
        if (contact) user.contact = contact;
        if (location) user.location = location;
        if (req.files) {
            const uploadedImage = await cloudinary.v2.uploader.upload(
                req.files.profileImage.path,
                {
                    folder: "profile_images",
                    crop: "scale",
                }
            );
            user.profileImage = uploadedImage.secure_url;
        }
        await user.save();

        // Return the updated user profile data
        res.status(200).json({
            success: true,
            message: "User profile updated successfully",
            userProfile: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                contact: user.contact,
                location: user.location,
                profileImage: user.profileImage,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
module.exports = {
    createUser,
    loginUser,
    resetPassword,
    verifyResetCode,
    updatePassword,
    getUsers,
    getSingleUser,
    changePassword,
    updateUserProfile,
    getUserProfile,
}