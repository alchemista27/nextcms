"use client";

import { useState } from "react";
import type { MenuItem } from "@prisma/client";
import { MenuItemForm } from "../MenuItemForm";
import { deleteMenuItemAction } from "../actions";

export function MenuItemsManager({ menuId, items }: { menuId: string, items: MenuItem[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 flex flex-col gap-4">
        {items.length === 0 ? (
          <div className="bg-surface border border-border rounded-xl p-10 text-center text-text-secondary">
            <span className="material-icons-outlined text-4xl opacity-30 mb-2 block">list</span>
            No items in this menu yet.
          </div>
        ) : (
          <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
            {items.map((item) => (
              <div key={item.id} className="p-4 border-b last:border-b-0 border-border flex items-center justify-between hover:bg-bg/50">
                <div className="flex flex-col">
                  <div className="font-medium text-text-primary flex items-center gap-2">
                    <span className="material-icons-outlined text-text-secondary text-lg">drag_indicator</span>
                    {item.label}
                  </div>
                  <div className="text-xs text-text-secondary pl-7">
                    {item.type} • {item.url || item.referenceId || "No URL"} • Order: {item.order}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { setEditingId(item.id); setIsAdding(false); }} className="px-2 py-1 text-xs border border-border rounded hover:bg-bg text-text-primary transition">Edit</button>
                  <form action={deleteMenuItemAction.bind(null, item.id)}>
                    <button type="submit" className="px-2 py-1 text-xs border border-danger/30 rounded hover:bg-danger/5 text-danger transition" onClick={(e) => { if (!confirm(`Delete ${item.label}?`)) e.preventDefault(); }}>Delete</button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-5">
        <div className="bg-surface border border-border rounded-xl p-5 shadow-sm">
          <h3 className="font-semibold text-text-primary mb-4 pb-2 border-b border-border flex justify-between items-center">
            {editingId ? "Edit Item" : "Add Item"}
            {editingId && (
              <button onClick={() => setEditingId(null)} className="text-xs text-primary hover:underline">Cancel Edit</button>
            )}
          </h3>
          <MenuItemForm 
            menuId={menuId} 
            initialData={editingId ? items.find(i => i.id === editingId) : undefined} 
            onSuccess={() => { setEditingId(null); setIsAdding(false); }} 
          />
        </div>
      </div>
    </div>
  );
}
