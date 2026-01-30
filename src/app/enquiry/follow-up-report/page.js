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

export default function FollowUpReportPage() {
  const [filters, setFilters] = useState({
    clinic: "",
    doctorName: "",
    fromDate: "2025-11-23", 
    toDate: "2025-12-23",
  })

  // Dummy data
  const [allData, setAllData] = useState([
    { srNo: 1, patientName: "prashant desai", mobile: "7045544960", nextFollowUp: "23-Dec-2025", source: "Reference", conversationDate: "23-Dec-2025", conversationDetails: "", followUpBy: "Dr.Riddhi Rathi" },
    { srNo: 2, patientName: "Karan Mithbawkar", mobile: "9664226872", nextFollowUp: "23-Dec-2025", source: "WALK-IN", conversationDate: "23-Dec-2025", conversationDetails: "", followUpBy: "Dr.Riddhi Rathi" },
    { srNo: 3, patientName: "Snehal Bornaks", mobile: "9137872164", nextFollowUp: "23-Dec-2025", source: "WALK-IN", conversationDate: "23-Dec-2025", conversationDetails: "", followUpBy: "Dr.Riddhi Rathi" },
    { srNo: 4, patientName: "Suryabham Yadav", mobile: "9029230585", nextFollowUp: "23-Dec-2025", source: "WALK-IN", conversationDate: "23-Dec-2025", conversationDetails: "", followUpBy: "Dr.Riddhi Rathi" },
    { srNo: 5, patientName: "Hardik Joshi", mobile: "9029230585", nextFollowUp: "22-Dec-2025", source: "WALK-IN", conversationDate: "22-Dec-2025", conversationDetails: "", followUpBy: "Dr.Riddhi Rathi" },
    { srNo: 6, patientName: "Siddhi Jadhav", mobile: "8291011876", nextFollowUp: "23-Dec-2025", source: "WALK-IN", conversationDate: "23-Dec-2025", conversationDetails: "", followUpBy: "Dr.Riddhi Rathi" },
    { srNo: 7, patientName: "Pooja Modi", mobile: "9757316731", nextFollowUp: "23-Dec-2025", source: "WALK-IN", conversationDate: "23-Dec-2025", conversationDetails: "", followUpBy: "Dr.Riddhi Rathi" },
    { srNo: 8, patientName: "Jijabai Vidhate", mobile: "9511753941", nextFollowUp: "23-Dec-2025", source: "WALK-IN", conversationDate: "23-Dec-2025", conversationDetails: "", followUpBy: "Dr.Riddhi Rathi" },
    { srNo: 9, patientName: "Tanya Madhani", mobile: "2487788628", nextFollowUp: "23-Dec-2025", source: "WALK-IN", conversationDate: "23-Dec-2025", conversationDetails: "", followUpBy: "Dr.Riddhi Rathi" },
    { srNo: 10, patientName: "Punya Arora", mobile: "8527132822", nextFollowUp: "22-Dec-2025", source: "WALK-IN", conversationDate: "22-Dec-2025", conversationDetails: "", followUpBy: "Dr.Riddhi Rathi" },
    { srNo: 11, patientName: "Extra Record 1", mobile: "0000000001", nextFollowUp: "22-Dec-2025", source: "WALK-IN", conversationDate: "22-Dec-2025", conversationDetails: "", followUpBy: "Dr.Riddhi Rathi" },
    { srNo: 12, patientName: "Extra Record 2", mobile: "0000000002", nextFollowUp: "22-Dec-2025", source: "WALK-IN", conversationDate: "22-Dec-2025", conversationDetails: "", followUpBy: "Dr.Riddhi Rathi" },
  ])

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10 
  
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentData = allData.slice(indexOfFirstItem, indexOfLastItem)
  const totalItems = allData.length

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
        <span className="text-foreground font-medium dark:text-gray-200">Follow Up Report</span>
      </div>

      {/* Header */}
      <PageHeader 
        title="FOLLOW UP REPORT" 
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
              <TableHead className="font-bold text-[#0f7396] dark:text-[#0f7396]">Next Follow Up Date</TableHead>
              <TableHead className="font-bold text-[#0f7396] dark:text-[#0f7396]">Source Name</TableHead>
              <TableHead className="font-bold text-[#0f7396] dark:text-[#0f7396]">Conversation Date</TableHead>
              <TableHead className="font-bold text-[#0f7396] dark:text-[#0f7396]">Conversation Details</TableHead>
              <TableHead className="font-bold text-[#0f7396] dark:text-[#0f7396]">Follow Up By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.length === 0 ? (
              <TableRow className="dark:border-slate-800">
                <TableCell colSpan={8} className="h-24 text-center bg-gray-50/50 dark:bg-slate-900/50 text-muted-foreground dark:text-slate-500">
                  No Record Available
                </TableCell>
              </TableRow>
            ) : (
              currentData.map((item, idx) => (
                <TableRow key={idx} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 dark:border-slate-800">
                  <TableCell className="dark:text-slate-300">{item.srNo}</TableCell>
                  <TableCell className="dark:text-slate-300">{item.patientName}</TableCell>
                  <TableCell className="dark:text-slate-300">{item.mobile}</TableCell>
                  <TableCell className="dark:text-slate-300">{item.nextFollowUp}</TableCell>
                  <TableCell className="uppercase dark:text-slate-300">{item.source}</TableCell>
                  <TableCell className="dark:text-slate-300">{item.conversationDate}</TableCell>
                  <TableCell className="dark:text-slate-300">{item.conversationDetails}</TableCell>
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
