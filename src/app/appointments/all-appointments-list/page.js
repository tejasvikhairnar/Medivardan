'use client'

import { useState, useEffect } from 'react'
import { Calendar, Check, X, Search, Filter } from 'lucide-react'
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
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function AllAppointmentsListPage() {
  const [approvalFilter, setApprovalFilter] = useState('all') 
  const [visitorName, setVisitorName] = useState('')
  const [mobileNo, setMobileNo] = useState('')
  const [selectedClinic, setSelectedClinic] = useState('all')
  const [selectedDoctor, setSelectedDoctor] = useState('all')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); 

  // Mock Data for Fallback
  const mockAppointments = [
    {
       AppointmentID: 101,
       FirstName: "Raj",
       LastName: "Sharma",
       DoctorName: "Dr. Kinnari Lade",
       AppointmentDate: "2025-01-02",
       TimeSlot: "10:00 AM",
       Status: "approved",
       ClinicName: "Panvel",
       MobileNo: "9876543210"
    },
    {
       AppointmentID: 102,
       FirstName: "Priya",
       LastName: "Verma",
       DoctorName: "Dr. Rajesh Kumar",
       AppointmentDate: "2025-01-03",
       TimeSlot: "11:30 AM",
       Status: "pending",
       ClinicName: "Mumbai",
       MobileNo: "8765432109"
    },
    {
       AppointmentID: 103,
       FirstName: "Amit",
       LastName: "Patel",
       DoctorName: "Dr. Priya Singh",
       AppointmentDate: "2025-01-04",
       TimeSlot: "02:00 PM",
       Status: "rejected",
       ClinicName: "Pune",
       MobileNo: "7654321098"
    }
  ];

  // Fetch Appointments
  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        Mode: '1',
        DoctorID: selectedDoctor !== 'all' && selectedDoctor !== '0' ? selectedDoctor : undefined 
      };
      
      const data = await getAppointments(params);
      
      if (Array.isArray(data) && data.length > 0) {
        setAppointments(data);
      } else {
        console.warn('API returned empty or invalid data, using mock data.');
        setAppointments(mockAppointments);
      }
    } catch (err) {
      console.error('Failed to fetch appointments, using mock data:', err);
      // Fallback to mock data on error so page renders
      setAppointments(mockAppointments);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [selectedDoctor]); 

  const handleApprove = (appointmentId) => {
    console.log('Approving:', appointmentId);
  }

  const handleReject = (appointmentId) => {
     console.log('Rejecting:', appointmentId);
  }

  const handleSearch = () => {
    setCurrentPage(1); 
  }

  // Client-side Filtering
  const filteredAppointments = appointments.filter(apt => {
    // 1. Approval Filter
    if (approvalFilter !== 'all') {
      const status = (apt.Status || apt.status || '').toLowerCase(); 
      if (approvalFilter === 'approve' && status !== 'approved') return false;
      if (approvalFilter === 'reject' && status !== 'rejected') return false;
    }

    // 2. Name Search
    if (visitorName) {
       const term = visitorName.toLowerCase();
       const name = (apt.PatientName || apt.FirstName || apt.firstName || apt.name || '').toLowerCase();
       const docName = (apt.DoctorName || apt.doctorName || '').toLowerCase();
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
        if (!aptDateStr) return false; 
        
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
    <div className="min-h-screen bg-[#0f7396] dark:bg-[#0f7396] py-6 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <Card className="border border-gray-200 dark:border-gray-700 shadow-md bg-white dark:bg-gray-800">
            <CardHeader className="p-4 bg-[#0f7396]/10 dark:bg-[#0f7396]/20 border-b border-[#0f7396]/20 dark:border-[#0f7396]/30">
                <h2 className="text-lg font-semibold text-[#0f7396] dark:text-[#0f7396] flex items-center gap-2">
                <Calendar className="w-5 h-5" /> ALL APPOINTMENT LIST
                </h2>
            </CardHeader>
            <CardContent className="p-6">
                
                {/* Search Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div>
                    <Input
                        placeholder="Visitor Name"
                        value={visitorName}
                        onChange={(e) => setVisitorName(e.target.value)}
                        className="w-full bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                    />
                    </div>
                    <div>
                    <Input
                        placeholder="Mobile No."
                        value={mobileNo}
                        onChange={(e) => setMobileNo(e.target.value)}
                        className="w-full bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                    />
                    </div>
                    <div>
                    <Select value={selectedClinic} onValueChange={setSelectedClinic}>
                        <SelectTrigger className="w-full bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600">
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
                    <div>
                    <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                        <SelectTrigger className="w-full bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600">
                        <SelectValue placeholder="Select Doctor" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="all">All Doctors</SelectItem>
                        <SelectItem value="32">Dr. Kinnari Lade</SelectItem>
                        <SelectItem value="33">Dr. Rajesh Kumar</SelectItem>
                        </SelectContent>
                    </Select>
                    </div>
                </div>

                {/* Radio Buttons and Date Filters */}
                <div className="flex flex-wrap items-center gap-6 mb-6">
                    <div className="flex gap-6 items-center">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                        type="radio"
                        name="approvalStatus"
                        value="approve"
                        checked={approvalFilter === 'approve'}
                        onChange={(e) => setApprovalFilter(e.target.value)}
                        className="w-4 h-4 cursor-pointer accent-[#0f7396]"
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
                        className="w-4 h-4 cursor-pointer accent-[#0f7396]"
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
                        className="w-4 h-4 cursor-pointer accent-[#0f7396]"
                        />
                        <span className="text-sm font-medium">All</span>
                    </label>
                    </div>

                    <div className="space-y-1">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">From</Label>
                    <Input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="w-full bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                    />
                    </div>

                    <div className="space-y-1">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">To</Label>
                    <Input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="w-full bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                    />
                    </div>

                    <Button
                    onClick={handleSearch}
                    className="bg-[#0f7396] hover:bg-[#0b5c7a] text-white px-8 mt-6"
                    >
                    <Search className="w-4 h-4 mr-2" />
                    Search
                    </Button>
                </div>

                {/* Appointments Table */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
                    {loading ? (
                        <div className="p-8 text-center text-muted-foreground">Loading appointments...</div>
                    ) : (
                    <table className="w-full">
                    <thead>
                        <tr className="bg-[#0f7396]/10 dark:bg-[#0f7396]/20">
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200">Sr. No.</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200">Doctor Name</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200">Time</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-200">Status</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-200">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayItems.length > 0 ? (
                            displayItems.map((appointment, index) => (
                        <tr
                            key={appointment.id || index}
                            className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{indexOfFirstItem + index + 1}</td>
                            <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{appointment.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{appointment.doctorName}</td>
                            <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{appointment.date}</td>
                            <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">{appointment.time}</td>
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
                {!loading && filteredAppointments.length > 0 && (
                    <div className="mt-4">
                        <div className="flex justify-end gap-2">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </Button>
                            <span className="text-sm py-2">Page {currentPage} of {totalPages}</span>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
