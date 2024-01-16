import User from "../models/user.model.js";
import createError from "../utils/createError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  try {
    // Hash password
    const hash = bcrypt.hashSync(req.body.password, 5);
    // Create new user
    const newUser = new User({
      ...req.body,
      password: hash,
    });
    await newUser.save();
    // Success
    res.status(201).send("User has been created");
  } catch (err) {
    // Creating User Failed
    next(err);
  }
};
export const login = async (req, res, next) => {
  try {
    // Find User
    const user = await User.findOne({ username: req.body.username });
    if (!user) return next(createError(404, "User Not Found"));

    // Compare entered password with hashed password
    const isCorrect = bcrypt.compareSync(req.body.password, user.password);
    if (!isCorrect) return next(createError(400, "Wrong password or username"));

    // JSON Web Token
    const token = jwt.sign(
      {
        id: user._id,
        isSeller: user.isSeller,
      },
      process.env.JWT_KEY
    );

    const { password, ...info } = user._doc;
    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .send(info);
  } catch (err) {
    next(err);
  }
};
export const logout = async (req, res) => {
  
};
