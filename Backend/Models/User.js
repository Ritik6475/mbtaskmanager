
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  
  {
    // 🔸 Basic Info
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },

    // 🔸 Phone required only for normal signup, not google login
    phone: { 
      type: String, 
      required: function () { return !this.googleId; } 
    },

    // 🔸 Password required only if not using google login
    password: { 
      type: String, 
      required: function () { return !this.googleId; } 
    },

    // 🔸 Google Login
    googleId: { type: String, unique: true, sparse: true },

    // 🔸 Optional additional info
    age: { type: Number },
    number: { type: Number },
    profilepic: { type: String },

    // 🔸 Tasks (if your user handles tasks)
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],

    // 🔸 Orders reference
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],

    // 🔸 Cart (with product reference)
    cart: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, default: 1 },
        price: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model('Usertm', userSchema);

export default User;
