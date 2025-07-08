import React, { useEffect, useState } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { collection, query, where, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';

const Cart = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (loading || !user || !isOpen) return;

    const q = query(collection(db, 'carts'), where('user', '==', user.email));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCartItems(items);
    });

    return () => unsubscribe();
  }, [user, loading, isOpen]);

  const removeItem = async (id) => {
    try {
      await deleteDoc(doc(db, 'carts', id));
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateDoc(doc(db, 'carts', id), { quantity: newQuantity });
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const total = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
    0
  );

  return (
    <div
      className={`fixed top-0 right-0 h-full z-50 bg-white shadow-2xl transition-transform duration-300 
        ${isOpen ? 'translate-x-0' : 'translate-x-full'} 
        w-full md:w-[400px]`}
      style={{ willChange: 'transform' }}
    >
      <div className="relative h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-[#141414]">Your Cart</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black text-2xl">&times;</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <p className="text-gray-500">Loading cart...</p>
          ) : cartItems.length === 0 ? (
            <p className="text-gray-500">Your cart is currently empty.</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex items-start gap-4 p-3 border rounded-lg shadow-sm hover:shadow-md transition">
                <img src={item.image} alt={item.title} className="w-20 h-30 object-top rounded" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-[#141414]">{item.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.type} | {item.size} {item.lining ? '| Lining' : ''}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="px-2 py-1 border rounded disabled:opacity-50"
                    >−</button>
                    <span className="text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 border rounded"
                    >+</button>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <FaTrashAlt />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t sticky bottom-0 bg-white">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-600">Total:</span>
            <span className="text-lg font-semibold text-[#141414]">
              Rs. {total.toLocaleString()}
            </span>
          </div>
          {cartItems.length > 0 ? (
            <Link
              to="/checkout"
              onClick={onClose}
              className="block w-full text-center bg-[#141414] text-white py-2 rounded-lg hover:opacity-90 transition"
            >
              Proceed to Checkout
            </Link>
          ) : (
            <button
              disabled
              className="w-full bg-[#141414] text-white py-2 rounded-lg opacity-50 cursor-not-allowed"
            >
              Proceed to Checkout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
