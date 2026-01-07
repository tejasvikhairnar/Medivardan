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
import { FileSpreadsheet, Settings } from "lucide-react";
import { exportToExcel } from "@/utils/exportToExcel";
import CustomPagination from "@/components/ui/custom-pagination";

export default function PatientwiseCollectionReportPage() {
  const [clinicName, setClinicName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [patientName, setPatientName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data matching the screenshot
  const [reportData, setReportData] = useState([
    {
      id: 1,
      clinic: "Vashi",
      date: "2019-03-01",
      receiptNo: "RNO/VSH/18-19/669",
      patientName: "mr. vijay",
      mobile: "9988998899",
      treatment: "CONSULTAION",
      doctor: "Dr.R.T.PATIL",
      paidAmount: "500",
      mode: "Cash",
    },
    {
      id: 2,
      clinic: "Vashi",
      date: "2019-03-02",
      receiptNo: "RNO/VSH/18-19/670",
      patientName: "Mrs. smita",
      mobile: "7766554433",
      treatment: "FOLLOW UP",
      doctor: "Dr.R.T.PATIL",
      paidAmount: "300",
      mode: "Card",
    },
    {
        id: 3,
        clinic: "Andheri",
        date: "2019-03-03",
        receiptNo: "RNO/AND/18-19/671",
        patientName: "mr. rahul",
        mobile: "9988776655",
        treatment: "CONSULTAION",
        doctor: "Dr.A.K.Sharma",
        paidAmount: "800",
        mode: "Cash",
    },
  ]);

  // Filter Data
  const filteredData = reportData.filter((item) => {
      const matchesClinic = !clinicName || clinicName === "all" || item.clinic.toLowerCase() === clinicName.toLowerCase();
      const matchesDoctor = item.doctor.toLowerCase().includes(doctorName.toLowerCase());
      const matchesPatient = item.patientName.toLowerCase().includes(patientName.toLowerCase());
      
      let matchesDate = true;
      if (fromDate) matchesDate = matchesDate && new Date(item.date) >= new Date(fromDate);
      if (toDate) matchesDate = matchesDate && new Date(item.date) <= new Date(toDate);

      return matchesClinic && matchesDoctor && matchesPatient && matchesDate;
  });
    
    const handleClear = () => {
      setClinicName("");
      setDoctorName("");
      setPatientName("");
      setFromDate("");
      setToDate("");
      setCurrentPage(1);
    }

  const handleExport = () => {
    exportToExcel(filteredData, "Patientwise_Collection_Report");
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalAmount = filteredData.reduce((acc, curr) => acc + parseFloat(curr.paidAmount || 0), 0);

  return (
    <div className="w-full min-h-screen bg-white dark:bg-gray-900 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
          <Settings className="w-4 h-4 text-[#0f7396]" />
        </div>
        <h1 className="text-xl font-bold text-[#0f7396] dark:text-[#0f7396] uppercase">
          PATIENTWISE COLLECTION REPORT
        </h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-end bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 font-normal">
        {/* Clinic Name (Required) */}
        <div className="w-full md:w-1/6 space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
             Clinic Name <span className="text-red-500">*</span>
          </label>
           <Select value={clinicName} onValueChange={setClinicName}>
            <SelectTrigger className="h-10 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700">
                <SelectValue placeholder="-- Select Clinic --" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Clinics</SelectItem>
                <SelectItem value="vashi">Vashi</SelectItem>
                <SelectItem value="andheri">Andheri</SelectItem>
                <SelectItem value="borivali">Borivali</SelectItem>
            </SelectContent>
            </Select>
        </div>

         {/* Doctor */}
         <div className="w-full md:w-1/6 space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Doctor
          </label>
           <Input
            placeholder=""
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
            className="h-10 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
          />
        </div>

        {/* Patient Name */}
        <div className="w-full md:w-1/6 space-y-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Patient Name
          </label>
           <Input
            placeholder="Type Patient Name"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            className="h-10 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
          />
        </div>

        {/* From Date */}
        <div className="w-full md:w-1/6 space-y-1">
           <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            From Date
          </label>
           <Input
            type="date"
            placeholder="From Date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="h-10 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
          />
        </div>

        {/* To Date */}
        <div className="w-full md:w-1/6 space-y-1">
           <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            To Date
          </label>
           <Input
            type="date"
            placeholder="To Date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="h-10 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-2 w-full md:w-auto">
          <Button className="bg-[#D35400] hover:bg-[#ba4a00] text-white px-6 h-10 w-full md:w-auto transition-colors">
            Search
          </Button>
           <Button
             onClick={handleClear}
             className="bg-[#A01A1A] hover:bg-[#8a1616] text-white px-6 h-10 w-full md:w-auto transition-colors"
          >
            Clear
          </Button>
        </div>
      </div>

       {/* Total Count */}
       <div className="flex justify-end pr-2">
         <span className="font-semibold text-gray-600 dark:text-gray-400 text-sm">Amount : {totalAmount.toFixed(2)}</span>
      </div>

      {/* Table */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-t-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-[#e6ffcc] dark:bg-[#e6ffcc]/20">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[60px] font-bold text-gray-800 dark:text-gray-200 border-r border-white dark:border-gray-600">
                Sr. No.
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-gray-200 border-r border-white dark:border-gray-600">
                Clinic Name
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-gray-200 border-r border-white dark:border-gray-600">
                Date
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-gray-200 border-r border-white dark:border-gray-600">
                Receipt No
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-gray-200 border-r border-white dark:border-gray-600">
                Patient Name
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-gray-200 border-r border-white dark:border-gray-600">
                Mobile No
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-gray-200 border-r border-white dark:border-gray-600">
                Treatment
              </TableHead>
               <TableHead className="font-bold text-gray-800 dark:text-gray-200 border-r border-white dark:border-gray-600">
                Doctor Name
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-gray-200 border-r border-white dark:border-gray-600 text-right">
                Paid Amount
              </TableHead>
              <TableHead className="font-bold text-gray-800 dark:text-gray-200">
                Mode
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
                    <TableCell className="font-medium text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 py-3">
                    {indexOfFirstItem + index + 1}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 py-3">
                    {row.clinic}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 py-3">
                    {row.date}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 py-3">
                    {row.receiptNo}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 py-3">
                    {row.patientName}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 py-3">
                    {row.mobile}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 py-3">
                    {row.treatment}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 py-3">
                    {row.doctor}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 py-3 text-right">
                    {row.paidAmount}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300 py-3">
                    {row.mode}
                    </TableCell>
                </TableRow>
                ))
            ) : (
                <TableRow>
                     <TableCell colSpan={10} className="text-center py-4 text-gray-500">No matching records found</TableCell>
                </TableRow>
            )}
             {currentItems.length > 0 && (
                <TableRow className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30">
                    <TableCell colSpan={8} className="border-r border-gray-200 dark:border-gray-700 py-3 text-right pr-4 font-bold text-gray-700 dark:text-gray-300">
                        Total
                    </TableCell>
                    <TableCell className="font-bold text-gray-700 dark:text-gray-300 py-3 text-right">
                        {totalAmount.toFixed(2)}
                    </TableCell>
                    <TableCell></TableCell>
                </TableRow>
             )}
          </TableBody>
        </Table>
      </div>
      
       {/* Footer / Pagination / Export */}
      <div className="flex justify-between items-center mt-4">
        {/* Excel Export */}
        <div className="cursor-pointer" onClick={handleExport} title="Download Excel">
           <div className="w-8 h-8 flex items-center justify-center bg-green-700 hover:bg-green-800 text-white rounded shadow transition-colors">
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
