const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const purchaseSchema = new Schema({
  //  fname:{type: String , default:'null',required:true},
   
    email:{type: String , default:'null',required:true},
   acc_name:{type: String , default:'null',required:true},
    acc_num:{type: String , default:'null',required:true},
    bank:{type: String , default:'null',required:true}, 
    amount:{type: String , default:'null',required:true},
    confirm:{type: String , default:'null',required:true},
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    },
    
});

const purchase = mongoose.model('purchase', purchaseSchema);
module.exports = purchase;
