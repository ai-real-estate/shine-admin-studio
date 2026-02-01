import { useState, useRef } from "react";
import { TrendingUp, FileDown, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";

// Generate 24 months of realistic Miami rent data
const generateHistoricalData = () => {
  const data = [];
  const baseDate = new Date(2024, 0, 1);
  
  for (let i = 0; i < 24; i++) {
    const date = new Date(baseDate);
    date.setMonth(date.getMonth() + i);
    
    // Base prices with upward trend and seasonal variations
    const seasonalFactor = 1 + 0.03 * Math.sin((i / 12) * Math.PI * 2);
    const trendFactor = 1 + (i * 0.002);
    
    data.push({
      month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      fullMonth: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      oneBed: Math.round(2650 * trendFactor * seasonalFactor + (Math.random() - 0.5) * 100),
      twoBed: Math.round(3250 * trendFactor * seasonalFactor + (Math.random() - 0.5) * 150),
      threeBed: Math.round(4000 * trendFactor * seasonalFactor + (Math.random() - 0.5) * 200),
    });
  }
  
  return data;
};

const historicalData = generateHistoricalData();

const bedroomStats = [
  {
    type: "1-Bedroom",
    avgRent: historicalData[23].oneBed,
    yoyChange: 3.2,
    periods: [
      { period: "1 Year", change: 3.2, startPrice: historicalData[11].oneBed, endPrice: historicalData[23].oneBed },
      { period: "6 Months", change: -1.5, startPrice: historicalData[17].oneBed, endPrice: historicalData[23].oneBed },
      { period: "1 Month", change: 2.1, startPrice: historicalData[22].oneBed, endPrice: historicalData[23].oneBed },
    ],
    color: "#60A5FA",
  },
  {
    type: "2-Bedroom",
    avgRent: historicalData[23].twoBed,
    yoyChange: 5.1,
    periods: [
      { period: "1 Year", change: 5.1, startPrice: historicalData[11].twoBed, endPrice: historicalData[23].twoBed },
      { period: "6 Months", change: 2.3, startPrice: historicalData[17].twoBed, endPrice: historicalData[23].twoBed },
      { period: "1 Month", change: 1.8, startPrice: historicalData[22].twoBed, endPrice: historicalData[23].twoBed },
    ],
    color: "#A78BFA",
  },
  {
    type: "3-Bedroom",
    avgRent: historicalData[23].threeBed,
    yoyChange: 4.8,
    periods: [
      { period: "1 Year", change: 4.8, startPrice: historicalData[11].threeBed, endPrice: historicalData[23].threeBed },
      { period: "6 Months", change: 1.2, startPrice: historicalData[17].threeBed, endPrice: historicalData[23].threeBed },
      { period: "1 Month", change: 3.5, startPrice: historicalData[22].threeBed, endPrice: historicalData[23].threeBed },
    ],
    color: "#22D3EE",
  },
];

const neighborhoodData = [
  { name: "Brickell", oneBed: 3200, twoBed: 4100, threeBed: 5500, yoyChange: 6.2 },
  { name: "Downtown", oneBed: 2900, twoBed: 3700, threeBed: 4800, yoyChange: 4.5 },
  { name: "Miami Beach", oneBed: 3500, twoBed: 4500, threeBed: 6200, yoyChange: 7.1 },
  { name: "Coral Gables", oneBed: 2700, twoBed: 3400, threeBed: 4400, yoyChange: 3.8 },
  { name: "Wynwood", oneBed: 2600, twoBed: 3200, threeBed: 4100, yoyChange: 5.2 },
];

const chartConfig = {
  oneBed: {
    label: "1-Bedroom",
    color: "#60A5FA",
  },
  twoBed: {
    label: "2-Bedroom",
    color: "#A78BFA",
  },
  threeBed: {
    label: "3-Bedroom",
    color: "#22D3EE",
  },
};

export const RentAnalytics = () => {
  const [selectedPeriods, setSelectedPeriods] = useState<Record<string, string>>({
    "1-Bedroom": "1 Year",
    "2-Bedroom": "1 Year",
    "3-Bedroom": "1 Year",
  });
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const componentRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = () => {
    window.print();
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
  };

  const sortedNeighborhoodData = [...neighborhoodData].sort((a, b) => {
    if (!sortColumn) return 0;
    const aValue = a[sortColumn as keyof typeof a];
    const bValue = b[sortColumn as keyof typeof b];
    const modifier = sortDirection === "asc" ? 1 : -1;
    return ((aValue as number) - (bValue as number)) * modifier;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getPeriodData = (stat: typeof bedroomStats[0], periodName: string) => {
    return stat.periods.find(p => p.period === periodName);
  };

  return (
    <div ref={componentRef} className="h-full flex flex-col bg-slate-950 print:bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 print:border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white print:text-slate-900">
              Rent Analytics - Miami
            </h1>
            <p className="text-xs text-slate-400 print:text-slate-600">
              February 1, 2026
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-emerald-400 border-emerald-400/30 bg-emerald-400/10">
            <DollarSign className="h-3 w-3 mr-1" />
            USD
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPDF}
            className="border-slate-700 text-slate-300 hover:bg-slate-800 print:hidden"
          >
            <FileDown className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {bedroomStats.map((stat) => (
              <Card
                key={stat.type}
                className="p-4 bg-slate-900 border-slate-800 print:bg-slate-50 print:border-slate-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400 print:text-slate-600">{stat.type}</span>
                  <Badge
                    variant="outline"
                    className={`${
                      stat.yoyChange >= 0
                        ? "text-emerald-400 border-emerald-400/30 bg-emerald-400/10"
                        : "text-red-400 border-red-400/30 bg-red-400/10"
                    }`}
                  >
                    {stat.yoyChange >= 0 ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {stat.yoyChange >= 0 ? "+" : ""}{stat.yoyChange}%
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-white print:text-slate-900">
                  {formatCurrency(stat.avgRent)}
                </div>
                <div className="text-xs text-slate-500 mt-1">per month</div>
              </Card>
            ))}
          </div>

          {/* Price Trend Chart */}
          <Card className="p-4 bg-slate-900 border-slate-800 print:bg-slate-50 print:border-slate-200">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-white print:text-slate-900">
                Average Rent Prices - Miami
              </h2>
              <p className="text-xs text-slate-400 print:text-slate-600">
                24-month historical trend
              </p>
            </div>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <LineChart data={historicalData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  dataKey="month"
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(_, payload) => payload?.[0]?.payload?.fullMonth}
                      formatter={(value, name) => [formatCurrency(value as number), chartConfig[name as keyof typeof chartConfig]?.label]}
                    />
                  }
                />
                <Line
                  type="monotone"
                  dataKey="oneBed"
                  stroke="#60A5FA"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "#60A5FA" }}
                />
                <Line
                  type="monotone"
                  dataKey="twoBed"
                  stroke="#A78BFA"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "#A78BFA" }}
                />
                <Line
                  type="monotone"
                  dataKey="threeBed"
                  stroke="#22D3EE"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "#22D3EE" }}
                />
              </LineChart>
            </ChartContainer>
            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-4">
              {bedroomStats.map((stat) => (
                <div key={stat.type} className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: stat.color }}
                  />
                  <span className="text-xs text-slate-400 print:text-slate-600">{stat.type}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Period Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {bedroomStats.map((stat) => {
              const selectedPeriod = selectedPeriods[stat.type];
              const periodData = getPeriodData(stat, selectedPeriod);
              const barData = stat.periods.map((p) => ({
                period: p.period.replace(" ", "\n"),
                change: p.change,
                fill: p.change >= 0 ? "#10B981" : "#EF4444",
              }));

              return (
                <Card
                  key={stat.type}
                  className="p-4 bg-slate-900 border-slate-800 print:bg-slate-50 print:border-slate-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-white print:text-slate-900">
                      {stat.type} Trends
                    </h3>
                    <Badge
                      variant="outline"
                      className={`${
                        periodData?.change && periodData.change >= 0
                          ? "text-emerald-400 border-emerald-400/30 bg-emerald-400/10"
                          : "text-red-400 border-red-400/30 bg-red-400/10"
                      }`}
                    >
                      {periodData?.change && periodData.change >= 0 ? "+" : ""}
                      {periodData?.change}%
                    </Badge>
                  </div>
                  <Tabs
                    value={selectedPeriod}
                    onValueChange={(value) =>
                      setSelectedPeriods((prev) => ({ ...prev, [stat.type]: value }))
                    }
                    className="mb-3"
                  >
                    <TabsList className="grid grid-cols-3 bg-slate-800 h-8">
                      <TabsTrigger value="1 Year" className="text-xs data-[state=active]:bg-slate-700">
                        1 Year
                      </TabsTrigger>
                      <TabsTrigger value="6 Months" className="text-xs data-[state=active]:bg-slate-700">
                        6 Months
                      </TabsTrigger>
                      <TabsTrigger value="1 Month" className="text-xs data-[state=active]:bg-slate-700">
                        1 Month
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <div className="h-[80px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                        <Bar
                          dataKey="change"
                          radius={[4, 4, 0, 0]}
                          fill="#10B981"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-xs text-center text-slate-400 mt-2 print:text-slate-600">
                    {periodData && `${formatCurrency(periodData.startPrice)} → ${formatCurrency(periodData.endPrice)}`}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Neighborhood Breakdown Table */}
          <Card className="bg-slate-900 border-slate-800 print:bg-slate-50 print:border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-800 print:border-slate-200">
              <h2 className="text-base font-semibold text-white print:text-slate-900">
                Neighborhood Breakdown
              </h2>
              <p className="text-xs text-slate-400 print:text-slate-600">
                Click headers to sort
              </p>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800 hover:bg-slate-800/50 print:border-slate-200 print:hover:bg-slate-100">
                    <TableHead
                      className="text-slate-400 cursor-pointer hover:text-white print:text-slate-600 print:hover:text-slate-900"
                      onClick={() => handleSort("name")}
                    >
                      Neighborhood
                    </TableHead>
                    <TableHead
                      className="text-slate-400 cursor-pointer hover:text-white print:text-slate-600 print:hover:text-slate-900"
                      onClick={() => handleSort("oneBed")}
                    >
                      1BR
                    </TableHead>
                    <TableHead
                      className="text-slate-400 cursor-pointer hover:text-white print:text-slate-600 print:hover:text-slate-900"
                      onClick={() => handleSort("twoBed")}
                    >
                      2BR
                    </TableHead>
                    <TableHead
                      className="text-slate-400 cursor-pointer hover:text-white print:text-slate-600 print:hover:text-slate-900"
                      onClick={() => handleSort("threeBed")}
                    >
                      3BR
                    </TableHead>
                    <TableHead
                      className="text-slate-400 cursor-pointer hover:text-white print:text-slate-600 print:hover:text-slate-900"
                      onClick={() => handleSort("yoyChange")}
                    >
                      YoY Change
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedNeighborhoodData.map((neighborhood) => (
                    <TableRow
                      key={neighborhood.name}
                      className="border-slate-800 hover:bg-slate-800/50 print:border-slate-200 print:hover:bg-slate-100"
                    >
                      <TableCell className="font-medium text-white print:text-slate-900">
                        {neighborhood.name}
                      </TableCell>
                      <TableCell className="text-slate-300 print:text-slate-700">
                        {formatCurrency(neighborhood.oneBed)}
                      </TableCell>
                      <TableCell className="text-slate-300 print:text-slate-700">
                        {formatCurrency(neighborhood.twoBed)}
                      </TableCell>
                      <TableCell className="text-slate-300 print:text-slate-700">
                        {formatCurrency(neighborhood.threeBed)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${
                            neighborhood.yoyChange >= 0
                              ? "text-emerald-400 border-emerald-400/30 bg-emerald-400/10"
                              : "text-red-400 border-red-400/30 bg-red-400/10"
                          }`}
                        >
                          {neighborhood.yoyChange >= 0 ? "+" : ""}
                          {neighborhood.yoyChange}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Data Source Note */}
          <div className="text-xs text-center text-slate-500 print:text-slate-600">
            Data sourced from Miami-Dade County rental listings • Updated February 2026
          </div>
        </div>
      </ScrollArea>

      {/* Print Styles */}
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
};
