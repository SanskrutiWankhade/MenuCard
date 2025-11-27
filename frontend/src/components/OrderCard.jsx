import React, { useState } from "react";

export default function OrderCard({ order, onActionDone }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Delete this order?")) return;
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/orders/${order.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        if (typeof onActionDone === "function") onActionDone();
      } else {
        const err = await res.json().catch(() => ({}));
        alert("Failed to delete order: " + (err.detail || res.statusText));
      }
    } catch (e) {
      console.error(e);
      alert("Network error while deleting order");
    } finally {
      setLoading(false);
    }
  };

  const handleReceived = async () => {
    if (!window.confirm("Mark this order as received?")) return;
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/orders/${order.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        if (typeof onActionDone === "function") onActionDone();
      } else {
        const err = await res.json().catch(() => ({}));
        alert("Failed to mark order received: " + (err.detail || res.statusText));
      }
    } catch (e) {
      console.error(e);
      alert("Network error while updating order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 bg-white rounded shadow-sm flex justify-between items-start">
      <div>
        <div className="font-medium">{order.username}</div>
        <div className="text-sm text-gray-600">{order.item || "—"}</div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="text-xs text-gray-400 mb-1">#{order.id}</div>
        <div className="flex gap-2">
          <button
            onClick={handleReceived}
            disabled={loading}
            className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:opacity-60"
          >
            {loading ? "..." : "Order Received"}
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 disabled:opacity-60"
          >
            {loading ? "..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
