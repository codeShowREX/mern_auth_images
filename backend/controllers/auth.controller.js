import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendPasswordResetRequestEmail, sendPasswordResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../mails/emails.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";






export const signup = async (req, res) => {
	const { email, password, name } = req.body;

	try {
		if (!email || !password || !name) {
			throw new Error("All fields are required");
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return res.status(400).json({ 
				success: false, 
				message: "Invalid email format" 
			});
		}

		const userAlreadyExists = await User.findOne({ email });
		console.log("userAlreadyExists", userAlreadyExists);

		if (userAlreadyExists) {
			return res.status(400).json({ success: false, message: "User already exists" });
		}

		const hashedPassword = await bcryptjs.hash(password, 10);
		// Generate a 6-digit verification code
		const verificationToken = Math.floor(100000 + Math.random() * 900000);
		console.log('Generated verification token:', verificationToken);
		
		const user = new User({
			email,
			password: hashedPassword,
			name,
			verificationToken: verificationToken.toString(),
			verificationTokenExpiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
		});
		await user.save();
		
		generateTokenAndSetCookie(res, user._id);

		console.log('Attempting to send verification email to:', email);
		try {
			const emailResult = await sendVerificationEmail(user.email, verificationToken);
			if (!emailResult.success) {
				console.error('Failed to send verification email:', emailResult.message);
				// Continue with signup even if email fails
			} else {
				console.log('Verification email sent successfully');
			}
		} catch (emailError) {
			console.error('Error sending verification email:', emailError);
			// Continue with signup even if email fails
		}

		res.status(201).json({
			success: true,
			message: "User created successfully. Please check your email for verification code.",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.error('Error in signup:', error);
		res.status(400).json({ 
			success: false, 
			message: error.message || "An error occurred during signup" 
		});
	}
};

export const verifyEmail = async (req, res) => {
	const { code } = req.body;
	try {
		console.log('Verifying email with code:', code);
		
		const user = await User.findOne({
			verificationToken: code,
			verificationTokenExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ 
				success: false, 
				message: "Invalid or expired verification code" 
			});
		}

		user.isVerified = true;
		user.verificationToken = undefined;
		user.verificationTokenExpiresAt = undefined;
		await user.save();

		try {
			await sendWelcomeEmail(user.email, user.name);
			console.log('Welcome email sent successfully');
		} catch (emailError) {
			console.error('Error sending welcome email:', emailError);
			// Don't throw here, just log the error
		}

		res.status(200).json({
			success: true,
			message: "Email verified successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.error("Error in verifyEmail:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

export const login = async (req, res) => {
	const { email, password } = req.body;
	try {
		console.log('=== Login Attempt ===');
		console.log('Email:', email);
		
		const user = await User.findOne({ email });
		console.log('User found:', user ? 'Yes' : 'No');
		
		if (!user) {
			console.log('User not found:', email);
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}

		console.log('Comparing passwords...');
		const isPasswordValid = await bcryptjs.compare(password, user.password);
		console.log('Password valid:', isPasswordValid ? 'Yes' : 'No');
		
		if (!isPasswordValid) {
			console.log('Invalid password for user:', email);
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}

		// Generate token
		console.log('Generating token...');
		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
			expiresIn: "7d",
		});
		console.log('Token generated:', token ? 'Yes' : 'No');

		// Update last login
		user.lastLogin = new Date();
		await user.save();
		console.log('Last login updated');

		// Send response with token
		const response = {
			success: true,
			message: "Logged in successfully",
			user: {
				...user._doc,
				password: undefined
			},
			token
		};
		console.log('Sending response:', { ...response, token: token ? 'present' : 'missing' });
		
		res.status(200).json(response);
	} catch (error) {
		console.error("Error in login:", error);
		res.status(500).json({ 
			success: false, 
			message: "An error occurred during login" 
		});
	}
};

export const logout = async (req, res) => {
	const cookieOptions = {
		httpOnly: true,
		secure: true, // Always set secure to true for cross-origin cookies
		sameSite: 'none', // Always set to none for cross-origin cookies
		path: "/",
		domain: process.env.NODE_ENV === 'production' ? '.onrender.com' : undefined
	};
	
	res.clearCookie("token", cookieOptions);
	res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
	try {
		const { email } = req.body;
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({ success: false, message: "User not found" });
		}

		const resetToken = crypto.randomBytes(32).toString("hex");
		user.resetPasswordToken = resetToken;
		user.resetPasswordExpiresAt = Date.now() + 3600000; // 1 hour
		await user.save();

		await sendPasswordResetRequestEmail(email, resetToken);
		res.status(200).json({ success: true, message: "Password reset email sent" });
	} catch (error) {
		console.error("Error in forgotPassword:", error);
		res.status(500).json({ success: false, message: "Error sending reset email" });
	}
};

export const resetPassword = async (req, res) => {
	try {
		const { token } = req.params;
		const { newPassword } = req.body;
		
		console.log('Reset password attempt:', { token, hasNewPassword: !!newPassword });
		
		// Find user with matching token and non-expired token
		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpiresAt: { $gt: Date.now() }
		});

		if (!user) {
			console.log('Invalid or expired token:', token);
			return res.status(400).json({ 
				success: false, 
				message: "Invalid or expired reset token. Please request a new password reset link." 
			});
		}

		// Hash the new password
		const hashedPassword = await bcryptjs.hash(newPassword, 10);
		
		// Update user's password and clear reset token fields
		user.password = hashedPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpiresAt = undefined;
		await user.save();

		// Send success email
		await sendPasswordResetSuccessEmail(user.email);
		
		res.status(200).json({ 
			success: true, 
			message: "Password reset successful. You can now login with your new password." 
		});
	} catch (error) {
		console.error("Error in resetPassword:", error);
		res.status(500).json({ 
			success: false, 
			message: "Error resetting password. Please try again." 
		});
	}
};

export const checkAuth = async (req, res) => {
	try {
		const token = req.headers.authorization?.split(' ')[1];
		
		if (!token) {
			return res.status(401).json({ 
				success: false, 
				message: "No token provided" 
			});
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.userId).select("-password");
		
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		res.status(200).json({ success: true, user });
	} catch (error) {
		console.log("Error in checkAuth:", error);
		res.status(401).json({ success: false, message: "Invalid token" });
	}
};

export const updateUser = async (req, res) => {
	try {
		const { email, name, currentPassword, newPassword, profile } = req.body;
		const userId = req.userId;

		console.log('Update request received:', { email, name, profile: profile ? 'present' : 'not present' });

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ success: false, message: "User not found" });
		}

		// If updating email
		if (email && email !== user.email) {
			const emailExists = await User.findOne({ email });
			if (emailExists) {
				return res.status(400).json({ success: false, message: "Email already in use" });
			}
			user.email = email;
		}

		// If updating name
		if (name) {
			user.name = name;
		}

		// If updating profile photo
		if (profile) {
			console.log('Updating profile photo');
			user.profile = profile;
		}

		// If updating password
		if (currentPassword && newPassword) {
			const isPasswordValid = await bcryptjs.compare(currentPassword, user.password);
			if (!isPasswordValid) {
				return res.status(400).json({ success: false, message: "Current password is incorrect" });
			}
			user.password = await bcryptjs.hash(newPassword, 10);
		}

		await user.save();
		console.log('User updated successfully');

		res.status(200).json({
			success: true,
			message: "Profile updated successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.error("Error in updateUser:", error);
		res.status(500).json({ success: false, message: "Error updating profile" });
	}
};
