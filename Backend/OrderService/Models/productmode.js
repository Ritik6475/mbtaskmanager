import mongoose from "mongoose";



const ProductsSchema = new mongoose.Schema(
  {

id:{
type:Number,
required:true,
unique:true

}
    ,
    title: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    thumbnail: {
      type: String, // URL of the image
      required: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true } 
  
);

const Products = mongoose.model("Products", ProductsSchema);


export default Products;
