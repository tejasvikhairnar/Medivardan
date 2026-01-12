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
import { exportToExcel } from "@/utils/exportToExcel";
import CustomPagination from "@/components/ui/custom-pagination";

export default function DoctorCollectionReportPage() {
  const [clinic, setClinic] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [fromDate, setFromDate] = useState("2024-12-08"); // Set default to realistic date
  const [toDate, setToDate] = useState("2025-12-23");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data matching the image
  const [reportData, setReportData] = useState([
    { id: 1, clinic: "DADAR West", doctor: "Dr.Harshada Mane", treatmentAmount: "1025000.00", medicineAmount: "0.00", date: "2025-12-10" },
    { id: 2, clinic: "MALAD West", doctor: "Dr.Swapnali Nachnekar", treatmentAmount: "66173.00", medicineAmount: "1173.04", date: "2025-12-12" },
    { id: 3, clinic: "ELECTRONIC CITY", doctor: "Dr.Shaheda Manjothi", treatmentAmount: "0.00", medicineAmount: "0.00", date: "2025-12-15" },
    { id: 4, clinic: "TRICHY", doctor: "Dr.SUVETHA ASHOK", treatmentAmount: "32500.00", medicineAmount: "0.00", date: "2025-12-18" },
    { id: 5, clinic: "BTM", doctor: "Dr.Hajara V K", treatmentAmount: "16800.00", medicineAmount: "0.00", date: "2025-12-20" },
    { id: 6, clinic: "Andheri East (takshila)", doctor: "Dr.A Samad Tanwar", treatmentAmount: "0.00", medicineAmount: "0.00", date: "2025-12-21" },
    { id: 7, clinic: "Andheri West (Juhu)", doctor: "Dr.A Samad Tanwar", treatmentAmount: "0.00", medicineAmount: "0.00", date: "2025-12-21" },
    { id: 8, clinic: "bandra west", doctor: "Dr.A Samad Tanwar", treatmentAmount: "0.00", medicineAmount: "0.00", date: "2025-12-21" },
    { id: 9, clinic: "Goregaon West", doctor: "Dr.A Samad Tanwar", treatmentAmount: "0.00", medicineAmount: "0.00", date: "2025-12-21" },
    { id: 10, clinic: "GOREGAON East", doctor: "Dr.A Samad Tanwar", treatmentAmount: "0.00", medicineAmount: "0.00", date: "2025-12-21" },
  ]);

  const handleExport = () => {
    exportToExcel(reportData, "Doctor_Collection_Report");
  };

  // Filter Data
  const filteredData = reportData.filter((item) => {
      const matchesClinic = !clinic || clinic === "all" || item.clinic.toLowerCase().includes(clinic.toLowerCase()); 
      const matchesDoctor = item.doctor.toLowerCase().includes(doctorName.toLowerCase());
      
      let matchesDate = true;
      if (fromDate) matchesDate = matchesDate && new Date(item.date) >= new Date(fromDate);
      if (toDate) matchesDate = matchesDate && new Date(item.date) <= new Date(toDate);

      return matchesClinic && matchesDoctor && matchesDate;
  });

  // Calculate Total
  const totalAmount = filteredData.reduce((acc, curr) => acc + parseFloat(curr.treatmentAmount) + parseFloat(curr.medicineAmount), 0).toFixed(2);


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
          DOCTOR COLLECTION REPORT
        </h1>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
                 <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Clinic Name</label>
                <Select value={clinic} onValueChange={setClinic}>
                    <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                    <SelectValue placeholder="--- Select Clinic ---" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="dadar">DADAR West</SelectItem>
                    <SelectItem value="malad">MALAD West</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            
            <div className="space-y-1">
                 <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Doctor Name</label>
                 <Input
                    placeholder="Doctor Name"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                />
            </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-end">
          <Input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 w-full md:w-auto"
          />

          <Input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 w-full md:w-auto"
          />

          <Button className="bg-[#0f7396] hover:bg-[#0b5c7a] text-white px-8 font-medium shadow-sm transition-all md:w-auto w-full">
            Search
          </Button>

          <div className="ml-auto text-sm font-medium text-gray-700 dark:text-gray-300">
            Total Amount : {totalAmount}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-t-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-[#0f7396]/10 dark:bg-gray-800">
            <TableRow className="hover:bg-[#0f7396]/10 dark:hover:bg-gray-700/50 border-gray-200 dark:border-gray-700">
              <TableHead className="font-bold text-gray-700 dark:text-gray-300 w-[80px]">Sr No.</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-300">Clinic Name</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-300">Doctor Name</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-300">Treatment Paid Amount</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-300">Medicines Paid Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((item, index) => (
              <TableRow key={item.id} className="border-gray-200 dark:border-gray-700 dark:hover:bg-gray-800/50">
                <TableCell className="dark:text-gray-300">{indexOfFirstItem + index + 1}</TableCell>
                <TableCell className="dark:text-gray-300">{item.clinic}</TableCell>
                <TableCell className="dark:text-gray-300">{item.doctor}</TableCell>
                <TableCell className="dark:text-gray-300">{item.treatmentAmount}</TableCell>
                <TableCell className="dark:text-gray-300">{item.medicineAmount}</TableCell>
              </TableRow>
            ))}
             {currentItems.length === 0 && (
              <TableRow>
                 <TableCell colSpan={5} className="text-center py-4 text-gray-500">No matching records found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
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
