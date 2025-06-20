import nodemailer from "nodemailer";
import Mailgen from "mailgen";

import { MAILTRAP_HOST, MAILTRAP_PORT, MAILTRAP_USER, MAILTRAP_PASS } from "../config/envConfig.js";

const sendEmail = async (options) => {
  const mailGen = new Mailgen({
    theme: "cerberus",
    product: {
      // Appears in header & footer of e-mails
      name: "BookBazar",
      link: "https://mailgen.js/",
      // optionsal product logo
      // logo: 'https://mailgen.js/img/logo.png'
    },
  });
    // generate and HTML email with provided contents
  const emailBody = mailGen.generate(options.mailgenContent);
  const emailText = mailGen.generatePlaintext(options.mailgenContent);

  const transporter = nodemailer.createTransport({
    host: MAILTRAP_HOST,
    port: MAILTRAP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: MAILTRAP_USER,
      pass: MAILTRAP_PASS,
    },
  });

  // info
  const mailInfo = {
    from: "\"BookBazar\" <mail.bookbazar@example.com>",
    to: options.email,
    subject: options.subject,
    text: emailText, // plain‑text body
    html: emailBody, // HTML body
  };

  // sending email
  try {
    await transporter.sendMail(mailInfo);
  }
  catch (error) {
    console.log(error);
  }
};

const emailVerificationMailgenContent = (username, verificationURL) => {
  return {
    body: {
      name: username,
      intro: "Welcome to BookBazar! We're very excited to have you on board.",
      action: {
        instructions: "To get started with our App , please click here:",
        button: {
          color: "#22BC66", // Optional action button color
          text: "Verify your Email",
          link: verificationURL,
        },
      },
      outro:
          "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

export { sendEmail, emailVerificationMailgenContent };
