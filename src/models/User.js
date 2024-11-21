import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  roll_number: {
    type: String,
    required: true,
    unique: true
  },
  dob: {
    type: Date,
    required: true
  }
});

userSchema.methods.getUserId = function() {
  const dob = this.dob.toISOString().split('T')[0].split('-').reverse().join('');
  return `${this.name.toLowerCase().replace(/\s+/g, '_')}_${dob}`;
};

export const User = mongoose.model('User', userSchema);