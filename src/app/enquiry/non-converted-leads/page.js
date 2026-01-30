"use client"

import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Settings, Home } from "lucide-react"
import Link from "next/link"
import CustomPagination from "@/components/ui/custom-pagination"
import { PageHeader } from "@/components/shared/PageHeader"

export default function NonConvertedLeadsPage() {
  const [filters, setFilters] = useState({
    clinic: "",
    doctorName: "",
    fromDate: "2025-11-23", 
    toDate: "2025-12-23",
  })

  // Dummy data
  const [data, setData] = useState([
    { srNo: 1, patientName: "mohammed moulana shariff", mobile: "8792339902", email: "", date: "23-Dec-2025", source: "Reference", followUpBy: "Dr.pooja kumari" },
    { srNo: 2, patientName: "Dadavalli", mobile: "8861849200", email: "", date: "23-Dec-2025", source: "WALK-IN", followUpBy: "Dr pooja kumari" },
    { srNo: 3, patientName: "Jaseela Aslam", mobile: "9287788888", email: "", date: "22-Dec-2025", source: "Reference", followUpBy: "Dr pooja kumari" },
  ])

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10 
  const totalItems = data.length

  const handleSearch = () => {
    console.log("Searching with filters:", filters)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gray-50/50 dark:bg-slate-950 transition-colors duration-200">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-muted-foreground mb-4">
        <Link href="/dashboard" className="flex items-center hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
          <Home className="w-4 h-4 mr-1" />
          Home
        </Link>
        <span className="mx-2">›</span>
        <span className="text-foreground font-medium dark:text-gray-200">Non Converted Enquiry</span>
      </div>

      {/* Header */}
      <PageHeader 
        title="NON CONVERTED ENQUIRY" 
        icon={Settings} 
      />

      {/* Filter Section */}
      <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
             {/* Clinic Select */}
            <div className="w-full">
              <Select 
                value={filters.clinic} 
                onValueChange={(val) => setFilters({...filters, clinic: val})}
              >
                <SelectTrigger className="w-full bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-800 dark:text-gray-200">
                  <SelectValue placeholder="-- Select Clinic --" />
                </SelectTrigger>
                <SelectContent className="dark:bg-slate-900 dark:border-slate-800">
                  <SelectItem value="panvel" className="dark:text-gray-200 dark:focus:bg-slate-800">Panvel</SelectItem>
                  <SelectItem value="pune" className="dark:text-gray-200 dark:focus:bg-slate-800">Pune</SelectItem>
                  <SelectItem value="mumbai" className="dark:text-gray-200 dark:focus:bg-slate-800">Mumbai</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Doctor Name */}
            <div className="w-full">
              <Input 
                placeholder="Doctor Name" 
                value={filters.doctorName}
                onChange={(e) => setFilters({...filters, doctorName: e.target.value})}
                className="w-full bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-800 dark:text-gray-200 dark:placeholder:text-gray-500"
              />
            </div>

            {/* From Date */}
            <div className="w-full">
              <Input 
                type="date" 
                value={filters.fromDate}
                onChange={(e) => setFilters({...filters, fromDate: e.target.value})}
                className="w-full bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-800 dark:text-gray-200"
              />
            </div>

            {/* To Date */}
            <div className="w-full">
              <Input 
                type="date" 
                value={filters.toDate}
                onChange={(e) => setFilters({...filters, toDate: e.target.value})}
                 className="w-full bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-800 dark:text-gray-200"
              />
            </div>

             {/* Search Button */}
            <div className="w-full">
              <Button 
                onClick={handleSearch}
                className="w-full bg-[#0f7396] hover:bg-[#0f7396]/90 text-white dark:bg-[#0f7396] dark:hover:bg-[#0f7396]/90 h-10"
              >
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <div className="rounded-md border dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden flex flex-col">
         {/* Total Count Bar */}
        <div className="flex justify-end px-4 py-2 bg-gray-50 dark:bg-slate-900 border-b dark:border-slate-800 text-sm font-medium text-gray-600 dark:text-gray-400">
          Total : {totalItems}
        </div>
        
        <Table>
          <TableHeader className="bg-[#0f7396]/10 dark:bg-[#0f7396]/20">
            <TableRow className="dark:border-slate-800">
              <TableHead className="w-[60px] font-bold text-[#0f7396] dark:text-[#0f7396]">Sr No.</TableHead>
              <TableHead className="font-bold text-[#0f7396] dark:text-[#0f7396]">Patient Name</TableHead>
              <TableHead className="font-bold text-[#0f7396] dark:text-[#0f7396]">Mobile No</TableHead>
              <TableHead className="font-bold text-[#0f7396] dark:text-[#0f7396]">Email</TableHead>
              <TableHead className="font-bold text-[#0f7396] dark:text-[#0f7396]">Date</TableHead>
              <TableHead className="font-bold text-[#0f7396] dark:text-[#0f7396]">Source Name</TableHead>
              <TableHead className="font-bold text-[#0f7396] dark:text-[#0f7396]">Follow Up By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow className="dark:border-slate-800">
                <TableCell colSpan={7} className="h-24 text-center bg-gray-50/50 dark:bg-slate-900/50 text-muted-foreground dark:text-slate-500">
                  No Record Available
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, idx) => (
                <TableRow key={idx} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 dark:border-slate-800">
                  <TableCell className="dark:text-slate-300">{item.srNo}</TableCell>
                  <TableCell className="dark:text-slate-300">{item.patientName}</TableCell>
                  <TableCell className="dark:text-slate-300">{item.mobile}</TableCell>
                  <TableCell className="dark:text-slate-300">{item.email}</TableCell>
                  <TableCell className="dark:text-slate-300">{item.date}</TableCell>
                  <TableCell className="uppercase dark:text-slate-300">{item.source}</TableCell>
                  <TableCell className="dark:text-slate-300">{item.followUpBy}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination at bottom */}
        <div className="px-4 border-t border-gray-100 dark:border-slate-800">
            <CustomPagination 
                totalItems={totalItems} 
                itemsPerPage={itemsPerPage} 
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />
        </div>
      </div>
    </div>
  )
}
