import React, { useEffect, useState } from "react";
import OrderCard from "./OrderCard";

/**
 * CategoryPage with large menu images + subtle animations (fade+slide-in + stagger).
 * Paste this file as frontend/src/components/CategoryPage.jsx
 */

export default function CategoryPage({ category, onBack }) {
  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [placing, setPlacing] = useState(false);

  const loadOrders = () => {
    fetch(`http://127.0.0.1:8000/categories/${category.id}/orders`)
      .then((r) => r.json())
      .then(setOrders)
      .catch(() => setOrders([]));
  };

  const loadMenu = () => {
    setLoadingMenu(true);
    fetch(`http://127.0.0.1:8000/categories/${category.id}/menu`)
      .then((r) => r.json())
      .then((data) => setMenu(data))
      .catch(() => setMenu([]))
      .finally(() => setLoadingMenu(false));
  };

  useEffect(() => {
    loadOrders();
    loadMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category.id]);

  const getDefaultImage = (menuItem) => {
    const lower = (menuItem.name || "").toLowerCase();
    const cat = (category.name || "").toLowerCase();
  };

  // Place order for a menu item (prompts for name)
  const addMenuItemOrder = async (menuItem) => {
    const username = window.prompt(`Enter your name to order "${menuItem.name}":`);
    if (!username || username.trim() === "") return;

    setPlacing(true);
    try {
      const payload = {
        category_id: category.id,
        username: username.trim(),
        item: menuItem.name,
      };
      const res = await fetch("http://127.0.0.1:8000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) loadOrders();
      else alert("Failed to place menu order");
    } catch (err) {
      console.error(err);
      alert("Network error placing order");
    } finally {
      setPlacing(false);
    }
  };

  // Add a custom item (prompts for item name and name)
  const addCustomItem = async () => {
    const itemName = window.prompt(`Enter item name to order from ${category.name}:`);
    if (!itemName || itemName.trim() === "") return;
    const username = window.prompt(`Enter your name to order "${itemName}":`);
    if (!username || username.trim() === "") return;

    setPlacing(true);
    try {
      const payload = {
        category_id: category.id,
        username: username.trim(),
        item: itemName.trim(),
      };
      const res = await fetch("http://127.0.0.1:8000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) loadOrders();
      else alert("Failed to place custom order");
    } catch (err) {
      console.error(err);
      alert("Network error placing order");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="text-blue-600 action-btn animate-pop">
          ← Back
        </button>
        <h2 className="text-2xl font-semibold">{category.name}</h2>
        <div />
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Choose items from the menu below. Click <strong>Add</strong> to order — you'll be prompted for your name.
      </p>

      {/* Menu header with Add Custom */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Menu</h3>
        <button
          onClick={addCustomItem}
          className="px-2 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 action-btn"
          disabled={placing}
        >
          {placing ? "Placing..." : "Add Custom Item"}
        </button>
      </div>

      {/* Menu grid: animated cards */}
      {loadingMenu ? (
        <div className="text-sm text-gray-500">Loading menu...</div>
      ) : menu.length === 0 ? (
        <div className="text-sm text-gray-500">No menu items available.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-5 md:grid-cols-5 gap-6 mb-6" data-anim="stagger">
          {menu.map((m, idx) => {
            const imgSrc = m.image && m.image.length > 10 ? m.image : getDefaultImage(m);
            return (
              <div
                key={m.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition animate-fade-in-up"
                style={{ animationDelay: `${idx * 70}ms` }}
              >
                {/* BIG IMAGE */}
                <img src={imgSrc} alt={m.name} className="w-full h-48 object-cover" />

                {/* Content */}
                <div className="p-1">
                  <h3 className="text-lg font-semibold text-gray-800">{m.name}</h3>

                  {m.price !== undefined && m.price !== null && (
                    <p className="text-gray-600 mt-1 text-sm">₹{Number(m.price).toFixed(2)}</p>
                  )}

                  <p className="text-xs text-gray-500 mt-2">Delicious & fresh — made to order</p>

                  {/* Add button */}
                  <button
                    onClick={() => addMenuItemOrder(m)}
                    className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg text-sm hover:bg-green-700 action-btn"
                    disabled={placing}
                  >
                    {placing ? "..." : "Add"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* orders list - animate each order card with a small delay */}
      <div className="space-y-3">
        {orders.length === 0 && <div className="text-sm text-gray-500">No orders yet.</div>}
        {orders.map((o, i) => (
          <div
            key={o.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <OrderCard order={o} onActionDone={loadOrders} />
          </div>
        ))}
      </div>
    </div>
  );
}
