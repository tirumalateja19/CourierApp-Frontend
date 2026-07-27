import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

const inputClass = "p-2 rounded-lg border border-gray-300 text-sm";

const Items = ({ items, jobId, setItems }) => {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [fragile, setFragile] = useState(false);
  const [adding, setAdding] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editItemName, setEditItemName] = useState("");
  const [editQuantity, setEditQuantity] = useState("");
  const [editFragile, setEditFragile] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  const resetAddForm = () => {
    setItemName("");
    setQuantity("");
    setFragile(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      const response = await api.post(`/api/jobs/pickup/${jobId}/items`, {
        itemName,
        quantity,
        fragile,
      });
      setItems((prev) => [...prev, response.data.item]);
      toast.success("Item added");
      resetAddForm();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add item");
    } finally {
      setAdding(false);
    }
  };

  const startEditing = (item) => {
    setEditingId(item._id);
    setEditItemName(item.itemName);
    setEditQuantity(item.quantity);
    setEditFragile(item.fragile);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const handleSaveEdit = async (itemId) => {
    setSavingEdit(true);
    try {
      const response = await api.patch(
        `/api/jobs/pickup/${jobId}/items/${itemId}`,
        {
          itemName: editItemName,
          quantity: editQuantity,
          fragile: editFragile,
        },
      );
      setItems((prev) =>
        prev.map((it) => (it._id === itemId ? response.data.updatedItem : it)),
      );
      toast.success("Item updated");
      setEditingId(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update item");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (itemId) => {
    setDeletingId(itemId);
    try {
      await api.delete(`/api/jobs/pickup/${jobId}/items/${itemId}`);
      setItems((prev) => prev.filter((it) => it._id !== itemId));
      toast.success("Item removed");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to remove item");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      {items.length === 0 ? (
        <p className="text-sm text-gray-400 italic mb-3">No items added yet</p>
      ) : (
        <ul className="flex flex-col gap-1 mb-3">
          {items.map((item) =>
            editingId === item._id ? (
              <li
                key={item._id}
                className="flex flex-wrap items-center gap-2 border-b border-gray-100 py-2"
              >
                <input
                  type="text"
                  value={editItemName}
                  onChange={(e) => setEditItemName(e.target.value)}
                  className={`${inputClass} w-32`}
                />
                <input
                  type="number"
                  value={editQuantity}
                  onChange={(e) => setEditQuantity(e.target.value)}
                  className={`${inputClass} w-20`}
                />
                <label className="flex items-center gap-1.5 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={editFragile}
                    onChange={(e) => setEditFragile(e.target.checked)}
                  />
                  Fragile
                </label>
                <button
                  onClick={() => handleSaveEdit(item._id)}
                  disabled={savingEdit}
                  className="text-sm px-3 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition disabled:opacity-50"
                >
                  {savingEdit ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={cancelEditing}
                  disabled={savingEdit}
                  className="text-sm px-3 py-2 rounded-lg bg-gray-200 text-black hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </li>
            ) : (
              <li
                key={item._id}
                className="flex items-center justify-between border-b border-gray-100 py-2 text-sm text-gray-700"
              >
                <span className="flex-1">{item.itemName}</span>
                <span className="w-20 text-center">Qty: {item.quantity}</span>
                <span className="w-28 text-center">
                  {item.fragile ? "Fragile" : "Not fragile"}
                </span>
                <span className="flex gap-2">
                  <button
                    onClick={() => startEditing(item)}
                    className="text-sm px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    disabled={deletingId === item._id}
                    className="text-sm px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition disabled:opacity-50"
                  >
                    {deletingId === item._id ? "..." : "Delete"}
                  </button>
                </span>
              </li>
            ),
          )}
        </ul>
      )}

      <form
        onSubmit={handleAdd}
        className="flex flex-wrap items-center gap-2 mt-2"
      >
        <input
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          placeholder="Item name"
          required
          className={`${inputClass} w-32`}
        />
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Qty"
          required
          min="1"
          className={`${inputClass} w-20`}
        />
        <label className="flex items-center gap-1.5 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={fragile}
            onChange={(e) => setFragile(e.target.checked)}
          />
          Fragile
        </label>
        <button
          type="submit"
          disabled={adding}
          className="text-sm px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition disabled:opacity-50"
        >
          {adding ? "Adding..." : "+ Add item"}
        </button>
      </form>
    </div>
  );
};

export default Items;
