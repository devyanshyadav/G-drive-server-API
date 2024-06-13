import nodemailer from "nodemailer";

const sendMail = async (guestEmail, generatedLink, subject, guestName) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: true,
      requireTLS: true,
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
  <body>
    <table width="600" cellpadding="0" cellspacing="0" align="center" style="border-collapse: collapse; border: 1px solid #ccc; font-family: Arial, sans-serif;">
      <tr>
        <td style="padding: 20px; background-color: #f4f4f4;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
            <tr>
              <td style="padding-bottom: 20px; text-align: center;">
                <h1 style="margin: 0; color: #333333;">Hey ${guestName}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding-bottom: 20px; color: #666666;">
                You recently requested to reset your password. To proceed, please click the link below:
              </td>
            </tr>
            <tr>
              <td style="padding-bottom: 20px; text-align: center;">
                <a href="${generatedLink}" style="display: inline-block; background-color: #007bff; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px;">Reset Password</a>
              </td>
            </tr>
            <tr>
              <td style="color: #666666; text-align: center;">
                If you did not request a password reset, please ignore this email.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
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
