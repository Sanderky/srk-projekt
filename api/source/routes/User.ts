import express, { application } from "express";
import controller from "@/controllers/User";
import passport from "passport";
import { isAuthorized } from "@/middleware/Authorize";
const router = express.Router();

require('@/library/Passport')

router.post('/signup', controller.createUser);
router.post('/login',controller.loginUser);
router.get('/protected',passport.authenticate('jwt',{session:false}),(req:any,res:any) => {
         res.status(200).send({
        success:true,
        user:{
            username: req.user.username,
            roles: req.user.roles
        }
    })
})

export = router;
