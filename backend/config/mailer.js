const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    host: process.env.BREVO_HOST,
    port : Number(process.env.BREVO_PORT),
    secure: false,
    auth:{
        user:process.env.BREVO_USER,
        pass:process.env.BREVO_PASS
    }
})

const sendMail = async(to , subject, html)=>{
    const mailOptions = {
        from: process.env.MAIL_FROM,
        to:to,
        subject:subject,
        html:html
    };

    const response = await transporter.sendMail(mailOptions);
    console.log("response",response);
    return response;
}

module.exports= sendMail;