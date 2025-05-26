import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "7d",
	});

	// Log token generation
	console.log("=== Token Generation ===");
	console.log("Token generated for user:", userId);
	console.log("Environment:", process.env.NODE_ENV);
	console.log("==============================");

	return token;
};
