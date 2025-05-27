import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { sendEmail } from "./sendgrid.js";

export const sendVerificationEmail = async (email, verificationToken) => {
	try {
		const subject = "Verify Your Email";
		const html = VERIFICATION_EMAIL_TEMPLATE.replace(
			"{verificationCode}",
			String(verificationToken).trim()
		);
		return await sendEmail({ to: email, subject, html });
	} catch (error) {
		console.error("Error sending verification email:", error);
		return { success: false, message: "Failed to send verification email" };
	}
};

export const sendWelcomeEmail = async (email, name) => {
	try {
		const subject = "Welcome to Mern-Auth Services";
		const html = WELCOME_EMAIL_TEMPLATE.replace(
			"{name}",
			String(name).trim()
		);
		return await sendEmail({ to: email, subject, html });
	} catch (error) {
		console.error("Error sending welcome email:", error);
		return { success: false, message: "Failed to send welcome email" };
	}
};

export const sendPasswordResetRequestEmail = async (email, resetToken) => {
	try {
		const subject = "Password Reset Request";
		const frontendUrl = process.env.FRONTEND_URL || 'https://mern-auth-m0gi.onrender.com';
		// Ensure the token is properly encoded for URLs
		const encodedToken = encodeURIComponent(String(resetToken).trim());
		const resetUrl = `${frontendUrl}/reset-password/${encodedToken}`;
		
		console.log('Generated reset URL:', resetUrl);
		
		const html = PASSWORD_RESET_REQUEST_TEMPLATE.replace(
			"{resetURL}",
			resetUrl
		);
		return await sendEmail({ to: email, subject, html });
	} catch (error) {
		console.error("Error sending password reset email:", error);
		return { success: false, message: "Failed to send password reset email" };
	}
};

export const sendPasswordResetSuccessEmail = async (email) => {
	try {
		const subject = "Password Reset Successful";
		const html = PASSWORD_RESET_SUCCESS_TEMPLATE;
		return await sendEmail({ to: email, subject, html });
	} catch (error) {
		console.error("Error sending password reset success email:", error);
		return { success: false, message: "Failed to send password reset success email" };
	}
};
