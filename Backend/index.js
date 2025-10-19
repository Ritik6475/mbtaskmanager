// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './Configs/mongoconnection.js';
import { registerUser } from './Controllers/userController.js'; // ✅ import directly
import './Configs/passport.js';
import { googleAuthController } from './Controllers/Googleauthcontroll.js';
import { loginController } from './Controllers/logincontroller.js';
import { createTask } from './Controllers/taskcreate.js';
import { deleteTask } from './Controllers/Deletetask.js';
import { updateTask } from './Controllers/Taskupdate.js';
import { updateTaskStatus } from './Controllers/Updatestatus.js';
import { getTasksByFilter,getAllTasks,getTasksByPriority,getTasksByStatus } from './Controllers/Fetchtasks.js';
import cookieParser from "cookie-parser";
import { userstats } from './Controllers/userstats.js';
import Razorpay from "razorpay";
import crypto from 'crypto';
import mongoose from 'mongoose';
import Order from './Models/orders.js';
import Products from './Models/productmode.js';
import User from './Models/User.js';


dotenv.config();
connectDB();



const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // your frontend URL
    credentials: true, // must be true
  })
);


const razorpay = new Razorpay({

  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});





app.use(cookieParser());
app.use(express.json());

// now define your POST route directly:
app.post('/api/auth/register', registerUser);
app.post('/api/auth/googlelogin', googleAuthController);
app.post('/api/auth/login', loginController);

app.post("/createtask",createTask);

app.put("/updatetask", updateTask);
app.put("/updatestatus", updateTaskStatus);

app.delete("/deletetask", deleteTask);

app.get("/tasks", getAllTasks);
app.get("/tasks/priority", getTasksByPriority);
app.get("/tasks/status", getTasksByStatus);
app.get("/api/tasks/filter", getTasksByFilter);
app.get("/userstats", userstats);






app.post('/saveallproduct',async(req,res)=>{
 const products = req.body.products;
 console.log(products);

 try {
    if(products){
        const inserted = await Products.insertMany(products,{ordered:false});
        return res.status(200).json({ message: "Product saves" });   
}
} 
catch (error) {
    return res.status(500).json({ error: "Cant save product" });
}
});



app.get('/getproduct', async (req, res) => {

  let { limit, skip } = req.query;

  limit = Number(limit) || 5;
  skip = Number(skip) || 0;

  console.log(limit, skip);

  try {
    const products = await Products.find({})
      .sort({ id: 1 }) // ascending order by id (use -1 for descending)
      .skip(skip)
      .limit(limit);

    // optionally you can also send total count
    // const totalCount = await Products.countDocuments();

    res.status(200).json({ limit, skip, products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



app.post('/buy',async(req,res)=>{

const {productId,quantity,price,userId} = req.body;

  try {
    // use ObjectId from MongoDB (_id) if saved in DB
    const productres = await Products.findById(productId);
    if (!productres) return res.status(404).send("Product not found");

    const totalprice = productres.price * quantity;

    const orderschema = new Order({
      user: userId,
      totalPrice: totalprice,
      status: 'pending',
      items: [
        {
          product: productId,
          quantity,
          price: productres.price
        }
      ],
      address: { street: '123 Main St', city: 'Anytown', state: 'CA', zip: '12345' },
      paymentMethod: 'cod'
    });
    await orderschema.save();
    res.status(200).send({ message: "Order created successfully", order: orderschema });

  
}   

catch (error) {
      console.error(error);
    res.status(500).send({ message: "Something went wrong" });


}


});

// --- Add to Cart Route ---
app.post("/cart", async (req, res) => {
  const { userId, productId, quantity, price } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // push subdocument
    user.cart.push({
      product: productId,
      quantity: quantity,
      price: price
    });

    await user.save();
    res.status(200).json({ message: "Product added to cart!", cart: user.cart });
    console.log("Cart updated:", user.cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});


app.post('/payments/create', async (req, res) => {
  try {
    const { items, userId, totalPrice } = req.body;
    console.log("Payment create request:", req.body);

    if (!items || !totalPrice || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const amountInPaise = Math.round(totalPrice * 100);

    const razorOrder = await razorpay.orders.create({
      amount: amountInPaise, // paise
      currency: "INR",
    });

    console.log("Razorpay order created:", razorOrder);

    res.json({
      key: process.env.RAZORPAY_KEY_ID,
      razorpayOrderId: razorOrder.id,
      amount: razorOrder.amount,
      currency: razorOrder.currency,
      items,
      userId,
      totalPrice,
    });
  } catch (err) {
    console.error("Error creating Razorpay order:", err);
    res.status(500).json({ error: err.message });
  }
});


// POST /api/payments/verify-and-save
app.post('/payments/verify-and-save', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { 
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      userId,
      items,
      totalPrice,
      address,
      paymentMethod
    } = req.body;

    // 1️⃣ Verify Razorpay signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: 'Invalid signature' });
    }

    // 2️⃣ Create order document
    const newOrder = await Order.create(
      [{
        user: userId,
        items,
        totalPrice,
        status: 'paid',
        address,
        paymentMethod,
      }],
      { session }
    );

    // 3️⃣ Update user
    await User.findByIdAndUpdate(
      userId,
      { 
        $push: { orders: newOrder[0]._id },
        $set: { cart: [] } // empty cart after purchase
      },
      { session }
    );

    // 4️⃣ Commit transaction
    await session.commitTransaction();
    session.endSession();

    res.json({ success: true, order: newOrder[0] });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error(err);
    res.status(500).json({ error: 'Payment verification or DB write failed' });
  }

});

app.get('/test', (req, res) => res.send('Server is working!'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
