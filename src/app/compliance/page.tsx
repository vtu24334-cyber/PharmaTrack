
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

const complianceData = [
  { id: 'C-001', type: 'GMP', status: 'Compliant', lastAudit: '2023-11-15', nextAudit: '2024-11-15', auditor: 'Jane Doe' },
  { id: 'C-002', type: 'FDA 21 CFR Part 11', status: 'Compliant', lastAudit: '2024-01-20', nextAudit: '2025-01-20', auditor: 'John Smith' },
  { id: 'C-003', type: 'ISO 13485', status: 'Pending', lastAudit: '2023-09-01', nextAudit: '2024-09-01', auditor: 'Emily White' },
  { id: 'C-004', type: 'GMP', status: 'Non-Compliant', lastAudit: '2024-02-10', nextAudit: '2024-05-10', auditor: 'Michael Brown' },
  { id: 'C-005', type: 'ISO 9001', status: 'Compliant', lastAudit: '2023-12-05', nextAudit: '2024-12-05', auditor: 'Sarah Green' },
  { id: 'C-006', type: 'FDA 21 CFR Part 211', status: 'Compliant', lastAudit: '2024-03-01', nextAudit: '2025-03-01', auditor: 'David Clark' },
  { id: 'C-007', type: 'GMP', status: 'Pending', lastAudit: '2024-04-18', nextAudit: '2025-04-18', auditor: 'Laura Taylor' },
  { id: 'C-008', type: 'ISO 14001', status: 'Compliant', lastAudit: '2023-10-25', nextAudit: '2024-10-25', auditor: 'Robert Wilson' },
];

export default function CompliancePage() {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Compliant':
        return 'success';
      case 'Pending':
        return 'secondary';
      case 'Non-Compliant':
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
            <CardTitle>Compliance Management</CardTitle>
            <CardDescription>Track and manage regulatory compliance records.</CardDescription>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search records..." className="pl-8 sm:w-[200px] lg:w-[300px]" />
            </div>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> New Record
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Compliance ID</TableHead>
              <TableHead>Regulation Type</TableHead>
              <TableHead>Last Audit</TableHead>
              <TableHead>Next Audit</TableHead>
              <TableHead>Auditor</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {complianceData.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{record.id}</TableCell>
                <TableCell>{record.type}</TableCell>
                <TableCell>{record.lastAudit}</TableCell>
                <TableCell>{record.nextAudit}</TableCell>
                <TableCell>{record.auditor}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(record.status) as any}>{record.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
