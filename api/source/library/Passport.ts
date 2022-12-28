import User from "@/models/User";
import passport from "passport";
import { Strategy,ExtractJwt } from "passport-jwt"
import Log from "./Logging";

const opts = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "randomTestString"
};

passport.use(new Strategy(opts,(jwt_payload,done) => {
    User.findOne({username: jwt_payload.username},(err:Error,user:any)=>{
        if(err){
            return done(err,false);
        }
        if(user){
            return done(null,user);
        }else{
            return done(null,false);
        }
    })
}))
