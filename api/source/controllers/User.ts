import { NextFunction, Request, Response } from 'express';
import User from '@/models/User';
import passport from 'passport';
import Log from '@/library/Logging';
import { compare, compareSync, hash, hashSync } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { all } from '@/routes/Doctor';

const createUser = async (req: Request, res: Response, next: NextFunction) => {
	const { username, password, roles } = req.body;
	if (!username || !password) return res.status(400).json({ message: 'Username or password was not provided' });

	try {
		const result = await User.create({
			username: username,
			password: await hash(password, 10),
			roles: roles
		});
		res.status(201).json({ message: 'Success, new user has been created.' });
	} catch (err: any) {
		res.status(500).json({ message: err.message });
	}
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
	const { username, password } = req.body;
	if (!username || !password) return res.status(400).json({ message: 'Username or password was not provided' });
	const foundedUser = await User.findOne({ username: username }).exec();
	if (!foundedUser) return res.sendStatus(401);
	const userPassword = foundedUser.password;
	const userRoles = foundedUser.roles;
	Log.debug(userRoles);
	const checkPassword = await compare(password, userPassword);
	if (checkPassword) {
		const accessToken = jwt.sign(
			{
				User: {
					username: foundedUser.username,
					roles: foundedUser.roles
				}
			},
			process.env.ACCESS_TOKEN_SECRET!,
			{ expiresIn: '5m' }
		);

		const refreshToken = jwt.sign(
			{
				username: foundedUser.username
			},
			process.env.REFRESH_TOKEN_SECRET!
		);

		foundedUser.refreshToken = refreshToken;
		const result = await foundedUser.save();

		res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, maxAge: 24 * 60 * 60 * 1000 });
		Log.debug('Zrobione');
		res.json({ accessToken, userRoles });
	} else {
		res.sendStatus(401);
	}
};

const verifyJWT = (req: any, res: Response, next: NextFunction) => {
	const token = req.headers['authorization'];

	//if (!authHeader) return res.sendStatus(401);
	//const token = authHeader.split(' ')[1];
	Log.debug(token);
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err: any, token: any) => {
		if (err) {
			Log.debug('tu jestem');
			return res.send(403).json({ err });
		}

		Log.debug('Niezweryfikowano');
		req.user = token.User.username;
		req.roles = token.User.roles;
		next();
	});
};

const refreshTokenController = async (req: Request, res: Response, next: NextFunction) => {
	const cookies = req.cookies;
	Log.debug(cookies);
	if (!cookies?.jwt) return res.sendStatus(401);
	const refreshToken = cookies.jwt;

	const foundedUser = await User.findOne({ refreshToken: refreshToken }).exec();
	if (!foundedUser) return res.sendStatus(403);

	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, (err: any, token: any) => {
		if (err || foundedUser.username !== token.username) return res.sendStatus(403);
		const roles = foundedUser.roles;
		const accessToken = jwt.sign(
			{
				User: {
					username: foundedUser.username,
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

	const foundedUser = await User.findOne({ refreshToken }).exec();
	if (!foundedUser) {
		res.clearCookie('jwt', { httpOnly: true });
		return res.sendStatus(204);
	}

	foundedUser.refreshToken = '';
	const result = await foundedUser.save();

	res.clearCookie('jwt', { httpOnly: true });
	res.sendStatus(204);
};

const verifyRoles = (...allowedRoles: any) => {
	return (req: any, res: Response, next: NextFunction) => {
		if (!req?.roles) return res.sendStatus(401);
		const allowRoles = [...allowedRoles];
		const result = allowRoles.some((r) => req.roles.includes(r));
		if (!result) {
			console.log('japapaej');
			return res.sendStatus(403);
		}
		next();
	};
};

export default { createUser, loginUser, verifyJWT, verifyRoles, refreshTokenController };
