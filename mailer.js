const nodemailer = require("nodemailer");

exports.sendConfirmationEmail = ({ toUser, hash }) => {
  return new Promise((res, rej) => {
    const tranposter = nodemailer.createTransport({
      host: process.env.DOMAIN,
      service: "gmail",
      auth: {
        user: process.env.GOOGLE_USER,
        pass: process.env.GOOGLE_PASSWORD,
      },
    });

    const numberConfirm = Math.random() * 10000;

    const message = {
      from: process.env.GOOGLE_USER,
      to: process.env.GOOGLE_USER,
      subject: "Confirm your account",
      html: `
            <h3> Hello ${toUser.usename}</h3>
            <p> Thank you for created user on nhat binh shop, Please confirm account below: ${numberConfirm}</p>
            `,
    };

    tranposter.sendMail(message, function (error, info) {
      if (error) {
        rej(error);
      } else {
        res(info);
      }
    });
  });
};
