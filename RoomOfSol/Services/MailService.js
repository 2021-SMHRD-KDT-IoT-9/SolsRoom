const nodeMailer = require('nodemailer');
const mailConfig = require('../db/mailConfig');

async function SendEmail(toEmail)
{
    let transporter;
    let mailOptions;

    transporter = nodeMailer.createTransport(
        {
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth:
            {
                user: mailConfig.email,
                pass: mailConfig.password
            }
        });

    mailOptions =
    {
        from: `facilityManager`,
        to: toEmail,
        subject: `RoomOfSol 고장접수`,
        html: `<h2>솔의 룸에서 안내드립니다</h2><br>
            <p>담당 흡연부스에 대한 고장접수가 요청되었습니다.</p>
            <p>신속하게 확인하고 해결해주시기 바랍니다</p>`
    }
   
    try
    {
        const info = transporter.sendMail(mailOptions);
        return true;   
    }
    catch(err)
    {
        console.log(err)
        return false;
    }
}

module.exports =
{
    SendEmail
}