import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

// Mock data - in a real app, you'd fetch this based on the ID
const formulaData = {
  'F-001-A': { productName: 'Pharma-C 500mg Tablets', version: 1.2, status: 'Active', createdDate: '2023-01-15', chemicalSymbolUrl: 'https://picsum.photos/600/400' },
  'F-002-C': { productName: 'PainAway Syrup', version: 2.5, status: 'Active', createdDate: '2022-11-30', chemicalSymbolUrl: 'https://picsum.photos/600/400' },
  'F-003-B': { productName: 'Vita-Boost Capsules', version: 1.0, status: 'In Development', createdDate: '2023-05-20', chemicalSymbolUrl: 'https://picsum.photos/600/400' },
  'F-001-B': { productName: 'Pharma-C 500mg Tablets', version: 1.3, status: 'Superseded', createdDate: '2023-08-01', chemicalSymbolUrl: 'https://picsum.photos/600/400' },
  'F-004-A': { productName: 'Ortho-Relief Gel', version: 0.8, status: 'In Development', createdDate: '2023-09-10', chemicalSymbolUrl: 'https://picsum.photos/600/400' },
  'F-002-D': { productName: 'PainAway Syrup', version: 2.6, status: 'Active', createdDate: '2023-10-05', chemicalSymbolUrl: 'https://picsum.photos/600/400' },
  'F-005-A': { productName: 'Generic-X 20mg', version: 1.0, status: 'Retired', createdDate: '2021-06-01', chemicalSymbolUrl: 'https://picsum.photos/600/400' },
};

type FormulaPageProps = {
  params: {
    id: keyof typeof formulaData;
  }
}

export default function FormulaDetailPage({ params }: FormulaPageProps) {
  const { id } = params;
  const formula = formulaData[id];

  if (!formula) {
    return <p>Formula not found.</p>;
  }
  
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
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Formula: {id}</CardTitle>
              <CardDescription>{formula.productName}</CardDescription>
            </div>
            <Badge variant={getStatusVariant(formula.status)}>{formula.status}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Version:</strong> {formula.version.toFixed(1)}</p>
            <p><strong>Created Date:</strong> {formula.createdDate}</p>
          </div>
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
          <CardTitle>Chemical Formation</CardTitle>
          <CardDescription>Visual representation of the chemical structure.</CardDescription>
        </CardHeader>
        <CardContent>
          <Image 
            src={formula.chemicalSymbolUrl} 
            alt={`Chemical symbol for ${formula.productName}`}
            width={600}
            height={400}
            className="rounded-lg border"
            data-ai-hint="chemical structure"
          />
        </CardContent>
      </Card>
    </div>
  );
}