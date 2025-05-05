import mongoose, { Schema } from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const userSchema = new Schema({
  fullName: {
    type: String,
    required: true
  },

  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select:false
  },
  refreshToken: {
    type: String,
  },
  profilePicture: {
    type: String,
    rewuired: true
  },
  
  imageId: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })


userSchema.pre("save", async function (next) {  
  if (!(this.isModified("password"))) next();
  else {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  }
})


userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function () {
  return jwt.sign({
    _id: this._id,
    username: this.username,
    email: this.email
  },
    process.env.ACCESS_TOKEN_SECRET
    ,
    {
      expiresIn: '1d'
    }
  )
}

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({
    _id: this.id
  },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: '10d'
    }
  )
}


export const User = mongoose.model("User", userSchema);