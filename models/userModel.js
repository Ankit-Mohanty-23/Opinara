import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    fullname: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    wave: {
        type: String,
    },
    avatar: {
        type: {
            type: String,
            enum: ["image"],
        },
        url: {
            type: String,
            default: "",
        },
        public_id: {
            type: String,
            default: ""
        },
    },
    bio: {
        type: String,
        trim: true,
        default: ""
    },
    karma: {
        type: Number,
        default: 0
    }
},{
    timestamps: true
});

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next();
    }
    try{
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    }catch(error){
        next(error);
    }
})

userSchema.methods.comparePassword = async function(candidatePassword){
    try{
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    }catch(error){
        throw error;
    }
}

const Users = mongoose.model('Users', userSchema);
export default Users;