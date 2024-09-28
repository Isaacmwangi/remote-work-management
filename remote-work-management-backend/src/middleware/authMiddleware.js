const jwt = require('jsonwebtoken');
const { prisma } = require('../config/db');

const authMiddleware = async (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(401).json({ message: 'No token provided or token is invalid' });
	}

	const token = authHeader.split(' ')[1];

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		const user = await prisma.user.findUnique({
			where: { id: decoded.id },
		});

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		req.user = user;
		next();
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError) {
			return res.status(401).json({ message: 'Unauthorized: Token expired' });
		} else {
			console.error('Authentication error:', error);
			return res.status(401).json({ message: 'Unauthorized: Invalid token' });
		}
	}
};

module.exports = authMiddleware;
