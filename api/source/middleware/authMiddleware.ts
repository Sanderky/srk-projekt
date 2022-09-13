import jwt from "jsonwebtoken"
import {NextFunction, Request, Response} from "express";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {

    const token = req.cookies.jwt

    if (token) {
        jwt.verify(token, 'superSecretKey2137', (error: any, decoded: any) => {
            if (error) res.redirect('/loginPage')
            else {
                next();
            }
        })
    } else {
        res.redirect('/loginPage')
    }
}

