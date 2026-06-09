const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const { protect } = require("../middleware/authMiddleware");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const registerUser = async (req, res) => {
  try {
    const {
      name,
      mobile,
      role,
      village,
      taluka,
      district,
      password,
    } = req.body;

    const userExists = await User.findOne({ mobile });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(
      password,
      salt
    );

    const user = await User.create({
      name,
      mobile,
      role,
      village,
      taluka,
      district,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: user._id,
      photo: user.photo,
      name: user.name,
      mobile: user.mobile,
      role: user.role,
      village: user.village,
      taluka: user.taluka,
      district: user.district,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const loginUser = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    const user = await User.findOne({ mobile });

    if (
      user &&
      (await bcrypt.compare(password, user.password))
    ) {
      res.json({

        _id: user._id,
        photo: user.photo,
        name: user.name,
        mobile: user.mobile,
        role: user.role,
        village: user.village,
        taluka: user.taluka,
        district: user.district,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({
        message: "Invalid Mobile or Password",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.name =
      req.body.name || user.name;

    user.mobile =
      req.body.mobile || user.mobile;

    user.village =
      req.body.village || user.village;

    user.taluka =
      req.body.taluka || user.taluka;

    user.district =
      req.body.district || user.district;

    user.photo =
      req.body.photo || user.photo;

    await user.save();

    res.json(user);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const uploadProfilePhoto = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded",
      });
    }

    const uploadFromBuffer = () => {
      return new Promise((resolve, reject) => {

        const stream =
          cloudinary.uploader.upload_stream(
            {
              folder: "profile-photos",
            },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );

        streamifier
          .createReadStream(req.file.buffer)
          .pipe(stream);

      });
    };

    const result = await uploadFromBuffer();

    res.json({
      imageUrl: result.secure_url,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  registerUser,
  loginUser,
  updateProfile,
  uploadProfilePhoto
};