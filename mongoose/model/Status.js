
import mongoose from 'mongoose';

const Data = new mongoose.Schema({
 
 TId:{type:String},
Message:{type:String},
Status:{type:Boolean}

 
});

const StatusSchema = mongoose.model('Status', Data);

export default StatusSchema;