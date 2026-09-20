import nodemailer from "nodemailer";
import "./config.env.js";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const MAIL_FROM = process.env.MAIL_FROM;

if (
  SMTP_HOST === undefined ||
  SMTP_PORT === undefined ||
  SMTP_USER === undefined ||
  SMTP_PASS === undefined ||
  MAIL_FROM === undefined
) {
  throw new Error("SMTP configuration is missing");
}

export const mailTransporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export const mailFrom = MAIL_FROM;
