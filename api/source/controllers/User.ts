import { NextFunction, Request, Response } from 'express';
import User from '@/models/User';
import passport from 'passport';
import Log from '@/library/Logging';
const createUser = (req: Request, res: Response, next: NextFunction) => {
	const { username, password, roles } = req.body;
	Log.debug(password);
	User.register(new User({ username: username, roles: roles }), password, (err, user) => {
		if (err) {
			res.json({ success: false, message: { err } });
		} else {
			res.json({ success: true, message: 'Succesfully registered' });
		}
	});
};

const loginUser = (req: Request, res: Response, next: NextFunction) => {
     res.status(200).json({message: "Auth Succesful"});
};

export default { createUser, loginUser };
