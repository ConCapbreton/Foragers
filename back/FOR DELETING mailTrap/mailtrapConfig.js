const { MailtrapClient } = require("mailtrap")
const dotenv = require('dotenv');
dotenv.config();


const mailtrapClient = new MailtrapClient({ 
    token: process.env.MAILTRAP_TOKEN,
    //FOR PROD
    //endpoint: process.env.MAILTRAP_ENDPOINT,
})

const sender = {
    //HAS TO BE THE VALID DOMAIN FROM WHERE THE EMAIL IS SENT
    email: "hello@example.com",
    name: "Mailtrap Test",
}

module.exports = {mailtrapClient, sender}
