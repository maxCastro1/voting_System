const { number } = require('joi')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    first_name: {
      type: String,
      required: [true, 'Please provide name'],
      maxlength: 50,
      minlength: 3,
    },
    last_name: {
        type: String,
        required: [true, 'Please provide name'],
        maxlength: 50,
        minlength: 3,
      },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email',
      ],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
      minlength: 3,
    },
    age: {
        type: Number,
        required: [true, 'Please provide your age'],
        minlength: 1,
      },
      nationalId: {
        type: Number,
        required: [true, 'Please provide your national id number'],
        minlength: 16,
      },
      admin: {
        type: Boolean,
        default: false,
      },
      picture: {
       type:String,
       required: [true, 'Please provide your picture'],
      }
      
  })
  UserSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
  })
  UserSchema.methods.createJWT = function () {
    return jwt.sign(
      { userId: this._id, name: this.first_name },
      process.env.JWT_SECRET,
      {
        expiresIn:'30d',
      }
    )
  }
  UserSchema.methods.comparePassword = async function (canditatePassword) {
    const isMatch = await bcrypt.compare(canditatePassword, this.password)
    return isMatch
  }
  module.exports = mongoose.model('User', UserSchema)