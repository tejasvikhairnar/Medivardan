"use client";

import React, { useState, useEffect } from "react";
import { getLeads } from "@/api/client/leads";
import { transformAPILeadToDisplay } from "@/utils/leadsTransformers";
import { Pagination } from "@/components/Pagination";
import { Card, CardContent } from "@/components/ui/card";
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
import { Settings, Eye, Trash2, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NewLeadPage() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    name: "",
    mobileNo: "",
    clinic: "",
    fromDate: "",
    toDate: "",
  });

  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch leads on component mount and when page changes
  // Fetch leads on component mount and when filters change (not on page change)
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async (searchFilters = filters) => {
    try {
      setIsLoading(true);
      // Remove empty filters
      const cleanFilters = Object.fromEntries(
        Object.entries(searchFilters).filter(([_, v]) => v !== "")
      );
      
      // Add pagination params
      const queryParams = {
        ...cleanFilters,
        PageNumber: searchFilters.pageNumber || 1, // Use passed page or default to 1
        PageSize: pageSize, // Use state pageSize (10)
      };

      const data = await getLeads(queryParams);
      
      console.log('[DEBUG] Raw API Data (First Item):', data && data[0] ? data[0] : 'No data');
      console.log('[DEBUG] Item Keys:', data && data[0] ? Object.keys(data[0]) : 'No keys');
      
      // Transform API data to match table structure
      const transformedLeads = Array.isArray(data) ? data.map((lead) => ({
        ...transformAPILeadToDisplay(lead),
        srNo: lead.srNo || undefined // Keep existing srNo if present, otherwise it will be handled by transformer or index in loop
      })).map((lead, index) => ({
         ...lead,
         srNo: index + 1 // override srNo for list view order
      })) : [];

      setLeads(transformedLeads);
    } catch (error) {
      console.error("Failed to fetch leads:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    if (field === "mobileNo") {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length > 10) return;
      
      setFilters((prev) => ({
        ...prev,
        [field]: numericValue,
      }));
      return;
    }

    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to page 1 on search
    fetchLeads(filters);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0) {
      setCurrentPage(newPage);
    }
  };

  const handleAddNewLead = () => {
    router.push("/enquiry/add-enquiry-form");
  };

  // Client-side Pagination Logic (REMOVED)
  // const indexOfLastItem = currentPage * pageSize;
  // const indexOfFirstItem = indexOfLastItem - pageSize;
  // const currentItems = leads.slice(indexOfFirstItem, indexOfLastItem);
  const currentItems = leads; // Server returns only current page items
  // const totalPages = Math.ceil(leads.length / pageSize); 
  // TODO: We need total count from API for real pagination. For now, assuming "Next" is available if we got full page.
  // Increased to 10000 to allow access up to 200,000 records (User reported 2000 limit with 100 pages)
  const totalPages = 10000;

  const handlePageChangeWrapper = (newPage) => {
    setCurrentPage(newPage);
    fetchLeads({ ...filters, pageNumber: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#0f7396]/10 dark:bg-teal-900/20 flex items-center justify-center">
          <Settings className="w-4 h-4 text-[#0f7396]" />
        </div>
        <h1 className="text-xl font-bold text-[#0f7396] dark:text-[#0f7396]">
          LEAD
        </h1>
      </div>

      {/* Search Filters */}
      <Card className="border-gray-200 dark:border-gray-800">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* First Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Name"
                value={filters.name}
                onChange={(e) => handleFilterChange("name", e.target.value)}
                className="border-gray-300 dark:border-gray-700"
              />
              <Input
                placeholder="Mobile No"
                value={filters.mobileNo}
                onChange={(e) => handleFilterChange("mobileNo", e.target.value)}
                className="border-gray-300 dark:border-gray-700"
              />
              <Select value={filters.clinic} onValueChange={(value) => handleFilterChange("clinic", value)}>
                <SelectTrigger className="border-gray-300 dark:border-gray-700">
                  <SelectValue placeholder="-- Select Clinic --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clinics</SelectItem>
                  <SelectItem value="panvel">Panvel</SelectItem>
                  <SelectItem value="pune">Pune</SelectItem>
                  <SelectItem value="mumbai">Mumbai</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <Input
                type="date"
                placeholder="From Enquiry Date"
                value={filters.fromDate}
                onChange={(e) => handleFilterChange("fromDate", e.target.value)}
                className="border-gray-300 dark:border-gray-700"
              />
              <Input
                type="date"
                placeholder="To Enquiry Date"
                value={filters.toDate}
                onChange={(e) => handleFilterChange("toDate", e.target.value)}
                className="border-gray-300 dark:border-gray-700"
              />
              <Button
                onClick={handleSearch}
                className="bg-[#0f7396] hover:bg-[#0f7396] text-white"
              >
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons and Total */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            onClick={handleAddNewLead}
            className="bg-[#0f7396] hover:bg-[#0b5c7a] text-white"
          >
            Add New Lead
          </Button>
        </div>

      </div>

      {/* Leads Table */}
      <Card className="border-gray-200 dark:border-gray-800">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#0f7396]/10 dark:bg-teal-900/20 hover:bg-[#0f7396]/20 dark:hover:bg-teal-900/40">
                  <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Sr. No.</TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Lead No</TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Name</TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Mobile No</TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Clinic Name</TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Source Name</TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Status</TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Date</TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-gray-100 text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      Loading leads...
                    </TableCell>
                  </TableRow>
                ) : (
                leads.length > 0 ? (
                  currentItems.map((lead, index) => (
                  <TableRow
                    key={index}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <TableCell className="text-gray-900 dark:text-gray-100">{lead.srNo}</TableCell>
                    <TableCell className="text-gray-900 dark:text-gray-100">{lead.leadNo}</TableCell>
                    <TableCell className="text-gray-900 dark:text-gray-100">{lead.name}</TableCell>
                    <TableCell className="text-gray-900 dark:text-gray-100">{lead.mobileNo}</TableCell>
                    <TableCell className="text-gray-900 dark:text-gray-100">{lead.clinicName}</TableCell>
                    <TableCell className="text-gray-900 dark:text-gray-100">{lead.sourceName}</TableCell>
                    <TableCell className="text-gray-900 dark:text-gray-100">{lead.status}</TableCell>
                    <TableCell className="text-gray-900 dark:text-gray-100">{lead.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        {/* View Button */}
                        <button
                          onClick={() => router.push(`/enquiry/add-enquiry-form?mode=view&id=${lead.EnquiryID || lead.enquiryId || lead.enquiryID || lead.id || lead.leadNo?.replace('E','')}`)} // Fallback ID extraction
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                        
                        {/* Edit Button - Using CheckCircle for now as 'Action' */}
                         <button
                          onClick={() => router.push(`/enquiry/add-enquiry-form?mode=edit&id=${lead.EnquiryID || lead.enquiryId || lead.enquiryID || lead.id || lead.leadNo?.replace('E','')}`)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                           title="Edit Lead"
                        >
                          <Settings className="w-4 h-4 text-blue-600" /> 
                        </button>

                        <button
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded opacity-50 cursor-not-allowed"
                          title="Delete (Disabled)"
                        >
                          <Trash2 className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center text-gray-500">
                     No leads found.
                  </TableCell>
                </TableRow>
              )
            )}
              </TableBody>
            </Table>
          </div>
          

        </CardContent>
      </Card>

      {/* Pagination Controls */}
      {!isLoading && leads.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChangeWrapper}
          showTotalPages={false}
        />
      )}
    </div>
  );
}
