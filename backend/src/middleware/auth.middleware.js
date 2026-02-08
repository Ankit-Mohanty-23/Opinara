import jwt from "jsonwebtoken";
import Users from "../models/user.model.js";

export default async function auth(req, res, next) {
  try {
    let token;

    // 1) Try Authorization: Bearer <token> header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2) Fallback to HTTP-only cookie (auth_token)
    if (!token && req.cookies && req.cookies.auth_token) {
      token = req.cookies.auth_token;
    }

    if (!token) {
      return res.status(401).json({
        status: "Fail",
        msg: "You are not logged in. Please log in to get access.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const currentUser = await Users.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: "Fail",
        msg: "The user belonging to this token no longer exists.",
      });
    }

    req.user = currentUser;
    next();
  } catch (error) {
    console.error("AUTH MIDDLEWARE ERROR:", error);

    let message = "Invalid token. Please log in again.";
    if (error.name === "TokenExpiredError") {
      message = "Your session has expired. Please log in again.";
    }

    return res.status(401).json({
      status: "fail",
      message,
    });
  }
}
