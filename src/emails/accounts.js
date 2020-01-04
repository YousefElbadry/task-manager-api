const sgMail = require('@sendgrid/mail');


sgMail.setApiKey(process.env.SENGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'yousef777m@gmail.com',
        subject: 'Welcome to Your Task Manager',
        text: `Welcome to the App, ${name}. Let me know how you get along with the app.`
    })
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'yousef777m@gmail.com',
        subject: 'You\'ll be missed',
        text: `Hi ${name},Can you tell us what was the reason for leaving the application \nSo we can make it better the next time you join us ;)`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}