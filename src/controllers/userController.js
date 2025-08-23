const userModel = require("../models/userModel")
const reviewModel = require('../models/reviewModel')
const bcrypt = require('bcrypt')

var jwt = require('jsonwebtoken');

const saltRounds = Number(process.env.SALT_ROUNDS)
const JWT_SECRET = process.env.JWT_SECRET

const registerController = async (req, res) => {
  const { name, email, password, profile_pic,role } = req.body

  const user = await userModel.findOne({ email })
  if (user) {
    res.status(400).json({ message: "User with this Email ID already exists" })
  } else {
    bcrypt.hash(password, saltRounds, async function (err, hash) {
      if (hash) {
        const newUser = await userModel.create({
          name, email, password: hash, profile_pic, role:role || "user",
        })
        const tokenPayload = { id: newUser._id.toString(), email: newUser.email };
        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "1d" });

        // set cookie (same as login)
        res.cookie("token", token, {
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          sameSite: "None",
          secure: true,
        });
        res.status(201).json({
          message: "User registered successfully",
          user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            token
          }
        });

      } else {
        res.status(400).json({ message: "Password is required." })
      }
    })
  }
}


const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.status === "inactive") {
      return res.status(401).json({ message: "Account is inactive. Please contact admin." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    //  Log and verify user._id is valid
    console.log("User found. ID:", user._id);

    const tokenPayload = {
      id: user._id.toString(),
      email: user.email
    };

    console.log("Token payload:", tokenPayload);

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1d' });

    res.cookie('token', token, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
      },
    });
  } catch (err) {
    console.error(" Login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};




// LOGOUT

const logoutController = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
  });
  res.json({ message: 'Logged out successfully' });
};


// UPDATE OWN PROFILE

const updateUserController = async (req, res) => {
  try {

    const user = await userModel.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.email = req.body.email || user.email;
    user.profile_pic = req.body.profile_pic || user.profile_pic;
    user.gender = req.body.gender || user.gender;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(saltRounds);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();
    res.json({
      message: 'User updated successfully',
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        profile_pic: updatedUser.profile_pic,
        gender: updatedUser.gender,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


// DELETE OWN ACCOUNT

const deleteUserController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.deleteOne();
    res.clearCookie('token');
    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ============ ADMIN: Delete any user ============
const deleteAnyUserController = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.deleteOne();
    res.json({ message: 'User deleted by admin successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ============ ADMIN: Get all users ============
const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find().select('-password');
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ============ ADMIN or USER: Get user by ID ============
const getUserByIdController = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ============ AUTH: Get reviews/ratings/comments by current user ============
const getUserActivityController = async (req, res) => {
  try {
    const reviews = await reviewModel.find({ user: req.user._id });
    res.json({ reviews });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};



module.exports = {
  registerController,
  loginController,
  logoutController,
  updateUserController,
  deleteUserController,
  deleteAnyUserController,
  getAllUsersController,
  getUserByIdController,
  getUserActivityController,
}