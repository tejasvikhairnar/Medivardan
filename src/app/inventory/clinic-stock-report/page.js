"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Search, FileSpreadsheet, Settings } from "lucide-react";
import { exportToExcel } from "@/utils/exportToExcel";
import CustomPagination from "@/components/ui/custom-pagination";

export default function ClinicStockReportPage() {
  const [filterClinic, setFilterClinic] = useState("");
  const [filterItemName, setFilterItemName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data for the table
  const [reportData, setReportData] = useState([
    {
      id: 1,
      date: "2024-01-01",
      clinicName: "Clinic A",
      itemName: "Paracetamol",
      openingStock: 100,
      inward: 50,
      outward: 30,
      closingStock: 120,
    },
    {
      id: 2,
      date: "2024-01-02",
      clinicName: "Clinic B",
      itemName: "Ibuprofen",
      openingStock: 80,
      inward: 20,
      outward: 10,
      closingStock: 90,
    },
    {
      id: 3,
      date: "2024-01-03",
      clinicName: "Clinic A",
      itemName: "Cough Syrup",
      openingStock: 50,
      inward: 10,
      outward: 5,
      closingStock: 55,
    },
     {
      id: 4,
      date: "2024-01-03",
      clinicName: "Clinic C",
      itemName: "Bandage",
      openingStock: 200,
      inward: 100,
      outward: 50,
      closingStock: 250,
    },
  ]);

  const handleExport = () => {
    exportToExcel(reportData, "Clinic_Stock_Report");
  };

  // Filter Data
  const filteredData = reportData.filter((item) => {
      const matchesClinic = !filterClinic || filterClinic === "all" || item.clinicName === filterClinic;
      const matchesItem = item.itemName.toLowerCase().includes(filterItemName.toLowerCase());
      
      let matchesDate = true;
      if (fromDate) matchesDate = matchesDate && new Date(item.date) >= new Date(fromDate);
      if (toDate) matchesDate = matchesDate && new Date(item.date) <= new Date(toDate);

      return matchesClinic && matchesItem && matchesDate;
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="w-full min-h-screen bg-white dark:bg-gray-900 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
          <Settings className="w-4 h-4 text-primary" />
        </div>
        <h1 className="text-xl font-bold text-primary dark:text-primary uppercase tracking-wide">
          CLINIC STOCK REPORT
        </h1>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 items-end">
        {/* Clinic Name */}
        <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase">Clinic Name</label>
            <Select value={filterClinic} onValueChange={setFilterClinic}>
            <SelectTrigger className="h-10 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700">
                <SelectValue placeholder="Select Clinic" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Clinics</SelectItem>
                <SelectItem value="Clinic A">Clinic A</SelectItem>
                <SelectItem value="Clinic B">Clinic B</SelectItem>
                <SelectItem value="Clinic C">Clinic C</SelectItem>
            </SelectContent>
            </Select>
        </div>

        {/* Item Name */}
        <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase">Item Name</label>
            <Input
            placeholder="Enter Item Name"
            value={filterItemName}
            onChange={(e) => setFilterItemName(e.target.value)}
            className="h-10 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
            />
        </div>

        {/* From Date */}
        <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase">From Date</label>
            <Input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="h-10 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
            />
        </div>

        {/* To Date */}
        <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase">To Date</label>
            <Input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="h-10 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
            />
        </div>

        {/* Search Button */}
        <div>
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-white h-10 transition-colors"
          >
            <Search className="w-4 h-4 mr-2" />
            SEARCH
          </Button>
        </div>
      </div>
      
       {/* Total Count */}
       <div className="flex justify-end text-sm text-gray-600 dark:text-gray-400 font-medium">
        Total : {filteredData.length}
      </div>

      {/* Table */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-t-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-primary/10 dark:bg-primary/20">
            <TableRow className="hover:bg-primary/10">
              <TableHead className="w-[80px] font-bold text-gray-800 dark:text-gray-200 border-r border-white dark:border-gray-600">
                S.No
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-gray-200 border-r border-white dark:border-gray-600">
                Date
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-gray-200 border-r border-white dark:border-gray-600">
                Clinic Name
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-gray-200 border-r border-white dark:border-gray-600">
                Item Name
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-gray-200 border-r border-white dark:border-gray-600">
                Opening Stock
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-gray-200 border-r border-white dark:border-gray-600">
                Inward
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-gray-200 border-r border-white dark:border-gray-600">
                Outward
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-gray-200">
                Closing Stock
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length > 0 ? (
                currentItems.map((row, index) => (
                <TableRow
                    key={row.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700"
                >
                    <TableCell className="font-medium text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 py-3">{indexOfFirstItem + index + 1}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 py-3">{row.date}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 py-3">{row.clinicName}</TableCell>
                    <TableCell className="font-medium text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 py-3">{row.itemName}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 py-3">{row.openingStock}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 py-3">{row.inward}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 py-3">{row.outward}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300 py-3">{row.closingStock}</TableCell>
                </TableRow>
                ))
            ) : (
                <TableRow>
                     <TableCell colSpan={8} className="text-center py-4 text-gray-500">No matching records found</TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

       {/* Footer / Pagination / Export */}
      <div className="flex justify-between items-center mt-4">
        {/* Excel Export */}
        <div className="cursor-pointer" onClick={handleExport} title="Download Excel">
           <div className="w-8 h-8 flex items-center justify-center bg-primary hover:bg-primary/90 text-white rounded shadow transition-colors">
            <FileSpreadsheet className="w-5 h-5" />
           </div>
        </div>
        
        {/* Pagination component */}
        <CustomPagination 
            totalItems={filteredData.length} 
            itemsPerPage={itemsPerPage} 
            currentPage={currentPage} 
            onPageChange={setCurrentPage} 
        />
      </div>
    </div>
  );
}
