import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
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
    res.status(500).send("Something went wrong");
  }
};
export const login = async (req, res) => {
  try {
    // Find User
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(404).send("User not found!");

    // Compare entered password with hashed password
    const isCorrect = bcrypt.compareSync(req.body.password, user.password);
    if (!isCorrect) return res.status(400).send("Wrong password or username");

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
    res.status(500).send("Something went wrong");
  }
};
export const logout = async (req, res) => {};
