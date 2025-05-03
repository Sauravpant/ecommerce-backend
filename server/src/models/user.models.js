import mongoose, { Schema } from "mongoose"
import bcrypt from "bcrypt"

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique:true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })


userSchema.pre("save", async function (next) {  //Using bcrypt tp hash the password before saving into the database
  if (!(this.isModified("password"))) next();
  else {
    this.password = await bcrypt.hash(this.password, 10);
    next;
  }
})


userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
}


export const User = mongoose.model("User", userSchema);