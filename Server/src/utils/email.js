const nodemailer = require('nodemailer')

const sendEmail = async (options) => {
    // 1) Create a transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    })

    // 2) Define the email options
    const mailOptions = {
        from: 'Lyeng Chiev <Lyeng@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: `
            <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background-color: #f2f2f2;">
                <div style="padding: 20px; background-color: #f8f8f8; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                    <img src="https://images-platform.99static.com/ROc_T-C-z7AXEf4L-HO8DpIy7Jo=/0x0:1086x1086/500x500/top/smart/99designs-contests-attachments/72/72063/attachment_72063237" alt="Your Logo" style="max-width: 100%; height: auto; margin-bottom: 20px;">
                    <h2 style="color: #333;">${options.subject}</h2>
                    <p>${options.message}</p>
                    <a href="${options.url}" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 20px;">Confirm Email</a>        <p>Click the "Confirm Email" button above or the link to verify your email address. If you have any questions, please contact our support team.</p>
                    <p>Best regards,<br>TECT TITIAN TEAM</p>
                </div>
            </div>
        `,
    }

    // 3) Actually send the email
    await transporter.sendMail(mailOptions)
}

module.exports = sendEmail
