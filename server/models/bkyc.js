const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const buisnessSchema = new Schema({
  //  fname:{type: String , default:'null',required:true},
    orgname:{type: String , default:'null',required:true},
    orgnum:{type: String , default:'null',required:true},
    orgcou:{type: String , default:'null',required:true},
    orgnat:{type: String , default:'null',required:true},
    fname:{type: String , default:'null',required:true},
    lname:{type: String , default:'null',required:true},
    date:{type: String , default:'null',required:true},
    month:{type: String , default:'null',required:true},
    year:{type: String , default:'null',required:true},
    email:{type: String , default:'null',required:true}, 
    document:{type: String , default:'null',required:true},
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    },
    
});

const KYCB = mongoose.model('buisness', buisnessSchema);
module.exports = KYCB;
