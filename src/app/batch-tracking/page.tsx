'use client';

import { useEffect, useState } from 'react';
import { ref, onValue, set, update, remove, push } from 'firebase/database';
import { database } from "../../firebaseConfig";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { PlusCircle, Search, Edit, Trash2, Save, X, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast'


interface Batch {
  id: string;
  batchId: string;
  product: string;
  startDate: string;
  completion: number;
  status: string;
}

interface EditFormData {
  batchId: string;
  product: string;
  startDate: string;
  completion: number;
  status: string;
}

export default function BatchTrackingPage() {
  const [batches, setBatches] = useState<Record<string, Batch>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditFormData>({
    batchId: '',
    product: '',
    startDate: '',
    completion: 0,
    status: 'In Progress',
  });
  const [originalData, setOriginalData] = useState<EditFormData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newBatch, setNewBatch] = useState({
    batchId: '',
    product: '',
    startDate: '',
    completion: 0,
    status: 'In Progress',
  });

  // Fetch data from Firebase Realtime Database with real-time updates
  useEffect(() => {
    const batchesRef = ref(database, 'batches');
    
    const unsubscribe = onValue(
      batchesRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setBatches(data);
        } else {
          setBatches({});
        }
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching batches:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch batch data',
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Add new batch to Firebase
  const handleAddBatch = async () => {
    if (!newBatch.batchId || !newBatch.product || !newBatch.startDate) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const batchesRef = ref(database, 'batches');
      const newBatchRef = push(batchesRef);
      await set(newBatchRef, {
        ...newBatch,
        id: newBatchRef.key,
      });
      
      toast({
        title: 'Success',
        description: 'Batch created successfully',
      });

      // Reset form
      setNewBatch({
        batchId: '',
        product: '',
        startDate: '',
        completion: 0,
        status: 'In Progress',
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error adding batch:', error);
      toast({
        title: 'Error',
        description: 'Failed to create batch',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Start editing a row
  const handleStartEdit = (id: string, batch: Batch) => {
    setEditingId(id);
    const formData: EditFormData = {
      batchId: batch.batchId,
      product: batch.product,
      startDate: batch.startDate,
      completion: batch.completion,
      status: batch.status,
    };
    setEditForm(formData);
    setOriginalData({ ...formData });
  };

  // Save edited batch to Firebase
  const handleSaveEdit = async (id: string) => {
    setIsLoading(true);
    try {
      const batchRef = ref(database, `batches/${id}`);
      await update(batchRef, editForm);
      
      toast({
        title: 'Success',
        description: 'Batch updated successfully',
      });

      setEditingId(null);
      setEditForm({
        batchId: '',
        product: '',
        startDate: '',
        completion: 0,
        status: 'In Progress',
      });
      setOriginalData(null);
    } catch (error) {
      console.error('Error updating batch:', error);
      toast({
        title: 'Error',
        description: 'Failed to update batch',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel editing and restore original data
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({
      batchId: '',
      product: '',
      startDate: '',
      completion: 0,
      status: 'In Progress',
    });
    setOriginalData(null);
  };

  // Delete batch from Firebase
  const handleDelete = async (id: string, batchId: string) => {
    if (!confirm(`Are you sure you want to delete batch ${batchId}?`)) {
      return;
    }

    setIsLoading(true);
    try {
      const batchRef = ref(database, `batches/${id}`);
      await remove(batchRef);
      
      toast({
        title: 'Success',
        description: 'Batch deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting batch:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete batch',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get status badge variant
  const getStatusVariant = (status: string): any => {
    switch (status) {
      case 'Completed':
        return 'default';
      case 'In Progress':
        return 'secondary';
      case 'QA Pending':
        return 'outline';
      case 'On Hold':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  // Get status badge color class
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'QA Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'On Hold':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter batches based on search query
  const filteredBatches = Object.entries(batches).filter(([_, batch]) =>
    batch.batchId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    batch.product?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    batch.status?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Check if form has changes
  const hasChanges = originalData 
    ? JSON.stringify(editForm) !== JSON.stringify(originalData)
    : false;

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold">Batch Tracking</CardTitle>
              <CardDescription className="text-base">
                Monitor production lots from start to finish.
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="gap-2">
                  <PlusCircle className="h-5 w-5" />
                  New Batch
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Batch</DialogTitle>
                  <DialogDescription>
                    Add a new batch to track its progress through production.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="batchId">
                      Batch ID <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="batchId"
                      value={newBatch.batchId}
                      onChange={(e) =>
                        setNewBatch({ ...newBatch, batchId: e.target.value })
                      }
                      placeholder="e.g., B-XXX"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="product">
                      Product Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="product"
                      value={newBatch.product}
                      onChange={(e) =>
                        setNewBatch({ ...newBatch, product: e.target.value })
                      }
                      placeholder="e.g., Pharma-C 500mg Tablets"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="startDate">
                      Start Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={newBatch.startDate}
                      onChange={(e) =>
                        setNewBatch({ ...newBatch, startDate: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="completion">Completion (%)</Label>
                    <Input
                      id="completion"
                      type="number"
                      min="0"
                      max="100"
                      value={newBatch.completion}
                      onChange={(e) =>
                        setNewBatch({
                          ...newBatch,
                          completion: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={newBatch.status}
                      onValueChange={(value) =>
                        setNewBatch({ ...newBatch, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="QA Pending">QA Pending</SelectItem>
                        <SelectItem value="On Hold">On Hold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddBatch} disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Batch'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Batch ID, Product, or Status..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Batch ID</TableHead>
                  <TableHead className="font-semibold">Product Name</TableHead>
                  <TableHead className="font-semibold">Start Date</TableHead>
                  <TableHead className="font-semibold">Progress</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBatches.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-32">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <p className="text-lg font-medium">No batches found</p>
                        <p className="text-sm">
                          {searchQuery
                            ? 'Try adjusting your search criteria'
                            : 'Click "New Batch" to get started'}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBatches.map(([id, batch]) => (
                    <TableRow
                      key={id}
                      className={editingId === id ? 'bg-blue-50 dark:bg-blue-950/20' : ''}
                    >
                      {/* Batch ID */}
                      <TableCell className="font-medium">
                        {editingId === id ? (
                          <Input
                            value={editForm.batchId}
                            onChange={(e) =>
                              setEditForm({ ...editForm, batchId: e.target.value })
                            }
                            className="w-32"
                            disabled={isLoading}
                          />
                        ) : (
                          <span className="font-semibold">{batch.batchId}</span>
                        )}
                      </TableCell>

                      {/* Product Name */}
                      <TableCell>
                        {editingId === id ? (
                          <Input
                            value={editForm.product}
                            onChange={(e) =>
                              setEditForm({ ...editForm, product: e.target.value })
                            }
                            className="min-w-[200px]"
                            disabled={isLoading}
                          />
                        ) : (
                          batch.product
                        )}
                      </TableCell>

                      {/* Start Date */}
                      <TableCell>
                        {editingId === id ? (
                          <Input
                            type="date"
                            value={editForm.startDate}
                            onChange={(e) =>
                              setEditForm({ ...editForm, startDate: e.target.value })
                            }
                            disabled={isLoading}
                          />
                        ) : (
                          batch.startDate
                        )}
                      </TableCell>

                      {/* Progress */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Progress
                            value={editingId === id ? editForm.completion : batch.completion}
                            className="w-[80px]"
                          />
                          {editingId === id ? (
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={editForm.completion}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  completion: parseInt(e.target.value) || 0,
                                })
                              }
                              className="w-20"
                              disabled={isLoading}
                            />
                          ) : (
                            <span className="text-sm font-medium w-12">
                              {batch.completion}%
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        {editingId === id ? (
                          <Select
                            value={editForm.status}
                            onValueChange={(value) =>
                              setEditForm({ ...editForm, status: value })
                            }
                            disabled={isLoading}
                          >
                            <SelectTrigger className="w-[150px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="In Progress">In Progress</SelectItem>
                              <SelectItem value="Completed">Completed</SelectItem>
                              <SelectItem value="QA Pending">QA Pending</SelectItem>
                              <SelectItem value="On Hold">On Hold</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge
                            variant={getStatusVariant(batch.status)}
                            className={getStatusColor(batch.status)}
                          >
                            {batch.status}
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
                                className="gap-1"
                              >
                                <Save className="h-4 w-4" />
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCancelEdit}
                                disabled={isLoading}
                                className="gap-1"
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
                                onClick={() => handleStartEdit(id, batch)}
                                disabled={isLoading || editingId !== null}
                                className="gap-1"
                              >
                                <Edit className="h-4 w-4" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDelete(id, batch.batchId)}
                                disabled={isLoading || editingId !== null}
                                className="gap-1"
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

          {/* Summary Stats */}
          {filteredBatches.length > 0 && (
            <div className="mt-6 flex justify-between items-center text-sm text-muted-foreground">
              <p>
                Showing <span className="font-medium text-foreground">{filteredBatches.length}</span> of{' '}
                <span className="font-medium text-foreground">{Object.keys(batches).length}</span> batches
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>In Progress: {Object.values(batches).filter(b => b.status === 'In Progress').length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Completed: {Object.values(batches).filter(b => b.status === 'Completed').length}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}