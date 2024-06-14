import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './mongoose/connectDB.js';
import postRoutes from './Routes/data.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use('/api/v1/post', postRoutes);
app.use('/api/v1', postRoutes);
app.use('/api/v1', postRoutes);
app.post('/',async (req, res) => {
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

  const startServer = async () => {
    try {
        connectDB(`mongodb+srv://shivaprasad:Shivu2000@cluster0.ifbbkit.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&authMechanism=DEFAULT`);
      app.listen(8080, () => console.log('Server started on port 8080'));
    } catch (error) {
      console.log(error);
    }
  };
  
  startServer();