"use client";

import { useEffect, useState } from "react";
import { ref, onValue, set, update, remove, push } from "firebase/database";
import { database } from "../../firebaseConfig";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, Edit, Trash2, Save, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

type Budget = {
  id: string;
  department: string;
  allocated: number;
  spent: number;
};

export default function BudgetPage() {
  const [budgets, setBudgets] = useState<Record<string, Budget>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Budget>>({});
  const [originalData, setOriginalData] = useState<Partial<Budget> | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newBudget, setNewBudget] = useState({
    department: "",
    allocated: 0,
    spent: 0,
  });

  useEffect(() => {
    const budgetRef = ref(database, "budget");
    const unsubscribe = onValue(
      budgetRef,
      (snapshot) => {
        const data = snapshot.val() || {};
        setBudgets(data);
        setIsLoading(false);
      },
      () => setIsLoading(false)
    );
    return () => unsubscribe();
  }, []);

  const handleAddBudget = async () => {
    if (!newBudget.department || !newBudget.allocated || isNaN(newBudget.allocated)) {
      toast({
        title: "Validation Error",
        description: "Please enter a department and allocated amount.",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    try {
      const budgetRef = ref(database, "budget");
      const newBudgetRef = push(budgetRef);
      await set(newBudgetRef, {
        ...newBudget,
        id: newBudgetRef.key,
      });
      setNewBudget({
        department: "",
        allocated: 0,
        spent: 0,
      });
      setIsDialogOpen(false);
      toast({ title: "Success", description: "Budget row added." });
    } catch {
      toast({
        title: "Error",
        description: "Failed to add budget row.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartEdit = (id: string, budget: Budget) => {
    setEditingId(id);
    setEditForm(budget);
    setOriginalData(budget);
  };

  const handleSaveEdit = async (id: string) => {
    setIsLoading(true);
    try {
      const budgetRef = ref(database, `budget/${id}`);
      await update(budgetRef, editForm);
      toast({ title: "Success", description: "Budget updated." });
      setEditingId(null);
      setEditForm({});
      setOriginalData(null);
    } catch {
      toast({
        title: "Error",
        description: "Update failed.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
    setOriginalData(null);
  };

  const handleDelete = async (id: string, department: string) => {
    if (!confirm(`Delete budget row for ${department}?`)) return;
    setIsLoading(true);
    try {
      const budgetRef = ref(database, `budget/${id}`);
      await remove(budgetRef);
      toast({ title: "Success", description: "Budget row deleted." });
    } catch {
      toast({
        title: "Error",
        description: "Delete failed.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const hasChanges =
    originalData ? JSON.stringify(editForm) !== JSON.stringify(originalData) : false;

  const filteredBudgets = Object.entries(budgets).filter(([_, b]) =>
    b.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalAllocated = Object.values(budgets).reduce((acc, b) => acc + (b.allocated || 0), 0);
  const totalSpent = Object.values(budgets).reduce((acc, b) => acc + (b.spent || 0), 0);

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Budget Allocation Details</CardTitle>
              <CardDescription>
                Detailed view of departmental budget allocation and spending.
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <PlusCircle className="h-5 w-5" />
                  New Row
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Budget Row</DialogTitle>
                  <DialogDescription>
                    Fill out to add a new department allocation.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    type="text"
                    value={newBudget.department}
                    onChange={e =>
                      setNewBudget({ ...newBudget, department: e.target.value })
                    }
                  />
                  <Label htmlFor="allocated">Allocated</Label>
                  <Input
                    id="allocated"
                    type="number"
                    min="0"
                    step="1000"
                    value={newBudget.allocated}
                    onChange={e =>
                      setNewBudget({ ...newBudget, allocated: parseInt(e.target.value) || 0 })
                    }
                  />
                  <Label htmlFor="spent">Spent</Label>
                  <Input
                    id="spent"
                    type="number"
                    min="0"
                    step="1000"
                    value={newBudget.spent}
                    onChange={e =>
                      setNewBudget({ ...newBudget, spent: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddBudget} disabled={isLoading}>
                    Add Row
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search department..."
              className="pl-10"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>Allocated</TableHead>
                  <TableHead>Spent</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBudgets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-32">
                      No rows found. Click "New Row" to add.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBudgets.map(([id, b]) => {
                    const usage = b.allocated
                      ? Math.round(((b.spent || 0) / b.allocated) * 100)
                      : 0;
                    return (
                      <TableRow
                        key={id}
                        className={editingId === id ? "bg-blue-50 dark:bg-blue-950/20" : ""}
                      >
                        {/* Department */}
                        <TableCell>
                          {editingId === id ? (
                            <Input
                              type="text"
                              value={editForm.department}
                              onChange={e => setEditForm({ ...editForm, department: e.target.value })}
                            />
                          ) : (
                            <span className="font-medium">{b.department}</span>
                          )}
                        </TableCell>
                        {/* Allocated */}
                        <TableCell>
                          {editingId === id ? (
                            <Input
                              type="number"
                              min="0"
                              value={editForm.allocated}
                              onChange={e =>
                                setEditForm({ ...editForm, allocated: parseInt(e.target.value) || 0 })
                              }
                            />
                          ) : (
                            b.allocated.toLocaleString("en-US", { style: "currency", currency: "USD" })
                          )}
                        </TableCell>
                        {/* Spent */}
                        <TableCell>
                          {editingId === id ? (
                            <Input
                              type="number"
                              min="0"
                              value={editForm.spent}
                              onChange={e =>
                                setEditForm({ ...editForm, spent: parseInt(e.target.value) || 0 })
                              }
                            />
                          ) : (
                            (b.spent || 0).toLocaleString("en-US", { style: "currency", currency: "USD" })
                          )}
                        </TableCell>
                        {/* Usage */}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={usage} className="w-[100px]" />
                            <span>{usage}%</span>
                          </div>
                        </TableCell>
                        {/* Actions */}
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {editingId === id ? (
                              <>
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => handleSaveEdit(id)}
                                  disabled={isLoading || !hasChanges}
                                >
                                  <Save className="h-4 w-4" />
                                  Save
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={handleCancelEdit}
                                  disabled={isLoading}
                                >
                                  <X className="h-4 w-4" />
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStartEdit(id, b)}
                                  disabled={isLoading || editingId !== null}
                                >
                                  <Edit className="h-4 w-4" />
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDelete(id, b.department)}
                                  disabled={isLoading || editingId !== null}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Delete
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4">
            <CardTitle className="text-base">Summary</CardTitle>
            <div className="flex gap-6 mt-1 text-muted-foreground text-sm">
              <div>Total Allocated: <span className="font-semibold text-foreground">{totalAllocated.toLocaleString("en-US", { style: "currency", currency: "USD" })}</span></div>
              <div>Total Spent: <span className="font-semibold text-foreground">{totalSpent.toLocaleString("en-US", { style: "currency", currency: "USD" })}</span></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
