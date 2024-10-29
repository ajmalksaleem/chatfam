import { Schema, model } from "mongoose";

const UserModel = new Schema({
    name: {
        type: String,
        required: true
      },
      email: {
        type: String,
        unique: true,
        required: true
      },
      password: {
        type: String,
        required: true
      },
      pic: {
        type: String,
        default: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
      },
      isAdmin: {
        type: Boolean,
        required: true,
        default: false
      }
}, {timestamps:true})

const User = new model("User", UserModel)

export default User