"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { patientService } from "@/api/client/patients";
import CustomPagination from "@/components/ui/custom-pagination";

export default function PatientSearchPage() {
  const router = useRouter();

  const [searchForm, setSearchForm] = useState({
    firstName: "",
    lastName: "",
    mobileNo: "",
    clinic: "",
    fromDate: "",
    toDate: "",
  });

  const [patientsList, setPatientsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchPatients();
  }, []); // Initial fetch only. Search triggers re-fetch.


  const fetchPatients = async () => {
    try {
      setIsLoading(true);
      
      const queryParams = {
        PageNumber: 1,
        PageSize: 1000,
      };

      // Add filters if present
      if (searchForm.firstName) queryParams.FirstName = searchForm.firstName;
      if (searchForm.lastName) queryParams.LastName = searchForm.lastName;
      if (searchForm.mobileNo) queryParams.MobileNo = searchForm.mobileNo;
      if (searchForm.clinic && searchForm.clinic !== "all") queryParams.Clinic = searchForm.clinic;
      if (searchForm.fromDate) queryParams.FromDate = searchForm.fromDate;
      if (searchForm.toDate) queryParams.ToDate = searchForm.toDate;

      const data = await patientService.getAllPatients(queryParams);
      
      // Handle response format
      // Expecting array for now based on user description, but handling if it returns object with data field
      const list = Array.isArray(data) ? data : (data?.data || []);
      const total = data?.totalCount || list.length; // Fallback if API doesn't return count
      
      setPatientsList(list);
      
      // If the API returns total count separately, use it. 
      // If it just returns a page, we might need to rely on list length or infinite scroll behavior logic
      // For now assuming list length is page size or we get total.
      // If API doesn't return total count, pagination might be limited.
      // But typically "GetAll" with paging returns a wrapper. 
      // If it returns just array, we can't really know total unless we fetch all.
      // Based on typical bmetrics API it might return just array.
      // We will assume 1000 items logic from leads if no count provided? 
      // Or just set total to "current length + something" to enable next button?
      // Let's assume for now detailed pagination requires TotalCount.
      // If data has no 'TotalCount', we might need to fetch a large batch or simple prev/next.
      // Let's set totalItems to a high number if we got full pageSize items to allow 'Next'
      
      if (data?.TotalCount) {
          setTotalItems(data.TotalCount);
      } else {
          // Heuristic: If we got full page, assume there are more.
          setTotalItems(list.length === pageSize ? (currentPage * pageSize) + 1 : (currentPage - 1) * pageSize + list.length);
      }

    } catch (error) {
      console.error("Failed to fetch patients:", error);
    } finally {
      setIsLoading(false);
    }
  };

  function handleSearchChange(e) {
    setSearchForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  }

  function handleSearch() {
    setCurrentPage(1); // Reset to page 1
    fetchPatients();   // Trigger fetch
  }

  function handleViewConsultation(patient) {
     // Use correct ID field from API
    const id = patient.patientID || patient.id || patient.PatientID; 
    router.push(`/MIS/consultation?patientId=${id}`);
  }

  function handleEditPatient(patient) {
     // Use correct ID field from API
    const id = patient.patientID || patient.id || patient.PatientID;
    console.log("Navigating to edit page for patient:", id);
    router.push(`/MIS/patient-edit?patientId=${id}`);
  }

  function handleExcelUpload() {
    console.log("Excel upload clicked");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Search Patient Section */}
        <Card className="border border-gray-200 dark:border-gray-700 shadow-md bg-white dark:bg-gray-800">
          <CardHeader className="p-4 bg-[#0f7396]/10 dark:bg-[#0f7396]/20 border-b border-[#0f7396]/20 dark:border-[#0f7396]/30">
            <h2 className="text-lg font-semibold text-[#0f7396] dark:text-[#0f7396] flex items-center gap-2">
              <span className="text-[#0f7396]">⚙</span> PATIENT
            </h2>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="space-y-2">
                <Input
                  name="firstName"
                  placeholder="First Name"
                  value={searchForm.firstName}
                  onChange={handleSearchChange}
                  className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Input
                  name="lastName"
                  placeholder="Last Name"
                  value={SearchForm.lastName}
                  onChange={handleSearchChange}
                  className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Input
                  name="mobileNo"
                  placeholder="Mobile No"
                  value={SearchForm.mobileNo}
                  onChange={handleSearchChange}
                  className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Select
                  value={SearchForm.clinic}
                  onValueChange={(value) => setSearchForm({ ...searchForm, clinic: value })}
                >
                  <SelectTrigger className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600">
                    <SelectValue placeholder="-- Select Clinic --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Clinics</SelectItem>
                    <SelectItem value="malad">MALAD West</SelectItem>
                    <SelectItem value="ghodbunder">Ghodbunder road</SelectItem>
                    <SelectItem value="jayanagar">JayaNagar</SelectItem>
                    <SelectItem value="madhapur">MADHAPUR</SelectItem>
                    <SelectItem value="aundh">Aundh</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Input
                  type="date"
                  name="fromDate"
                  placeholder="From Date"
                  value={SearchForm.fromDate}
                  onChange={handleSearchChange}
                  className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="date"
                  name="toDate"
                  placeholder="To Date"
                  value={SearchForm.toDate}
                  onChange={handleSearchChange}
                  className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSearch} className="bg-[#0f7396] hover:bg-[#0b5c7a] text-white px-8">
                  Search
                </Button>
                <Button
                  onClick={handleExcelUpload}
                  variant="outline"
                  className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 px-6"
                >
                  Excel upload
                </Button>
              </div>
            </div>

            {/* Patient List Table */}
            <div className="mt-6">
              <div className="flex justify-end mb-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total: <span className="font-semibold">{totalItems}</span>
                </p>
              </div>
              <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-green-100 dark:bg-green-900/20">
                      <th className="p-3 text-left font-medium text-gray-700 dark:text-gray-300">Sr. No.</th>
                      <th className="p-3 text-left font-medium text-gray-700 dark:text-gray-300">Case Paper No.</th>
                      <th className="p-3 text-left font-medium text-gray-700 dark:text-gray-300">Name</th>
                      <th className="p-3 text-left font-medium text-gray-700 dark:text-gray-300">Mobile No</th>
                      <th className="p-3 text-left font-medium text-gray-700 dark:text-gray-300">Registration Date</th>
                      <th className="p-3 text-left font-medium text-gray-700 dark:text-gray-300">Clinic Name</th>
                      <th className="p-3 text-center font-medium text-gray-700 dark:text-gray-300">#</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800">
                    {isLoading ? (
                      <tr>
                        <td colSpan="7" className="p-8 text-center text-gray-500">Loading...</td>
                      </tr>
                    ) : patientsList.length > 0 ? (
                      patientsList
                        .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                        .map((patient, index) => (
                        <tr
                          key={patient.patientID || patient.id || index}
                          className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                        >
                          <td className="p-3 text-gray-800 dark:text-gray-100">{(currentPage - 1) * pageSize + index + 1}</td>
                          <td className="p-3 text-gray-800 dark:text-gray-100">{patient.patientCode || patient.casePaperNo || "-"}</td>
                          <td className="p-3 text-gray-800 dark:text-gray-100">
                             {/* Handle typo in API response 'fristName' */}
                             {patient.fristName || patient.firstName 
                               ? `${patient.fristName || patient.firstName} ${patient.lastName || ""}` 
                               : (patient.name || "-")}
                          </td>
                          <td className="p-3 text-gray-800 dark:text-gray-100">{patient.mobile || patient.mobileNo || "-"}</td>
                          <td className="p-3 text-gray-800 dark:text-gray-100">
                            {patient.registrationDate ? new Date(patient.registrationDate).toLocaleDateString("en-GB") : "-"}
                          </td>
                          <td className="p-3 text-gray-800 dark:text-gray-100">{patient.clinicName || patient.ClinicName || "-"}</td>
                          <td className="p-3 text-center">
                            <div className="flex justify-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleViewConsultation(patient)}
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950 h-8 w-8 p-0"
                                title="View Consultation"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditPatient(patient)}
                                className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-950 h-8 w-8 p-0"
                                title="Edit Patient Details"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="p-8 text-center text-gray-500 dark:text-gray-400">
                          No patients found. Try adjusting your Search criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
                <CustomPagination
                  totalItems={totalItems}
                  itemsPerPage={pageSize}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
