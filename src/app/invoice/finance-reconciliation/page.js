"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, X, FileSpreadsheet } from "lucide-react";

export default function FinanceReconciliationPage() {
  const [filters, setFilters] = useState({
    clinicName: "",
    invoiceNo: "",
    fromDate: "2025-12-08", // Matching screenshot example
    toDate: "2025-12-23",   // Matching screenshot example
  });

  // Mock Data
  const data = [
    { id: 1, clinic: "Dehradun", pCode: "P113605", pName: "neha verma", invNo: "UTP003122526", date: "17-Dec-2025", rev: "32,000.00", disb: "0.00", lan: "", sub: "0.00", mode: "Shopse- Credit Card Bank" },
    { id: 2, clinic: "Secunderabad", pCode: "P113614", pName: "Nithin Javvaji", invNo: "TEL003352526", date: "17-Dec-2025", rev: "72,450.00", disb: "0.00", lan: "", sub: "0.00", mode: "Bajaj finance" },
    { id: 3, clinic: "Secunderabad", pCode: "P113614", pName: "Nithin Javvaji", invNo: "TEL003342526", date: "17-Dec-2025", rev: "31,050.00", disb: "0.00", lan: "", sub: "0.00", mode: "Bajaj finance" },
    { id: 4, clinic: "LB NAGAR", pCode: "P113583", pName: "adla srinivas reddy", invNo: "TEL003162526", date: "16-Dec-2025", rev: "1,00,000.00", disb: "0.00", lan: "", sub: "0.00", mode: "Shopse- Credit Card Bank" },
    { id: 5, clinic: "MADHAPUR", pCode: "P113577", pName: "vijay kumar l", invNo: "TEL002292526", date: "16-Dec-2025", rev: "45,000.00", disb: "0.00", lan: "", sub: "0.00", mode: "Shopse - Preapproved Debit Card + Cardless EMI" },
    { id: 6, clinic: "MADHAPUR", pCode: "P113282", pName: "sreya B", invNo: "TEL000562526", date: "17-Dec-2025", rev: "23,800.00", disb: "0.00", lan: "", sub: "0.00", mode: "Zeropay" },
    { id: 7, clinic: "MADHAPUR", pCode: "P113282", pName: "sreya B", invNo: "TEL000552526", date: "17-Dec-2025", rev: "10,200.00", disb: "0.00", lan: "", sub: "0.00", mode: "Zeropay" },
    { id: 8, clinic: "Toli Chowki", pCode: "P113174", pName: "syed obaid", invNo: "TEL000102526", date: "09-Dec-2025", rev: "11,400.00", disb: "0.00", lan: "", sub: "0.00", mode: "SaveIn" },
    { id: 9, clinic: "Annanagar", pCode: "P113906", pName: "RAJAM L", invNo: "TAN007932526", date: "22-Dec-2025", rev: "55,000.00", disb: "0.00", lan: "", sub: "0.00", mode: "SaveIn" },
    { id: 10, clinic: "Nanganallur", pCode: "P113801", pName: "KAVITHANJALI A", invNo: "TAN006432526", date: "21-Dec-2025", rev: "55,000.00", disb: "0.00", lan: "", sub: "0.00", mode: "SaveIn" },
  ];

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClear = () => {
    setFilters({
      clinicName: "",
      invoiceNo: "",
      fromDate: "",
      toDate: "",
    });
  };

  return (
    <div className="w-full p-4 space-y-6 min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <h1 className="text-xl font-bold text-red-500 uppercase tracking-wide">
        FINANCE RECONCILIATIONS
      </h1>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-white dark:bg-gray-900 rounded-lg">
        {/* Clinic Name */}
        <div className="md:col-span-3 space-y-1">
          <Label className="text-xs font-semibold text-gray-500">Clinic Name</Label>
          <Select
            value={filters.clinicName}
            onValueChange={(val) => handleFilterChange("clinicName", val)}
          >
            <SelectTrigger className="h-9 bg-white border-gray-300">
              <SelectValue placeholder="-- Select Clinic --" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dehradun">Dehradun</SelectItem>
              <SelectItem value="secunderabad">Secunderabad</SelectItem>
              <SelectItem value="lb-nagar">LB Nagar</SelectItem>
              <SelectItem value="madhapur">Madhapur</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Invoice No */}
        <div className="md:col-span-3 space-y-1">
          <Label className="text-xs font-semibold text-gray-500">Invoice No</Label>
          <Input
             className="h-9 bg-white border-gray-300"
             placeholder="Invoice No"
             value={filters.invoiceNo}
             onChange={(e) => handleFilterChange("invoiceNo", e.target.value)}
          />
        </div>

        {/* Empty Spacer */}
        <div className="hidden md:block md:col-span-6"></div>

         {/* From Date */}
         <div className="md:col-span-3">
          <Input
             type="date"
             className="h-9 bg-white border-gray-300"
             value={filters.fromDate}
             onChange={(e) => handleFilterChange("fromDate", e.target.value)}
          />
        </div>

         {/* To Date */}
         <div className="md:col-span-3">
          <Input
             type="date"
             className="h-9 bg-white border-gray-300"
             value={filters.toDate}
             onChange={(e) => handleFilterChange("toDate", e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="md:col-span-3 flex gap-2">
            <Button
                size="sm"
                className="bg-[#C04000] hover:bg-[#A03000] text-white px-6 h-9 rounded-md"
            >
                Search
            </Button>
            <Button
                size="sm"
                onClick={handleClear}
                className="bg-[#C04000] hover:bg-[#A03000] text-white px-6 h-9 rounded-md"
            >
                Clear
            </Button>
        </div>
        
        {/* Total Count */}
        <div className="md:col-span-3 flex justify-end pb-2">
             <span className="text-sm text-gray-600 font-medium">Total : 165</span>
        </div>
      </div>

      {/* Table Section */}
      <div className="border border-gray-200 rounded-sm overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[#E6FFCC] hover:bg-[#E6FFCC]">
                <TableRow className="border-b border-gray-100 hover:bg-[#E6FFCC]">
                  <TableHead className="text-xs font-bold text-gray-700 h-10 w-12">Sr. No.</TableHead>
                  <TableHead className="text-xs font-bold text-gray-700 h-10 w-32"></TableHead> 
                  <TableHead className="text-xs font-bold text-gray-700 h-10">Clinic Name</TableHead>
                  <TableHead className="text-xs font-bold text-gray-700 h-10">Patient Code</TableHead>
                  <TableHead className="text-xs font-bold text-gray-700 h-10">Patient Name</TableHead>
                  <TableHead className="text-xs font-bold text-gray-700 h-10">Invoice No.</TableHead>
                  <TableHead className="text-xs font-bold text-gray-700 h-10">Payment Date</TableHead>
                  <TableHead className="text-xs font-bold text-gray-700 h-10">Revenue Amount</TableHead>
                  <TableHead className="text-xs font-bold text-gray-700 h-10">Disbursed amount</TableHead>
                  <TableHead className="text-xs font-bold text-gray-700 h-10">LAN</TableHead>
                  <TableHead className="text-xs font-bold text-gray-700 h-10">Subvention Rate</TableHead>
                  <TableHead className="text-xs font-bold text-gray-700 h-10">Payment Mode</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, index) => (
                    <TableRow key={row.id} className="border-b border-gray-50 hover:bg-gray-50 text-xs">
                      <TableCell className="py-2 text-gray-600">{row.id}</TableCell>
                      <TableCell className="py-2">
                        <Button
                            size="sm"
                            className="bg-[#1E6B8C] hover:bg-[#155a75] text-white text-[10px] h-7 px-2 w-full rounded-sm"
                        >
                            Add Reconciliations
                        </Button>
                      </TableCell>
                      <TableCell className="py-2 text-gray-600">{row.clinic}</TableCell>
                      <TableCell className="py-2 text-gray-600">{row.pCode}</TableCell>
                      <TableCell className="py-2 text-gray-600">{row.pName}</TableCell>
                      <TableCell className="py-2 text-gray-600">{row.invNo}</TableCell>
                      <TableCell className="py-2 text-gray-600">{row.date}</TableCell>
                      <TableCell className="py-2 text-gray-600 font-medium">{row.rev}</TableCell>
                      <TableCell className="py-2 text-gray-600">{row.disb}</TableCell>
                      <TableCell className="py-2 text-gray-600">{row.lan}</TableCell>
                      <TableCell className="py-2 text-gray-600">{row.sub}</TableCell>
                      <TableCell className="py-2 text-gray-600">{row.mode}</TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
        </div>
      </div>
      
       {/* Footer / Pagination */}
       <div className="flex justify-between items-center pt-2">
            <Button variant="outline" size="icon" className="h-8 w-8 text-green-700 border-green-700 hover:bg-green-50">
                <FileSpreadsheet className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-1">
                 <Button variant="ghost" size="sm" className="h-8 text-blue-500 font-normal hover:bg-transparent px-1">
                    12345678910...&gt;&gt;
                 </Button>
            </div>
       </div>
    </div>
  );
}
