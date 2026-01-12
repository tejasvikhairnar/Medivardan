"use client";

import React, { useState } from "react";
import { Settings, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function BranchProfile() {
  const [clinicName, setClinicName] = useState("");
  const [locationName, setLocationName] = useState("");
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'create'
  const [editingId, setEditingId] = useState(null);

  // Form State
  const initialFormState = {
    clinicName: "",
    regDate: "",
    addressLine1: "",
    addressLine2: "",
    country: "India",
    state: "",
    city: "",
    pincode: "",
    location: "",
    mobile: "",
    telephone: "",
    email: "",
    dayOfWeek: "",
    openTime: "",
    closeTime: "",
    userName: ""
  };
  const [formData, setFormData] = useState(initialFormState);

  // Mock data for Branch Profile
  const [branches, setBranches] = useState([
    { id: 1, clinicName: "Borivali", address: "Flat No 2, Grd. Floor, A- Wing Borivali Vyomesh Co-op HSG Soc. Ltd, S.V.P Road, Borivali West, Mumbai 400092", location: "MUMBAI", phone: "9167195818, 9167195818", openTime: "10:00 AM", closeTime: "21:00", workingDays: 6 },
    { id: 2, clinicName: "DADAR West", address: "Premises No. 104, 1st Floor, Tirthankar Apartments, S. K. Bole Road, Opp. Navneet Jain Health Centre, Dadar West, Mumbai 400028", location: "MUMBAI", phone: "9167195818", openTime: "10:00 AM", closeTime: "9:00 PM", workingDays: 6 },
    { id: 3, clinicName: "bandra west", address: "Flat No. 4, Ground Floor, 269B, Jubilee Court, Linking Road, Behind Kurion Showroom, Bandra West, Mumbai - 400050", location: "MUMBAI", phone: "8451035993, 8451035993", openTime: "11:00 AM", closeTime: "9:00 PM", workingDays: 6 },
    { id: 4, clinicName: "Andheri West (Juhu)", address: "Juhu Dhara Complex, 101, Juhu Sagar, Juhu Versova Link Rd, Andheri West, Mumbai, Maharashtra 400058", location: "MUMBAI", phone: "9029028805", openTime: "10:00 AM", closeTime: "9:00 PM", workingDays: 6 },
    { id: 5, clinicName: "GOREGAON East", address: "Shop No. 2, B Wing, Satellite Garden Phase 1, Wagheshwari, Filmcity Road, Goregaon East, Mumbai 400063", location: "MUMBAI", phone: "9167195818", openTime: "09:00", closeTime: "21:00", workingDays: 6 },
    { id: 6, clinicName: "MALAD West", address: "201, 2nd floor, A wing, Devraj Residency, Opp. Bank of India, S. V. Road, Malad west, Mumbai - 400064", location: "MUMBAI", phone: "9029028860", openTime: "10:00 AM", closeTime: "9:00 PM", workingDays: 6 },
    { id: 7, clinicName: "BYCULLA West", address: "Shop No. 64, Laxmi Niwas CHS, N. M. Joshi Marg, Byculla West, Mumbai 400027", location: "MUMBAI", phone: "9167195818", openTime: "10:00 AM", closeTime: "9:00 PM", workingDays: 6 },
    { id: 8, clinicName: "GHATKOPAR East", address: "Flat no.2, Ground floor, Kallash bhuvan No 1 Co-operative Housing Society Ltd, Plot no 40, Tilak Rd, Ghatkopar East, Mumbai, Maharashtra 400077", location: "MUMBAI", phone: "9167195818", openTime: "10:00 AM", closeTime: "9:00 PM", workingDays: 6 },
    { id: 9, clinicName: "MULUND", address: "1st Floor, Poornima Darshan, 9G/9F, 90 Feet Rd, near Shiv Sena Shakha, Deendayal Nagar, Mulund East, Mumbai, Maharashtra 400081", location: "MUMBAI", phone: "7021099509", openTime: "10:00 AM", closeTime: "9:00 PM", workingDays: 6 },
    { id: 10, clinicName: "CHEMBUR East", address: "A/9, 1st Floor My Mother CHS LTD, Plot. 412, Ramakrishna Chemburkar Marg, Chembur (East), Mumbai, Maharashtra 400074", location: "MUMBAI", phone: "8591263055", openTime: "10:00 AM", closeTime: "9:00 PM", workingDays: 6 }
  ]);

  const filteredData = branches.filter(item => {
      const matchName = item.clinicName.toLowerCase().includes(clinicName.toLowerCase());
      const matchLoc = item.location.toLowerCase().includes(locationName.toLowerCase());
      return matchName && matchLoc;
  });

  const handleDelete = (id) => {
      if(confirm("Are you sure you want to delete this branch?")) {
        setBranches(branches.filter(b => b.id !== id));
      }
  };

  const handleEdit = (branch) => {
      setFormData({
          ...initialFormState,
          clinicName: branch.clinicName,
          addressLine1: branch.address,
          location: branch.location,
          mobile: branch.phone.split(',')[0], // Simplified extraction
          openTime: branch.openTime,
          closeTime: branch.closeTime
      });
      setEditingId(branch.id);
      setViewMode("create");
  };

  const handleAddNew = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setViewMode("create");
  };

  const handleSubmit = (e) => {
      e.preventDefault();
      // Combine address lines for the table view
      const fullAddress = `${formData.addressLine1} ${formData.addressLine2 || ''} ${formData.city || ''} ${formData.pincode || ''}`.trim();
      
      if (editingId) {
          setBranches(branches.map(b => b.id === editingId ? {
              ...b,
              clinicName: formData.clinicName,
              address: fullAddress || b.address,
              location: formData.location || b.location,
              phone: formData.mobile,
              openTime: formData.openTime,
              closeTime: formData.closeTime
          } : b));
          alert("Branch Updated Successfully!");
      } else {
          const newId = Math.max(...branches.map(b => b.id), 0) + 1;
          const newBranch = {
              id: newId,
              clinicName: formData.clinicName,
              address: fullAddress,
              location: formData.location || "MUMBAI",
              phone: formData.mobile,
              openTime: formData.openTime,
              closeTime: formData.closeTime,
              workingDays: 6 // Default
          };
          setBranches([...branches, newBranch]);
          alert("Branch Created Successfully!");
      }
      setViewMode("list");
  };

  if (viewMode === "create") {
      return (
        <div className="p-6 bg-white dark:bg-gray-900 min-h-screen space-y-6">
             <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-4">
                <Settings className="w-5 h-5 text-[#0f7396]" />
                <h1 className="text-lg font-bold text-[#0f7396] uppercase tracking-wide">CLINIC</h1>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                         <div className="space-y-2">
                             <label className="text-sm text-gray-600 dark:text-gray-400">Clinic Name <span className="text-red-500">*</span></label>
                             <Input required value={formData.clinicName} onChange={e => setFormData({...formData, clinicName: e.target.value})} />
                         </div>
                         <div className="space-y-2">
                             <label className="text-sm text-gray-600 dark:text-gray-400">Address Line 1</label>
                             <textarea 
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.addressLine1}
                                onChange={e => setFormData({...formData, addressLine1: e.target.value})}
                             />
                         </div>
                         <div className="space-y-2">
                             <label className="text-sm text-gray-600 dark:text-gray-400">PinCode</label>
                             <Input value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} />
                         </div>
                          <div className="space-y-2">
                             <label className="text-sm text-gray-600 dark:text-gray-400">State</label>
                             <select 
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.state}
                                onChange={e => setFormData({...formData, state: e.target.value})}
                             >
                                <option value="">--Select--</option>
                                <option value="Maharashtra">Maharashtra</option>
                                <option value="Gujarat">Gujarat</option>
                             </select>
                         </div>
                         <div className="space-y-2">
                             <label className="text-sm text-gray-600 dark:text-gray-400">Mobile No 1. <span className="text-red-500">*</span></label>
                             <Input required value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} />
                         </div>
                         <div className="space-y-2">
                             <label className="text-sm text-gray-600 dark:text-gray-400">Email <span className="text-red-500">*</span></label>
                             <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                         </div>
                         <div className="space-y-2">
                             <label className="text-sm text-gray-600 dark:text-gray-400">Open Time (HH:MM) <span className="text-red-500">*</span></label>
                             <Input required value={formData.openTime} onChange={e => setFormData({...formData, openTime: e.target.value})} />
                         </div>
                         <div className="space-y-2">
                             <label className="text-sm text-gray-600 dark:text-gray-400">Location</label>
                             <select 
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.location}
                                onChange={e => setFormData({...formData, location: e.target.value})}
                             >
                                <option value="">--Select--</option>
                                <option value="Santacruz East">Santacruz East</option>
                                <option value="MUMBAI">MUMBAI</option>
                             </select>
                         </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                             <label className="text-sm text-gray-600 dark:text-gray-400">Reg.Date <span className="text-red-500">*</span></label>
                             <Input type="date" value={formData.regDate} onChange={e => setFormData({...formData, regDate: e.target.value})} />
                         </div>
                         <div className="space-y-2">
                             <label className="text-sm text-gray-600 dark:text-gray-400">Address Line 2</label>
                             <textarea 
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.addressLine2}
                                onChange={e => setFormData({...formData, addressLine2: e.target.value})}
                             />
                         </div>
                         <div className="space-y-2">
                             <label className="text-sm text-gray-600 dark:text-gray-400">Country</label>
                             <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})}>
                                 <option>India</option>
                             </select>
                         </div>
                         <div className="space-y-2">
                             <label className="text-sm text-gray-600 dark:text-gray-400">City</label>
                             <select 
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={formData.city}
                                onChange={e => setFormData({...formData, city: e.target.value})}
                             >
                                <option value="">--Select--</option>
                                <option value="Mumbai">Mumbai</option>
                             </select>
                         </div>
                         <div className="space-y-2">
                             <label className="text-sm text-gray-600 dark:text-gray-400">Telephone No</label>
                             <Input value={formData.telephone} onChange={e => setFormData({...formData, telephone: e.target.value})} />
                         </div>
                          <div className="space-y-2">
                             <label className="text-sm text-gray-600 dark:text-gray-400">Day Of Week <span className="text-red-500">*</span></label>
                             <select 
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={formData.dayOfWeek}
                                onChange={e => setFormData({...formData, dayOfWeek: e.target.value})}
                             >
                                <option value="">--Select--</option>
                                <option value="Monday">Monday</option>
                                <option value="Tuesday">Tuesday</option>
                             </select>
                         </div>
                         <div className="space-y-2">
                             <label className="text-sm text-gray-600 dark:text-gray-400">Close Time (HH:MM) <span className="text-red-500">*</span></label>
                             <Input required value={formData.closeTime} onChange={e => setFormData({...formData, closeTime: e.target.value})} />
                         </div>
                         <div className="space-y-2">
                             <label className="text-sm text-gray-600 dark:text-gray-400">User Name</label>
                             <Input value={formData.userName} onChange={e => setFormData({...formData, userName: e.target.value})} />
                         </div>
                    </div>
                </div>

                <div className="flex justify-center pt-8 gap-4">
                    <Button type="submit" className="bg-[#0f7396] hover:bg-[#0b5c7a] text-white px-8">Submit</Button>
                    <Button type="button" className="bg-[#0f7396] hover:bg-[#0b5c7a] text-white px-8" onClick={() => setViewMode("list")}>Cancel</Button>
                </div>
            </form>
        </div>
      );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-4">
        <Settings className="w-5 h-5 text-[#0f7396]" />
        <h1 className="text-lg font-bold text-[#0f7396] uppercase tracking-wide">
          CLINIC
        </h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <Input
            placeholder="Clinic Name"
            value={clinicName}
            onChange={(e) => setClinicName(e.target.value)}
            className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 md:max-w-xs"
        />
        <Input
            placeholder="Location Name"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
             className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 md:max-w-xs"
        />
        <div className="flex gap-2">
            <Button className="bg-[#0f7396] hover:bg-[#0b5c7a] text-white px-6 font-medium shadow-sm transition-all whitespace-nowrap">
                Search
            </Button>
            <Button 
                onClick={handleAddNew}
                className="bg-[#0f7396] hover:bg-[#0b5c7a] text-white px-6 font-medium shadow-sm transition-all whitespace-nowrap"
            >
                Add New Clinic
            </Button>
        </div>
         <div className="ml-auto text-sm text-gray-500">
            Total : {filteredData.length}
        </div>
      </div>

      {/* Table */}
       <div className="border border-gray-200 dark:border-gray-700 rounded-t-lg overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader className="bg-[#0f7396]/10 dark:bg-gray-800">
            <TableRow className="hover:bg-[#0f7396]/10 dark:hover:bg-gray-700/50 border-gray-200 dark:border-gray-700">
              <TableHead className="font-bold text-gray-700 dark:text-gray-300 w-[60px]">Sr. No.</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-300">Clinic Name</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-300">Address</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-300">Location</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-300">Phone No.</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-300">Open Time</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-300">Close Time</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-300">Working Days</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-300 w-[100px] text-center"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((row, index) => (
              <TableRow key={row.id} className="border-gray-200 dark:border-gray-700 dark:hover:bg-gray-800/50">
                <TableCell className="dark:text-gray-300">{index + 1}</TableCell>
                <TableCell className="dark:text-gray-300">{row.clinicName}</TableCell>
                <TableCell className="dark:text-gray-300 max-w-xs whitespace-normal break-words">{row.address}</TableCell>
                <TableCell className="dark:text-gray-300">{row.location}</TableCell>
                <TableCell className="dark:text-gray-300">{row.phone}</TableCell>
                <TableCell className="dark:text-gray-300">{row.openTime}</TableCell>
                <TableCell className="dark:text-gray-300">{row.closeTime}</TableCell>
                <TableCell className="dark:text-gray-300">{row.workingDays}</TableCell>
                <TableCell className="dark:text-gray-300">
                    <div className="flex flex-col gap-1 items-center justify-center">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-4 w-4 text-gray-600 hover:text-blue-600"
                            onClick={() => handleEdit(row)}
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-4 w-4 text-gray-600 hover:text-red-600"
                            onClick={() => handleDelete(row.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </TableCell>
              </TableRow>
            ))}
             {filteredData.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center h-24 text-gray-500">
                  No clinics found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

        {/* Footer / Pagination */}
       <div className="flex justify-end items-center pt-2">
          {/* Pagination logic can be added here */}
        </div>
    </div>
  );
}
