import nodemailer from "nodemailer";

const sendMail = async (guestEmail, generatedLink, subject, guestName) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: guestEmail,
      subject: subject,
      html: `
        <h1>Hey ${guestName}</h1>
        <h3>Click on the link below to reset your password</h3>
        <a href="${generatedLink}">${generatedLink}</a>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export default sendMail;