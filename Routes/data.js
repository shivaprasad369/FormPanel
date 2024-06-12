import express from 'express';
import * as dotenv from 'dotenv';
import Post from '../mongoose/model/Data.js';
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

router.route('/').post(async (req, res) => {
  try {
    // const {From,TId,To,PickUp,ReturnAt,PickUpAt,Type } = req.body;
    

    const newPost = await Post.create(
      req.body
    );

    res.status(200).json({ success: true, data: newPost });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Unable to create a post, please try again' });
  }
});

export default router;