import React, { useEffect, useState } from 'react';
import { doc, collection, query, where, onSnapshot, deleteDoc, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Header from './Header';
import { useNavigate, useLocation } from 'react-router-dom';

const BuyNowCheckout = () => {
  const user = auth.currentUser;
  const userEmail = user?.email;
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product;

  const [cartItems, setCartItems] = useState([]);
  const [form, setForm] = useState({
    email: userEmail || '',
    fullName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    region: '',
    country: '',
    shippingMethod: 'Standard Delivery',
    paymentMethod: 'Cash on Delivery',
    promoCode: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [bankTransferProofBase64, setBankTransferProofBase64] = useState(null);
  const [convertingImage, setConvertingImage] = useState(false);

  // Initialize with the buy now product
  useEffect(() => {
    if (product) {
      setCartItems([{
        id: `temp_${Date.now()}`,
        ...product,
        quantity: product.quantity || 1,
        createdAt: new Date()
      }]);
    }
  }, [product]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const shippingCost = 300; // Fixed shipping cost
  const total = subtotal + shippingCost;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for the field being changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    // Clear the Base64 string if payment method changes from Bank Transfer
    if (name === 'paymentMethod' && value !== 'Bank Transfer') {
      setBankTransferProofBase64(null);
      setErrors(prev => ({ ...prev, bankTransferProof: '' })); // Clear bank transfer proof error
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Basic file size validation (e.g., 5MB limit)
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
      if (file.size > MAX_FILE_SIZE) {
        setErrors(prev => ({ ...prev, bankTransferProof: 'File size exceeds 5MB limit.' }));
        setBankTransferProofBase64(null);
        return;
      }

      setConvertingImage(true);
      setErrors(prev => ({ ...prev, bankTransferProof: '' })); // Clear previous error

      const reader = new FileReader();
      reader.onloadend = () => {
        setBankTransferProofBase64(reader.result);
        setConvertingImage(false);
      };
      reader.onerror = (error) => {
        console.error("Error converting file to Base64:", error);
        setBankTransferProofBase64(null);
        setConvertingImage(false);
        setErrors(prev => ({ ...prev, bankTransferProof: 'Failed to read image file.' }));
      };
      reader.readAsDataURL(file);
    } else {
      setBankTransferProofBase64(null);
      setErrors(prev => ({ ...prev, bankTransferProof: '' })); // Clear error if no file selected
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['fullName', 'phone', 'address', 'city', 'postalCode', 'country', 'region']; // Added region to required fields
    
    requiredFields.forEach(field => {
      if (!form[field]) {
        newErrors[field] = 'This field is required';
      }
    });

    // Basic phone number validation (e.g., at least 7 digits)
    if (form.phone && !/^\d{7,}$/.test(form.phone)) {
      newErrors.phone = 'Please enter a valid phone number.';
    }

    if (form.paymentMethod === 'Bank Transfer' && !bankTransferProofBase64) {
      newErrors.bankTransferProof = 'Please upload a screenshot of your bank transfer.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const placeOrder = async () => {
    if (!validateForm()) {
      // Scroll to the first error if validation fails
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        document.getElementsByName(firstErrorField)[0]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    if (!userEmail) {
      alert('Please login to complete your order');
      return;
    }

    setLoading(true);

    const order = {
      user: userEmail,
      items: cartItems.map(item => ({
        productId: item.productId || item.id.replace('temp_', ''), // Handle temp id for buy now
        title: item.title,
        type: item.type,
        size: item.size,
        lining: item.lining,
        quantity: item.quantity || 1,
        price: item.price,
        image: item.image || item.coverImage,
      })),
      shipping: form.shippingMethod,
      payment: form.paymentMethod,
      shippingAddress: {
        fullName: form.fullName,
        phone: form.phone,
        address: form.address,
        city: form.city,
        postalCode: form.postalCode,
        region: form.region,
        country: form.country,
      },
      promoCode: form.promoCode,
      notes: form.notes,
      subtotal,
      shippingCost,
      total,
      createdAt: new Date(),
      status: 'pending', // Initial status for new orders
      buyNow: true,
      // Store the Base64 string directly in the Firestore document
      bankTransferProofBase64: form.paymentMethod === 'Bank Transfer' ? bankTransferProofBase64 : null,
    };

    try {
      await addDoc(collection(db, 'orders'), order);
      navigate('/order-confirmation', { state: { order } }); // Pass order details to confirmation page
    } catch (err) {
      console.error("Error placing order:", err);
      // More specific error message for size limit (Firebase document size limit is ~1MB)
      if (err.code === 'resource-exhausted' || (err.message && err.message.includes('too large'))) {
        alert('Error: The uploaded image is too large. Please try a smaller image or contact support.');
      } else {
        alert('Error placing order. Please try again. If the issue persists, contact support.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!userEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Please Login to Checkout</h2>
          <p className="mb-6 text-gray-600">You need to be logged in to complete your purchase.</p>
          <button 
            onClick={() => navigate('/login', { state: { from: location } })}
            className="w-full bg-black text-white py-3 rounded-md font-medium hover:bg-gray-800 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!product && cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4">No Product Selected</h2>
          <p className="mb-6 text-gray-600">Please select a product to proceed with Buy Now.</p>
          <button 
            onClick={() => navigate('/products')}
            className="w-full bg-black text-white py-3 rounded-md font-medium hover:bg-gray-800 transition"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#FFDCDC] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm sm:text-base">
              <li>
                <a href="/" className="text-gray-500 hover:text-gray-700">Home</a>
              </li>
              <li>
                <span className="text-gray-400">/</span>
              </li>
              <li>
                <span className="text-black font-medium">Buy Now Checkout</span>
              </li>
            </ol>
          </nav>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Buy Now Checkout</h1>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Form */}
            <div className="bg-[#FFF2EB] p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-6 pb-2 border-b">Contact Information</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                <input 
                  name="email" 
                  value={form.email} 
                  onChange={handleChange} 
                  disabled 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black text-sm sm:text-base"
                />
              </div>

              <h2 className="text-xl font-semibold mb-6 pb-2 border-b">Shipping Address</h2>
              
              <div className="grid gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
                  <input 
                    id="fullName"
                    name="fullName" 
                    value={form.fullName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-black focus:border-black text-sm sm:text-base`}
                  />
                  {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number*</label>
                  <input 
                    id="phone"
                    name="phone" 
                    value={form.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-black focus:border-black text-sm sm:text-base`}
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Street Address*</label>
                  <input 
                    id="address"
                    name="address" 
                    value={form.address}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-black focus:border-black text-sm sm:text-base`}
                  />
                  {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City*</label>
                    <input 
                      id="city"
                      name="city" 
                      value={form.city}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-black focus:border-black text-sm sm:text-base`}
                    />
                    {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                  </div>

                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">Postal Code*</label>
                    <input 
                      id="postalCode"
                      name="postalCode" 
                      value={form.postalCode}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border ${errors.postalCode ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-black focus:border-black text-sm sm:text-base`}
                    />
                    {errors.postalCode && <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">Province/Region*</label>
                    <input 
                      id="region"
                      name="region" 
                      value={form.region}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border ${errors.region ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-black focus:border-black text-sm sm:text-base`}
                    />
                    {errors.region && <p className="mt-1 text-sm text-red-600">{errors.region}</p>}
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country*</label>
                    <select 
                      id="country"
                      name="country" 
                      value={form.country}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border ${errors.country ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-black focus:border-black text-sm sm:text-base`}
                    >
                      <option value="">Select Country</option>
                      <option value="PK">Pakistan</option>
                      {/* Add more countries as needed */}
                    </select>
                    {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country}</p>}
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-6 pb-2 border-b">Shipping Method</h2>
              
              <div className="space-y-4">
                <label className="flex items-center p-4 border rounded-md hover:border-black cursor-pointer">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="Standard Delivery"
                    checked={form.shippingMethod === 'Standard Delivery'}
                    onChange={handleChange}
                    className="h-4 w-4 text-black focus:ring-black border-gray-300"
                  />
                  <div className="ml-3">
                    <p className="font-medium text-gray-900 text-sm sm:text-base">Standard Delivery</p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      PKR 300 - Delivery in 5-7 business days
                    </p>
                  </div>
                </label>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-6 pb-2 border-b">Payment Method</h2>
              
              <div className="space-y-4">
                {['Cash on Delivery', 'Bank Transfer'].map(method => (
                  <label key={method} className="flex items-center p-4 border rounded-md hover:border-black cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={form.paymentMethod === method}
                      onChange={handleChange}
                      className="h-4 w-4 text-black focus:ring-black border-gray-300"
                    />
                    <span className="ml-3 font-medium text-gray-900 text-sm sm:text-base">{method}</span>
                  </label>
                ))}
              </div>

              {form.paymentMethod === 'Bank Transfer' && (
                <div className="mt-6 p-4 border border-blue-300 bg-blue-50 rounded-md">
                  <h3 className="text-lg font-semibold mb-3">Bank Transfer Details</h3>
                  <p className="text-gray-700 mb-4 text-sm sm:text-base">
                    Please transfer the total amount of PKR {total.toLocaleString()} to our bank account:
                  </p>
                  <ul className="list-disc list-inside text-gray-800 mb-4 text-sm sm:text-base">
               <li><strong>Bank Name:</strong> [HBL]</li>
                    <li><strong>Account Name:</strong> [Maham Sarwar]</li>
                    <li><strong>Account Number:</strong> [02947902132799]</li>
                    {/* <li><strong>IBAN:</strong> [Your IBAN]</li> */}
                  </ul>
                  <p className="text-gray-700 mb-4 text-sm sm:text-base">
                    After making the transfer, please upload a screenshot of the transaction as proof of payment.
                  </p>
                  <div>
                    <label htmlFor="bankTransferProof" className="block text-sm font-medium text-gray-700 mb-1">
                      Upload Bank Transfer Screenshot*
                    </label>
                    <input
                      id="bankTransferProof"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className={`w-full px-4 py-2 border ${errors.bankTransferProof ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-black focus:border-black text-sm sm:text-base file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100`}
                    />
                    {errors.bankTransferProof && <p className="mt-1 text-sm text-red-600">{errors.bankTransferProof}</p>}
                    {bankTransferProofBase64 && (
                      <p className="mt-2 text-sm text-gray-600">Image selected and converted.</p>
                    )}
                    {convertingImage && (
                      <p className="mt-2 text-sm text-gray-600 flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Converting image...
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <label htmlFor="promoCode" className="block text-sm font-medium text-gray-700 mb-1">Promo Code</label>
                <div className="flex">
                  <input 
                    id="promoCode"
                    name="promoCode" 
                    value={form.promoCode}
                    onChange={handleChange}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:ring-black focus:border-black text-sm sm:text-base"
                    placeholder="Enter promo code"
                  />
                  <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-r-md hover:bg-gray-300 transition text-sm sm:text-base">
                    Apply
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Order Notes (Optional)</label>
                <textarea 
                  id="notes"
                  name="notes" 
                  value={form.notes}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black text-sm sm:text-base"
                  placeholder="Special instructions, delivery notes, etc."
                />
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="bg-[#FFF2EB] p-6 rounded-lg shadow-sm h-fit lg:sticky lg:top-8">
              <h2 className="text-xl font-semibold mb-6 pb-2 border-b">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cartItems.map(item => (
                  <div key={item.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="flex gap-4 mb-2 sm:mb-0">
                      <img
                        src={item.image || item.coverImage}
                        alt={item.title}
                        className="w-16 h-20 sm:w-20 sm:h-25 object-top rounded"
                      />
                      <div>
                        <p className="font-medium text-gray-900 text-sm sm:text-base">{item.title}</p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {item.type} | Size: {item.size} {item.lining && '| With Lining'}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">Qty: {item.quantity || 1}</p>
                      </div>
                    </div>
                    <p className="font-medium text-sm sm:text-base">
                      PKR {(item.price * (item.quantity || 1)).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="text-sm">PKR {subtotal.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Shipping</span>
                  <span className="text-sm">
                    PKR {shippingCost.toLocaleString()}
                  </span>
                </div>
                
                {form.promoCode && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Discount</span>
                    <span className="text-sm text-green-600">-PKR 0</span> {/* Placeholder for actual discount logic */}
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-4 pt-4 border-t border-gray-200">
                <span className="font-medium text-base sm:text-lg">Total</span>
                <span className="font-bold text-base sm:text-lg">PKR {total.toLocaleString()}</span>
              </div>

              <button
                onClick={placeOrder}
                disabled={loading || cartItems.length === 0 || convertingImage}
                className={`mt-6 w-full py-3 px-4 rounded-md font-medium text-white ${loading || cartItems.length === 0 || convertingImage ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'} transition text-base sm:text-lg`}
              >
                {loading || convertingImage ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {convertingImage ? 'Converting Image...' : 'Processing Order...'}
                  </span>
                ) : cartItems.length === 0 ? (
                  'No Items to Order'
                ) : (
                  'Place Order Now'
                )}
              </button>

              <div className="mt-6 text-center text-xs sm:text-sm text-gray-500">
                <p>100% secure checkout</p>
                <p className="mt-1">Easy returns and exchanges</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BuyNowCheckout;