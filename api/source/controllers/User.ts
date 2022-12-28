import { NextFunction, Request, Response } from 'express';
import User from '@/models/User';
import passport from 'passport';
import Log from '@/library/Logging';
import { compare, compareSync, hashSync } from 'bcrypt';
import jwt from 'jsonwebtoken';
const createUser = (req: Request, res: Response, next: NextFunction) => {
	const { username, password, roles } = req.body;
	const user = new User({
		username: username,
		password: hashSync(password, 10),
		roles: roles
	});

	user.save()
		.then((user: any) => {
			res.send({
				success: true,
				message: 'User created succesfully.',
				user: user
			});
		})
		.catch((err: Error) => {
			res.send({
				success: false,
				message: 'Something went wrong.',
				error: err
			});
		});
};

const loginUser = (req: Request, res: Response, next: NextFunction) => {
	User.findOne({ username: req.body.username })
		.then(user => {
			if(!user){
				return res.status(401).send(({
					success:false,
					message:"Could not find the user."
				}))
			}
			if(!compareSync(req.body.password,user.password)){
				return res.status(401).send(({
					success:false,
					message:"Incorrect password"
				}))
			}
			
			const payload = {
				username: user.username,
				roles: user.roles
			}
			const token = jwt.sign(payload,'randomTestString',{expiresIn:"1d"})

			return res.status(200).send({
				success: true,
				message: "Logged in succesfully",
				token: "Bearer " + token,
				user:{
					username: user.username,
					roles: user.roles
				}
			})
		})
};

export default { createUser, loginUser };
