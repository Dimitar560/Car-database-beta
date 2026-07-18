import { Router } from "express";
import passport from "../config/passport.js";
import { UserModel } from "../models/User.js";

const router = Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body ?? {};
  if (!username || !password) {
    return res.status(400).json({ error: "username and password required" });
  }
  try {
    const user = await UserModel.register(new UserModel({ username }), password);
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ error: "Login after register failed" });
      }
      res.status(201).json({ user: { id: user._id, username: user.username } });
    });
  } catch (err) {
    res.status(409).json({ error: (err as Error).message });
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err: Error | null, user: Express.User | false) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: "Wrong username or password" });
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

router.get("/me", (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({ user: req.user });
  }
  res.status(401).json({ error: "Not authenticated" });
});

export default router;
