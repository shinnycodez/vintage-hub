import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./firebase";
import { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import Home from "./Home";
import Login from "./components/Login";
import Products from "./components/Products";
import AdminPortal from "./components/AdminPortal";
import ProductPage from "./components/Productpage";
import CheckoutPage from "./components/ChceckoutPage";
import BuyNowCheckout from "./components/BuyNowCheckout";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      (user) => {
        setUser(user);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">
          Error loading authentication state: {error.message}
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/buynowcheckout" element={<BuyNowCheckout />} />
        <Route path="/admin" element={<AdminPortal />} />
       <Route path="/checkout" element={<CheckoutPage />} />

        {/* Protected Route */}
        

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
