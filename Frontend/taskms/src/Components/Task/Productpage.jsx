import { useState, useEffect } from "react";
import axios from "axios";
import ProductActionModal from "../productactionmodel";
import "./productpage.css";

function Productpage() {
  
  
  // ---- Infinite Scroll Products from DB ----
  
  const [dbProducts, setDbProducts] = useState([]);
  const [page, setPage] = useState(0);
  const limit = 5;
  const [hasMore, setHasMore] = useState(true);


 const fetchProducts = async (currentPage) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/getproduct?limit=${limit}&skip=${currentPage * limit}`
      );
      if (res.data?.products?.length) {
        setDbProducts((prev) => [...prev, ...res.data.products]);
      } else {
        setHasMore(false); // no more products
      }
    } catch (error) {
      console.error("Error fetching products from DB", error);
    }
  };


  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 50;
    if (bottom && hasMore) setPage((prev) => prev + 1);
  };

  // ---- Modal state ----
  const [openModal, setOpenModal] = useState(false);
  const [mode, setMode] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);


  let valone = 14;
  let valtwo =  valone;
  console.log(valone,valtwo);

  valtwo = 15;
  console.log(valone,valtwo);



  const userId = localStorage.getItem("userId");

  


  return (
    <div className="container">

      <h1>My Products & Users</h1>
      <h5>userId:{userId}</h5>
      
      <h2>DB Products (Infinite Scroll)</h2>
        <div
    className="productpage-scrollable"
    onScroll={handleScroll}
  >
    {dbProducts.map((product) => (
      <div key={product._id} className="productpage-card">
        <p>{product.title}</p>
        <img src={product.thumbnail} alt="No image" />
        <p>₹ {product.price}</p>
        <div className="productpage-actions">
        <button onClick={() => { setSelectedProduct(product); setMode("buy"); setOpenModal(true); }} > Buy </button> 
        <button onClick={() => { setSelectedProduct(product); setMode("cart"); setOpenModal(true); }} > Add to Cart </button>
        
        </div>
      </div>
    ))}
    {!hasMore && (
      <p className="productpage-end">No more products</p>
    )}
  </div>

      {/* Single modal for all products */}
      {openModal && selectedProduct && (
        <ProductActionModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          mode={mode}
          productId={selectedProduct._id} // use MongoDB ObjectId
          quantity={1}
          price={selectedProduct.price}
          
        />
      )}

    </div>
  );
}

export default Productpage;
