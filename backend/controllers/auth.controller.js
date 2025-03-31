import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendWelcomeEmail } from "../emails/emailHandler.js";

export const signup = async (req, res) => {
   try {
     const { name, username, email, password } = req.body;
     const existingEmail = await User.findOne({email});
     const existingUsername = await User.findOne({username});

     if(!name || !username || !email || !password){
        return res.status(400).json({message: "All fields are required"});
     }
     if(existingEmail){
        return res.status(400).json({message: "User already exists"});
     }

     if(existingUsername){
        return res.status(400).json({message: "User already exists"});
     }

     if(password.length < 6){
        return res.status(400).json({message: "Password must be at least 6 characters"});
     }

     const salt = await bcrypt.genSalt(10);
     const hashPassword = await bcrypt.hash(password, salt);

     const user = new User({
        name,
        username,
        email,
        password: hashPassword,
     });

     await user.save();

     const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: "1d"});

     res.cookie("jwt-linkedin-clone", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
     })

     res.status(201).json({user, token});
     const profileUrl = process.env.CLIENT_URL+"/profile/"+user.username;

     try{
       await sendWelcomeEmail(user.email, user.name, profileUrl);
     }
     catch(error){
       console.log(`Error sending welcome email: ${error.message}`);
     }

   } catch (error) {
    console.log(`Error signing up: ${error.message}`);
    res.status(500).json({message: "Internal server error"});
   }
};

export const login = async (req, res) => {
	try {
		const { username, password } = req.body;

		// Check if user exists
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		// Check password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		// Create and send token
		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });
		await res.cookie("jwt-linkedin", token, {
			httpOnly: true,
			maxAge: 3 * 24 * 60 * 60 * 1000,
			sameSite: "strict",
			secure: process.env.NODE_ENV === "production",
		});

		res.json({ message: "Logged in successfully" });
	} catch (error) {
		console.error("Error in login controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};

export const logout = (req, res) => {
    res.clearCookie("jwt-linkedin-clone");
    res.status(200).json({message: "Logged out successfully"});
};