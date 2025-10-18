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
import { PlusCircle, Search } from 'lucide-react';

const batchData = [
  { id: 'B-789', product: 'Pharma-C 500mg Tablets', startDate: '2023-10-01', completion: 85, status: 'In Progress' },
  { id: 'B-788', product: 'PainAway Syrup', startDate: '2023-09-25', completion: 100, status: 'Completed' },
  { id: 'B-790', product: 'Vita-Boost Capsules', startDate: '2023-10-05', completion: 60, status: 'In Progress' },
  { id: 'B-787', product: 'Pharma-C 500mg Tablets', startDate: '2023-09-20', completion: 100, status: 'QA Pending' },
  { id: 'B-791', product: 'Generic-X 20mg', startDate: '2023-10-10', completion: 15, status: 'In Progress' },
  { id: 'B-786', product: 'PainAway Syrup', startDate: '2023-09-15', completion: 100, status: 'Completed' },
  { id: 'B-792', product: 'Ortho-Relief Gel', startDate: '2023-10-12', completion: 40, status: 'On Hold' },
];

export default function BatchTrackingPage() {
  const getStatusVariant = (status: string) => {
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

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Batch Tracking</CardTitle>
            <CardDescription>Monitor production lots from start to finish.</CardDescription>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search batches..." className="pl-8 sm:w-[200px] lg:w-[300px]" />
            </div>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> New Batch
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Batch ID</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {batchData.map((batch) => (
              <TableRow key={batch.id}>
                <TableCell className="font-medium">{batch.id}</TableCell>
                <TableCell>{batch.product}</TableCell>
                <TableCell>{batch.startDate}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={batch.completion} className="w-[100px]" />
                    <span className="text-sm text-muted-foreground">{batch.completion}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(batch.status)}>{batch.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
