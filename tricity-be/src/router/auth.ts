import express, { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import passport from "passport";
import User from "../model/User";
import Signupkey from "../model/Signupkey";
import Organization from "../model/Organization";
import { isAuthenticated } from "../middleware/authenticate";

const router = express.Router();

router.post(
  "/signup",
  // @ts-ignore
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      firstName,
      lastName,
      organization,
      email,
      password,
      confirmPassword,
      phone,
      signupKey,
    } = req.body;

    try {
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match." });
      }

      const keyRecord = await Signupkey.findOne({
        key: signupKey,
        used: false,
      });
      if (!keyRecord) {
        return res
          .status(403)
          .json({ message: "Invalid or expired signup key." });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists." });
      }

      // Find or create organization
      let organizationDoc = await Organization.findOne({ name: organization });
      if (!organizationDoc) {
        organizationDoc = new Organization({ name: organization });
        await organizationDoc.save();
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        firstName,
        lastName,
        organizationId: organizationDoc._id,
        email,
        password: hashedPassword,
        phone,
        role: keyRecord.role,
      });

      await user.save();

      // Mark the signup key as used
      keyRecord.used = true;
      keyRecord.usedBy = user._id;
      await keyRecord.save();

      res.status(201).json({ message: "User registered successfully." });
    } catch (err) {
      console.error("Signup error:", err);
      res.status(500).json({ message: "Internal server error." });
    }
  }
);

// @ts-ignore
router.post("/login", async (req, res, next) => {
  const { organizationId } = req.body as any;

  if (!organizationId) {
    return res.status(400).json({ message: "Organization ID is required" });
  }

  try {
    // Check if organization exists by name
    const organization = await Organization.findOne({ name: organizationId });
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    passport.authenticate(
      "local",
      async (err: Error, user: any, info: { message: string }) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: info.message });

        // Check if user's organizationId matches found organization._id
        if (user.organizationId.toString() !== organization._id.toString()) {
          return res
            .status(403)
            .json({ message: "User does not belong to this organization" });
        }

        req.login(user, (err) => {
          if (err) return next(err);
          res.status(200).json({ message: "Login successful", user });
        });
      }
    )(req, res, next);
  } catch (error) {
    console.error("Login error:", error);
    next(error);
  }
});

// @ts-ignore
router.post("/logout", isAuthenticated, (req, res, next) => {
  if (!req.session) {
    return res.status(400).json({ message: "No active session" });
  }

  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }

    res.clearCookie("connect.sid", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.json({ message: "Logged out successfully" });
  });
});

router.get("/status", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ loggedIn: true, user: req.user });
  } else {
    res.json({ loggedIn: false });
  }
});

export default router;
