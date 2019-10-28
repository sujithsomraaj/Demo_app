const express = require('express');
const router = express.Router();
const Joi = require('joi');
const passport = require('passport');
const randomstring = require('randomstring');
const mailer = require('../misc/mailer');
const fs = require('fs');
const multer=require('multer');
const bcrypt = require('bcryptjs');
const nodemailer=require('nodemailer');
const config = require('../config/mailer');
var async = require("async");
const url=require('url');
var crypto = require("crypto");
const path=require('path');
const User = require('../models/user');
const KYCP = require('../models/pkyc');
const KYCB = require('../models/bkyc');
const AML = require('../models/aml');
const purchase=require('../models/purchase');
var isloggedIn = false;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null,'./public/uploads');
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' ) {
      cb(null, true);
  } else {
      // rejects storing a file
      req.fileValidationError = 'Only Image (.png or .jpeg ) file format Allowed !';
      return cb(null, false, new Error('Only Image (.png or .jpeg ) file format Allowed !'));
  }
}

const upload = multer({
  storage: storage,
  limits: {
      fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});
var id_proof,address_proof,photo_proof,regdoc,confirm;

const userSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  publicKey: Joi.string().required(),
  privateKey: Joi.string().required(),
  oss: Joi.string().required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(5),
  confirmationPassword: Joi.any().valid(Joi.ref('password')).required()
});

// Authorization 
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('error', 'Sorry, but you must be registered first!');
    res.redirect('/');
  }
};

const isNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    req.flash('error', 'Sorry, but you are already logged in!');
    res.redirect('/');
  } else {
    return next();
  }
};

router.route('/upload')
.post(upload.single('imageData'), (req, res, next) => {
 
  if(req.fileValidationError) 
  return res.send({
    error:req.fileValidationError
  })
  else{
  if(req.body.imageName==="id_proof")
   id_proof=req.file.path
   else if(req.body.imageName==="photo_proof")
   photo_proof=req.file.path
  else if(req.body.imageName==="address_proof")
   address_proof=req.file.path
   else if(req.body.imageName==="regdoc")
   regdoc=req.file.path
   else
   confirm=req.file.path
 }


});

