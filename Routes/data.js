import express from 'express';
import * as dotenv from 'dotenv';
import Post from '../mongoose/model/Data.js';
import axios from 'axios';
import crypto from 'crypto'
import CryptoJS from 'crypto-js';
import Status from '../mongoose/model/Status.js'

// import sha256 from 'sha256';

// import sha256 from 'sha256';
dotenv.config();
const router = express.Router();
// router.route('/').get((req,res)=>{
//     res.send("hello world")
// })
const mid='M225WZIY10UMV'
router.route('/').get(async (req, res) => {
    const id = req.params.id;
  try {
    const posts = await Post.find({});
    res.status(200).json({ success: true, data: posts });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Fetching posts failed, please try again' });
  }
});
router.route('/statu').get(async (req, res) => {
  const id = req.params.id;
try {
  const posts = await Status.find({});
  res.status(200).json({ success: true, data: posts });
} catch (err) {
  res.status(500).json({ success: false, message: 'Fetching posts failed, please try again' });
}
});

router.route('/payments').post(async (req, res) => {
  try {
  
    const {name,email,phone,address,price,course}=req.body
    console.log(name)
    // res.status(201).json({ success: true, data: newPost });
    const merchantTransactionId = 'T' + Date.now();

    const merchantUserId = 'MUID' + Date.now();
    const data = {
      merchantId: "M225WZIY10UMV",
      merchantTransactionId: merchantTransactionId,
      merchantUserId: merchantUserId,
      name: name,
      email:email,
      amount: 100 * price, // Amount in paise
      redirectUrl: `https://formpanel-1.onrender.com/api/v1/status/${merchantTransactionId}`,
      // redirectUrl:'https://learnersitacademy.com/',
      
      redirectMode: "POST",
      mobileNumber: phone,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };
    const newPost = await Post.create(
     {
      Name:name,
      Phone:phone,
      Email:email,
      TId:merchantTransactionId,
      Address:address,
    course:course
     }
    );
    const payload = JSON.stringify(data);
    const payloadMain = Buffer.from(payload).toString('base64');

    const key ="a1af0450-4fce-4c51-bded-29c7c5affd8e";
    const keyIndex = 1;
    const string = payloadMain + "/pg/v1/pay" + key;
    const hash = crypto.createHash('sha256').update(string).digest('hex');
    // hash.update(string);
    const sha256 = hash;
    const checksum =`${sha256}###${keyIndex}`;
    console.log(payloadMain)
    console.log(checksum)
// const check=CryptoJS.SHA256(payloadMain + "/pg/v1/pay" + key) + '###' + keyIndex;
    const prod_url = 'https://api.phonepe.com/apis/hermes/pg/v1/pay';

    const options = {
      method: 'POST',
      url: prod_url,
      headers: {
        accept: 'application/json',
        // 'Authorization':`${mid}`,
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
      },
      data: {
        request: payloadMain
      }
    };

    axios.request(options)
      .then(response => {
        if (response.status === 200) {
          const paymentResponse = response.data;
          if (paymentResponse.error) {
            console.error("Payment API Error:", paymentResponse.error);
            res.status(500).json({ msg: "Payment Failed", status: "error", error: paymentResponse.error });
          } else {
            res.status(201).send({
              msg: "Payment done",
              status: "success",
              data: paymentResponse,
            });
            console.log(paymentResponse.data);
            // res.status(201).json({ success: true, data: paymentResponse.data });
          }
        } else {
          console.error("Payment API Error:", response.status);
          res.status(500).json({ msg: "Payment Failed", status: "error", error: response.status });
        }
      })
      .catch(error => {
        console.error("Payment API Error:", error.message);
        res.status(500).json({ msg: "Payment Failed", status: "error", error: error });
      });
  } catch (e) {
    console.error("Internal Server Error:", e.message);
    res.status(500).json({ msg: "Internal Server Error", status: "error", error: e.message });
  }
});





router.post("/payment", async (req, res) => {
  // console.log(req.body);

  try {
    const {name,email,subject,message}=req.body
    // const price = parseFloat(req.body.price);
    // const { user_id, phone, name, email, tempId } = req.body;

    // Set the values to variables for later use

    // this.user = user_id;
    
    // this.tempId = tempId;
    // this.price = price;

    const data = {
      merchantId: "PGTESTPAYUAT86",
      merchantTransactionId: generatedTranscId(),
      merchantUserId: 'MUID' + Date.now(),
      name: name,
      amount: 100*req.body.price,
      redirectUrl: `http://localhost:8080/api/v1/status/${generatedTranscId()}`,
      // redirectUrl:'http://localhost:3000/',
      redirectMode: "POST",
      mobileNumber:'9380309188',
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    const payload = JSON.stringify(data);
    const payloadMain = Buffer.from(payload).toString("base64");

    const key = "96434309-7796-489d-8924-ab56988a6076";
    const keyIndex = 1;
    const string = payloadMain + "/pg/v1/pay" + key;
    const sha256 = CryptoJS.SHA256(string).toString();
    const checksum = sha256 + "###" + keyIndex;
    // const payloadMain=Buffer.from(JSON.stringify(data),'utf8').toString('base64')
;
    // const xVarify=sha256(payloadMain+'/pg/v1/pay'+'a1af0450-4fce-4c51-bded-29c7c5affd8e')+'###'+keyIndex;
    // const string=payloadMain+'/pg/v1/pay'+'a1af0450-4fce-4c51-bded-29c7c5affd8e';
    // const sha256=crypto.createHash('sha256').update(string).digest('hex')
    // const checkSum=sha256+'###'+keyIndex;
    const prod_URL = "https://api-preprod.phonepe.com/apis/hermes/pg/v1/pay";
    const requestData = {
      method: "POST",
      url: prod_URL,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
      },
      data: {
        request: payloadMain,
      },
    };

    axios.request(requestData)
     .then(async function (response) {
        const phonePeTransactionId = response.data.transactionId;
        res.status(201).send({
          msg: "payment done",
          status: "success",
          data: response.data,
          phonePeTransactionId: phonePeTransactionId,
        });
        console.log("Payment API Response:", response.data);
        console.log(response.data.data.instrumentResponse.redirectInfo.url);
      })
     .catch(function (error) {
        console.error("Payment API Error:", error.message);
        res.status(500).json({ msg: "Payment Failed", status: "error", error: error.message });
      });
  } catch (e) {
    console.error("Internal Server Error:", e.message);
    res.status(500).json({ msg: error, status: "error", error: e.message });
  }
});

