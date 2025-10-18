"use client";

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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Pie, PieChart, Cell, Legend } from 'recharts';
import { Progress } from '@/components/ui/progress';

const budgetData = [
    { name: 'R&D', value: 400, allocated: 500000, spent: 450000, fill: 'hsl(var(--chart-1))' },
    { name: 'Marketing', value: 300, allocated: 300000, spent: 250000, fill: 'hsl(var(--chart-2))' },
    { name: 'Production', value: 500, allocated: 750000, spent: 700000, fill: 'hsl(var(--chart-3))' },
    { name: 'Logistics', value: 200, allocated: 200000, spent: 210000, fill: 'hsl(var(--chart-4))' },
    { name: 'Admin', value: 100, allocated: 150000, spent: 150000, fill: 'hsl(var(--chart-5))' },
];

export default function BudgetPage() {
  const getUsagePercentage = (spent: number, allocated: number) => {
    if (allocated === 0) return 0;
    return (spent / allocated) * 100;
  };

  return (
    <div className="grid gap-6 lg:grid-cols-5">
       <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Budget Allocation Details</CardTitle>
          <CardDescription>Detailed view of departmental budget allocation and spending.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead className="text-right">Allocated</TableHead>
                <TableHead className="text-right">Spent</TableHead>
                <TableHead className='w-[200px]'>Usage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {budgetData.map((item) => {
                const usage = getUsagePercentage(item.spent, item.allocated);
                return (
                  <TableRow key={item.name}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-right">${item.allocated.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${item.spent.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={usage > 100 ? 100 : usage} className="w-[100px]" />
                        <span className="text-sm text-muted-foreground">{Math.round(usage)}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Budget Allocation</CardTitle>
                <CardDescription>Departmental budget usage for the current fiscal year.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
                <ChartContainer config={{}} className="min-h-[250px] w-full max-w-[300px]">
                    <PieChart>
                        <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                        <Pie data={budgetData} dataKey="value" nameKey="name" innerRadius={60}>
                            {budgetData.map((entry) => (
                                <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                            ))}
                        </Pie>
                        <Legend/>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    </div>
  );
}
