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
        const orderDate = order.createdAt?.toDate?.() || new Date();
        const total = order.total || 0;

        if (orderDate >= startOfDay) dayTotal += total;
        if (orderDate >= startOfMonth) monthTotal += total;
        if (orderDate >= startOfYear) yearTotal += total;

        const month = orderDate.toLocaleString('default', { month: 'short' });
        monthMap[month] = (monthMap[month] || 0) + total;

        (order.items || []).forEach(item => {
          if (!productMap[item.productId]) {
            productMap[item.productId] = {
              title: item.title,
              totalQty: 0,
              totalSales: 0
            };
          }
          productMap[item.productId].totalQty += item.quantity;
          productMap[item.productId].totalSales += item.price * item.quantity;
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

      setProductSales(Object.values(productMap));
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
      await updateDoc(doc(db, "orders", orderId), {
        status: "delivered",
      });
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
    <div className="mt-4 space-y-2 text-sm text-gray-700">
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Payment Method:</strong> {order.payment}</p>
      <p><strong>Shipping Method:</strong> {order.shipping}</p>
      <p><strong>Promo Code:</strong> {order.promoCode || "None"}</p>
      <p><strong>Notes:</strong> {order.notes || "None"}</p>
      <p>
        <strong>Order Time:</strong>{" "}
        {order.createdAt?.toDate?.().toLocaleString() || "Unknown"}
      </p>

      <div>
        <strong>Shipping Address:</strong>
        <div className="ml-4">
          <p>{order.shippingAddress?.address}</p>
          <p>{order.shippingAddress?.city}, {order.shippingAddress?.region}</p>
          <p>{order.shippingAddress?.country}, {order.shippingAddress?.postalCode}</p>
          <p>Phone: {order.shippingAddress?.phone}</p>
        </div>
      </div>

      <div>
        <strong>Items:</strong>
        <ul className="list-disc ml-5 mt-1">
          {(order.items || []).map((item, i) => (
            <li key={i}>
              {item.title} – {item.type} – Size: {item.size} – Qty: {item.quantity} – Price: PKR {item.price}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto p-6 space-y-10">
        {/* Toggle Add Product */}
        <div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full bg-black text-white px-4 py-3 text-left rounded hover:bg-gray-800"
          >
            {showForm ? "➖ Hide Add Product" : "➕ Add Product"}
          </button>

          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="bg-white p-6 mt-4 rounded shadow space-y-4"
            >
              {successMsg && <p className="text-green-600">{successMsg}</p>}
              <input name="title" placeholder="Product Title" className="w-full border p-2" value={formData.title} onChange={handleChange} required />
              <input name="price" placeholder="Price" type="number" className="w-full border p-2" value={formData.price} onChange={handleChange} required />
              <input name="category" placeholder="Category" className="w-full border p-2" value={formData.category} onChange={handleChange} required />
              <textarea name="description" placeholder="Description" className="w-full border p-2" value={formData.description} onChange={handleChange} required />
              <input name="coverImage" placeholder="Cover Image URL" className="w-full border p-2" value={formData.coverImage} onChange={handleChange} required />
              <input name="image1" placeholder="Image 1 URL" className="w-full border p-2" value={formData.image1} onChange={handleChange} />
              <input name="image2" placeholder="Image 2 URL" className="w-full border p-2" value={formData.image2} onChange={handleChange} />
              
              <div className="flex gap-4">
                <label className="flex gap-2 text-sm">
                  <input type="checkbox" name="isTopProduct" checked={formData.isTopProduct} onChange={handleChange} />
                  Mark as Top Product
                </label>
                <label className="flex gap-2 text-sm">
                  <input type="checkbox" name="available" checked={formData.available} onChange={handleChange} />
                  Product Available
                </label>
              </div>
              
              <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                {editId ? "Update Product" : "Add Product"}
              </button>
            </form>
          )}
        </div>

        {/* Toggle Inventory */}
        <div>
          <button
            onClick={() => setShowInventory(!showInventory)}
            className="w-full bg-black text-white px-4 py-3 text-left rounded hover:bg-gray-800"
          >
            {showInventory ? "➖ Hide Inventory" : "📦 View Inventory"}
          </button>

          {showInventory && (
            <div className="mt-4 bg-white p-4 rounded shadow grid md:grid-cols-2 gap-4">
              {products.length === 0 ? (
                <p className="col-span-full text-center text-gray-500">No products found.</p>
              ) : (
                products.map((product) => (
                  <div key={product.id} className={`flex gap-4 border p-4 rounded ${product.available === false ? 'bg-gray-100 opacity-80' : ''}`}>
                    <img src={product.coverImage} className="w-24 h-24 object-contain" alt={product.title} />
                    <div className="flex-1">
                      <h3 className="font-semibold">{product.title}</h3>
                      <p>Price: PKR {product.price}</p>
                      <p>Category: {product.category}</p>
                      <p>Top Product: {product.isTopProduct ? "Yes" : "No"}</p>
                      <p>Status: <span className={`font-medium ${product.available === false ? 'text-red-600' : 'text-green-600'}`}>
                        {product.available === false ? 'Out of Stock' : 'Available'}
                      </span></p>
                      <div className="mt-2 flex gap-2">
                        <button onClick={() => handleEdit(product)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 text-sm rounded">Edit</button>
                        <button onClick={() => handleDelete(product.id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm rounded">Delete</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Toggle Orders */}
        <div>
          <button
            onClick={() => setShowOrders(!showOrders)}
            className="w-full bg-black text-white px-4 py-3 text-left rounded hover:bg-gray-800"
          >
            {showOrders ? "➖ Hide Orders" : "🧾 View Orders"}
          </button>

          {showOrders && (
            <div className="mt-4 bg-white p-4 rounded shadow space-y-6">
              {orders.length === 0 ? (
                <p className="text-center text-gray-500">No orders yet.</p>
              ) : (
                <>
                  {/* New Orders */}
                  <div>
                    <h3 className="text-lg font-bold mb-3">🆕 New Orders</h3>
                    {orders.filter(o => o.status !== "delivered").length === 0 ? (
                      <p className="text-gray-500">No new orders.</p>
                    ) : (
                      orders
                        .filter((order) => order.status !== "delivered")
                        .map((order) => (
                          <div key={order.id} className="border rounded p-4 bg-gray-50 shadow-sm">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-semibold">Order by: {order.user}</p>
                                <p className="text-sm text-gray-500">Total: PKR {order.total?.toLocaleString()}</p>
                                <p className="text-sm text-gray-500">Payment: {order.payment}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <button
                                  className="text-sm text-blue-600 underline"
                                  onClick={() => toggleExpand(order.id)}
                                >
                                  {expandedOrders[order.id] ? "Hide Details" : "View Details"}
                                </button>
                                <button
                                  onClick={() => markAsDelivered(order.id)}
                                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm rounded"
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
                    <h3 className="text-lg font-bold mt-6 mb-3 text-gray-700">📦 Delivered Orders</h3>
                    {orders.filter(o => o.status === "delivered").length === 0 ? (
                      <p className="text-gray-500">No delivered orders yet.</p>
                    ) : (
                      orders
                        .filter((order) => order.status === "delivered")
                        .map((order) => (
                          <div key={order.id} className="border rounded p-4 bg-green-50 shadow-sm">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-semibold">Order by: {order.user}</p>
                                <p className="text-sm text-gray-500">Total: PKR {order.total?.toLocaleString()}</p>
                                <p className="text-sm text-gray-500">Payment: {order.payment}</p>
                              </div>
                              <button
                                className="text-sm text-blue-600 underline"
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center bg-white p-6 rounded shadow">
          <div>
            <p className="text-lg font-semibold">📅 Daily Sales</p>
            <p className="text-2xl text-green-600 font-bold">PKR {totalSales.day.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-lg font-semibold">🗓️ Monthly Sales</p>
            <p className="text-2xl text-blue-600 font-bold">PKR {totalSales.month.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-lg font-semibold">📆 Yearly Sales</p>
            <p className="text-2xl text-purple-600 font-bold">PKR {totalSales.year.toLocaleString()}</p>
          </div>
        </div>

        {/* Sales Bar Chart */}
        <div className="bg-white p-6 mt-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">📊 Monthly Sales Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesByMonth}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Product Sales Chart */}
        <div className="bg-white p-6 mt-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">🧾 Top Selling Products</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productSales.slice(0, 10)}>
              <XAxis dataKey="title" tick={{ fontSize: 10 }} interval={0} angle={-30} textAnchor="end" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalSales" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}

export default AdminPortal;