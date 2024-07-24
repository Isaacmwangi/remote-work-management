const adminEmployerMiddleware = (req, res, next) => {
	if (!req.user) {
		return res.status(401).json({ message: 'User not authenticated' });
	}

	if (req.user.role !== 'ADMIN' && req.user.role !== 'EMPLOYER') {
		return res.status(403).json({ message: 'Access denied: Admins and Employers only' });
	}

	next();
};

module.exports = adminEmployerMiddleware;

