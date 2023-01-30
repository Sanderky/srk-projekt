import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const verifyJWT = (req: any, res: Response, next: NextFunction) => {
	const token = req.headers['authorization'];

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err: any, token: any) => {
		if (err) {
			return res.status(403).json({ err });
		}
		req.user = token.User.username;
		req.roles = token.User.roles;
		next();
	});
};

const verifyRoles = (allowedRoles: any) => {
	return (req: any, res: Response, next: NextFunction) => {
		if (!req?.roles) return res.status(401).json({ message: 'Unauthorized' });
		const allowRoles = [...allowedRoles];
		const result = allowRoles.some((r) => req.roles.includes(r));
		if (!result) {
			return res.status(403).json({ message: 'Bad credentials' });
		}
		next();
	};
};

export default { verifyJWT, verifyRoles };