router.route('/register')
  .get(isNotAuthenticated, (req, res) => {
   return res.send({success:"false"});
   
  })
  .post(async (req, res, next) => {
    try {
      const result = Joi.validate(req.body, userSchema);
      if (result.error) {
        console.log(result.error.message);
        return res.send({success:result.error.message});
      }

      // Checking if email is already taken
      const user = await User.findOne({ 'email': result.value.email });
      if (user) {
        return res.send({success:"Email is already in use"});
        
      }
      const token= Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      // Hash the password
      const hash = await User.hashPassword(result.value.password);
      result.value.uuid=token;
      // Generate secret token
      const secretToken = randomstring.generate();
     // console.log('secretToken', secretToken);

      // Save secret token to the DB
      result.value.secretToken = secretToken;

      // Flag account as inactive
      result.value.active = false;

      // Save user to DB
      delete result.value.confirmationPassword;
      result.value.password = hash;
      result.value.publicKey=req.body.publicKey;
      result.value.privateKey=req.body.privateKey;

var ua = req.headers['user-agent'];
if( /firefox/i.test(ua) )
 var br = 'firefox';
else if( /chrome/i.test(ua) )
br = 'chrome';
else if( /safari/i.test(ua) )
  br = 'safari';
else if( /msie/i.test(ua) )
  br = 'msie';
else
  br = 'unknown';
  result.value.browser=br;
  
result.value.os=req.body.oss;
var abc="https://investor.greyzdorf.io";

    result.value.ipAddr=req.ip.split(":").pop();
      const newUser = await new User(result.value); 
      console.log('newUser', newUser);
      await newUser.save();

      // Compose email
      const html = `<!DOCTYPE html><html><head> <title>Greyz BTR Coin</title> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta charset="utf-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <style>.btn{display: inline-block; *display: inline; *zoom: 1; padding: 4px 10px 4px; margin-bottom: 0; font-size: 13px; line-height: 18px; color: #333333; text-align: center; text-shadow: 0 1px 1px rgba(255, 255, 255, 0.75); vertical-align: middle; background-color: #f5f5f5;}.btn-large{padding: 9px 14px; font-size: 15px; line-height: normal; -webkit-border-radius: 5px; -moz-border-radius: 5px; border-radius: 5px; max-width:50%; margin-left:20%}.btn:hover{color: #333333; text-decoration: none; background-color: #ff3f3f; background-position: 0 -15px; -webkit-transition: background-position 0.1s linear; -moz-transition: background-position 0.1s linear; -ms-transition: background-position 0.1s linear; -o-transition: background-position 0.1s linear; transition: background-position 0.1s linear;}.btn-primary, .btn-primary:hover{text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25); color: #ffffff;}.btn-primary.active{color: rgba(255, 255, 255, 0.75);}.btn-primary{background-image: linear-gradient(224deg,#3c54a4 14%,#0f73ee 100%); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.5);}.btn-primary:hover, .btn-primary:active, .btn-primary.active, .btn-primary.disabled, .btn-primary[disabled]{filter: none; background-color: white; color: #3c54a4;}.btn-block{width: 100%; display: block;}.btn-rr{border-radius: 0.2em;}*{margin: 0; padding: 0; -webkit-box-sizing: border-box; -ms-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box;}a{text-decoration: none;}html{height: 100vh; width: 100%;}body{font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif; font-size: 3em; color: #333; background: #ee0979; /* fallback for old browsers */ background-image: -webkit-linear-gradient(to bottom right, rgba(243, 90, 70, 0.97), rgba(238, 9, 121, 0.97)); /* Chrome 10-25, Safari 5.1-6 */ background-image: linear-gradient(to bottom right, rgba(255, 106, 0, 0.97), rgba(238, 9, 121, 0.97)); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */ height: 100vh; width: 100%;}.main{color: #3c54a4; font-weight: bold;}p{font-size:18px; color:black; text-align: justify;}.main:hover{color: rgb(1, 193, 252);}.light{color: #fff;}.main-container{width: 75%; height: 100%; position: relative; margin: 2em auto; background-color: #eee;}.row{width: 100%; display: flex; flex-wrap: wrap;}.col-1{width: 8.33%;}.col-2{width: 16.67%;}.col-3{width: 25%;}.col-4{width: 33.33%;}.col-5{width: 41.67%}.col-6{width: 50%;}.col-7{width: 58.33%;}.col-8{width: 66.67%;}.col-9{width: 75%;}.col-10{width: 83.33%;}.col-11{width: 91.67%;}.col-12{width: 100%;}html{}.img-logo{max-width: 10%; height: auto;}.main-container h2{text-align: center;}#main-header{padding: 30px 0;}#modal{width: 90%; position: relative; padding: 1.5em; font-size: 1.7em; margin: 0 auto; background-color: #fff; border-radius: 10px;}#modal-header{padding: 30px 0; color:#3c54a4;}#modal-footer a{width: 80%; position: relative; margin: 30px auto;}#modal-body{padding: 2em; color:black;}a button{width: 100%; text-align: center; font-size: 14px;}#modal-footer{text-align: center; font-size:14px;}.highlight{font-weight: bolder; font-size: 30px;}@media only screen and (max-width:770px){#modal{width: 100%; font-size: 1.2em;}.main-container{width: 100%;}.img-logo{max-width: 20%;}#modal-body{padding: 0.5em;}#btn-large{max-width: 100%; margin-left:0;}}</style></head><body> <div class="main-container"> <div id="main-header"> <h2><img src="https://www.greyzdorf.io/image/favicon.png" class="img-logo"></h2> </div><div id="main-body"> <div id="modal"> <div id="modal-header"> <h2>Verify Your Account</h2> </div><hr> <div id="modal-body"> <p>Dear User,</p><br><p style="text-align:justify">You have successfully registered for greyzdorf BTR LLC, however to verify your account paste the token given below on the verification link</p><br><p>Verification Token : <b>${secretToken}</b></p><br><a href="https://investor.greyzdorf.io/verify"><button class='btn btn-large btn-primary btn-rr'>Verify Now</button></a> <br><br><p style="text-align:justify">If you haven't done this, please contact our Support Team by replying directly to this message or email us at technical@greyzdorf.io<br><br><p>Sincerely,<br>Tech Team,<br>Greyzdorf BTR LLC</p></div><br><br><hr> <p style="text-align:center;font-size:1em">&copy;Greyzdorf BTR LLC<br>3620 Piedmont RD NE, <br>Suite B-4122,Atlanta,Georgia - 30305</p></div></div></div></div></body></html>`
      // Send email
      await mailer.sendEmail('"Greyzdorf"<support@greyzdorf.io>', result.value.email, 'Please verify your email!', html);
      return res.send({success:"true"});
    } catch(error) {
      console.log(error);
      next(error);
    }
  });

  router.route('/kycpersonal')
  .post((requst,response)=>{
    const  fname =  requst.body.fname;
    const  lname =  requst.body.lname;
    const  date = requst.body.date;
    const   month = requst.body.month;
    const   year = requst.body.year;
    const   address= requst.body.address;
    const  city= requst.body.city;
    const  country= requst.body.country;
    const  postcode= requst.body.postcode;
    const  type_id= requst.body.type_id;
    const  gross_inc= requst.body.gross_inc;
    const  source= requst.body.source;
    const  prof= requst.body.prof;
    const type_address=requst.body.type_address;
    const token=requst.body.token;
    const newUser = new KYCP();
  
  
      newUser.fname = fname;
      newUser.lname = lname;
      newUser.date = date;
      newUser.month = month;
      newUser.year = year;
      newUser.address = address;
      newUser.city = city;
      newUser.prof = prof;
      newUser.country = country;
      newUser.postcode = postcode;
      newUser.type_id = type_id;
      newUser.id_proof = id_proof;
      newUser.gross_inc=gross_inc;
      newUser.source=source;
      newUser.photo_proof = photo_proof;
       newUser.address_proof = address_proof;
       newUser.type_address = type_address;
      if(!id_proof || !address_proof || !photo_proof)
      return response.send({error1:"Upload a valid image file to continue..."})
      newUser.kyc_type = "PERSONAL";
      newUser.save(async(err,user)=>{
          if(err){
              console.log(err);
            return  response.send({success:"false"});
          }
          const userr=await User.findOne({uuid : token});

          if(userr.is_kyc_done && userr.is_aml_done && !userr.is_kyc_verified)
          return response.send({error:"Already Your Response has been taken !",loc:`/demo/?token=${userr.uuid}`});
          else if(userr.is_kyc_done && userr.is_aml_done && userr.is_kyc_verified)
          return response.send({error:"Your KYC has been verified already !",loc:`/dashboard/?token=${userr.uuid}`});
          else if(userr.is_kyc_done && !userr.is_aml_done)
          return response.send({error:"You already completed KYC ! Please Complete the AML ",loc:`/aml/?token=${userr.uuid}`});
          else  {userr.is_kyc_done=true;await userr.save();}
         return response.send({success:"true",loc:`/aml/?token=${userr.uuid}`});
   });
  });
  

  router.route('/kycbuisness')
  .post((requst,response) => {
console.log(requst.body.token);

    const  fname =  requst.body.fname;
    const  lname =  requst.body.lname;
    const email=requst.body.email;
    const date=requst.body.date;
    const month=requst.body.month;
    const year=requst.body.year;
    const  orgname= requst.body.orgname;
    const  orgcou= requst.body.orgcou;
    const  orgnat= requst.body.orgnat;
    
    const orgnum=requst.body.orgnum;
    const token=requst.body.token;
  
      const newUser = new KYCB();
  
      newUser.fname = fname;
      newUser.lname = lname;
      newUser.email=email;
      newUser.date=date;
      newUser.year=year;
      newUser.month=month;
      newUser.orgname=orgname;
      newUser.orgcou=orgcou;
      newUser.orgnum=orgnum;
      newUser.orgnat=orgnat;
      newUser.document=regdoc;
     
  console.log(newUser);
      newUser.save(async (err,user)=>{
          if(err){
            return  response.send({success:"false"});
          }
          
          const userr=await User.findOne({uuid : token});
          if(userr.is_kyc_done && userr.is_aml_done && !userr.is_kyc_verified)
          return response.send({error:"Already Your Response has been taken !",loc:`/demo/?token=${userr.uuid}`});
          else if(userr.is_kyc_done && userr.is_aml_done && userr.is_kyc_verified)
          return response.send({error:"Your KYC has been verified already !",loc:`/dashboard/?token=${userr.uuid}`});
          else if(userr.is_kyc_done && !userr.is_aml_done)
          return response.send({error:"You already completed KYC ! Please Complete the AML ",loc:`/aml/?token=${userr.uuid}`});
          else  {userr.is_kyc_done=true;await userr.save();}
         return response.send({success:"true",loc:`/aml/?token=${userr.uuid}`});
         
   });
  });
  
  router.route('/purchase')
  .post(async(requst,response) => {
console.log(requst.body.token);

    const  acc_num =  requst.body.acc_num;
    const  acc_name =  requst.body.acc_name;
 
    const bank=requst.body.bank;
    const amount=requst.body.amount;
    const token=requst.body.token;
    const email=await User.findOne({uuid :token},{email:1,_id:0});
    if(!email)
    return res.send({'error':"Sorry , User not found"});
    else
    var mailid=email.email;
      const newUser = new purchase();
  
  
      newUser.acc_name = acc_name;
      newUser.acc_num = acc_num;
      newUser.bank = bank;
      newUser.amount = amount;
      newUser.email=mailid;
     
      newUser.confirm=confirm;
   
     
  console.log(newUser);
      newUser.save(async (err,user)=>{
          if(err){
              console.log(err);
            return  response.send({success:"false"});
          }
        
         
         return response.send({success:"true"});
   });
  });



  router.route('/aml')
  .post(async (requst,response) => {
console.log(requst.body.token);

    const  pep =  requst.body.pep;
    const  value =  requst.body.inv;
    const often=requst.body.oft;
    const source=requst.body.source;

    const token=requst.body.token;
  
      const newUser = new AML();
  
const email=await User.findOne({uuid :token},{email:1,_id:0});
if(!email)
return res.send({'error':"Sorry , User not found"});
else
var mailid=email.email;

      newUser.email=mailid;
      newUser.PeP = pep;
      newUser.Value = value;
      newUser.How_Often=often;
      newUser.Source=source;
  
  console.log(newUser);
      newUser.save(async (err,user)=>{
          if(err){
            
            return  response.send({success:"false"});
          }
        
          const userr=await User.findOne({uuid : token});
         
          if(userr.is_aml_done)
          return response.send({error:"Already Your Response has been taken !"});
          else {userr.is_aml_done=true;await userr.save();}
         
         return response.send({success:"true",uuid:userr.uuid});
     
   });
  });
  




