import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import axios from "axios";

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL;

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    next(errorHandler(400, "All fields are required"));
  }

  try {
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const CreatedUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({ message: "SignUp successFully" });
  } catch (error) {
    console.log("error while signup", error.message);
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid password"));
    }
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

    const { password: pass, ...rest } = validUser._doc;

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("User has been signed out");
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { email, name, photoURL } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json({ success: true, user: rest });
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      const NewUser = await User.create({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: photoURL,
      });
      const token = jwt.sign({ id: NewUser._id }, process.env.JWT_SECRET);
      const { password, ...rest } = NewUser._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json({ success: true, user: rest });
    }
  } catch (error) {
    next(error);
  }
};

export const githubAuth = (req, res) => {
  const redirectUri = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=user:email`;
  res.redirect(redirectUri);
};


export const githubCallback = async (req, res, next) => {
  const { code } = req.query;
  if (!code) return next(errorHandler(400, "Authorization code is missing"));

  try {
    console.log("GitHub OAuth callback hit. Code received:", code);

    // Exchange code for access token
    const { data } = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: "application/json" } }
    );

    console.log("Access token response:", data);

    const accessToken = data.access_token;
    if (!accessToken) {
      console.error("Failed to obtain access token");
      return next(errorHandler(401, "Failed to get access token"));
    }

    // Fetch GitHub user details
    const { data: githubUser } = await axios.get(
      "https://api.github.com/user",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    console.log("GitHub User:", githubUser);

    // Fetch GitHub email
    const { data: emails } = await axios.get(
      "https://api.github.com/user/emails",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    console.log("GitHub Emails:", emails);

    const emailObj = emails.find((email) => email.primary && email.verified);
    if (!emailObj) {
      console.error("No verified email found");
      return next(errorHandler(400, "No verified email found"));
    }

    const email = emailObj.email;
    let user = await User.findOne({ email });

    if (!user) {
      // Generate a random password for first-time GitHub users
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(randomPassword, 10);

      user = await User.create({
        username: githubUser.login + Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: githubUser.avatar_url,
      });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    console.log("Generated JWT:", token);

    // Redirect user to frontend with token
    res.redirect(`${FRONTEND_URL}/auth-success?token=${token}`);
  } catch (error) {
    console.error("GitHub Auth Error:", error.response?.data || error.message);
    next(error);
  }
};
