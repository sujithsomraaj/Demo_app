const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    email: {type: String,
        default:null},
    secretToken: {type: String,
        default:null},
    active: {type: Boolean,
        default:null},
   // username:{type:String},
    password: {type: String,
        default:null},
    ipAddr : {type: String,
        default:null},
    browser: {type: String,
        default:null},
    os:{type: String,
        default:null},
    resetPasswordToken : {type: String,
    default:''},
    resetPasswordExpires:{type: Date,
        default:null},
    privateKey:{type: String,
                default:''},
    publicKey:{type: String,
                    default:''},
    is_kyc_done :{type:Boolean,
    default:false
    },
    is_aml_done :{type:Boolean,
        default:false
        },
    is_kyc_verified :{type:Boolean,
        default:false
        },
        uuid :{type:String,
            
            },
        
    
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    },
    
});

const User = mongoose.model('user', userSchema);
module.exports = User;
module.exports.hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    } catch(error) {
        throw new Error('Hashing failed', error);
    }
};
module.exports.comparePasswords = async (inputPassword, hashedPassword) => {
    try {
        return await bcrypt.compare(inputPassword, hashedPassword);
    } catch(error) {
        throw new Error('Comparing failed', error);
    }
};