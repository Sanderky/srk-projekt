import { NextFunction, Request, Response } from 'express';
import User from '@/models/User';
import Log from '@/library/Logging';
import { compare, hash } from 'bcrypt';
import jwt from 'jsonwebtoken';

const createUser = async (req: Request, res: Response, next: NextFunction) => {
	const { username, password, roles, details } = req.body;
	if (!username || !password) return res.status(400).json({ message: 'Username or password was not provided' });

	try {
		const result = await User.create({
			username: username,
			password: await hash(password, 10),
			roles: roles,
			details: details
		});
		res.status(201).json({ message: 'Success, new user has been created.', createdUser: result });
	} catch (err: any) {
		res.status(500).json({ message: err.message });
	}
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
	const { username, password, allowedRoles } = req.body;
	if (!username || !password) return res.status(400).json({ message: 'Username or password was not provided' });
	try {
		const foundUser = await User.findOne({ username: username }).exec();
		if (!foundUser) {
			return res.status(401).json({ message: 'Bad credentials.' });
		}
		const userPassword = foundUser.password;
		const userRoles = foundUser.roles;
		const userDetails = foundUser.details ? foundUser.details : null;
		const checkPassword = await compare(password, userPassword);
		if (!userRoles.every((val) => allowedRoles.includes(val))) {
			return !checkPassword ? res.status(401).json({ message: 'Bad credentials.' }) : res.status(403).json({ message: 'Role not allowed.' });
		} else if (checkPassword) {
			const accessToken = jwt.sign(
				{
					User: {
						username: foundUser.username,
						roles: foundUser.roles
					}
				},
				process.env.ACCESS_TOKEN_SECRET!,
				{ expiresIn: '5m' }
			);

			const refreshToken = jwt.sign(
				{
					username: foundUser.username
				},
				process.env.REFRESH_TOKEN_SECRET!
			);

			foundUser.refreshToken = refreshToken;
			await foundUser.save();
			res;
			console.log(userDetails);
			return userDetails
				? res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, maxAge: 24 * 60 * 60 * 1000, sameSite: 'none' }).json({ accessToken, userRoles, userDetails })
				: res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, maxAge: 24 * 60 * 60 * 1000, sameSite: 'none' }).json({ accessToken, userRoles });
		} else {
			return res.status(401).json({ message: 'Bad credentials.' });
		}
	} catch (error) {
		Log.error(error);
		return res.status(500).json({ error });
	}
};

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

const refreshTokenController = async (req: Request, res: Response) => {
	const cookies = req.cookies;
	if (!cookies?.jwt) return res.sendStatus(401);
	// if (!cookies?.jwt) return res.sendStatus(200);
	const refreshToken = cookies.jwt;

	const foundUser = await User.findOne({ refreshToken: refreshToken }).exec();
	if (!foundUser) return res.sendStatus(403);

	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, (err: any, token: any) => {
		if (err || foundUser.username !== token.username) return res.sendStatus(403);
		const roles = foundUser.roles;
		const accessToken = jwt.sign(
			{
				User: {
					username: foundUser.username,
					roles: roles
				}
			},
			process.env.ACCESS_TOKEN_SECRET!,
			{ expiresIn: '5m' }
		);
		res.json({ roles, accessToken });
	});
};

const logout = async (req: Request, res: Response) => {
	const cookies = req.cookies;
	if (!cookies?.jwt) return res.sendStatus(204);
	const refreshToken = cookies.jwt;

	const foundUser = await User.findOne({ refreshToken }).exec();
	if (!foundUser) {
		res.clearCookie('jwt', { httpOnly: true });
		return res.sendStatus(204);
	}
	foundUser.refreshToken = '';
	await foundUser.save();

	res.clearCookie('jwt', { httpOnly: true });
	return res.sendStatus(204);
};

const verifyRoles = (allowedRoles: any) => {
	return (req: any, res: Response, next: NextFunction) => {
		if (!req?.roles) return res.sendStatus(401);
		const allowRoles = [...allowedRoles];
		const result = allowRoles.some((r) => req.roles.includes(r));
		if (!result) {
			return res.sendStatus(403);
		}
		next();
	};
};

export default { createUser, loginUser, verifyJWT, verifyRoles, refreshTokenController, logout };
