"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { patientService } from "@/api/patient";
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
    fetchPatients(currentPage);
  }, [currentPage]); 

  const fetchPatients = async (page = currentPage) => {
    try {
      setIsLoading(true);
      
      const queryParams = {
        PageNumber: page,
        PageSize: pageSize,
      };

      // Add filters if present
      if (searchForm.firstName) queryParams.FirstName = searchForm.firstName;
      if (searchForm.lastName) queryParams.LastName = searchForm.lastName;
      if (searchForm.mobileNo) queryParams.MobileNo = searchForm.mobileNo;
      if (searchForm.clinic && searchForm.clinic !== "all") queryParams.Clinic = searchForm.clinic;
      if (searchForm.fromDate) queryParams.FromDate = searchForm.fromDate;
      if (searchForm.toDate) queryParams.ToDate = searchForm.toDate;

      const data = await patientService.getAllPatients(queryParams);
      
      const list = Array.isArray(data) ? data : (data?.data || []);
      
      setPatientsList(list);
      
      // Heuristic: Set total items large to allow navigation, as API doesn't return total count
      // mimicking "All Leads" behavior
      setTotalItems(1000 * pageSize); 

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
    setCurrentPage(1); // will trigger useEffect
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
          <CardHeader className="p-4 bg-primary/10 dark:bg-primary/20 border-b border-primary/20 dark:border-primary/30">
            <h2 className="text-lg font-semibold text-primary dark:text-primary flex items-center gap-2">
              <span className="text-primary">⚙</span> PATIENT
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
                  value={searchForm.lastName}
                  onChange={handleSearchChange}
                  className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Input
                  name="mobileNo"
                  placeholder="Mobile No"
                  value={searchForm.mobileNo}
                  onChange={handleSearchChange}
                  className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Select
                  value={searchForm.clinic}
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
                  value={searchForm.fromDate}
                  onChange={handleSearchChange}
                  className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="date"
                  name="toDate"
                  placeholder="To Date"
                  value={searchForm.toDate}
                  onChange={handleSearchChange}
                  className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSearch} className="bg-primary hover:bg-primary/90 text-white px-8">
                  Search
                </Button>
                <Button
                  onClick={handleExcelUpload}
                  variant="outline"
                  className="bg-primary hover:bg-primary/90 text-white border-primary px-6"
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
                    <tr className="bg-primary/10 dark:bg-primary/20">
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
                        .map((patient, index) => (
                        <tr
                          key={patient.patientID || patient.id || index}
                          className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                        >
                          <td className="p-3 text-gray-800 dark:text-gray-100">{((currentPage - 1) * pageSize) + index + 1}</td>
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
