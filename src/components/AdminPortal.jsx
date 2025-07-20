import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import Header from "./Header";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function AdminPortal() {
  const [salesByMonth, setSalesByMonth] = useState([]);
  const [productSales, setProductSales] = useState([]);
  const [totalSales, setTotalSales] = useState({ day: 0, month: 0, year: 0 });

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
    coverImage: "",
    image1: "",
    image2: "",
    isTopProduct: false,
    available: true, // New availability field
  });

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState({});

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      setProducts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "orders"), (snapshot) => {
      const ordersData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOrders(ordersData);

      // Process sales data
      const now = new Date();
      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);

      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfYear = new Date(now.getFullYear(), 0, 1);

      let dayTotal = 0;
      let monthTotal = 0;
      let yearTotal = 0;
      const monthMap = {};
      const productMap = {};

      ordersData.forEach(order => {
        // Ensure order.createdAt is a valid Date object
        const orderDate = order.createdAt?.toDate ? order.createdAt.toDate() : (order.createdAt instanceof Date ? order.createdAt : new Date());
        const total = order.total || 0;

        if (orderDate >= startOfDay) dayTotal += total;
        if (orderDate >= startOfMonth) monthTotal += total;
        if (orderDate >= startOfYear) yearTotal += total;

        const month = orderDate.toLocaleString('default', { month: 'short' });
        monthMap[month] = (monthMap[month] || 0) + total;

        (order.items || []).forEach(item => {
          // Use a unique identifier for products, e.g., productId or a combination of title and type
          const itemId = item.productId || `${item.title}-${item.type}-${item.size}`;
          if (!productMap[itemId]) {
            productMap[itemId] = {
              title: item.title,
              totalQty: 0,
              totalSales: 0
            };
          }
          productMap[itemId].totalQty += item.quantity;
          productMap[itemId].totalSales += item.price * item.quantity;
        });
      });

      setTotalSales({
        day: dayTotal,
        month: monthTotal,
        year: yearTotal
      });

      setSalesByMonth(
        Object.keys(monthMap).map(month => ({
          month,
          total: monthMap[month]
        }))
      );

      // Sort product sales by totalSales in descending order and take top 10
      const sortedProductSales = Object.values(productMap).sort((a, b) => b.totalSales - a.totalSales);
      setProductSales(sortedProductSales);
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const markAsDelivered = async (orderId) => {
    try {
        const orderRef = doc(db, "orders", orderId);
        await updateDoc(orderRef, {
            status: "delivered",
            bankTransferProofBase64: null, // Set to null to remove the field
        });
        console.log(`Order ${orderId} marked as delivered and bank transfer proof removed.`);
    } catch (err) {
        console.error("Failed to mark as delivered:", err);
    }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");

    try {
      if (editId) {
        await updateDoc(doc(db, "products", editId), {
          ...formData,
          price: parseFloat(formData.price),
          images: [formData.image1, formData.image2],
        });
        setSuccessMsg("✅ Product updated successfully!");
        setEditId(null);
      } else {
        await addDoc(collection(db, "products"), {
          ...formData,
          price: parseFloat(formData.price),
          images: [formData.image1, formData.image2],
          createdAt: serverTimestamp(),
        });
        setSuccessMsg("✅ Product added successfully!");
      }

      setFormData({
        title: "",
        price: "",
        category: "",
        description: "",
        coverImage: "",
        image1: "",
        image2: "",
        isTopProduct: false,
        available: true,
      });
    } catch (err) {
      console.error("Error:", err);
      setSuccessMsg("❌ Failed to submit.");
    }

    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteDoc(doc(db, "products", id));
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  const handleEdit = (product) => {
    setFormData({
      title: product.title,
      price: product.price,
      category: product.category,
      description: product.description,
      coverImage: product.coverImage,
      image1: product.images?.[0] || "",
      image2: product.images?.[1] || "",
      isTopProduct: product.isTopProduct || false,
      available: product.available !== false, // Default to true if undefined
    });
    setEditId(product.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleExpand = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const OrderDetails = ({ order }) => (
    <div className="mt-4 space-y-3 text-sm text-gray-700 p-2 border-t border-gray-200 pt-3">
      <p><strong>Status:</strong> <span className={`font-semibold ${order.status === 'delivered' ? 'text-green-600' : 'text-orange-600'}`}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></p>
      <p><strong>Payment Method:</strong> {order.payment}</p>
      {order.payment === 'Bank Transfer' && order.bankTransferProofBase64 && (
        <div className="mt-2">
          <strong>Bank Transfer Proof:</strong>
          <div className="mt-1 border border-gray-300 p-2 rounded max-w-full sm:max-w-xs overflow-hidden">
            {/* Display the Base64 image directly */}
            <img 
              src={order.bankTransferProofBase64} 
              alt="Bank Transfer Proof" 
              className="w-full h-auto object-contain max-h-64 sm:max-h-80" // Constrain image height
            />
          </div>
        </div>
      )}
      <p><strong>Shipping Method:</strong> {order.shipping}</p>
      <p><strong>Promo Code:</strong> {order.promoCode || "None"}</p>
      <p><strong>Notes:</strong> {order.notes || "None"}</p>
      <p>
        <strong>Order Time:</strong>{" "}
        {order.createdAt?.toDate?.().toLocaleString() || "Unknown"}
      </p>

      <div>
        <strong>Shipping Address:</strong>
        <div className="ml-0 sm:ml-4 text-xs sm:text-sm">
          <p>{order.shippingAddress?.fullName}</p>
          <p>{order.shippingAddress?.address}</p>
          <p>{order.shippingAddress?.city}, {order.shippingAddress?.region}</p>
          <p>{order.shippingAddress?.country}, {order.shippingAddress?.postalCode}</p>
          <p>Phone: {order.shippingAddress?.phone}</p>
        </div>
      </div>

      <div>
        <strong>Items:</strong>
        <ul className="list-disc ml-4 sm:ml-5 mt-1 text-xs sm:text-sm">
          {(order.items || []).map((item, i) => (
            <li key={i}>
              {item.title} – {item.type} – Size: {item.size} – Qty: {item.quantity} – Price: PKR {item.price?.toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 sm:space-y-10">
        {/* Page Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

        {/* Toggle Add Product */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full bg-black text-white px-4 py-3 text-left rounded-md hover:bg-gray-800 transition-colors duration-200 flex items-center justify-between text-base sm:text-lg font-medium"
          >
            <span>{showForm ? "➖ Hide Add Product Form" : "➕ Add New Product"}</span>
            <svg className={`w-5 h-5 transition-transform duration-200 ${showForm ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>

          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="bg-gray-50 p-4 sm:p-6 mt-4 rounded-lg shadow-inner space-y-4"
            >
              {successMsg && (
                <p className={`text-center text-sm sm:text-base p-2 rounded ${successMsg.startsWith('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {successMsg}
                </p>
              )}
              <input name="title" placeholder="Product Title" className="w-full border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base" value={formData.title} onChange={handleChange} required />
              <input name="price" placeholder="Price (PKR)" type="number" step="0.01" className="w-full border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base" value={formData.price} onChange={handleChange} required />
              <input name="category" placeholder="Category (e.g., 'Formal', 'Casual')" className="w-full border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base" value={formData.category} onChange={handleChange} required />
              <textarea name="description" placeholder="Product Description" rows="4" className="w-full border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base" value={formData.description} onChange={handleChange} required />
              <input name="coverImage" placeholder="Cover Image URL (e.g., Firebase Storage URL)" className="w-full border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base" value={formData.coverImage} onChange={handleChange} required />
              <input name="image1" placeholder="Image 1 URL (Optional)" className="w-full border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base" value={formData.image1} onChange={handleChange} />
              <input name="image2" placeholder="Image 2 URL (Optional)" className="w-full border border-gray-300 p-2 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base" value={formData.image2} onChange={handleChange} />
              
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-4">
                <label className="flex items-center gap-2 text-sm sm:text-base text-gray-700 cursor-pointer">
                  <input type="checkbox" name="isTopProduct" checked={formData.isTopProduct} onChange={handleChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  Mark as Top Product
                </label>
                <label className="flex items-center gap-2 text-sm sm:text-base text-gray-700 cursor-pointer">
                  <input type="checkbox" name="available" checked={formData.available} onChange={handleChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  Product Available
                </label>
              </div>
              
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-md transition-colors duration-200 text-base sm:text-lg font-medium disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {loading ? (editId ? "Updating..." : "Adding...") : (editId ? "Update Product" : "Add Product")}
              </button>
            </form>
          )}
        </div>

        {/* Toggle Inventory */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <button
            onClick={() => setShowInventory(!showInventory)}
            className="w-full bg-black text-white px-4 py-3 text-left rounded-md hover:bg-gray-800 transition-colors duration-200 flex items-center justify-between text-base sm:text-lg font-medium"
          >
            <span>{showInventory ? "➖ Hide Inventory" : "📦 View Product Inventory"}</span>
            <svg className={`w-5 h-5 transition-transform duration-200 ${showInventory ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>

          {showInventory && (
            <div className="mt-4 bg-gray-50 p-4 sm:p-6 rounded-lg shadow-inner grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {products.length === 0 ? (
                <p className="col-span-full text-center text-gray-500 text-sm sm:text-base py-4">No products found. Add a product to get started!</p>
              ) : (
                products.map((product) => (
                  <div key={product.id} className={`flex flex-col sm:flex-row gap-4 border border-gray-200 p-4 rounded-md shadow-sm ${product.available === false ? 'bg-gray-100 opacity-80' : 'bg-white'}`}>
                    <img src={product.coverImage} className="w-24 h-24 object-contain rounded-md flex-shrink-0 mx-auto sm:mx-0" alt={product.title} />
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-1">{product.title}</h3>
                      <p className="text-sm text-gray-700">Price: PKR {product.price?.toLocaleString()}</p>
                      <p className="text-sm text-gray-700">Category: {product.category}</p>
                      <p className="text-sm text-gray-700">Top Product: {product.isTopProduct ? "Yes" : "No"}</p>
                      <p className="text-sm mt-1">Status: <span className={`font-medium ${product.available === false ? 'text-red-600' : 'text-green-600'}`}>
                        {product.available === false ? 'Out of Stock' : 'Available'}
                      </span></p>
                      <div className="mt-3 flex justify-center sm:justify-start gap-2">
                        <button onClick={() => handleEdit(product)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 text-xs sm:text-sm rounded-md transition-colors duration-200">Edit</button>
                        <button onClick={() => handleDelete(product.id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-xs sm:text-sm rounded-md transition-colors duration-200">Delete</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Toggle Orders */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <button
            onClick={() => setShowOrders(!showOrders)}
            className="w-full bg-black text-white px-4 py-3 text-left rounded-md hover:bg-gray-800 transition-colors duration-200 flex items-center justify-between text-base sm:text-lg font-medium"
          >
            <span>{showOrders ? "➖ Hide Orders" : "🧾 View Customer Orders"}</span>
            <svg className={`w-5 h-5 transition-transform duration-200 ${showOrders ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>

          {showOrders && (
            <div className="mt-4 bg-gray-50 p-4 sm:p-6 rounded-lg shadow-inner space-y-6">
              {orders.length === 0 ? (
                <p className="text-center text-gray-500 text-sm sm:text-base py-4">No orders received yet.</p>
              ) : (
                <>
                  {/* New Orders */}
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold mb-3 text-gray-800 border-b pb-2">🆕 Pending Orders ({orders.filter(o => o.status !== "delivered").length})</h3>
                    {orders.filter(o => o.status !== "delivered").length === 0 ? (
                      <p className="text-gray-500 text-sm sm:text-base">No pending orders at the moment. Great job!</p>
                    ) : (
                      orders
                        .filter((order) => order.status !== "delivered")
                        .map((order) => (
                          <div key={order.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm mb-4 last:mb-0">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                              <div className="mb-2 sm:mb-0">
                                <p className="font-semibold text-base sm:text-lg text-gray-900">Order by: {order.user}</p>
                                <p className="text-sm text-gray-600">Total: PKR {order.total?.toLocaleString()}</p>
                                <p className="text-sm text-gray-600">Payment: {order.payment}</p>
                              </div>
                              <div className="flex items-center gap-3 mt-2 sm:mt-0">
                                <button
                                  className="text-sm text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
                                  onClick={() => toggleExpand(order.id)}
                                >
                                  {expandedOrders[order.id] ? "Hide Details" : "View Details"}
                                </button>
                                <button
                                  onClick={() => markAsDelivered(order.id)}
                                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm rounded-md transition-colors duration-200"
                                >
                                  ✅ Mark as Delivered
                                </button>
                              </div>
                            </div>

                            {expandedOrders[order.id] && (
                              <OrderDetails order={order} />
                            )}
                          </div>
                        ))
                    )}
                  </div>

                  {/* Delivered Orders */}
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold mt-6 mb-3 text-gray-800 border-b pb-2">📦 Delivered Orders ({orders.filter(o => o.status === "delivered").length})</h3>
                    {orders.filter(o => o.status === "delivered").length === 0 ? (
                      <p className="text-gray-500 text-sm sm:text-base">No delivered orders yet.</p>
                    ) : (
                      orders
                        .filter((order) => order.status === "delivered")
                        .map((order) => (
                          <div key={order.id} className="border border-green-300 rounded-lg p-4 bg-green-50 shadow-sm mb-4 last:mb-0">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                              <div className="mb-2 sm:mb-0">
                                <p className="font-semibold text-base sm:text-lg text-gray-900">Order by: {order.user}</p>
                                <p className="text-sm text-gray-600">Total: PKR {order.total?.toLocaleString()}</p>
                                <p className="text-sm text-gray-600">Payment: {order.payment}</p>
                              </div>
                              <button
                                className="text-sm text-blue-600 hover:text-blue-800 underline transition-colors duration-200 mt-2 sm:mt-0"
                                onClick={() => toggleExpand(order.id)}
                              >
                                {expandedOrders[order.id] ? "Hide Details" : "View Details"}
                              </button>
                            </div>

                            {expandedOrders[order.id] && (
                              <OrderDetails order={order} />
                            )}
                          </div>
                        ))
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-center bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <div className="p-3 sm:p-4 bg-gray-50 rounded-md">
            <p className="text-base sm:text-lg font-semibold text-gray-700">📅 Daily Sales</p>
            <p className="text-xl sm:text-2xl text-green-600 font-bold mt-1">PKR {totalSales.day.toLocaleString()}</p>
          </div>
          <div className="p-3 sm:p-4 bg-gray-50 rounded-md">
            <p className="text-base sm:text-lg font-semibold text-gray-700">🗓️ Monthly Sales</p>
            <p className="text-xl sm:text-2xl text-blue-600 font-bold mt-1">PKR {totalSales.month.toLocaleString()}</p>
          </div>
          <div className="p-3 sm:p-4 bg-gray-50 rounded-md">
            <p className="text-base sm:text-lg font-semibold text-gray-700">📆 Yearly Sales</p>
            <p className="text-xl sm:text-2xl text-purple-600 font-bold mt-1">PKR {totalSales.year.toLocaleString()}</p>
          </div>
        </div>

        {/* Sales Bar Chart */}
        <div className="bg-white p-4 sm:p-6 mt-4 sm:mt-6 rounded-lg shadow-md">
          <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-800">📊 Monthly Sales Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesByMonth}>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(value) => `PKR ${value.toLocaleString()}`} />
              <Tooltip formatter={(value) => [`PKR ${value.toLocaleString()}`, 'Sales']} />
              <Bar dataKey="total" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Product Sales Chart */}
        <div className="bg-white p-4 sm:p-6 mt-4 sm:mt-6 rounded-lg shadow-md">
          <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-800">📈 Top Selling Products (By Sales)</h2>
          <ResponsiveContainer width="100%" height={300}>
            {productSales.length > 0 ? (
              <BarChart data={productSales.slice(0, 10)}> {/* Show top 10 products */}
                <XAxis dataKey="title" tick={{ fontSize: 10 }} interval={0} angle={-30} textAnchor="end" height={60} />
                <YAxis tickFormatter={(value) => `PKR ${value.toLocaleString()}`} />
                <Tooltip formatter={(value) => [`PKR ${value.toLocaleString()}`, 'Sales']} />
                <Bar dataKey="totalSales" fill="#10b981" />
              </BarChart>
            ) : (
              <p className="text-center text-gray-500 py-10">No product sales data available yet.</p>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}

export default AdminPortal;