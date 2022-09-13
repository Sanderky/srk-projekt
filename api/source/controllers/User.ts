import {NextFunction, Request, Response} from 'express';
import User from '@/models/User';
import Log from "@/library/Logging";
import jwt from "jsonwebtoken"

const createUser = (req: Request, res: Response, next: NextFunction) => {
    Log.debug("Tworzenie")
    const {username, password} = req.body;
    const user = new User({
        username: username,
        password: password,
    });

    return user
        .save()
        .then(() => {
            const token = createToken(user.id)
            res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000})
            res.status(200).json({message: "User created"})
        })
        .catch((error) => res.status(500).json({error}));
};

const loginUser = (req: Request, res: Response, next: NextFunction) => {
    const {username, password} = req.body;
    User.findOne({username: username}, (error: any, result: any) => {
        if (error) return res.status(200).json({error});
        else if (!result) return res.status(404).json({message: "User not found"});
        else {
            result.comparePasswords(password, (err: any, result: boolean) => {
                if (err) return res.status(500).json({error})
                else if (!result) return res.status(401).json({message: "Wrong password"})
                else {

                    return res.status(200).json({message: "Login successful"})
                }

            })
            const token = createToken(result.id)
            res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000})
        }
    })
};

const maxAge = 3 * 24 * 60 * 60
const createToken = (id: string) => {
    return jwt.sign({id}, 'superSecretKey2137', {
        expiresIn: maxAge
    })
}

export default {createUser, loginUser};
