"use client";

import React, { useState } from "react";
import { Settings, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { exportToExcel } from "@/utils/exportToExcel";
import CustomPagination from "@/components/ui/custom-pagination";

export default function OrderHistoryPage() {
  const [clinic, setClinic] = useState("");
  const [doctor, setDoctor] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

 // Mock data
  const [historyData, setHistoryData] = useState([
    { id: 1, clinic: "Clinic 1", doctor: "Dr. Smith", orderId: "ORD001", date: "2025-01-01", status: "Completed", amount: "1500" },
    { id: 2, clinic: "Clinic 2", doctor: "Dr. Jones", orderId: "ORD002", date: "2025-01-02", status: "Pending", amount: "3000" },
    { id: 3, clinic: "Clinic 1", doctor: "Dr. Smith", orderId: "ORD003", date: "2025-01-03", status: "Completed", amount: "1200" },
    { id: 4, clinic: "Clinic 3", doctor: "Dr. Doe", orderId: "ORD004", date: "2025-01-04", status: "Cancelled", amount: "0" },
    { id: 5, clinic: "Clinic 2", doctor: "Dr. Jones", orderId: "ORD005", date: "2025-01-05", status: "Completed", amount: "5500" },
  ]);

  const handleExport = () => {
    exportToExcel(historyData, "Order_History_Report");
  };

  // Filter Data
  const filteredData = historyData.filter((item) => {
      const matchesClinic = !clinic || clinic === "all" || item.clinic === clinic;
      const matchesDoctor = !doctor || doctor === "all" || item.doctor === doctor;
      return matchesClinic && matchesDoctor;
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-4">
        <Settings className="w-5 h-5 text-[#0f7396] animate-spin-slow" />
        <h1 className="text-lg font-bold text-[#0f7396] uppercase tracking-wide">
          ORDER HISTORY
        </h1>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
                 <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Clinic Name</label>
                <Select value={clinic} onValueChange={setClinic}>
                    <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                    <SelectValue placeholder="-- Select Clinic --" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="all">All Clinics</SelectItem>
                    <SelectItem value="Clinic 1">Clinic 1</SelectItem>
                    <SelectItem value="Clinic 2">Clinic 2</SelectItem>
                    <SelectItem value="Clinic 3">Clinic 3</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-1">
                 <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Doctor Name</label>
                <Select value={doctor} onValueChange={setDoctor}>
                    <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                    <SelectValue placeholder="-- Select Doctor --" />
                    </SelectTrigger>
                    <SelectContent>
                     <SelectItem value="all">All Doctors</SelectItem>
                    <SelectItem value="Dr. Smith">Dr. Smith</SelectItem>
                    <SelectItem value="Dr. Jones">Dr. Jones</SelectItem>
                    <SelectItem value="Dr. Doe">Dr. Doe</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>

        <div>
          <Button className="bg-[#D35400] hover:bg-[#A04000] text-white px-8 font-medium shadow-sm transition-all md:w-auto w-full">
            Search
          </Button>
        </div>
      </div>
      
       {/* Total Count */}
       <div className="flex justify-end text-sm text-gray-600 dark:text-gray-400 font-medium">
        Total : {filteredData.length}
      </div>

      {/* Table Area */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-t-lg overflow-hidden">
         <Table>
           <TableHeader className="bg-[#E8F8F5] dark:bg-gray-800">
            <TableRow className="hover:bg-[#E8F8F5] dark:hover:bg-gray-700/50 border-gray-200 dark:border-gray-700">
              <TableHead className="font-bold text-gray-700 dark:text-gray-300 w-[60px]">Sr. No.</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-300">Clinic</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-300">Doctor</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-300">Order ID</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-300">Date</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-300">Status</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-300">Amount</TableHead>
            </TableRow>
          </TableHeader>
            <TableBody>
                {currentItems.length > 0 ? (
                    currentItems.map((item, index) => (
                    <TableRow key={item.id} className="border-gray-200 dark:border-gray-700 dark:hover:bg-gray-800/50">
                        <TableCell className="dark:text-gray-300">{indexOfFirstItem + index + 1}</TableCell>
                        <TableCell className="dark:text-gray-300">{item.clinic}</TableCell>
                        <TableCell className="dark:text-gray-300">{item.doctor}</TableCell>
                        <TableCell className="dark:text-gray-300">{item.orderId}</TableCell>
                        <TableCell className="dark:text-gray-300">{item.date}</TableCell>
                        <TableCell className="dark:text-gray-300">{item.status}</TableCell>
                        <TableCell className="dark:text-gray-300">{item.amount}</TableCell>
                    </TableRow>
                    ))
                ) : (
                <TableRow>
                     <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                        No Record Available
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
         </Table>
      </div>
      
       {/* Footer / Pagination */}
       <div className="flex justify-between items-center pt-2">
         {/* Excel Export Icon */}
         <Button variant="ghost" size="icon" onClick={handleExport} className="text-green-600 hover:text-green-700">
              <FileSpreadsheet className="w-6 h-6" />
         </Button>
         
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
