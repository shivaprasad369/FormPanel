import express from 'express';
import * as dotenv from 'dotenv';
import Post from '../mongoose/model/Data.js';
import axios from 'axios';
import crypto from 'crypto'
import CryptoJS from 'crypto-js';

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

router.route('/payments').post(async (req, res) => {
  try {
  
    const {Name,Email,Phone}=req.body
    console.log(Name)
    // res.status(201).json({ success: true, data: newPost });
    const merchantTransactionId = 'T' + Date.now();

    const merchantUserId = 'MUID' + Date.now();
    const data = {
      merchantId: "M225WZIY10UMV",
      merchantTransactionId: merchantTransactionId,
      merchantUserId: merchantUserId,
      name: Name,
      email:Email,
      amount: 399 * 100, // Amount in paise
      // redirectUrl: `https://formpanel.onrender.com/api/v1/status/${merchantTransactionId}`,
      redirectUrl:'https://learnersitacademy.com/',
      redirectMode: "POST",
      mobileNumber: Phone,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };
    const newPost = await Post.create(
     {
      Name:req.body.Name,
      Phone:req.body.Phone,
      Email:req.body.Email,
      Course:merchantTransactionId,
      Interst:req.body.Interst
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
    const {Name,Email,Phone}=req.body
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
      name: Name,
      amount: 399* 100,
      redirectUrl: `http://localhost:8080/api/v1/status/${generatedTranscId()}`,
      // redirectUrl:'http://localhost:3000',
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
  // const MID= "PGTESTPAYUAT86"
  const keyIndex=1;
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
  axios.request(options).then((res)=>{
    console.log(res.data)
  
      // res.status(201).json({ success: true, data: res.data });
         
   
   const post = Post.findOneAndUpdate({})
  //  console.log(post)
   const data=post.Course;
   console.log(data)
    if(res.data.success===true)
      {
        console.log(Post.findOneAndUpdate(filter, { "Status" : res.data.data.state } ))
    //  console.log(Post.findOne({Course:MTID}))
        const url="http://localhost:3000";
        const string=JSON.stringify(res)
        return res.send(string.data)
      // return res.redirect(200,url)
      }
      else{
        return res.status(500).json({ msg: "Payment Failed", status: "error", error: res.data.error });
      }
    // console.log(res.data.data.instrumentResponse.redirectInfo.url);
    // return res.status(200).send(res.data.data.instrumentResponse.redirectInfo.url)
  })
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