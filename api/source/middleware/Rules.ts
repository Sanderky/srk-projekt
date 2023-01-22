import { Request, Response, NextFunction } from 'express';
import { FRONTEND_BASE_URL } from '@/config/settings';

// Rules of API
export function rules(req: Request, res: Response, next: NextFunction) {
	res.header('Access-Control-Allow-Origin', FRONTEND_BASE_URL);
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	res.header('Access-Control-Allow-Credentials', 'true');
	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
		return res.status(200).json({});
	}
	next();
}
