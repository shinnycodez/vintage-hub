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

  if (loading) {
    return <LoadingSpinner />;
  }

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
    {!loading ? (
      <Routes>
        {/* Public route */}
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />

        {/* Protected routes */}
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" replace />} />
        <Route path="/checkout" element={user ? <CheckoutPage /> : <Navigate to="/login" replace />} />
        <Route path="/buynowcheckout" element={user ? <BuyNowCheckout /> : <Navigate to="/login" replace />} />
        <Route path="/products" element={user ? <Products /> : <Navigate to="/login" replace />} />
        <Route path="/admin" element={user ? <AdminPortal /> : <Navigate to="/login" replace />} />
        <Route path="/product/:id" element={user ? <ProductPage /> : <Navigate to="/login" replace />} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    ) : (
      <LoadingSpinner />
    )}
  </Router>
);

}

export default App;
