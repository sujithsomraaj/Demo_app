const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const amlSchema = new Schema({
  //  fname:{type: String , default:'null',required:true},
   
    email:{type: String , default:'null',required:true},
    PeP:{type: String , default:'null',required:true},
    Value:{type: String , default:'null',required:true},
    How_Often:{type: String , default:'null',required:true}, 
    Source:{type: String , default:'null',required:true},
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    },
    
});

const aml = mongoose.model('aml', amlSchema);
module.exports =aml;
