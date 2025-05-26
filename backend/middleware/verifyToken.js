import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
	try {
		console.log('=== Token Verification ===');
		console.log('Headers:', req.headers);
		
		// Get token from Authorization header
		const authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			console.log('No token found in Authorization header');
			return res.status(401).json({ 
				success: false, 
				message: "Unauthorized - no token provided" 
			});
		}

		const token = authHeader.split(' ')[1];
		console.log('Token found:', token.substring(0, 20) + '...');
		
		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			console.log('Token decoded:', decoded);
			
			if (!decoded || !decoded.userId) {
				console.log('Invalid token structure:', decoded);
				return res.status(401).json({ 
					success: false, 
					message: "Unauthorized - invalid token" 
				});
			}

			req.userId = decoded.userId;
			console.log('Token verified successfully for user:', decoded.userId);
			next();
		} catch (jwtError) {
			console.log('JWT verification error:', jwtError.message);
			if (jwtError.name === 'TokenExpiredError') {
				return res.status(401).json({ 
					success: false, 
					message: "Token expired" 
				});
			}
			return res.status(401).json({ 
				success: false, 
				message: "Invalid token" 
			});
		}
	} catch (error) {
		console.error("Error in verifyToken:", error);
		return res.status(401).json({ 
			success: false, 
			message: "Unauthorized" 
		});
	}
};
