import { useState } from "react";
import axios from "axios";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  DollarSign,
  RefreshCw,
  BarChart3,
  ShoppingCart,
} from "lucide-react";

const api = axios.create({
  baseURL: "/api",
});

export default function App() {
  // ===== STATE =====
  const [userId, setUserId] = useState("1");
  const [balances, setBalances] = useState(null);
  const [side, setSide] = useState("bid");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [orderResult, setOrderResult] = useState(null);
  const [quoteSide, setQuoteSide] = useState("bid");
  const [quoteQty, setQuoteQty] = useState("");
  const [quoteUser, setQuoteUser] = useState("1");
  const [quoteValue, setQuoteValue] = useState(null);
  const [depth, setDepth] = useState({});

  // ===== API CALLS =====
  const fetchBalance = async () => {
    const res = await api.get(`/balance/${userId}`);
    setBalances(res.data.balances);
  };

  const submitOrder = async () => {
    const res = await api.post("/order", {
      side,
      price: Number(price),
      quantity: Number(quantity),
      userId,
    });
    setOrderResult(res.data);
  };

  const fetchQuote = async () => {
    const res = await api.post("/quote", {
      side: quoteSide,
      quantity: Number(quoteQty),
      userId: quoteUser,
    });
    setQuoteValue(res.data.quote);
  };

  const fetchDepth = async () => {
    const res = await api.get("/depth");
    setDepth(res.data.depth);
  };

  // ===== UI =====
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-8">
      <div className="max-w-5xl mx-auto space-y-10">
        <h1 className="text-3xl font-bold text-center mb-10 flex justify-center items-center gap-2">
          <BarChart3 className="text-blue-600" /> Mini Exchange
          <span className="text-gray-500 text-lg"></span>
        </h1>

        {/* ===== Balance Viewer ===== */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">
            <DollarSign className="text-green-500" /> User Balance
          </h2>
          <div className="flex gap-4 items-center mb-4">
            <select
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="border rounded px-3 py-1"
            >
              <option value="1">User 1</option>
              <option value="2">User 2</option>
            </select>
            <button
              onClick={fetchBalance}
              className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
            >
              Fetch
            </button>
          </div>
          {balances && (
            <div className="flex gap-6 text-lg">
              <p>
                💵 USD: <span className="font-semibold">{balances.USD}</span>
              </p>
              <p>
                📈 GOOGLE:{" "}
                <span className="font-semibold">{balances.GOOGLE}</span>
              </p>
            </div>
          )}
        </div>

        {/* ===== Order Form ===== */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">
            <ShoppingCart className="text-purple-500" /> Create Order
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium">Side</label>
              <select
                value={side}
                onChange={(e) => setSide(e.target.value)}
                className="border rounded px-2 py-1 w-full"
              >
                <option value="bid">Buy (Bid)</option>
                <option value="ask">Sell (Ask)</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium">User</label>
              <select
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="border rounded px-2 py-1 w-full"
              >
                <option value="1">User 1</option>
                <option value="2">User 2</option>
              </select>
            </div>
          </div>
          <button
            onClick={submitOrder}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Submit Order
          </button>
          {orderResult && (
            <p className="mt-3 text-green-600">
              ✅ Filled Quantity: {orderResult.filledQuantity}
            </p>
          )}
        </div>

        {/* ===== Quote Viewer ===== */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">
            <ArrowUpCircle className="text-amber-500" /> Quote Calculator
          </h2>
          <div className="flex flex-wrap gap-3 mb-4">
            <select
              value={quoteSide}
              onChange={(e) => setQuoteSide(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="bid">Bid</option>
              <option value="ask">Ask</option>
            </select>
            <input
              type="number"
              placeholder="Quantity"
              value={quoteQty}
              onChange={(e) => setQuoteQty(e.target.value)}
              className="border rounded px-2 py-1 w-32"
            />
            <select
              value={quoteUser}
              onChange={(e) => setQuoteUser(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="1">User 1</option>
              <option value="2">User 2</option>
            </select>
            <button
              onClick={fetchQuote}
              className="bg-amber-500 text-white px-4 py-1 rounded hover:bg-amber-600"
            >
              Get Quote
            </button>
          </div>
          {quoteValue !== null && (
            <p className="text-lg text-gray-700">
              💬 Estimated Quote:{" "}
              <span className="font-semibold">${quoteValue}</span>
            </p>
          )}
        </div>

        {/* ===== Market Depth ===== */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">
            <ArrowDownCircle className="text-blue-500" /> Market Depth
          </h2>
          <button
            onClick={fetchDepth}
            className="flex items-center gap-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-3"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-100 text-sm text-gray-600">
                <tr>
                  <th className="px-3 py-2 border">Price</th>
                  <th className="px-3 py-2 border">Quantity</th>
                  <th className="px-3 py-2 border">Type</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(depth).map(([price, data]) => (
                  <tr
                    key={price}
                    className={`text-center text-sm ${
                      data.type === "bid"
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    <td className="border px-3 py-2">{price}</td>
                    <td className="border px-3 py-2">{data.quantity}</td>
                    <td className="border px-3 py-2 uppercase font-semibold">
                      {data.type}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
