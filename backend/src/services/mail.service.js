import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import AppError from "../util/AppError.js"

dotenv.config();

const transporter = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Resolve HTML template path (ESM-safe)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const htmlTemplatePath = path.join(__dirname, "emailhtml.html");
const htmlTemplate = fs.readFileSync(htmlTemplatePath, "utf8");

const sendMail = async (fullname, userEmail, otp) => {
  try {
    const finalHtml = htmlTemplate
      .replace(/{{user_name}}/g, fullname)
      .replace(/{{verification_code}}/g, otp);

    await transporter.sendMail({
      from: `"Opinara" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "Verify your email address",
      html: finalHtml,
    });
  } catch (error) {
    throw new AppError(
      "Failed to send email",
      502,
      {
        mail: userEmail,
        errorMessage: error.message,
        errorCode: error.code,
        service: "email",
      }
    );
  }
};

export default sendMail;