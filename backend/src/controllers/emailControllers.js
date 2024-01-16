const nodemailer = require("nodemailer");

const SendManualMail = async (req, res, next) => {
  const { to, prenom, subject, text } = req.body;
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `Epimeleia Massage <${process.env.MAIL_SENDER}>`,
      to,
      subject,
      html: `<body style="margin: 0; padding: 0">
      <main
        style="
          display: flex;
          flex-direction: column;
          gap: 3rem;
          margin: 0 auto;
          max-width: 600px;
          font-family: Montserrat, Roboto, sans-serif;
          background-color: #fefefe;
          color: #101010;
        "
      >
      <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; background-color: #101010; width: 100%; height: 120px; border-radius: 0.5rem;">
        <a  href="https://www.epimeleia-massage.fr/"
            style="margin:auto; background-image: url(https://www.epimeleia-massage.fr/Sources/svg/favicon.png); background-repeat: no-repeat; background-size: contain; background-position: center; width: 100px; height: 100px;"
        /></a>
      </div>
      
        <div>
          <h1 style="font-size: 1rem; font-weight: 400;">Bonjour ${prenom},</h1>
          <div>
            <p style="font-size: 1rem; font-weight: 400;">${text.replace(
              /\n/g,
              "<br/>"
            )}</p>
          </div>
          <div>
            <p style="font-size: 1rem; font-weight: 400; margin: 1rem 0 0 0;">Bien à vous,</p>
            <hr  style="width: 280px; margin: 1rem 0 0 0;" />
            <h2 style="font-size: 1.1rem; font-weight: 600; margin: 1rem 0 0 0; ">Perrine SAVE</h2>
            <h3 style="font-size: 1rem; font-weight: 400; margin: 0">Epimeleia Massage</h3>
            <a style="font-size: 1rem; font-weight: 300; margin: 0; text-decoration: none; color:#101010;" href="https://epimeleia-massage.fr">epimeleia-massage.fr</a>
            <br></br><a style="font-size: 1rem; font-weight: 300; margin: 0; text-decoration: none; color:#101010;" href="tel:07 68 06 17 25">07 68 06 17 25</a>
            <br></br><a style="font-size: 1rem; font-weight: 300; margin: 0; text-decoration: none; color:#101010;" href="mailto:perrine.epimeleiamassage@gmail.com">perrine.epimeleiamassage@gmail.com</a>
        </div>
      </main>
      </body>`,
    };

    const info = await transporter.sendMail(mailOptions);
    res.status(200).send(info);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  SendManualMail,
};
