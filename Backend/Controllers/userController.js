// Controllers/userController.js
import bcrypt from "bcrypt";
import User from "../Models/User.js"; // make sure .js extension

export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    console.log(name, email, phone, password);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
