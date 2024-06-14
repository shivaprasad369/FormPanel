import express from 'express';
import * as dotenv from 'dotenv';
import Post from '../mongoose/model/Data.js';
import axios from 'axios';
import crypto from 'crypto'
import { request } from 'http';
import sha256 from 'sha256';
dotenv.config();
const router = express.Router();
// router.route('/').get((req,res)=>{
//     res.send("hello world")
// })
router.route('/').get(async (req, res) => {
    const id = req.params.id;
  try {
    const posts = await Post.find({});
    res.status(200).json({ success: true, data: posts });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Fetching posts failed, please try again' });
  }
});

router.route('/payment').post(async (req, res) => {
  const MUID='MUID'+Date.now();
  const transactionId='T'+Date.now()
 const data= {
    merchantId: "M225WZIY10UMV",
    merchantTransactionId: 'T'+Date.now(),
    merchantUserId:'MUID'+Date.now(),
    amount: 200,
    name:"shivu",
    // email:"Shivu369sapare@gmail.com",
    redirectUrl: `http://localhost:8080/api/v1/status/${'T'+Date.now()}`,
     redirectMode:'POST',
    mobileNumber: "9380309188",
  paymentInstrument : {
      type: "PAY_PAGE",
      
    }
  }
  const payload=JSON.stringify(data);
  const payloadMain=Buffer.from(JSON.stringify(data),'utf8').toString('base64')
  const keyIndex=1;
  const xVarify=sha256(payloadMain+'/pg/v1/pay'+'a1af0450-4fce-4c51-bded-29c7c5affd8e')+'###'+keyIndex;
  // const string=payloadMain+'/pg/v1/pay'+'a1af0450-4fce-4c51-bded-29c7c5affd8e';
  // const sha256=crypto.createHash('sha256').update(string).digest('hex')
  // const checkSum=sha256+'###'+keyIndex;
  const prod_url=`https://api.phonepe.com/apis/hermes/pg/v1/pay`
  // const options = {
  //   method:'POST',
  //   url:prod_url,
  //   headers:{
  //     accept:'application/json',
  //     'Content-Type':'application/json',
  //     'X-VERIFY':checkSum,
  //   },
  //   data:{
  //     request:payloadMain
  //   }
  // }

  // axios.request(options).then((res)=>{
  //   console.log(res.data.data.instrumentResponse.redirectInfo.url);
  //   // return res.status(200).send(res.data.data.instrumentResponse.redirectInfo.url)
  // })
  const options = {
    method:'post',
    url:prod_url,
    headers:{
      accept:'application/json',
      'Content-Type':'application/json',
      'X-VERIFY':xVarify,
    },
    data:{
      request:payloadMain
    }
  };
  axios
    .request(options)
        .then(function (response) {
        // console.log(response.data);
        console.log(response.data.data.instrumentResponse.redirectInfo.url);
    })
    .catch(function (error) {
      console.error(error);
    });
})


router.route('/status/:transactionId').post(async (req, res) => {
  const MTID=res.req.body.transactionId;
  const MId=res.req.body.marchantId;
  const keyIndex=1;
  const string=`/pg/v1/status/${MId}/${MTID}`+'a1af0450-4fce-4c51-bded-29c7c5affd8e';
  const sha256=crypto.createHash('sha256').update(string).digest('hex')
  const checkSum=sha256+'###'+keyIndex;
  const prod_url=`https://api.phonepe.com/apis/hermes/pg/v1/status/${MId}/${MTID}`
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
  axios.request(options).then((res)=>{
    if(res.data.success===true)
      {
        const url='http://localhost:3001';
        return res.redirect(url)
      }
    // console.log(res.data.data.instrumentResponse.redirectInfo.url);
    // return res.status(200).send(res.data.data.instrumentResponse.redirectInfo.url)
  })
});
router.route('/').post(async (req, res) => {
  try {
    // const {From,TId,To,PickUp,ReturnAt,PickUpAt,Type } = req.body;
    

    const newPost = await Post.create(
      req.body
    );
    const MUID='MUID'+Date.now();
    const transactionId='T'+Date.now()
   const data= {
      "merchantId": "	PGTESTPAYUAT",
      "merchantTransactionId": transactionId,
      "merchantUserId": MUID,
      "amount": 1,
      "name":'shivu',
      "email":'shivu@gmail.com',
      "redirectUrl": `http://localhost:8080/api/v1/status/${transactionId}`,
       "redirectMode":'POST',
      "mobileNumber": '948477578',
      "paymentInstrument": {
        "type": "PAY_PAGE",
        
      }
    }
    const payload=JSON.stringify(data);
    const payloadMain=Buffer.from(payload).toString('base64')
    const keyIndex=1;
    const string=payloadMain+'/pg/v1/pay'+'099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';
    const sha256=crypto.createHash('sha256').update(string).digest('hex');
    const checkSum=sha256+'###'+keyIndex;
    const prod_url=`https://api-preprod.phonepe.com/apis/hermes/pg/v1/pay`
    const options = {
      method:'POST',
      url:prod_url,
      headers:{
        accept:'application/json',
        'Content-Type':'application/json',
        'X-VERIFY':checkSum,
      }
      ,
      data:{
        request:payloadMain
      }
    }

    axios.request(options).then(function (res){
      console.log(res.data);
      return res.status(200).send(res.data.data.instrumentResponse.redirectInfo.url)
    }).catch((error)=> res.status(200).json({ success: true, data: newPost }))
    res.status(200).json({ success: true, data: newPost });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Unable to create a post, please try again' });
  }
});

export default router;