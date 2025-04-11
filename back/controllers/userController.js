

// createUser
//GOING TO RECIEVE A RECAPTCHA TOKEN AND NEED TO VALIDATE IT
// DO THIS FIRST BECAUSE IF ITS NOT A HUMAN NO POINT IN CHECKING THE OTHER DATA

// const isHuman = await validateHuman(FormData.token)
// if (!isHuman) {
//     res.status(400)
//     res.json({ errors: ["Please, you're not fooling us, bot!"]})
//     return
// }

//MAYBE THIS GOES IN SERVICES
// async function validateHuman(token) {
//     const secret = process.env.RECAPTCHA_SECRET_KEY
//     const response = await fetch(
//         `https://www.google.com/recaptcha/api/siteverfiy?secret=${secret}&response=${token}`,
//         {method: 'POST'},
//     )
//     const data = await response.json()
//     return data.success
// }