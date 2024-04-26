import React, { useState, useEffect } from "react";
import Web3 from "web3";
import "./App.css";
import sunsetImage from "./sunset.png";
import mountImage from "./mountain.png";
import beachImage from "./beach.png";
import flowerpaintImage from "./flowerpaint.png";
import ancientpaintImage from "./ancientpaint.png";

const initialPicturesData = [
  {
    id: 1,
    name: "Sunset Paint",
    price: 0.001,
    imageUrl: sunsetImage,
  },
  {
    id: 2,
    name: "Mountain Paint",
    price: 0.002,
    imageUrl: mountImage,
  },
  {
    id: 3,
    name: "Beach Paint",
    price: 0.003,
    imageUrl: beachImage,
  },
  {
    id: 4,
    name: "Flower paint",
    price: 0.004,
    imageUrl: flowerpaintImage,
  },
  {
    id: 5,
    name: "Ancient paint",
    price: 0.005,
    imageUrl: ancientpaintImage,
  },
];

function Picture({ picture, addToCart }) {
  return (
    <div className="picture">
      <div className="picture-content">
        <img
          src={picture.imageUrl}
          alt={picture.name}
          className="picture-image"
        />
        <div className="bottom-half">
          <h3>{picture.name}</h3>
          <p>Price: {picture.price} ETH</p>
          <button onClick={() => addToCart(picture)}>Buy</button>
        </div>
      </div>
    </div>
  );
}

function Cart({ cartItems, totalPrice, pay, removeFromCart }) {
  return (
    <div className="cart">
      <h2>Shopping Cart</h2>
      <ul className="cart-items">
        {cartItems.map((item) => (
          <li key={item.id}>
            {item.name} - {item.price} ETH
            <button
              onClick={() => removeFromCart(item)}
              className="remove-button"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <p>Total: {totalPrice.toFixed(3)} ETH</p>
      <button onClick={pay} className="pay-button">
        Pay
      </button>
    </div>
  );
}

function App() {
  const [pictures, setPictures] = useState(initialPicturesData);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [userAddress, setUserAddress] = useState(""); // State to store user's MetaMask address

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          setWeb3(web3Instance);
          const accs = await web3Instance.eth.getAccounts();
          setAccounts(accs);
          setUserAddress(accs[0]); // Set user's MetaMask address
        } catch (error) {
          console.error("Error connecting to MetaMask:", error);
        }
      } else {
        console.error("MetaMask not found");
      }
    };

    initWeb3();
  }, []);

  const addToCart = (picture) => {
    setCartItems([...cartItems, picture]);
    setTotalPrice(totalPrice + picture.price);
    setPictures(pictures.filter((item) => item.id !== picture.id));
  };

  const removeFromCart = (itemToRemove) => {
    setCartItems(cartItems.filter((item) => item.id !== itemToRemove.id));
    setTotalPrice(totalPrice - itemToRemove.price);
    setPictures([...pictures, itemToRemove]);
  };

  const pay = async () => {
    if (!web3) {
      console.error("Web3 not initialized");
      return;
    }

    if (!userAddress) {
      console.error("User's MetaMask address not found");
      return;
    }
  
    const receiverAddress = "0x3680C9C0Ad3F36C4134999e10212369BfccCaFa6"; // Replace with your testnet wallet address
  
    try {
      let totalAmount = web3.utils.toWei(totalPrice.toString(), "ether");
  
      await web3.eth.sendTransaction({
        from: userAddress, // Use user's MetaMask address for transaction
        to: receiverAddress,
        value: totalAmount,
        gas: 21000 * cartItems.length, // Adjust gas limit based on number of items
      });
   
      // Reset cart and total price after successful payment
      setCartItems([]);
      setTotalPrice(0);
      alert("Yayy!! Payment successful!");
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <div className="container">
      <h1 className="pic">PiCart</h1>
      <div className="pictures">
        {pictures.map((picture) => (
          <Picture key={picture.id} picture={picture} addToCart={addToCart} />
        ))}
      </div>
      <Cart
        cartItems={cartItems}
        totalPrice={totalPrice}
        pay={pay}
        removeFromCart={removeFromCart}
      />
    </div>
  );
}

export default App;