router.route('/login')
.post(async function(req, res, next) {
  var email=req.body.email;
  passport.authenticate('local', function(err, user, info) {
    if (err) { console.log(err); }
    if (!user) {
    return res.send({error:"Authentication Error. Please Check your Email/Password"}); }
    req.logIn(user, async function(err) {
    if (err) { console.log(err); }
     const isdone=await User.findOne({email:email},{is_aml_done:1,is_kyc_done:1,is_kyc_verified:1,uuid:1,_id:0});
   //  console.log(isdone.uuid);
     isloggedIn=true;
     var ua = req.headers['user-agent'];
if( /firefox/i.test(ua) )
 var browser = 'Firefox';
else if( /chrome/i.test(ua) )
browser = 'Chrome';
else if( /safari/i.test(ua) )
  browser = 'Safari';
else if( /msie/i.test(ua) )
  browser = 'Msie';
else
  browser = 'Unknown';
     var ip=req.ip.split(':').pop();
     var os=req.body.os;
    // var abc="https://investor.greyzdorf.io/reset/?token="+token;
    var smtpTransport = nodemailer.createTransport({
      //host: "email-smtp.us-east-1.amazonaws.com",
      host:"smtp.sendgrid.net",
      port: 587,
    
        auth: {
          user: config.MAILGUN_USER,
          pass: config.MAILGUN_PASS
        },
        tls: {
          rejectUnauthorized: false
        }
    });
    var mailOptions = {
      to: email,
      from: '"Greyzdorf"<support@greyzdorf.io>',
      subject: 'Login Detected',
      html:`<!DOCTYPE html>
      <html><head>
       <title>Greyz BTR Coin</title> 
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta charset="utf-8"> 
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
         <style>.btn{display: inline-block; *display: inline; *zoom: 1; padding: 4px 10px 4px; margin-bottom: 0; font-size: 13px; line-height: 18px; color: #333333; text-align: center; text-shadow: 0 1px 1px rgba(255, 255, 255, 0.75); vertical-align: middle; background-color: #f5f5f5;}.btn-large{padding: 9px 14px; font-size: 15px; line-height: normal; -webkit-border-radius: 5px; -moz-border-radius: 5px; border-radius: 5px; max-width:50%; margin-left:20%}.btn:hover{color: #333333; text-decoration: none; background-color: #ff3f3f; background-position: 0 -15px; -webkit-transition: background-position 0.1s linear; -moz-transition: background-position 0.1s linear; -ms-transition: background-position 0.1s linear; -o-transition: background-position 0.1s linear; transition: background-position 0.1s linear;}.btn-primary, .btn-primary:hover{text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25); color: #ffffff;}.btn-primary.active{color: rgba(255, 255, 255, 0.75);}.btn-primary{background-image: linear-gradient(224deg,#3c54a4 14%,#0f73ee 100%); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.5);}.btn-primary:hover, .btn-primary:active, .btn-primary.active, .btn-primary.disabled, .btn-primary[disabled]{filter: none; background-color: white; color: #3c54a4;}.btn-block{width: 100%; display: block;}.btn-rr{border-radius: 0.2em;}*{margin: 0; padding: 0; -webkit-box-sizing: border-box; -ms-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box;}a{text-decoration: none;}html{height: 100vh; width: 100%;}body{font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif; font-size: 3em; color: #333; background: #ee0979; /* fallback for old browsers */ background-image: -webkit-linear-gradient(to bottom right, rgba(243, 90, 70, 0.97), rgba(238, 9, 121, 0.97)); /* Chrome 10-25, Safari 5.1-6 */ background-image: linear-gradient(to bottom right, rgba(255, 106, 0, 0.97), rgba(238, 9, 121, 0.97)); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */ height: 100vh; width: 100%;}.main{color: #3c54a4; font-weight: bold;}p{font-size:18px; color:black; text-align: justify;}.main:hover{color: rgb(1, 193, 252);}.light{color: #fff;}.main-container{width: 75%; height: 100%; position: relative; margin: 2em auto; background-color: #eee;}.row{width: 100%; display: flex; flex-wrap: wrap;}.col-1{width: 8.33%;}.col-2{width: 16.67%;}.col-3{width: 25%;}.col-4{width: 33.33%;}.col-5{width: 41.67%}.col-6{width: 50%;}.col-7{width: 58.33%;}.col-8{width: 66.67%;}.col-9{width: 75%;}.col-10{width: 83.33%;}.col-11{width: 91.67%;}.col-12{width: 100%;}html{}.img-logo{max-width: 10%; height: auto;}.main-container h2{text-align: center;}#main-header{padding: 30px 0;}#modal{width: 90%; position: relative; padding: 1.5em; font-size: 1.7em; margin: 0 auto; background-color: #fff; border-radius: 10px;}#modal-header{padding: 30px 0; color:#3c54a4;}#modal-footer a{width: 80%; position: relative; margin: 30px auto;}#modal-body{padding: 2em; color:black;}a button{width: 100%; text-align: center; font-size: 14px;}#modal-footer{text-align: center; font-size:14px;}.highlight{font-weight: bolder; font-size: 30px;}@media only screen and (max-width:770px){#modal{width: 100%; font-size: 1.2em;}.main-container{width: 100%;}.img-logo{max-width: 20%;}#modal-body{padding: 0.5em;}#btn-large{max-width: 100%; margin-left:0;}}</style></head>
         <body> <div class="main-container"> 
         <div id="main-header"> 
         <h2><img src="https://www.greyzdorf.io/image/favicon.png" class="img-logo"></h2> </div>
      <div id="main-body"> <div id="modal">
       <div id="modal-header"> 
       
       <h2>Successful Login</h2> </div><hr> <div id="modal-body"> 
       <p>Dear User,</p><br><p style="text-align:justify"> An attempt to login to your Greyzdorf Investor Portal was made from an unknown browser. Please confirm the following details are correct:</p><br>
       <p><b>IP:</b>${ip}<br>
        <p><b>OS:</b>${os}<br>
       <p><b>Browser:</b>${browser}<br><br>
      <p style="text-align:justify">If its not you,change your password immediately or please contact our Support Team by replying directly to this message or email us at technical@greyzdorf.io</p>
      <br><br><p>Sincerely,<br>Tech Team,<br>Greyzdorf BTR LLC</p></div></div><br><br><hr> <p style="text-align:center;font-size:1em">&copy;Greyzdorf BTR LLC<br>3620 Piedmont RD NE, <br>Suite B-4122,Atlanta,Georgia - 30305</p></div></div></div></div></body></html>`               
    };
     await smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
      //  req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
      });
     
     if(isdone.is_kyc_done && isdone.is_kyc_verified && isdone.is_aml_done)
      return res.send({success:"dashboard",uuid:isdone.uuid});
      else if(isdone.is_kyc_done && !isdone.is_aml_done)
      return res.send({success:"aml",uuid:isdone.uuid});
      else if(isdone.is_kyc_done && isdone.is_aml_done && !isdone.is_kyc_verified)
      return res.send({success:"demo",uuid:isdone.uuid});
      else
      return res.send({success:"kyc",uuid:isdone.uuid});

    });
  })(req, res, next);
});


  router.post('/forgot', function(req, res, next) {
    console.log('Hi');
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ email: req.body.token }, function(err, user) {
          if (!user) {
            return res.send({success:"No account with that email address exists."});
          }
  
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
          user.save(function(err) {
            console.log(user);
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        var smtpTransport = nodemailer.createTransport({
          //host: "email-smtp.us-east-1.amazonaws.com",
          host:"smtp.sendgrid.net",
          port: 587,
         //port: 587,
            //service : 'Gmail',
            auth: {
              user: config.MAILGUN_USER,
              pass: config.MAILGUN_PASS
            },
            tls: {
              rejectUnauthorized: false
            }
        });
       
        var abc="https://investor.greyzdorf.io/reset/?token="+token;
         var mailOptions = {
          to: user.email,
          from: '"Greyzdorf"<support@greyzdorf.io>',
          subject: 'Greyz Password Reset',
          html:`<!DOCTYPE html><html><head> <title>Greyz BTR Coin</title> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta charset="utf-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <style>.btn{display: inline-block; *display: inline; *zoom: 1; padding: 4px 10px 4px; margin-bottom: 0; font-size: 13px; line-height: 18px; color: #333333; text-align: center; text-shadow: 0 1px 1px rgba(255, 255, 255, 0.75); vertical-align: middle; background-color: #f5f5f5;}.btn-large{padding: 9px 14px; font-size: 15px; line-height: normal; -webkit-border-radius: 5px; -moz-border-radius: 5px; border-radius: 5px; max-width:50%; margin-left:20%}.btn:hover{color: #333333; text-decoration: none; background-color: #ff3f3f; background-position: 0 -15px; -webkit-transition: background-position 0.1s linear; -moz-transition: background-position 0.1s linear; -ms-transition: background-position 0.1s linear; -o-transition: background-position 0.1s linear; transition: background-position 0.1s linear;}.btn-primary, .btn-primary:hover{text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25); color: #ffffff;}.btn-primary.active{color: rgba(255, 255, 255, 0.75);}.btn-primary{background-image: linear-gradient(224deg,#3c54a4 14%,#0f73ee 100%); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.5);}.btn-primary:hover, .btn-primary:active, .btn-primary.active, .btn-primary.disabled, .btn-primary[disabled]{filter: none; background-color: white; color: #3c54a4;}.btn-block{width: 100%; display: block;}.btn-rr{border-radius: 0.2em;}*{margin: 0; padding: 0; -webkit-box-sizing: border-box; -ms-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box;}a{text-decoration: none;}html{height: 100vh; width: 100%;}body{font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif; font-size: 3em; color: #333; background: #ee0979; /* fallback for old browsers */ background-image: -webkit-linear-gradient(to bottom right, rgba(243, 90, 70, 0.97), rgba(238, 9, 121, 0.97)); /* Chrome 10-25, Safari 5.1-6 */ background-image: linear-gradient(to bottom right, rgba(255, 106, 0, 0.97), rgba(238, 9, 121, 0.97)); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */ height: 100vh; width: 100%;}.main{color: #3c54a4; font-weight: bold;}p{font-size:18px; color:black; text-align: justify;}.main:hover{color: rgb(1, 193, 252);}.light{color: #fff;}.main-container{width: 75%; height: 100%; position: relative; margin: 2em auto; background-color: #eee;}.row{width: 100%; display: flex; flex-wrap: wrap;}.col-1{width: 8.33%;}.col-2{width: 16.67%;}.col-3{width: 25%;}.col-4{width: 33.33%;}.col-5{width: 41.67%}.col-6{width: 50%;}.col-7{width: 58.33%;}.col-8{width: 66.67%;}.col-9{width: 75%;}.col-10{width: 83.33%;}.col-11{width: 91.67%;}.col-12{width: 100%;}html{}.img-logo{max-width: 10%; height: auto;}.main-container h2{text-align: center;}#main-header{padding: 30px 0;}#modal{width: 90%; position: relative; padding: 1.5em; font-size: 1.7em; margin: 0 auto; background-color: #fff; border-radius: 10px;}#modal-header{padding: 30px 0; color:#3c54a4;}#modal-footer a{width: 80%; position: relative; margin: 30px auto;}#modal-body{padding: 2em; color:black;}a button{width: 100%; text-align: center; font-size: 14px;}#modal-footer{text-align: center; font-size:14px;}.highlight{font-weight: bolder; font-size: 30px;}@media only screen and (max-width:770px){#modal{width: 100%; font-size: 1.2em;}.main-container{width: 100%;}.img-logo{max-width: 20%;}#modal-body{padding: 0.5em;}#btn-large{max-width: 100%; margin-left:0;}}</style></head><body> <div class="main-container"> <div id="main-header"> <h2><img src="https://www.greyzdorf.io/image/favicon.png" class="img-logo"></h2> </div><div id="main-body"> <div id="modal"> <div id="modal-header"> <h2>Reset Password</h2> </div><hr> <div id="modal-body"> <p>Dear User,</p><br><p style="text-align:justify"> You recently requested to reset your Greyzdorf Investor Portal account password.</p><br><a href="${abc}"><button class='btn btn-large btn-primary btn-rr'>Reset Now</button><br><br><p style="text-align:justify">To receive more help on this issue, please contact our Support Team by replying directly to this message or reach us at technical@greyzdorf.io<br><br><p>Sincerely,<br>Tech Team,<br>Greyzdorf BTR LLC</p></div><br><br><hr> <p style="text-align:center;font-size:0.7em">&copy;Greyzdorf BTR LLC<br>3620 Piedmont RD NE, <br>Suite B-4122,Atlanta,Georgia - 30305</p></div></div></div></div></body></html>`
           };
        smtpTransport.sendMail(mailOptions, function(err) {
          console.log('mail sent');
          req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
          return res.send({success:"true"});
        
        });
      }
    ], function(err) {
      if (err)  {
        console.log(err);
        return res.send({success:"true"});}
    });
  });
  
  
  router.route('/reset')
  .get((req,res)=>{
    res.redirect('/reset1');
  })
  .post(function(req, res) {
    
     console.log(req.body);
        User.findOne({ resetPasswordToken: req.body.token, resetPasswordExpires: { $gt: Date.now() } }, async function(err, user) {
          if (!user) {
            console.log( 'Password reset token is invalid or has expired.');
            return res.send({success:"Password reset token is invalid or has expired."});
          }
          if(req.body.new === req.body.confirm) {
            const pass= await User.hashPassword(req.body.new);
            console.log(pass);
            user.password=pass;
            console.log(user.password);
              user.resetPasswordToken = "undefined";
              user.resetPasswordExpires = '';
  
              await user.save();
              const html = `<!DOCTYPE html><html><head> <title>Greyz BTR Coin</title> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta charset="utf-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <style>.btn{display: inline-block; *display: inline; *zoom: 1; padding: 4px 10px 4px; margin-bottom: 0; font-size: 13px; line-height: 18px; color: #333333; text-align: center; text-shadow: 0 1px 1px rgba(255, 255, 255, 0.75); vertical-align: middle; background-color: #f5f5f5;}.btn-large{padding: 9px 14px; font-size: 15px; line-height: normal; -webkit-border-radius: 5px; -moz-border-radius: 5px; border-radius: 5px; max-width:50%; margin-left:20%}.btn:hover{color: #333333; text-decoration: none; background-color: #ff3f3f; background-position: 0 -15px; -webkit-transition: background-position 0.1s linear; -moz-transition: background-position 0.1s linear; -ms-transition: background-position 0.1s linear; -o-transition: background-position 0.1s linear; transition: background-position 0.1s linear;}.btn-primary, .btn-primary:hover{text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25); color: #ffffff;}.btn-primary.active{color: rgba(255, 255, 255, 0.75);}.btn-primary{background-image: linear-gradient(224deg,#3c54a4 14%,#0f73ee 100%); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.5);}.btn-primary:hover, .btn-primary:active, .btn-primary.active, .btn-primary.disabled, .btn-primary[disabled]{filter: none; background-color: white; color: #3c54a4;}.btn-block{width: 100%; display: block;}.btn-rr{border-radius: 0.2em;}*{margin: 0; padding: 0; -webkit-box-sizing: border-box; -ms-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box;}a{text-decoration: none;}html{height: 100vh; width: 100%;}body{font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif; font-size: 3em; color: #333; background: #ee0979; /* fallback for old browsers */ background-image: -webkit-linear-gradient(to bottom right, rgba(243, 90, 70, 0.97), rgba(238, 9, 121, 0.97)); /* Chrome 10-25, Safari 5.1-6 */ background-image: linear-gradient(to bottom right, rgba(255, 106, 0, 0.97), rgba(238, 9, 121, 0.97)); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */ height: 100vh; width: 100%;}.main{color: #3c54a4; font-weight: bold;}p{font-size:18px; color:black; text-align: justify;}.main:hover{color: rgb(1, 193, 252);}.light{color: #fff;}.main-container{width: 75%; height: 100%; position: relative; margin: 2em auto; background-color: #eee;}.row{width: 100%; display: flex; flex-wrap: wrap;}.col-1{width: 8.33%;}.col-2{width: 16.67%;}.col-3{width: 25%;}.col-4{width: 33.33%;}.col-5{width: 41.67%}.col-6{width: 50%;}.col-7{width: 58.33%;}.col-8{width: 66.67%;}.col-9{width: 75%;}.col-10{width: 83.33%;}.col-11{width: 91.67%;}.col-12{width: 100%;}html{}.img-logo{max-width: 10%; height: auto;}.main-container h2{text-align: center;}#main-header{padding: 30px 0;}#modal{width: 90%; position: relative; padding: 1.5em; font-size: 1.7em; margin: 0 auto; background-color: #fff; border-radius: 10px;}#modal-header{padding: 30px 0; color:#3c54a4;}#modal-footer a{width: 80%; position: relative; margin: 30px auto;}#modal-body{padding: 2em; color:black;}a button{width: 100%; text-align: center; font-size: 14px;}#modal-footer{text-align: center; font-size:14px;}.highlight{font-weight: bolder; font-size: 30px;}@media only screen and (max-width:770px){#modal{width: 100%; font-size: 1.2em;}.main-container{width: 100%;}.img-logo{max-width: 20%;}#modal-body{padding: 0.5em;}#btn-large{max-width: 100%; margin-left:0;}}</style></head><body> <div class="main-container"> <div id="main-header"> <h2><img src="https://www.greyzdorf.io/image/favicon.png" class="img-logo"></h2> </div><div id="main-body"> <div id="modal"> <div id="modal-header"> <h2>Reset Successful</h2> </div><hr> <div id="modal-body"> <p>Dear User,</p><br><p style="text-align:justify">You have successfully reset the password for your Greyzdorf BTR LLC investor portal</p><br><br><p style="text-align:justify">If you haven't done this, please contact our Support Team by replying directly to this message.</p></div><br><br><hr> <p style="text-align:center;font-size:0.5em">&copy;Greyzdorf BTR LLC</p></div></div></div></div></body></html>`
              // Send email
          await mailer.sendEmail('"Greyzdorf"<support@greyzdorf.io>', user.email, 'Confirmation email!', html);
      console.log("mail sent !");
             
              return res.send({success:"true"});
            
          } else {
              console.log(err);
              return res.send({success:"Passwords do not match."});
          }
    });
    });
      
      
     
  
