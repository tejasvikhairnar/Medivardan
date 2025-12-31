'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Settings } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function NewAppointmentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedDate = searchParams.get('date')
  const selectedClinic = searchParams.get('clinic')
  const selectedDoctor = searchParams.get('doctor')

  const [formData, setFormData] = useState({
    clinicName: selectedClinic || '',
    doctorName: selectedDoctor || '',
    appointmentNo: 'A12800',
    date: selectedDate || new Date().toISOString().split('T')[0],
    firstName: '',
    lastName: '',
    age: '',
    dateOfBirth: '',
    gender: 'Male',
    mobileNo: '',
    email: '',
    telephoneNo: ''
  })

  const handleInputChange = (field, value) => {
    // strictly 10 digits for mobileNo and telephoneNo
    if (field === "mobileNo" || field === "telephoneNo") {
       const numericValue = value.replace(/\D/g, "");
       if (numericValue.length > 10) return;
       
       setFormData(prev => ({
         ...prev,
         [field]: numericValue
       }));
       return;
    }

    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Auto-calculate age from date of birth
    if (field === 'dateOfBirth' && value) {
      const birthDate = new Date(value)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        setFormData(prev => ({ ...prev, age: age - 1 }))
      } else {
        setFormData(prev => ({ ...prev, age }))
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate mandatory fields
    const mandatoryFields = {
      mobileNo: "Mobile No."
    };

    const missingFields = [];
    Object.entries(mandatoryFields).forEach(([field, label]) => {
      if (!formData[field] || formData[field].toString().trim() === "") {
        missingFields.push(label);
      }
    });

    if (missingFields.length > 0) {
      alert(`Please fill in the following mandatory fields:\n- ${missingFields.join('\n- ')}`);
      return;
    }

    // Validate mobile number format
    if (formData.mobileNo.length !== 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }

    // Handle form submission - save to API
    alert('Appointment booked successfully!');
    router.push('/appointments/Book-Appointments')
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#4DB8AC]/10 dark:bg-[#1E6B8C]/20">
          <Settings className="w-5 h-5 text-[#E74C3C]" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-[#E74C3C]">BOOK APPOINTMENT</h1>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Clinic Name and Doctor Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="clinicName" className="text-sm font-medium">
              Clinic Name
            </Label>
            <Select
              value={formData.clinicName}
              onValueChange={(value) => handleInputChange('clinicName', value)}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select Clinic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Panvel">Panvel</SelectItem>
                <SelectItem value="Mumbai">Mumbai</SelectItem>
                <SelectItem value="Thane">Thane</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="doctorName" className="text-sm font-medium">
              Doctor Name
            </Label>
            <Select
              value={formData.doctorName}
              onValueChange={(value) => handleInputChange('doctorName', value)}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="--- Select ---" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dr. Smith">Dr. Smith</SelectItem>
                <SelectItem value="Dr. Patel">Dr. Patel</SelectItem>
                <SelectItem value="Dr. Kumar">Dr. Kumar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Appointment No. and Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="appointmentNo" className="text-sm font-medium">
              Appointment No.
            </Label>
            <Input
              id="appointmentNo"
              value={formData.appointmentNo}
              onChange={(e) => handleInputChange('appointmentNo', e.target.value)}
              className="mt-1.5 bg-muted"
              readOnly
            />
          </div>

          <div>
            <Label htmlFor="date" className="text-sm font-medium">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="mt-1.5"
            />
          </div>
        </div>

        {/* First Name and Last Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="firstName" className="text-sm font-medium">
              First Name
            </Label>
            <Input
              id="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="mt-1.5"
              required
            />
          </div>

          <div>
            <Label htmlFor="lastName" className="text-sm font-medium">
              Last Name
            </Label>
            <Input
              id="lastName"
              placeholder="Enter Last Name"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="mt-1.5"
            />
          </div>
        </div>

        {/* Date of Birth and Age */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="dateOfBirth" className="text-sm font-medium">
              Date of Birth
            </Label>
            <Input
              id="dateOfBirth"
              type="date"
              placeholder="Date of Birth"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="age" className="text-sm font-medium">
              Age
            </Label>
            <Input
              id="age"
              placeholder="Enter Age"
              value={formData.age}
              onChange={(e) => handleInputChange('age', e.target.value)}
              className="mt-1.5"
            />
          </div>
        </div>

        {/* Gender and Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-sm font-medium">Gender</Label>
            <div className="flex gap-6 mt-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={formData.gender === 'Male'}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-4 h-4 text-[#E74C3C] focus:ring-[#E74C3C] cursor-pointer"
                />
                <span className="text-sm">Male</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={formData.gender === 'Female'}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-4 h-4 text-[#E74C3C] focus:ring-[#E74C3C] cursor-pointer"
                />
                <span className="text-sm">Female</span>
              </label>
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="mt-1.5"
            />
          </div>
        </div>

        {/* Mobile No. and Telephone No. */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="mobileNo" className="text-sm font-medium">
              Mobile No. <span className="text-red-500">*</span>
            </Label>
            <Input
              id="mobileNo"
              type="tel"
              placeholder="Enter Mobile"
              value={formData.mobileNo}
              onChange={(e) => handleInputChange('mobileNo', e.target.value)}
              className="mt-1.5"
              required
            />
          </div>

          <div>
            <Label htmlFor="telephoneNo" className="text-sm font-medium">
              Telephone No.
            </Label>
            <Input
              id="telephoneNo"
              type="tel"
              placeholder="Enter Telephone"
              value={formData.telephoneNo}
              onChange={(e) => handleInputChange('telephoneNo', e.target.value)}
              className="mt-1.5"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center pt-6">
          <Button
            type="submit"
            className="px-12 bg-green-600 hover:bg-green-700 text-white"
          >
            Submit
          </Button>
          <Button
            type="button"
            onClick={handleCancel}
            className="px-12 bg-red-600 hover:bg-red-700 text-white"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
