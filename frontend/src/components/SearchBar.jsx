import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProducts } from "../api/productApi";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all products when the component mounts
    const fetchProducts = async () => {
      try {
        const products = await getAllProducts();
        setAllProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setFilteredProducts([]);
    } else {
      const filtered = allProducts.filter((product) =>
        product.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setFilteredProducts([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    setQuery("");
    setFilteredProducts([]);
  };

  return (
    <div style={{ position: "relative", width: "300px" }} ref={dropdownRef}>
      <input
        type="text"
        placeholder="Search product..."
        value={query}
        onChange={handleChange}
        style={{
          padding: "8px",
          width: "100%",
          color: "black",
          boxSizing: "border-box",
          borderRadius: "4px",
          border: "1px solid #ccc",
          fontSize: "16px",
        }}
      />
      {filteredProducts.length > 0 && (
        <ul
          style={{
            listStyleType: "none",
            margin: 0,
            padding: 0,
            maxHeight: "200px",
            overflowY: "auto",
            position: "absolute",
            width: "100%",
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderTop: "none",
            borderRadius: "0 0 4px 4px",
            zIndex: 1000,
            color: "black",
          }}
        >
          {filteredProducts.map((product) => (
            <li
              key={product._id}
              onClick={() => handleProductClick(product._id)}
              style={{
                padding: "8px",
                borderBottom: "1px solid #eee",
                cursor: "pointer",
                color: "black",
              }}
            >
              {product.name} - ₹{product.price}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
