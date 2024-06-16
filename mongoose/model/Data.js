import mongoose from 'mongoose';

const Data = new mongoose.Schema({
  Name:{type: String},
  Email:{type: String},
  Phone:{type: String},
 Course:{type:String},
 Interst:{type:String},
 Status:{type:String}
 
});

const PostSchema = mongoose.model('Info', Data);

export default PostSchema;