// Function to generate a unique transaction ID
function generatedTranscId() {
  return 'T' + Date.now();
}
router.route('/status/:transactionId').post(async (req, res) => {
try{

  const MTID=req.params.transactionId;
  const MId="M225WZIY10UMV";
  // const MId="PGTESTPAYUAT86";
  const keyIndex=1;
  var message,id;

  const string=`/pg/v1/status/${MId}/${MTID}`+"a1af0450-4fce-4c51-bded-29c7c5affd8e";

  // const string=`/pg/v1/status/${MId}/${MTID}`+"96434309-7796-489d-8924-ab56988a6076";
  const sha256=crypto.createHash('sha256').update(string).digest('hex')
  const checkSum=sha256+'###'+keyIndex;
  const prod_url=`https://api.phonepe.com/apis/hermes/pg/v1/status/${MId}/${MTID}`
  // const prod_url=`https://api-preprod.phonepe.com/apis/hermes/pg/v1/status/${MId}/${MTID}`

  
  const options = {
    method:'GET',
    url:prod_url,
    headers:{
      accept:'application/json',
      'Content-Type':'application/json',
      'X-VERIFY':checkSum,
      'X-MERCHANT-ID':`${MId}`
    },
   
  }
  const filter={'Course':MTID}
  const response=await axios.request(options)
  console.log(response.data.success)

  if(response.data.success===true){
   const data= await Post.findOne({TId:MTID})
   console.log(data)
    // collection.find({ age: { $gt: 25 } }).toArray(function(err, docs) {
    //   console.log(docs);
    // });
 await Status.create({
      TId: MTID,
      Status: response.data.success,
      Message:response.data.message

    })
  console.log(response.data)
  //  res.send({
  //   status: response.data.success,
  //   message: response.data.message,
  //   data: response.data.data,
  //   transactionId: response.data.data.transactionId,
  //   // url: "http://localhost:3000",
  //   // message: message,
    
  //  })
 return res.redirect('http://localhost:3000/success')
    // res.send({
     
    //   status: "success",
     
    // })
  }
  else{
    // const datas= await Post.findOne({TId:MTID})
    // console.log(datas)
    const data=await Status.create({
      TId: MTID,
      Status: response.data.success,
      Message:response.data.message

    })
    return res.redirect('http://localhost:3000/fail')
  }
  // .then((res)=>{
  //   console.log(res.data)
  
  //     // res.status(201).json({ success: true, data: res.data });
     
   
  //  const post = Post.findOneAndUpdate({})
  // //  console.log(post)
  //  const data=post.Course;
  //  console.log(data)
  //   if(res.data.success===true)
  //     {
  //       console.log(Post.findOneAndUpdate(filter, { "Status" : res.data.data.state } ))
  //   //  console.log(Post.findOne({Course:MTID}))
  //       const url="http://localhost:3000";
  //       console.log(res.data.message)
  //       message=res.data.message;
  //       id=res.data.data.transactionId;
     
  //       // const string=JSON.stringify(res)
  //       // return res.send(string.data)
  //     // return res.redirect(200,url)
  //     }
  //     else{
  //       return res.status(500).json({ msg: "Payment Failed", status: "error", error: res.data.error });
  //     }
  //   // console.log(res.data.data.instrumentResponse.redirectInfo.url);
  //   // return res.status(200).send(res.data.data.instrumentResponse.redirectInfo.url)
  // })
}
 catch (error) {
  console.error("Status API Error:", error.message);
  console.error("Status API Error Response:", error.response.data);
  res.status(500).json({ msg: "Error checking payment status", status: "error", error: error.message });
}

});
router.route('/').post(async (req, res) => {

    // const {From,TId,To,PickUp,ReturnAt,PickUpAt,Type } = req.body;
    

    const newPost = await Post.create(
      req.body
    );
   if(newPost){
    res.status(201).send({
      msg: "Post Created",
      status: "success",
      data: newPost,
    });
   }

 
});

export default router;