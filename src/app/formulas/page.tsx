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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, Edit, Trash2, Save, X } from "lucide-react";
import { toast } from "@/hooks/use-toast"; // Or "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";

type Formula = {
  id: string;
  formulaId: string;
  productName: string;
  version: number;
  status: string;
  createdDate: string;
};

const statusOptions = [
  "Active",
  "In Development",
  "Superseded",
  "Retired"
];

export default function FormulasPage() {
  const [formulas, setFormulas] = useState<Record<string, Formula>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Formula>>({});
  const [originalData, setOriginalData] = useState<Partial<Formula> | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newFormula, setNewFormula] = useState({
    formulaId: "",
    productName: "",
    version: 1.0,
    status: "Active",
    createdDate: "",
  });

  useEffect(() => {
    const formulasRef = ref(database, "formulas");
    const unsubscribe = onValue(
      formulasRef,
      (snapshot) => {
        const data = snapshot.val() || {};
        setFormulas(data);
        setIsLoading(false);
      },
      () => setIsLoading(false)
    );
    return () => unsubscribe();
  }, []);

  const handleAddFormula = async () => {
    if (!newFormula.formulaId || !newFormula.productName || !newFormula.createdDate) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    try {
      const formulasRef = ref(database, "formulas");
      const newFormulaRef = push(formulasRef);
      await set(newFormulaRef, {
        ...newFormula,
        id: newFormulaRef.key,
      });
      setNewFormula({
        formulaId: "",
        productName: "",
        version: 1.0,
        status: "Active",
        createdDate: "",
      });
      setIsDialogOpen(false);
      toast({ title: "Success", description: "Formula added" });
    } catch {
      toast({
        title: "Error",
        description: "Failed to add formula",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartEdit = (id: string, formula: Formula) => {
    setEditingId(id);
    setEditForm(formula);
    setOriginalData(formula);
  };

  const handleSaveEdit = async (id: string) => {
    setIsLoading(true);
    try {
      const formulaRef = ref(database, `formulas/${id}`);
      await update(formulaRef, editForm);
      toast({ title: "Success", description: "Formula updated" });
      setEditingId(null);
      setEditForm({});
      setOriginalData(null);
    } catch {
      toast({
        title: "Error",
        description: "Update failed",
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

  const handleDelete = async (id: string, formulaId: string) => {
    if (!confirm(`Delete formula ${formulaId}?`)) { return; }
    setIsLoading(true);
    try {
      const formulaRef = ref(database, `formulas/${id}`);
      await remove(formulaRef);
      toast({ title: "Success", description: "Formula deleted" });
    } catch {
      toast({
        title: "Error",
        description: "Delete failed",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const hasChanges =
    originalData
      ? JSON.stringify(editForm) !== JSON.stringify(originalData)
      : false;

  const filteredFormulas = Object.entries(formulas).filter(([_, formula]) =>
    formula.formulaId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    formula.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    formula.status?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Formulation Management</CardTitle>
              <CardDescription>
                Manage and track all drug formulas.
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <PlusCircle className="h-5 w-5" />
                  New Formula
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Formula</DialogTitle>
                  <DialogDescription>
                    Enter details to add a new formula.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-2">
                  <Label htmlFor="formulaId">Formula ID</Label>
                  <Input
                    id="formulaId"
                    type="text"
                    value={newFormula.formulaId}
                    onChange={e =>
                      setNewFormula({ ...newFormula, formulaId: e.target.value })
                    }
                  />
                  <Label htmlFor="productName">Product Name</Label>
                  <Input
                    id="productName"
                    type="text"
                    value={newFormula.productName}
                    onChange={e =>
                      setNewFormula({ ...newFormula, productName: e.target.value })
                    }
                  />
                  <Label htmlFor="version">Version</Label>
                  <Input
                    id="version"
                    type="number"
                    min="0"
                    step="0.1"
                    value={newFormula.version}
                    onChange={e =>
                      setNewFormula({
                        ...newFormula,
                        version: parseFloat(e.target.value) || 1.0
                      })
                    }
                  />
                  <Label>Status</Label>
                  <Select
                    value={newFormula.status}
                    onValueChange={status =>
                      setNewFormula({ ...newFormula, status })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(opt => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Label htmlFor="createdDate">Created Date</Label>
                  <Input
                    id="createdDate"
                    type="date"
                    value={newFormula.createdDate}
                    onChange={e =>
                      setNewFormula({ ...newFormula, createdDate: e.target.value })
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
                  <Button onClick={handleAddFormula} disabled={isLoading}>
                    Add Formula
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
              placeholder="Search formulas"
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
                  <TableHead>Formula ID</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFormulas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-32">
                      No formulas found. Click "New Formula" to add.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFormulas.map(([id, formula]) => (
                    <TableRow
                      key={id}
                      className={editingId === id ? "bg-blue-50 dark:bg-blue-950/20" : ""}
                    >
                      {/* Formula ID */}
                      <TableCell>
                        {editingId === id ? (
                          <Input
                            type="text"
                            value={editForm.formulaId}
                            onChange={e => setEditForm({ ...editForm, formulaId: e.target.value })}
                          />
                        ) : (
                          <span className="font-medium">{formula.formulaId}</span>
                        )}
                      </TableCell>
                      {/* Product Name */}
                      <TableCell>
                        {editingId === id ? (
                          <Input
                            type="text"
                            value={editForm.productName}
                            onChange={e => setEditForm({ ...editForm, productName: e.target.value })}
                          />
                        ) : (
                          formula.productName
                        )}
                      </TableCell>
                      {/* Version */}
                      <TableCell>
                        {editingId === id ? (
                          <Input
                            type="number"
                            step="0.1"
                            value={editForm.version}
                            onChange={e =>
                              setEditForm({
                                ...editForm,
                                version: parseFloat(e.target.value) || 1.0
                              })
                            }
                          />
                        ) : (
                          formula.version
                        )}
                      </TableCell>
                      {/* Created Date */}
                      <TableCell>
                        {editingId === id ? (
                          <Input
                            type="date"
                            value={editForm.createdDate}
                            onChange={e =>
                              setEditForm({ ...editForm, createdDate: e.target.value })
                            }
                          />
                        ) : (
                          formula.createdDate
                        )}
                      </TableCell>
                      {/* Status */}
                      <TableCell>
                        {editingId === id ? (
                          <Select
                            value={editForm.status}
                            onValueChange={status =>
                              setEditForm({ ...editForm, status })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {statusOptions.map(opt => (
                                <SelectItem key={opt} value={opt}>
                                  {opt}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge>
                            {formula.status}
                          </Badge>
                        )}
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
                                onClick={() => handleStartEdit(id, formula)}
                                disabled={isLoading || editingId !== null}
                              >
                                <Edit className="h-4 w-4" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDelete(id, formula.formulaId)}
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
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
