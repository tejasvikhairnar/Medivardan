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

export default function ChequeReport() {
  const [clinic, setClinic] = useState("");
  const [doctor, setDoctor] = useState("");
  const [patientName, setPatientName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data matching the image
  const [tableData, setTableData] = useState([
    {
      id: 1,
      invoiceNo: "INV173797",
      clinicName: "Borivali",
      patientName: "BHARAT JOSHI",
      age: "62",
      chequeName: "Cheque",
      treatmentName: "Dental Implants Genesis",
      groupName: "Implant",
      paidAmount: "0.00",
      date: "2028-12-30",
    },
    {
      id: 2,
      invoiceNo: "INV173797",
      clinicName: "Borivali",
      patientName: "BHARAT JOSHI",
      age: "62",
      chequeName: "Cheque",
      treatmentName: "Dental Implants Genesis",
      groupName: "Implant",
      paidAmount: "0.00",
      date: "2025-03-03",
    },
    {
      id: 3,
      invoiceNo: "INV173797",
      clinicName: "Borivali",
      patientName: "BHARAT JOSHI",
      age: "62",
      chequeName: "Cheque",
      treatmentName: "Dental Implants Genesis",
      groupName: "Implant",
      paidAmount: "0.00",
      date: "2025-12-30",
    },
    {
      id: 4,
      invoiceNo: "INV191123",
      clinicName: "KALYAN NAGAR",
      patientName: "Rupa S Poojary",
      age: "57",
      chequeName: "Cheque",
      treatmentName: "DENTAL IMPLANT-ALPHA BIO",
      groupName: "Implant",
      paidAmount: "0.00",
      date: "2025-12-25",
    },
    {
      id: 5,
      invoiceNo: "INV191123",
      clinicName: "KALYAN NAGAR",
      patientName: "Rupa S Poojary",
      age: "57",
      chequeName: "Cheque",
      treatmentName: "DENTAL IMPLANT-ALPHA BIO",
      groupName: "Implant",
      paidAmount: "0.00",
      date: "2025-12-15",
    },
    {
      id: 6,
      invoiceNo: "INV192381",
      clinicName: "Borivali",
      patientName: "Reginald Colaco",
      age: "64",
      chequeName: "Cheque",
      treatmentName: "REMOVABLE PARTIAL DENTURE BASE - FLEXI",
      groupName: "General",
      paidAmount: "18000.00",
      date: "2025-12-15",
    },
    {
      id: 7,
      invoiceNo: "MAH002642526",
      clinicName: "Borivali",
      patientName: "Suresh Desai",
      age: "70",
      chequeName: "Cheque",
      treatmentName: "DENTAL IMPLANTS - SUPERLINE",
      groupName: "Implant",
      paidAmount: "90000.00",
      date: "2025-12-15",
    },
    {
      id: 8,
      invoiceNo: "INV186017",
      clinicName: "Dombivali East",
      patientName: "SHWETA MHATRE",
      age: "0",
      chequeName: "Cheque",
      treatmentName: "IMMEDIATE LOADING IMPLANTS - SINGLE ARCH-OSSTEM",
      groupName: "Implant",
      paidAmount: "25000.00",
      date: "2025-12-15",
    },
    {
      id: 9,
      invoiceNo: "GUJ001812526",
      clinicName: "Shahibaug",
      patientName: "Bhawarlal Doshi",
      age: "65",
      chequeName: "Cheque",
      treatmentName: "COMPLETE DENTURES - CLASSIC",
      groupName: "General",
      paidAmount: "10000.00",
      date: "2025-12-13",
    },
    {
      id: 10,
      invoiceNo: "GUJ001812526",
      clinicName: "Shahibaug",
      patientName: "Bhawarlal Doshi",
      age: "65",
      chequeName: "Cheque",
      treatmentName: "COMPLETE DENTURES - CLASSIC",
      groupName: "General",
      paidAmount: "20000.00",
      date: "2025-12-13",
    },
  ]);

  const handleExport = () => {
    exportToExcel(tableData, "Cheque_Report");
  };

  // Filter Data
  const filteredData = tableData.filter((item) => {
      const matchesClinic = !clinic || clinic === "all" || item.clinicName.toLowerCase() === clinic.toLowerCase();
      const matchesPatient = item.patientName.toLowerCase().includes(patientName.toLowerCase());
      // Mock data doesn't have mobile number but image implies it. Skipping mobile filter if not present in mock data for now.
      
      let matchesDate = true;
      if (fromDate) matchesDate = matchesDate && new Date(item.date) >= new Date(fromDate);
      if (toDate) matchesDate = matchesDate && new Date(item.date) <= new Date(toDate);

      return matchesClinic && matchesPatient && matchesDate;
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
          CHEQUE REPORT
        </h1>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Clinic Name</label>
                <Select value={clinic} onValueChange={setClinic}>
                    <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                    <SelectValue placeholder="-- Select Clinic --" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="all">All Clinics</SelectItem>
                    <SelectItem value="Borivali">Borivali</SelectItem>
                    <SelectItem value="Kalyan Nagar">Kalyan Nagar</SelectItem>
                     <SelectItem value="Dombivali East">Dombivali East</SelectItem>
                      <SelectItem value="Shahibaug">Shahibaug</SelectItem>
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
                    <SelectItem value="doc1">Dr. Smith</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Patient Name</label>
                <Input
                    placeholder="Patient Name"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                />
            </div>

             <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Mobile No</label>
                <Input
                    placeholder="Mobile No"
                    value={mobileNo}
                    onChange={(e) => setMobileNo(e.target.value)}
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                />
            </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 max-w-xs">
                 <label className="text-xs font-medium text-gray-700 dark:text-gray-300">From Payment Date</label>
                <Input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                />
            </div>
            <div className="flex-1 max-w-xs">
                 <label className="text-xs font-medium text-gray-700 dark:text-gray-300">To Payment Date</label>
                 <Input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                />
            </div>

            <div className="flex-none pt-4">
                 <Button className="bg-[#D35400] hover:bg-[#A04000] text-white px-8 font-medium shadow-sm transition-all">
                    Search
                </Button>
            </div>
        </div>
      </div>
      
       {/* Total Count */}
       <div className="flex justify-end text-sm text-gray-600 dark:text-gray-400 font-medium">
        Total : {filteredData.length}
      </div>

      {/* Table */}
       <div className="border border-gray-200 dark:border-gray-700 rounded-t-lg overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader className="bg-[#E8F8F5] dark:bg-gray-800">
            <TableRow className="hover:bg-[#E8F8F5] dark:hover:bg-gray-700/50 border-gray-200 dark:border-gray-700">
              <TableHead className="font-bold text-gray-700 dark:text-gray-300 w-[60px]">Sr. No.</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-300">Invoice No.</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-300">Clinic Name</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-300">Patient Name</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-300">Age</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-300">ChequeName</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-300">Treatment Name</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-300">Group Name</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-300">Paid Amount</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-300">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length > 0 ? (
                currentItems.map((row, index) => (
                <TableRow key={row.id} className="border-gray-200 dark:border-gray-700 dark:hover:bg-gray-800/50">
                    <TableCell className="dark:text-gray-300">{indexOfFirstItem + index + 1}</TableCell>
                    <TableCell className="dark:text-gray-300">{row.invoiceNo}</TableCell>
                    <TableCell className="dark:text-gray-300">{row.clinicName}</TableCell>
                    <TableCell className="dark:text-gray-300">{row.patientName}</TableCell>
                    <TableCell className="dark:text-gray-300">{row.age}</TableCell>
                    <TableCell className="dark:text-gray-300">{row.chequeName}</TableCell>
                    <TableCell className="dark:text-gray-300">{row.treatmentName}</TableCell>
                    <TableCell className="dark:text-gray-300">{row.groupName}</TableCell>
                    <TableCell className="dark:text-gray-300">{row.paidAmount}</TableCell>
                    <TableCell className="dark:text-gray-300 whitespace-nowrap">{row.date}</TableCell>
                </TableRow>
                ))
            ) : (
                <TableRow>
                     <TableCell colSpan={10} className="text-center py-4 text-gray-500">No matching records found</TableCell>
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
