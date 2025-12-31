'use client'

import { useState, useEffect } from 'react'
import { Settings, Check, X, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getAppointments } from '@/api/client/appointments'
import { Pagination } from '@/components/Pagination'

export default function AllAppointmentsListPage() {
  const [approvalFilter, setApprovalFilter] = useState('all') // Changed default to 'all' to see data initially
  const [visitorName, setVisitorName] = useState('')
  const [mobileNo, setMobileNo] = useState('')
  const [selectedClinic, setSelectedClinic] = useState('all')
  const [selectedDoctor, setSelectedDoctor] = useState('all') // Changed to handle 'all'
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100); // Default items per page (Increased from 10 as per user request)

  // Fetch Appointments
  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      // Pass filters if backend supports them, otherwise client-side filtering is simpler for now
      // The backend API provided uses Mode=1 & DoctorID=32. We can make DoctorID dynamic.
      const params = {
        Mode: '1',
         // If selectedDoctor is 'all' or empty, maybe send a default or omit? 
         // User provided DoctorID=32 in example. Let's use 32 as default if nothing selected, or maybe '0' for all?
         // For now, let's Stick to the provided '32' or dynamic if user selects.
        // If 'all', sending nothing (or undefined) is cleaner if we want to fetch everything
        DoctorID: selectedDoctor !== 'all' && selectedDoctor !== '0' ? selectedDoctor : undefined 
      };
      
      const data = await getAppointments(params);
      
      if (Array.isArray(data)) {
        setAppointments(data);
      } else {
        console.warn('API returned non-array data:', data);
        setAppointments([]);
      }
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
      setError('Failed to load appointments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [selectedDoctor]); // Re-fetch when doctor changes

  const handleApprove = (appointmentId) => {
    // Implement API call for approval
    console.log('Approving:', appointmentId);
  }

  const handleReject = (appointmentId) => {
    // Implement API call for rejection
     console.log('Rejecting:', appointmentId);
  }

  const handleSearch = () => {
    // Re-fetch or just filter client-side since we have data
    // If backend supports search params, call fetchAppointments() here.
    // For now, client-side filtering below is sufficient for displayed list.
    setCurrentPage(1); // Reset to page 1 on search
  }

  // Client-side Filtering
  const filteredAppointments = appointments.filter(apt => {
    // 1. Approval Filter
    if (approvalFilter !== 'all') {
      const status = (apt.Status || apt.status || '').toLowerCase(); // Adjust key based on API
      if (approvalFilter === 'approve' && status !== 'approved') return false;
      if (approvalFilter === 'reject' && status !== 'rejected') return false;
    }

    // 2. Name Search
    if (visitorName) {
       const term = visitorName.toLowerCase();
       const name = (apt.PatientName || apt.FirstName || apt.firstName || apt.name || '').toLowerCase();
       const docName = (apt.DoctorName || apt.doctorName || '').toLowerCase();
       // Allowing search by Patient or Doctor name for better UX
       if (!name.includes(term) && !docName.includes(term)) return false;
    }

    // 3. Mobile Search
    if (mobileNo) {
       const term = String(mobileNo);
       const mobile = String(apt.MobileNo || apt.PhoneNo || apt.mobile || apt.Mobile || '');
       if (!mobile.includes(term)) return false;
    }
    
    // 4. Clinic Filter
    if (selectedClinic !== 'all') {
        const clinic = (apt.ClinicName || apt.clinicName || '').toLowerCase();
        if (!clinic.includes(selectedClinic.toLowerCase())) return false;
    }

    // 5. Date Range Filter
    if (fromDate || toDate) {
        const aptDateStr = apt.AppointmentDate || apt.appointmentDate || apt.startDate;
        if (!aptDateStr) return false; // Filter out invalid dates if range is active
        
        const aptDate = new Date(aptDateStr);
        // Normalize time to 00:00:00 for accurate date comparison
        const checkDate = new Date(aptDate.getFullYear(), aptDate.getMonth(), aptDate.getDate());

        if (fromDate) {
            const fDate = new Date(fromDate);
            const fromCheck = new Date(fDate.getFullYear(), fDate.getMonth(), fDate.getDate());
            if (checkDate < fromCheck) return false;
        }

        if (toDate) {
            const tDate = new Date(toDate);
            const toCheck = new Date(tDate.getFullYear(), tDate.getMonth(), tDate.getDate());
            if (checkDate > toCheck) return false;
        }
    }

    return true;
  });

  // Client-side Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAppointments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  // Transform Data for Table Display
  // Adjust keys based on actual API response structure (checking both Pascal and camelCase)
  const displayItems = currentItems.map(apt => ({
      id: apt.AppointmentID || apt.appointmentId || apt.id,
      name: `${apt.FirstName || apt.firstName || ''} ${apt.LastName || apt.lastName || ''}`.trim() || apt.PatientName || 'N/A',
      doctorName: apt.DoctorName || apt.doctorName || (apt.doctorID ? `Dr. ID ${apt.doctorID}` : 'N/A'),
      date: (apt.AppointmentDate || apt.appointmentDate || apt.startDate) ? new Date(apt.AppointmentDate || apt.appointmentDate || apt.startDate).toLocaleDateString() : 'N/A',
      time: apt.TimeSlot || apt.AppointmentTime || apt.appointmentTime || apt.startTime || 'N/A',
      status: String(apt.Status || apt.status || (apt.isActive ? 'Active' : 'Inactive')).toLowerCase()
  }));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/20">
          <Settings className="w-5 h-5 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-red-600">ALL APPOINTMENT LIST</h1>
      </div>

      {/* Search Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Visitor Name */}
        <div>
          <Input
            placeholder="Visitor Name"
            value={visitorName}
            onChange={(e) => setVisitorName(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Mobile No */}
        <div>
          <Input
            placeholder="Mobile No."
            value={mobileNo}
            onChange={(e) => setMobileNo(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Clinic Name */}
        <div>
          <Select value={selectedClinic} onValueChange={setSelectedClinic}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Clinic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clinics</SelectItem>
              <SelectItem value="panvel">Panvel</SelectItem>
              <SelectItem value="mumbai">Mumbai</SelectItem>
              <SelectItem value="pune">Pune</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Doctor Name - Defaulting to ID 32 for now as per user, but allow "All" logically */}
        <div>
          <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Doctor" />
            </SelectTrigger>
            <SelectContent>
               {/* Values should matching backend DoctorIDs if possible */}
              <SelectItem value="all">All Doctors</SelectItem>
              <SelectItem value="32">Dr. Kinnari Lade (ID: 32)</SelectItem>
              <SelectItem value="33">Dr. Rajesh Kumar</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Radio Buttons and Date Filters */}
      <div className="flex flex-wrap items-center gap-6 mb-6">
        {/* Approval Status Radio Buttons */}
        <div className="flex gap-6 items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="approvalStatus"
              value="approve"
              checked={approvalFilter === 'approve'}
              onChange={(e) => setApprovalFilter(e.target.value)}
              className="w-4 h-4 cursor-pointer"
            />
            <span className="text-sm font-medium">Approve</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="approvalStatus"
              value="reject"
              checked={approvalFilter === 'reject'}
              onChange={(e) => setApprovalFilter(e.target.value)}
              className="w-4 h-4 cursor-pointer"
            />
            <span className="text-sm font-medium">Reject</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="approvalStatus"
              value="all"
              checked={approvalFilter === 'all'}
              onChange={(e) => setApprovalFilter(e.target.value)}
              className="w-4 h-4 cursor-pointer"
            />
            <span className="text-sm font-medium">All</span>
          </label>
        </div>

        {/* From Date */}
        <div className="space-y-1">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">From</Label>
          <Input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full"
          />
        </div>

        {/* To Date */}
        <div className="space-y-1">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">To</Label>
          <Input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          className="bg-orange-600 hover:bg-orange-700 text-white px-8"
        >
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </div>

      {/* Appointments Table */}
      <div className="border border-border rounded-lg overflow-hidden bg-white dark:bg-card">
        {loading ? (
             <div className="p-8 text-center text-muted-foreground">Loading appointments...</div>
        ) : error ? (
             <div className="p-8 text-center text-red-500">{error}</div>
        ) : (
        <table className="w-full">
          <thead>
            <tr className="bg-green-100 dark:bg-green-900/20">
              <th className="px-4 py-3 text-left text-sm font-medium">Sr. No.</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Doctor Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Time</th>
              <th className="px-4 py-3 text-center text-sm font-medium">Status</th>
              <th className="px-4 py-3 text-center text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayItems.length > 0 ? (
                displayItems.map((appointment, index) => (
              <tr
                key={appointment.id || index}
                className="border-t border-border hover:bg-accent/50 transition-colors"
              >
                <td className="px-4 py-3 text-sm">{indexOfFirstItem + index + 1}</td>
                <td className="px-4 py-3 text-sm">{appointment.name}</td>
                <td className="px-4 py-3 text-sm">{appointment.doctorName}</td>
                <td className="px-4 py-3 text-sm">{appointment.date}</td>
                <td className="px-4 py-3 text-sm">{appointment.time}</td>
                <td className="px-4 py-3">
                    <div className="flex items-center justify-center">
                      {appointment.status === 'approved' ? (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Approved
                        </span>
                      ) : appointment.status === 'rejected' ? (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 flex items-center gap-1">
                          <X className="w-3 h-3" />
                          Rejected
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                          {appointment.status}
                        </span>
                      )}
                    </div>
                  </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleApprove(appointment.id)}
                      className="p-1.5 rounded-full bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-600 dark:text-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Approve"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleReject(appointment.id)}
                      className="p-1.5 rounded-full bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Reject"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
            ) : (
                <tr>
                    <td colSpan="7" className="text-center py-12 text-muted-foreground">
                        No appointments found.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
        )}
      </div>

       {/* Pagination Controls */}
       {!loading && !error && filteredAppointments.length > 0 && (
         <div className="mt-4">
           {/* Reusing the Pagination logic/component if available or building simple one */}
           {/* If CustomPagination is available: */}
           <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
         </div>
       )}
      
      {/* Pagination Info simple fallback if component fails or for debug */}
      {/* 
      <div className="flex justify-end text-sm text-muted-foreground">
        Showing {displayItems.length} of {filteredAppointments.length} appointments
      </div>
      */}
    </div>
  )
}
