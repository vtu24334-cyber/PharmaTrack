import Link from 'next/link';
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
import { PlusCircle, Search } from 'lucide-react';

const formulaData = [
  { id: 'F-001-A', productName: 'Pharma-C 500mg Tablets', version: 1.2, status: 'Active', createdDate: '2023-01-15' },
  { id: 'F-002-C', productName: 'PainAway Syrup', version: 2.5, status: 'Active', createdDate: '2022-11-30' },
  { id: 'F-003-B', productName: 'Vita-Boost Capsules', version: 1.0, status: 'In Development', createdDate: '2023-05-20' },
  { id: 'F-001-B', productName: 'Pharma-C 500mg Tablets', version: 1.3, status: 'Superseded', createdDate: '2023-08-01' },
  { id: 'F-004-A', productName: 'Ortho-Relief Gel', version: 0.8, status: 'In Development', createdDate: '2023-09-10' },
  { id: 'F-002-D', productName: 'PainAway Syrup', version: 2.6, status: 'Active', createdDate: '2023-10-05' },
  { id: 'F-005-A', productName: 'Generic-X 20mg', version: 1.0, status: 'Retired', createdDate: '2021-06-01' },
];

export default function FormulasPage() {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'In Development':
        return 'secondary';
      case 'Superseded':
        return 'outline';
      case 'Retired':
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
            <CardTitle>Formulation Management</CardTitle>
            <CardDescription>Manage and track all drug formulations.</CardDescription>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search formulas..." className="pl-8 sm:w-[200px] lg:w-[300px]" />
            </div>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> New Formula
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Formula ID</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead className="text-right">Version</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {formulaData.map((formula) => (
              <TableRow key={formula.id}>
                <TableCell className="font-medium">
                  <Link href={`/formulas/${formula.id}`} className="text-primary hover:underline">
                    {formula.id}
                  </Link>
                </TableCell>
                <TableCell>{formula.productName}</TableCell>
                <TableCell className="text-right">{formula.version.toFixed(1)}</TableCell>
                <TableCell>{formula.createdDate}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(formula.status)}>{formula.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