router.route('/verify')
  .get( (req, res) => {
    return res.redirect('/verify');
  })
  .post(async (req, res, next) => {
    try {
      const { token } = req.body;
      console.log(req.body);
      // Find account with matching secret token
      const user = await User.findOne({ 'secretToken': token });
      if (!user) {
      
        return res.send({success:"No user Found."});
        
      }

      user.active = true;
      user.secretToken = '';
      
      await user.save();

    
      return res.send({success:"Success"});
    } catch(error) {
      next(error);
    }
  })
 
  router.route('/fetchkey')
  .post(async(req, res) => {
   // console.log(req.body.token);
   const user=await User.findOne({uuid:req.body.token},{publicKey:1,privateKey:1,_id:0});
   //console.log(user.privateKey);
   if(!user) return res.send({error:"User not found"}); 
    return res.send({privateKey:user.privateKey,publicKey:user.publicKey});  
  });
  

  router.route('/logout')
  .post((req, res) => {
    req.logout();
    isloggedIn=false;
    return res.send({success:true});  
  });

  router.route('/validate')
  .post((req, res) => {
    if(isloggedIn===true){
    return res.send({success:true});}
    else
    return res.send({success:false})
    }
  );

  
  router.route('/transaction_alert')
  .post(async (req, res)=> {
     console.log(req.body);
     const user=await User.findOne({uuid:req.body.token},{email:1,_id:0});
     var to = req.body.address;
     var amount = req.body.amount;
     const html = `<!DOCTYPE html><html><head> <title>Greyz BTR Coin</title> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta charset="utf-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <style>.btn{display: inline-block; *display: inline; *zoom: 1; padding: 4px 10px 4px; margin-bottom: 0; font-size: 13px; line-height: 18px; color: #333333; text-align: center; text-shadow: 0 1px 1px rgba(255, 255, 255, 0.75); vertical-align: middle; background-color: #f5f5f5;}.btn-large{padding: 9px 14px; font-size: 15px; line-height: normal; -webkit-border-radius: 5px; -moz-border-radius: 5px; border-radius: 5px; max-width:50%; margin-left:20%}.btn:hover{color: #333333; text-decoration: none; background-color: #ff3f3f; background-position: 0 -15px; -webkit-transition: background-position 0.1s linear; -moz-transition: background-position 0.1s linear; -ms-transition: background-position 0.1s linear; -o-transition: background-position 0.1s linear; transition: background-position 0.1s linear;}.btn-primary, .btn-primary:hover{text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25); color: #ffffff;}.btn-primary.active{color: rgba(255, 255, 255, 0.75);}.btn-primary{background-image: linear-gradient(224deg,#3c54a4 14%,#0f73ee 100%); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.5);}.btn-primary:hover, .btn-primary:active, .btn-primary.active, .btn-primary.disabled, .btn-primary[disabled]{filter: none; background-color: white; color: #3c54a4;}.btn-block{width: 100%; display: block;}.btn-rr{border-radius: 0.2em;}*{margin: 0; padding: 0; -webkit-box-sizing: border-box; -ms-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box;}a{text-decoration: none;}html{height: 100vh; width: 100%;}body{font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif; font-size: 3em; color: #333; background: #ee0979; /* fallback for old browsers */ background-image: -webkit-linear-gradient(to bottom right, rgba(243, 90, 70, 0.97), rgba(238, 9, 121, 0.97)); /* Chrome 10-25, Safari 5.1-6 */ background-image: linear-gradient(to bottom right, rgba(255, 106, 0, 0.97), rgba(238, 9, 121, 0.97)); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */ height: 100vh; width: 100%;}.main{color: #3c54a4; font-weight: bold;}p{font-size:18px; color:black; text-align: justify;}.main:hover{color: rgb(1, 193, 252);}.light{color: #fff;}.main-container{width: 75%; height: 100%; position: relative; margin: 2em auto; background-color: #eee;}.row{width: 100%; display: flex; flex-wrap: wrap;}.col-1{width: 8.33%;}.col-2{width: 16.67%;}.col-3{width: 25%;}.col-4{width: 33.33%;}.col-5{width: 41.67%}.col-6{width: 50%;}.col-7{width: 58.33%;}.col-8{width: 66.67%;}.col-9{width: 75%;}.col-10{width: 83.33%;}.col-11{width: 91.67%;}.col-12{width: 100%;}html{}.img-logo{max-width: 10%; height: auto;}.main-container h2{text-align: center;}#main-header{padding: 30px 0;}#modal{width: 90%; position: relative; padding: 1.5em; font-size: 1.7em; margin: 0 auto; background-color: #fff; border-radius: 10px;}#modal-header{padding: 30px 0; color:#3c54a4;}#modal-footer a{width: 80%; position: relative; margin: 30px auto;}#modal-body{padding: 2em; color:black;}a button{width: 100%; text-align: center; font-size: 14px;}#modal-footer{text-align: center; font-size:14px;}.highlight{font-weight: bolder; font-size: 30px;}@media only screen and (max-width:770px){#modal{width: 100%; font-size: 1.2em;}.main-container{width: 100%;}.img-logo{max-width: 20%;}#modal-body{padding: 0em;}#btn-large{max-width: 100%; margin-left:0;}}</style></head><body> <div class="main-container"> <div id="main-header"> <h2><img src="https://www.greyzdorf.io/image/favicon.png" class="img-logo"></h2> </div><div id="main-body"> <div id="modal"> <div id="modal-header"> <h2>Transaction Successful</h2> </div><hr> <div id="modal-body"> <p>Dear User,</p><br><p style="text-align:justify">Your transaction have been submitted successfully. Kindly verify the following details. As this transaction is already confirmed on the blockchain it cannot be reverted or stopped.</p><br><p><b>Receiver:</b>${to} <br> <b>Amount:</b>${amount} </p><br><p style="text-align:justify">If you haven't done this transaction, please contact our Support Team by replying directly to this message or contact us at technical@greyzdorf.io<br><br><p>Sincerely,<br>Tech Team,<br>Greyzdorf BTR LLC</p></div><br><br><hr> <p style="text-align:center;font-size:0.5em">&copy;Greyzdorf BTR LLC<br>3620 Piedmont RD NE, <br>Suite B-4122,Atlanta,Georgia - 30305</p></div></div></div></div></body></html>`
              // Send email
     mailer.sendEmail('"Greyzdorf"<support@greyzdorf.io>', user.email, 'Transaction Alert!', html);
    });
      
  
  


module.exports = router;