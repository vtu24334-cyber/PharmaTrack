"use client";

import { database } from "../../firebaseConfig";
import { ref, onValue, update, push } from "firebase/database";
import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";

const STATUS_OPTIONS = ["In Stock", "Low Stock", "Out of Stock"];

export default function InventoryPage() {
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    quantity: "",
    unit: "",
    status: "In Stock",
  });
  const [editRows, setEditRows] = useState<{ [key: string]: boolean }>({});
  const [editData, setEditData] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    const inventoryRef = ref(database, "inventory");
    onValue(inventoryRef, (snapshot) => {
      const data = snapshot.val() || {};
      const items = Object.entries(data).map(([id, val]: [string, any]) => ({
        id,
        ...val,
      }));
      setInventoryItems(items);
    });
  }, []);

  // Add new item handler
  function handleAddItem(e: any) {
    e.preventDefault();
    if (!newItem.name || !newItem.category || !newItem.quantity || !newItem.unit)
      return;
    push(ref(database, "inventory"), {
      name: newItem.name,
      category: newItem.category,
      quantity: parseInt(newItem.quantity),
      unit: newItem.unit,
      status: newItem.status,
    });
    setNewItem({
      name: "",
      category: "",
      quantity: "",
      unit: "",
      status: "In Stock",
    });
  }

  // Edit logic
  const startEdit = (id: string, data: any) => {
    setEditRows({ ...editRows, [id]: true });
    setEditData({ ...editData, [id]: { ...data } });
  };

  const cancelEdit = (id: string) => {
    setEditRows({ ...editRows, [id]: false });
    setEditData({ ...editData, [id]: undefined });
  };

  const saveEdit = (id: string) => {
    const itemRef = ref(database, `inventory/${id}`);
    update(itemRef, { ...editData[id], quantity: parseInt(editData[id].quantity) });
    setEditRows({ ...editRows, [id]: false });
    setEditData({ ...editData, [id]: undefined });
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "In Stock":
        return "default";
      case "Low Stock":
        return "secondary";
      case "Out of Stock":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Inventory Management</CardTitle>
            <CardDescription>
              Track and manage raw materials and finished products.
            </CardDescription>
          </div>
          <form onSubmit={handleAddItem} className="flex gap-2">
            <Input
              placeholder="Name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="pl-4"
            />
            <Input
              placeholder="Category"
              value={newItem.category}
              onChange={(e) =>
                setNewItem({ ...newItem, category: e.target.value })
              }
              className="pl-4"
            />
            <Input
              placeholder="Quantity"
              type="number"
              value={newItem.quantity}
              onChange={(e) =>
                setNewItem({ ...newItem, quantity: e.target.value })
              }
              className="pl-4 w-[80px]"
            />
            <Input
              placeholder="Unit"
              value={newItem.unit}
              onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
              className="pl-4 w-[80px]"
            />
            <select
              value={newItem.status}
              onChange={(e) => setNewItem({ ...newItem, status: e.target.value })}
              className="px-2 py-1 rounded border"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <Button type="submit">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Item
            </Button>
          </form>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item ID</TableHead>
              <TableHead>Item Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Edit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventoryItems.map((item) =>
              editRows[item.id] ? (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>
                    <Input
                      value={editData[item.id].name}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          [item.id]: {
                            ...editData[item.id],
                            name: e.target.value,
                          },
                        })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={editData[item.id].category}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          [item.id]: {
                            ...editData[item.id],
                            category: e.target.value,
                          },
                        })
                      }
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Input
                      type="number"
                      value={editData[item.id].quantity}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          [item.id]: {
                            ...editData[item.id],
                            quantity: e.target.value,
                          },
                        })
                      }
                      style={{ width: 70 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={editData[item.id].unit}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          [item.id]: {
                            ...editData[item.id],
                            unit: e.target.value,
                          },
                        })
                      }
                      style={{ width: 65 }}
                    />
                  </TableCell>
                  <TableCell>
                    <select
                      value={editData[item.id].status}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          [item.id]: {
                            ...editData[item.id],
                            status: e.target.value,
                          },
                        })
                      }
                      style={{ padding: "4px", borderRadius: 5, border: "1px solid #ddd" }}
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="secondary"
                      onClick={() => saveEdit(item.id)}
                      className="mr-2"
                    >
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => cancelEdit(item.id)}
                    >
                      Cancel
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(item.status)}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      onClick={() => startEdit(item.id, item)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
