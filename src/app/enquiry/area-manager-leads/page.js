"use client"

import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Settings, Home, Plus, Trash2, FileSpreadsheet } from "lucide-react"
import Link from "next/link"
import CustomPagination from "@/components/ui/custom-pagination"
import { PageHeader } from "@/components/shared/PageHeader"

export default function AreaManagerLeadsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Dummy data
  const [data, setData] = useState([
    { srNo: 1, name: "Dr.RUCHI BHANSALI" },
    { srNo: 2, name: "Sayali Jadhav" },
    { srNo: 3, name: "Dr.Nilay Vakharia" },
    { srNo: 4, name: "Dr.isha jain" },
    { srNo: 5, name: "Dr.Harshada Mane" },
    { srNo: 6, name: "Dr.Akhil Nair" },
    { srNo: 7, name: "Dr.Anagha Patil Chavan" },
    { srNo: 8, name: "Dr.Apurva Vaidya" },
    { srNo: 9, name: "Dr.PARIDHI SHUKLA" },
  ])

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10 
  const totalItems = data.length

  const handleSearch = () => {
    console.log("Searching for:", searchTerm)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleAddNew = () => {
    console.log("Add New Area Manager")
  }

  const handleDelete = (id) => {
      console.log("Delete item", id)
      // confirm logic here
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
        <span className="text-foreground font-medium dark:text-gray-200">Area Manager Leads</span>
      </div>

      {/* Header */}
      <PageHeader 
        title="AREA MANAGER LEADS" 
        icon={Settings} 
      />

      {/* Filter & Action Section */}
      <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
             <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">
                <div className="w-full md:w-[300px]">
                    <Input 
                        placeholder="Area Manager Name" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-white dark:bg-slate-950 border-gray-200 dark:border-slate-800 dark:text-gray-200 h-10 w-full"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button 
                        onClick={handleSearch}
                        className="bg-[#0f7396] hover:bg-[#0f7396]/90 text-white min-w-[100px] h-10"
                    >
                        Search
                    </Button>
                    <Button 
                        onClick={handleAddNew}
                        className="bg-[#0f7396] hover:bg-[#0f7396]/90 text-white min-w-[100px] h-10"
                    >
                        Add New
                    </Button>
                </div>
             </div>
             
             {/* Total Count */}
             <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total : {totalItems}
             </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <div className="rounded-md border dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden flex flex-col">
        <Table>
          <TableHeader className="bg-[#0f7396]/10 dark:bg-[#0f7396]/20">
            <TableRow className="dark:border-slate-800">
              <TableHead className="w-[80px] font-bold text-[#0f7396] dark:text-[#0f7396] border-r border-[#0f7396]/20">Sr No.</TableHead>
              <TableHead className="font-bold text-[#0f7396] dark:text-[#0f7396] border-r border-[#0f7396]/20">Area Manager</TableHead>
              <TableHead className="w-[80px] font-bold text-[#0f7396] dark:text-[#0f7396] text-center">#</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow className="dark:border-slate-800">
                <TableCell colSpan={3} className="h-24 text-center bg-gray-50/50 dark:bg-slate-900/50 text-muted-foreground dark:text-slate-500">
                  No Record Available
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, idx) => (
                <TableRow key={idx} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800">
                  <TableCell className="border-r border-gray-100 dark:border-slate-800 dark:text-slate-300">{item.srNo}</TableCell>
                  <TableCell className="border-r border-gray-100 dark:border-slate-800 text-blue-600 hover:underline cursor-pointer dark:text-blue-400">
                    {item.name}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-gray-500 hover:text-primary hover:bg-primary/10 dark:text-gray-400 dark:hover:bg-red-900/20"
                        onClick={() => handleDelete(item.srNo)}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
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
      
      {/* Footer / Excel Icon */}
      <div>
        <Button variant="outline" size="icon" className="h-10 w-10 text-green-600 border-green-200 hover:bg-green-50 dark:bg-slate-900 dark:border-slate-800 dark:text-green-500 dark:hover:bg-slate-800">
            <FileSpreadsheet className="w-6 h-6" />
        </Button>
      </div>
    </div>
  )
}
