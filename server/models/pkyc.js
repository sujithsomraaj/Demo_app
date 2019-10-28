const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const personalSchema = new Schema({
    fname:{type: String , default:'null'},
    lname:{type: String , default:'null'},
    date:{type: String , default:'null'},
    month:{type: String , default:'null'},
    year:{type: String , default:'null'},
   mobile:{type: String , default:'null'},
    prof:{type: String , default:'null'},
    city:{type: String , default:'null'},
    gross_inc:{type: String , default:'null'},
    source:{type: String , default:'null'},
    address:{type: String , default:'null'},
    country:{type: String , default:'null'},
    type_id:{type: String , default:'null'},
    postcode:{type: String , default:'null'},
    id_proof:{type: String , default:'null'},
    photo_proof:{type: String , default:'null'},
    address_proof:{type: String , default:'null'}, 
    type_address:{type: String , default:'null'}, 
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    },
    
});

const KYCP = mongoose.model('personal', personalSchema);
module.exports = KYCP;
/*fname:this.state.fname,
        lname:this.state.lname,
        date:this.state.date,
        month:this.state.month,
        year:this.state.year,
        mobile:this.state.mobile,
        prof:this.state.prof,
        gross_inc:this.state.gross_inc,
        source:this.state.source,
        address:this.state.address,
        country:this.state.country,
        postcode:this.state.postcode, 
        // id_proof:this.state.id_proof,
        // photo_proof:this.state.photo_proof,
        // address_proof:this.state.address_proof,
        type_address:this.state.type_address,
        kyc_type:'personal'*/ 