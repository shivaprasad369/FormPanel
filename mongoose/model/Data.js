import mongoose from 'mongoose';

const Data = new mongoose.Schema({
  Name:{type: String},
  Email:{type: String},
  Phone:{type: String},
 TId:{type:String},
Address:{type:String},
 course:{type:String}
 
});

const PostSchema = mongoose.model('Info', Data);

export default PostSchema;