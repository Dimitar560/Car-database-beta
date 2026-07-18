import { Router } from "express";
import passport from "../config/passport.js";
import { UserModel } from "../models/User.js";
import { validate } from "../middleware/validate.js";
import { credentialsSchema } from "../validation/auth.js";
import { AppError } from "../lib/AppError.js";

const router = Router();

router.post("/register", validate(credentialsSchema), async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await UserModel.register(new UserModel({ username }), password);
    req.login(user, (err) => {
      if (err) {
        return next(new AppError("INTERNAL_ERROR", 500, "Login after register failed"));
      }
      res.status(201).json({ user: { id: user._id, username: user.username } });
    });
  } catch (err) {
    next(new AppError("USERNAME_TAKEN", 409, (err as Error).message));
  }
});

router.post("/login", validate(credentialsSchema), (req, res, next) => {
  passport.authenticate("local", (err: Error | null, user: Express.User | false) => {
    if (err) return next(err);
    if (!user) {
      return next(new AppError("INVALID_CREDENTIALS", 401, "Wrong username or password"));
    }
    req.login(user, (loginErr) => {
      if (loginErr) return next(loginErr);
      res.json({ user });
    });
  })(req, res, next);
});

router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.status(204).end();
  });
});

router.get("/me", (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.json({ user: req.user });
  }
  next(new AppError("NOT_AUTHENTICATED", 401, "Not authenticated"));
});

export default router;
