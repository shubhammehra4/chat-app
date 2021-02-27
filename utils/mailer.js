const nodemailer = require("nodemailer");

exports.activation = async (token, email) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            auth: {
                user: "fausto95@ethereal.email",
                pass: "qYK2QTudqAqPmtvSEF",
            },
        });

        let info = await transporter.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>',
            to: email,
            subject: "Account Activation",
            html: `
            <div style="display:flex; justify-content: center; align-items: center; background-color: lightgrey; width: 100%; height:500px;">
                <h2>Activate Your Account</h2>
                <a style="background-color: lightblue; border-radius: 10px; padding: 10px;" href="${process.env.CLIENT_URL}/api/auth/activate/${token}">Click here</a>
                <p>${token}</p>
            </div>
            `,
        });
        return info;
    } catch (err) {
        return { error: true };
    }
};
