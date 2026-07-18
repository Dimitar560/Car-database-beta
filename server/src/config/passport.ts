import passport from "passport";
import { UserModel } from "../models/User.js";

passport.use(UserModel.createStrategy());
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

export default passport;
