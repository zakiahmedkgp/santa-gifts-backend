
const cors = require('cors');
const nodemailer = require('nodemailer');
const express = require('express')
const app = express()
 
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/sendEmail', cors(), async (req, res)=>{
    console.log("sending email.....");
    console.log(req.body);

    if(req.body.length > 0){
        await sendEmail(req.body).catch((error)=> {
            console.log(error);
        });

        console.log("emails sent!");
        res.status(200).json("Successfully sent emails!");
    } else{
        console.log("No greeting from kids");
        res.status(200).json("No greeting from kids -_- ");
    }
    
    
    
});

async function sendEmail(ctx) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();
  
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "boris.prosacco@ethereal.email", // generated ethereal user
        pass: "YmZpJkds2r3tCQ71WQ", // generated ethereal password
      },
    });
    
    for(let i = 0; i < ctx.length; i++){
        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: 'do_not_reply@northpole.com', // sender address
            to: "santa@northpole.com", // list of receivers
            subject: `Greetings to Santa from ${ctx[i].username}`, // Subject line
            text: "Please accept my greetings", // plain text body
            html: `<b>please send gifts to ${ctx[i].address}</b>`, // html body

        });

        console.log("Message sent: %s", info.messageId);


        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
    
}
 
app.listen(8080, () => {
  console.log('Example app listening on port 8080!')
})