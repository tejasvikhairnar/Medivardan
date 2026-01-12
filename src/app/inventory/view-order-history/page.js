"use client";

import React, { useState } from "react";
import { Settings, FileSpreadsheet } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { exportToExcel } from "@/utils/exportToExcel";
import CustomPagination from "@/components/ui/custom-pagination";

export default function ViewOrderHistory() {
  const [clinicName, setClinicName] = useState("");
  const [inventoryType, setInventoryType] = useState("");
  const [itemName, setItemName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data matching the image
  const [tableData, setTableData] = useState([
    {
      id: 1,
      clinicName: "Mansarovar",
      date: "2025-12-04",
      orderRequested: "CORD9451",
      order: "CORD9451",
      status: "Request Pending",
    },
    {
      id: 2,
      clinicName: "Mansarovar",
      date: "2025-12-04",
      orderRequested: "CORD9901",
      order: "CORD9901",
      status: "Request Pending",
    },
    {
      id: 3,
      clinicName: "Dombivali East",
      date: "2025-06-23",
      orderRequested: "CORD7208",
      order: "CORD7208",
      status: "Request Pending",
    },
    {
        id: 4,
        clinicName: "Vasai west",
        date: "2024-11-06",
        orderRequested: "CORD1801",
        order: "CORD1801",
        status: "Request Pending",
      },
      {
        id: 5,
        clinicName: "MADHAPUR",
        date: "2024-10-31",
        orderRequested: "CORD6067",
        order: "CORD6067",
        status: "Request Pending",
      },
      {
        id: 6,
        clinicName: "MAMBALAM",
        date: "2024-10-22",
        orderRequested: "CORD8953",
        order: "CORD8953",
        status: "Request Pending",
      },
      {
        id: 7,
        clinicName: "Market Yard",
        date: "2024-09-20",
        orderRequested: "CORD1559",
        order: "CORD1559",
        status: "Dispatched",
      },
      {
        id: 8,
        clinicName: "Hadapsar",
        date: "2024-09-20",
        orderRequested: "CORD7050",
        order: "CORD7050",
        status: "Dispatched",
      },
      {
        id: 9,
        clinicName: "Nigdi",
        date: "2024-09-20",
        orderRequested: "CORD9650",
        order: "CORD9650",
        status: "Request Pending",
      },
       {
        id: 10,
        clinicName: "Chakan",
        date: "2024-09-19",
        orderRequested: "CORD2235",
        order: "CORD2235",
        status: "Dispatched",
      },
  ]);

  const getStatusBadge = (status) => {
    if (status === "Dispatched") {
      return (
        <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-100 border border-orange-200 shadow-sm">
          {status}
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-gray-500 border-gray-300 shadow-sm bg-gray-50">
        {status}
      </Badge>
    );
  };

  const handleExport = () => {
    exportToExcel(tableData, "View_Order_History");
  };

  // Filter Data
  const filteredData = tableData.filter((item) => {
      const matchesClinic = !clinicName || clinicName === "all" || item.clinicName === clinicName; // In real app, IDs would be used
      // Note: Inventory Type and Item Name are not in the top-level mock data shown in table (except maybe implied by order number or hidden). 
      // Assuming for now we just filter what we have. If Item Name filter is required, data structure needs to support it. 
      // I'll filter by Clinic Name and Date for now as they are visible.
      
      let matchesDate = true;
      if (fromDate) matchesDate = matchesDate && new Date(item.date) >= new Date(fromDate);
      if (toDate) matchesDate = matchesDate && new Date(item.date) <= new Date(toDate);

      return matchesClinic && matchesDate;
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
          <Settings className="w-4 h-4 text-[#0f7396]" />
        </div>
        <h1 className="text-xl font-bold text-[#0f7396] dark:text-[#0f7396] uppercase">
          VIEW ORDER HISTORY
        </h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-1/3 space-y-1">
             <label className="text-xs font-semibold text-gray-500 uppercase">Clinic Name</label>
            <Select value={clinicName} onValueChange={setClinicName}>
              <SelectTrigger className="h-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400">
                <SelectValue placeholder="-- Select Clinic --" />
              </SelectTrigger>
              <SelectContent>
                 <SelectItem value="all">All Clinics</SelectItem>
                <SelectItem value="Mansarovar">Mansarovar</SelectItem>
                <SelectItem value="Dombivali East">Dombivali East</SelectItem>
                <SelectItem value="Vasai west">Vasai west</SelectItem>
                <SelectItem value="MADHAPUR">MADHAPUR</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-1/3 space-y-1">
             <label className="text-xs font-semibold text-gray-500 uppercase">Inventory Type</label>
            <Select value={inventoryType} onValueChange={setInventoryType}>
              <SelectTrigger className="h-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400">
                <SelectValue placeholder="--- Select Material Type---" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="material">MATERIAL</SelectItem>
                <SelectItem value="medicine">MEDICINE</SelectItem>
              </SelectContent>
            </Select>
          </div>

           <div className="w-full md:w-1/3 space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase">Item Name</label>
            <Input
              placeholder="Material Name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="h-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-end">
           <div className="w-full md:w-1/3 space-y-1">
            <label className="text-xs font-semibold text-gray-500 uppercase">From Date</label>
             <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="h-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400"
             />
           </div>
           
           <div className="w-full md:w-1/3 space-y-1">
             <label className="text-xs font-semibold text-gray-500 uppercase">To Date</label>
             <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="h-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400"
             />
           </div>

            <div className="w-full md:w-1/3">
                <Button className="bg-[#0f7396] hover:bg-[#0b5c7a] text-white px-8 h-10 w-full md:w-auto shadow-sm transition-all">
                    Search
                </Button>
            </div>
        </div>
      </div>

      {/* Summary Count */}
      <div className="flex justify-end text-sm text-gray-600 dark:text-gray-400 font-medium">
        Total : {filteredData.length}
      </div>

      {/* Table */}
       <div className="border border-gray-200 dark:border-gray-700 rounded-t-lg overflow-hidden overflow-x-auto">
         <Table>
          <TableHeader className="bg-[#0f7396]/10 dark:bg-[#0f7396]/20">
            <TableRow className="hover:bg-[#0f7396]/10 border-gray-200 dark:border-gray-700">
              <TableHead className="font-bold text-gray-800 dark:text-gray-200 w-[60px] border-r border-white dark:border-gray-600">Sr. No.</TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-gray-200 border-r border-white dark:border-gray-600">Clinic Name</TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-gray-200 border-r border-white dark:border-gray-600">Date</TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-gray-200 border-r border-white dark:border-gray-600">Order Requested</TableHead>
               <TableHead className="font-bold text-gray-800 dark:text-gray-200 border-r border-white dark:border-gray-600">Order</TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-gray-200">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length > 0 ? (
                currentItems.map((row, index) => (
                <TableRow key={row.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <TableCell className="font-medium text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{indexOfFirstItem + index + 1}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{row.clinicName}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">{row.date}</TableCell>
                    <TableCell className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium border-r border-gray-200 dark:border-gray-700">{row.orderRequested}</TableCell>
                    <TableCell className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium border-r border-gray-200 dark:border-gray-700">{row.order}</TableCell>
                    <TableCell>
                        {getStatusBadge(row.status)}
                    </TableCell>
                </TableRow>
                ))
            ) : (
                <TableRow>
                     <TableCell colSpan={6} className="text-center py-4 text-gray-500">No matching records found</TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
       {/* Footer / Pagination */}
       <div className="flex justify-between items-center mt-4">
        {/* Excel Export */}
        <div className="cursor-pointer" onClick={handleExport} title="Download Excel">
           <div className="w-8 h-8 flex items-center justify-center bg-[#0f7396] hover:bg-[#0b5c7a] text-white rounded shadow transition-colors">
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
