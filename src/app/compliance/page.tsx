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
import { toast } from "@/hooks/use-toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Compliance = {
  id: string;
  complianceId: string;
  regulationType: string;
  lastAudit: string;
  nextAudit: string;
  auditor: string;
  status: string;
};

const statusOptions = [
  "Compliant", "Pending", "Non-Compliant"
];

export default function CompliancePage() {
  const [compliances, setCompliances] = useState<Record<string, Compliance>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Compliance>>({});
  const [originalData, setOriginalData] = useState<Partial<Compliance> | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newCompliance, setNewCompliance] = useState({
    complianceId: "",
    regulationType: "",
    lastAudit: "",
    nextAudit: "",
    auditor: "",
    status: "Compliant",
  });

  useEffect(() => {
    const complianceRef = ref(database, "compliance");
    const unsubscribe = onValue(
      complianceRef,
      (snapshot) => {
        const data = snapshot.val() || {};
        setCompliances(data);
        setIsLoading(false);
      },
      () => setIsLoading(false)
    );
    return () => unsubscribe();
  }, []);

  const handleAddCompliance = async () => {
    if (
      !newCompliance.complianceId || !newCompliance.regulationType ||
      !newCompliance.lastAudit || !newCompliance.nextAudit || !newCompliance.auditor
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    try {
      const complianceRef = ref(database, "compliance");
      const newComplianceRef = push(complianceRef);
      await set(newComplianceRef, {
        ...newCompliance,
        id: newComplianceRef.key,
      });
      setNewCompliance({
        complianceId: "",
        regulationType: "",
        lastAudit: "",
        nextAudit: "",
        auditor: "",
        status: "Compliant",
      });
      setIsDialogOpen(false);
      toast({ title: "Success", description: "Record added." });
    } catch {
      toast({
        title: "Error",
        description: "Failed to add compliance record.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartEdit = (id: string, compliance: Compliance) => {
    setEditingId(id);
    setEditForm(compliance);
    setOriginalData(compliance);
  };

  const handleSaveEdit = async (id: string) => {
    setIsLoading(true);
    try {
      const complianceRef = ref(database, `compliance/${id}`);
      await update(complianceRef, editForm);
      toast({ title: "Success", description: "Record updated." });
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

  const handleDelete = async (id: string, complianceId: string) => {
    if (!confirm(`Delete compliance record ${complianceId}?`)) return;
    setIsLoading(true);
    try {
      const complianceRef = ref(database, `compliance/${id}`);
      await remove(complianceRef);
      toast({ title: "Success", description: "Record deleted." });
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

  const filteredCompliances = Object.entries(compliances).filter(([_, c]) =>
    c.complianceId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.regulationType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.auditor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.status?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Compliance Management</CardTitle>
              <CardDescription>
                Track and manage regulatory compliance records.
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <PlusCircle className="h-5 w-5" />
                  New Record
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Compliance Record</DialogTitle>
                  <DialogDescription>
                    Enter details to add a new record.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-2">
                  <Label htmlFor="complianceId">Compliance ID</Label>
                  <Input
                    id="complianceId"
                    type="text"
                    value={newCompliance.complianceId}
                    onChange={e =>
                      setNewCompliance({ ...newCompliance, complianceId: e.target.value })
                    }
                  />
                  <Label htmlFor="regulationType">Regulation Type</Label>
                  <Input
                    id="regulationType"
                    type="text"
                    value={newCompliance.regulationType}
                    onChange={e =>
                      setNewCompliance({ ...newCompliance, regulationType: e.target.value })
                    }
                  />
                  <Label htmlFor="lastAudit">Last Audit</Label>
                  <Input
                    id="lastAudit"
                    type="date"
                    value={newCompliance.lastAudit}
                    onChange={e =>
                      setNewCompliance({ ...newCompliance, lastAudit: e.target.value })
                    }
                  />
                  <Label htmlFor="nextAudit">Next Audit</Label>
                  <Input
                    id="nextAudit"
                    type="date"
                    value={newCompliance.nextAudit}
                    onChange={e =>
                      setNewCompliance({ ...newCompliance, nextAudit: e.target.value })
                    }
                  />
                  <Label htmlFor="auditor">Auditor</Label>
                  <Input
                    id="auditor"
                    type="text"
                    value={newCompliance.auditor}
                    onChange={e =>
                      setNewCompliance({ ...newCompliance, auditor: e.target.value })
                    }
                  />
                  <Label>Status</Label>
                  <Select
                    value={newCompliance.status}
                    onValueChange={status =>
                      setNewCompliance({ ...newCompliance, status })
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
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddCompliance} disabled={isLoading}>
                    Add Record
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
              placeholder="Search records..."
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
                  <TableHead>Compliance ID</TableHead>
                  <TableHead>Regulation Type</TableHead>
                  <TableHead>Last Audit</TableHead>
                  <TableHead>Next Audit</TableHead>
                  <TableHead>Auditor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompliances.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-32">
                      No records found. Click "New Record" to add.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCompliances.map(([id, c]) => (
                    <TableRow
                      key={id}
                      className={editingId === id ? "bg-blue-50 dark:bg-blue-950/20" : ""}
                    >
                      {/* Compliance ID */}
                      <TableCell>
                        {editingId === id ? (
                          <Input
                            type="text"
                            value={editForm.complianceId}
                            onChange={e => setEditForm({ ...editForm, complianceId: e.target.value })}
                          />
                        ) : (
                          <span className="font-medium">{c.complianceId}</span>
                        )}
                      </TableCell>
                      {/* Regulation Type */}
                      <TableCell>
                        {editingId === id ? (
                          <Input
                            type="text"
                            value={editForm.regulationType}
                            onChange={e => setEditForm({ ...editForm, regulationType: e.target.value })}
                          />
                        ) : (
                          c.regulationType
                        )}
                      </TableCell>
                      {/* Last Audit */}
                      <TableCell>
                        {editingId === id ? (
                          <Input
                            type="date"
                            value={editForm.lastAudit}
                            onChange={e => setEditForm({ ...editForm, lastAudit: e.target.value })}
                          />
                        ) : (
                          c.lastAudit
                        )}
                      </TableCell>
                      {/* Next Audit */}
                      <TableCell>
                        {editingId === id ? (
                          <Input
                            type="date"
                            value={editForm.nextAudit}
                            onChange={e => setEditForm({ ...editForm, nextAudit: e.target.value })}
                          />
                        ) : (
                          c.nextAudit
                        )}
                      </TableCell>
                      {/* Auditor */}
                      <TableCell>
                        {editingId === id ? (
                          <Input
                            type="text"
                            value={editForm.auditor}
                            onChange={e => setEditForm({ ...editForm, auditor: e.target.value })}
                          />
                        ) : (
                          c.auditor
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
                          <Badge
                            className={
                              c.status === "Compliant"
                                ? "bg-green-600 text-white"
                                : c.status === "Pending"
                                  ? "bg-blue-500 text-white"
                                  : "bg-red-600 text-white"
                            }
                          >
                            {c.status}
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
                                onClick={() => handleStartEdit(id, c)}
                                disabled={isLoading || editingId !== null}
                              >
                                <Edit className="h-4 w-4" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDelete(id, c.complianceId)}
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
