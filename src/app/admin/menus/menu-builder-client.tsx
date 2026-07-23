"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createMenu, updateMenu, deleteMenu, saveMenuItems } from "@/actions/menu";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

// --- Types ---
type MenuItemType = "PAGE" | "POST" | "CATEGORY" | "CUSTOM";

interface TreeMenuItem {
  id: string;
  menuId: string;
  parentId: string | null;
  label: string;
  url: string;
  type: string;
  referenceId: string | null;
  target: string | null;
  cssClass: string | null;
  order: number;
}

interface Menu {
  id: string;
  name: string;
  location: string | null;
  items: TreeMenuItem[];
}

interface Props {
  menus: Menu[];
  pages: any[];
  posts: any[];
  categories: any[];
}

// --- Sortable Item Component ---
function SortableMenuItem({ 
  item, 
  depth, 
  onDelete, 
  onUpdate, 
  onIndent, 
  onOutdent 
}: { 
  item: TreeMenuItem; 
  depth: number; 
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: Partial<TreeMenuItem>) => void;
  onIndent: (id: string) => void;
  onOutdent: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const [expanded, setExpanded] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginLeft: `${depth * 24}px`,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-white border border-gray-200 rounded-md mb-2 shadow-sm">
      <div className="flex items-center p-3 gap-3">
        <button {...attributes} {...listeners} className="cursor-grab text-gray-400 hover:text-gray-600 focus:outline-none">
          <DragIndicatorIcon fontSize="small" />
        </button>
        <div className="flex-1 font-medium text-gray-800 text-sm">
          {item.label}
          <span className="ml-2 text-[10px] uppercase font-bold text-gray-400 border border-gray-200 rounded px-1">{item.type}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <button onClick={() => onOutdent(item.id)} disabled={depth === 0} className="p-1 text-gray-400 hover:text-[#00704A] disabled:opacity-30 disabled:cursor-not-allowed">
            <KeyboardBackspaceIcon fontSize="small" />
          </button>
          <button onClick={() => onIndent(item.id)} className="p-1 text-gray-400 hover:text-[#00704A]">
            <ArrowRightAltIcon fontSize="small" />
          </button>
          <button onClick={() => setExpanded(!expanded)} className="p-1 text-gray-400 hover:text-gray-700">
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="p-4 border-t border-gray-100 bg-gray-50 space-y-3">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-600 mb-1">Navigation Label</label>
              <input 
                type="text" 
                value={item.label} 
                onChange={(e) => onUpdate(item.id, { label: e.target.value })}
                className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#00704A]" 
              />
            </div>
            {item.type === "CUSTOM" && (
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-600 mb-1">URL</label>
                <input 
                  type="text" 
                  value={item.url} 
                  onChange={(e) => onUpdate(item.id, { url: e.target.value })}
                  className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#00704A]" 
                />
              </div>
            )}
          </div>
          <div className="flex justify-between items-center mt-2">
            <button onClick={() => onDelete(item.id)} className="text-red-600 hover:underline text-xs flex items-center gap-1">
              <DeleteOutlineIcon fontSize="small" /> Remove
            </button>
            {item.type !== "CUSTOM" && (
              <p className="text-xs text-gray-500">Original: {item.label}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


// --- Main Component ---
export default function MenuBuilderClient({ menus, pages, posts, categories }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedMenuId, setSelectedMenuId] = useState<string>(menus[0]?.id || "new");
  const [menuName, setMenuName] = useState("");
  const [menuLocation, setMenuLocation] = useState<string>("");
  
  // Flat list of items representing the current working menu
  const [items, setItems] = useState<TreeMenuItem[]>([]);
  // To track parent-child depth in flat list, we'll store a parallel depth array or compute it
  const [depthMap, setDepthMap] = useState<Record<string, number>>({});

  // Form states for custom link
  const [customLabel, setCustomLabel] = useState("");
  const [customUrl, setCustomUrl] = useState("https://");

  const activeMenu = menus.find(m => m.id === selectedMenuId);

  useEffect(() => {
    if (selectedMenuId === "new") {
      setMenuName("");
      setMenuLocation("");
      setItems([]);
      setDepthMap({});
    } else if (activeMenu) {
      setMenuName(activeMenu.name);
      setMenuLocation(activeMenu.location || "");
      
      const flatItems = [...activeMenu.items].sort((a, b) => a.order - b.order);
      setItems(flatItems);
      
      const newDepthMap: Record<string, number> = {};
      const calculateDepth = (parentId: string | null): number => {
        if (!parentId) return 0;
        return (newDepthMap[parentId] || 0) + 1;
      };
      
      flatItems.forEach(item => {
        newDepthMap[item.id] = calculateDepth(item.parentId);
      });
      setDepthMap(newDepthMap);
    }
  }, [selectedMenuId, activeMenu]);


  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const generateId = () => crypto.randomUUID();

  const addItems = (type: MenuItemType, selection: any[]) => {
    const newItems = selection.map(s => {
      const id = generateId();
      setDepthMap(prev => ({ ...prev, [id]: 0 }));
      return {
        id,
        menuId: selectedMenuId !== "new" ? selectedMenuId : "",
        parentId: null,
        label: s.title || s.name || customLabel,
        url: type === "CUSTOM" ? customUrl : type === "PAGE" ? `/${s.slug}` : type === "POST" ? `/blog/${s.slug}` : `/category/${s.slug}`,
        type,
        referenceId: s.id || null,
        target: null,
        cssClass: null,
        order: 0
      };
    });
    setItems([...items, ...newItems]);
    
    // reset custom if used
    if (type === "CUSTOM") {
      setCustomLabel("");
      setCustomUrl("https://");
    }
  };

  const updateItem = (id: string, data: Partial<TreeMenuItem>) => {
    setItems(items.map(item => item.id === id ? { ...item, ...data } : item));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const indentItem = (id: string) => {
    setDepthMap(prev => ({ ...prev, [id]: Math.min((prev[id] || 0) + 1, 3) }));
  };
  
  const outdentItem = (id: string) => {
    setDepthMap(prev => ({ ...prev, [id]: Math.max((prev[id] || 0) - 1, 0) }));
  };

  const handleSave = () => {
    startTransition(async () => {
      try {
        let currentMenuId = selectedMenuId;
        
        // 1. Create or Update the Menu shell
        if (currentMenuId === "new") {
          const res = await createMenu({ name: menuName, location: menuLocation || null });
          if (!res.success) return alert(res.error);
          currentMenuId = res.data!.id;
          setSelectedMenuId(currentMenuId);
        } else {
          const res = await updateMenu(currentMenuId, { name: menuName, location: menuLocation || null });
          if (!res.success) return alert(res.error);
        }

        // 2. Compute parentIds based on depthMap and order
        const finalItems = items.map((item, index) => {
          let parentId = null;
          const currentDepth = depthMap[item.id] || 0;
          
          if (currentDepth > 0) {
            // Find the closest previous item with depth = currentDepth - 1
            for (let i = index - 1; i >= 0; i--) {
              if ((depthMap[items[i].id] || 0) === currentDepth - 1) {
                parentId = items[i].id;
                break;
              }
            }
          }

          return {
            ...item,
            menuId: currentMenuId,
            parentId,
            order: index,
          };
        });

        // 3. Save Items
        const resSave = await saveMenuItems(currentMenuId, finalItems);
        if (!resSave.success) return alert(resSave.error);
        
        alert("Menu saved successfully!");
        router.refresh();
      } catch (err) {
        alert("Failed to save menu");
      }
    });
  };

  const handleDeleteMenu = () => {
    if (!confirm("Are you sure you want to delete this menu?")) return;
    startTransition(async () => {
      await deleteMenu(selectedMenuId);
      setSelectedMenuId("new");
    });
  };


  return (
    <div className="flex gap-6 items-start">
      
      {/* LEFT COLUMN - Add Items */}
      <div className="w-1/3 bg-white border border-gray-200 rounded-lg shadow-sm p-4 sticky top-6">
        <h3 className="font-semibold text-gray-900 mb-4">Add menu items</h3>
        
        <div className="space-y-3">
          {/* Custom Link */}
          <details className="group border border-gray-200 rounded">
            <summary className="p-3 font-medium text-sm cursor-pointer list-none flex justify-between bg-gray-50 hover:bg-gray-100">
              Custom Links <ExpandMoreIcon fontSize="small" className="group-open:rotate-180 transition-transform"/>
            </summary>
            <div className="p-3 border-t border-gray-200 space-y-3">
              <div>
                <label className="block text-xs mb-1 text-gray-600">URL</label>
                <input type="text" value={customUrl} onChange={e => setCustomUrl(e.target.value)} className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:border-[#00704A]" />
              </div>
              <div>
                <label className="block text-xs mb-1 text-gray-600">Link Text</label>
                <input type="text" value={customLabel} onChange={e => setCustomLabel(e.target.value)} className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:border-[#00704A]" />
              </div>
              <div className="flex justify-end">
                <button 
                  onClick={() => addItems("CUSTOM", [{ title: customLabel, url: customUrl }])}
                  disabled={!customLabel || !customUrl}
                  className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded text-gray-700 disabled:opacity-50"
                >
                  Add to Menu
                </button>
              </div>
            </div>
          </details>

          {/* Pages */}
          <details className="group border border-gray-200 rounded">
            <summary className="p-3 font-medium text-sm cursor-pointer list-none flex justify-between bg-gray-50 hover:bg-gray-100">
              Pages <ExpandMoreIcon fontSize="small" className="group-open:rotate-180 transition-transform"/>
            </summary>
            <div className="p-3 border-t border-gray-200 max-h-60 overflow-y-auto">
              {pages.map(p => (
                <div key={p.id} className="flex justify-between items-center py-1">
                  <span className="text-sm">{p.title}</span>
                  <button onClick={() => addItems("PAGE", [p])} className="text-xs text-[#00704A] hover:underline">Add</button>
                </div>
              ))}
            </div>
          </details>

          {/* Posts */}
          <details className="group border border-gray-200 rounded">
            <summary className="p-3 font-medium text-sm cursor-pointer list-none flex justify-between bg-gray-50 hover:bg-gray-100">
              Posts <ExpandMoreIcon fontSize="small" className="group-open:rotate-180 transition-transform"/>
            </summary>
            <div className="p-3 border-t border-gray-200 max-h-60 overflow-y-auto">
              {posts.map(p => (
                <div key={p.id} className="flex justify-between items-center py-1">
                  <span className="text-sm">{p.title}</span>
                  <button onClick={() => addItems("POST", [p])} className="text-xs text-[#00704A] hover:underline">Add</button>
                </div>
              ))}
            </div>
          </details>

          {/* Categories */}
          <details className="group border border-gray-200 rounded">
            <summary className="p-3 font-medium text-sm cursor-pointer list-none flex justify-between bg-gray-50 hover:bg-gray-100">
              Categories <ExpandMoreIcon fontSize="small" className="group-open:rotate-180 transition-transform"/>
            </summary>
            <div className="p-3 border-t border-gray-200 max-h-60 overflow-y-auto">
              {categories.map(c => (
                <div key={c.id} className="flex justify-between items-center py-1">
                  <span className="text-sm">{c.name}</span>
                  <button onClick={() => addItems("CATEGORY", [c])} className="text-xs text-[#00704A] hover:underline">Add</button>
                </div>
              ))}
            </div>
          </details>
        </div>
      </div>

      {/* RIGHT COLUMN - Menu Structure */}
      <div className="flex-1 bg-white border border-gray-200 rounded-lg shadow-sm">
        
        {/* Menu selector */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50 rounded-t-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Select a menu to edit:</span>
            <select 
              value={selectedMenuId} 
              onChange={e => setSelectedMenuId(e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1.5 min-w-[200px]"
            >
              <option value="new">— Create a new menu —</option>
              {menus.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
          <button 
            onClick={handleSave} 
            disabled={isPending || !menuName}
            className="px-4 py-2 bg-[#00704A] text-white text-sm font-medium rounded hover:bg-[#1E3932] disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save Menu"}
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Menu Info */}
          <div className="flex gap-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Menu Name</label>
              <input 
                type="text" 
                value={menuName}
                onChange={e => setMenuName(e.target.value)}
                placeholder="e.g. Primary Menu"
                className="w-full max-w-sm border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#00704A]" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Location</label>
              <select 
                value={menuLocation}
                onChange={e => setMenuLocation(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#00704A]" 
              >
                <option value="">— Select Location —</option>
                <option value="HEADER">Header Navigation</option>
                <option value="FOOTER">Footer Navigation</option>
              </select>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Menu Items */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-4">Menu Structure</h3>
            <p className="text-sm text-gray-500 mb-4">
              Drag each item into the order you prefer. Use the indent arrows to create sub-menus.
            </p>
            
            <div className="min-h-[200px] p-4 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
              {items.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  No menu items yet. Add items from the left column.
                </div>
              ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={items} strategy={verticalListSortingStrategy}>
                    {items.map(item => (
                      <SortableMenuItem 
                        key={item.id} 
                        item={item} 
                        depth={depthMap[item.id] || 0}
                        onDelete={deleteItem}
                        onUpdate={updateItem}
                        onIndent={indentItem}
                        onOutdent={outdentItem}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              )}
            </div>
          </div>

        </div>
        
        {/* Footer actions */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg flex justify-between items-center">
          {selectedMenuId !== "new" && (
            <button 
              onClick={handleDeleteMenu}
              disabled={isPending}
              className="text-red-600 text-sm hover:underline font-medium"
            >
              Delete Menu
            </button>
          )}
          <div className="flex-1"></div>
          <button 
            onClick={handleSave} 
            disabled={isPending || !menuName}
            className="px-4 py-2 bg-[#00704A] text-white text-sm font-medium rounded hover:bg-[#1E3932] disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save Menu"}
          </button>
        </div>

      </div>
    </div>
  );
}
