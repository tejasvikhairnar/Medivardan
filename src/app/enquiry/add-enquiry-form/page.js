"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { upsertLead } from "@/api/client/leads";
import { transformFormDataToAPI } from "@/utils/leadsTransformers";

export default function AddLeadFormPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    leadNo: "",
    leadDate: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    age: "",
    gender: "",
    email: "",
    address: "",
    area: "",
    country: "India",
    state: "Maharashtra",
    city: "Mumbai",
    leadSource: "",
    mobileNo1: "",
    mobileNo2: "",
    contactType: "doctors",
    clinicName: "Panvel",
    assignTo: "",
    patientFollowup: "patient",
    interestLevel: "1",
    patientStatus: "cooperative",
    conversationDetails: "",
    leadFor: "",
  });

  const handleInputChange = (field, value) => {
    if (field === "mobileNo1" || field === "mobileNo2") {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length > 10) return;
      
      setFormData((prev) => ({
        ...prev,
        [field]: numericValue,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate mandatory fields
    const mandatoryFields = {
      firstName: "First Name",
      leadSource: "Lead Source",
      mobileNo1: "Mobile No 1",
      clinicName: "Clinic Name",
      assignTo: "Assign To",
      leadFor: "Lead For"
    };

    const missingFields = [];
    Object.entries(mandatoryFields).forEach(([field, label]) => {
      if (!formData[field] || formData[field].trim() === "") {
        missingFields.push(label);
      }
    });

    if (missingFields.length > 0) {
      alert(`Please fill in the following mandatory fields:\n- ${missingFields.join('\n- ')}`);
      return;
    }

    // Validate mobile number format
    if (formData.mobileNo1.length < 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }

    try {
      setLoading(true);

      // Transform form data to API format
      const apiData = transformFormDataToAPI(formData);

      // Debug: Log the transformed data
      console.log('Form data before transformation:', formData);
      console.log('Transformed API data:', JSON.stringify(apiData, null, 2));

      // Call API to add/update lead
      const response = await upsertLead(apiData);

      console.log("Lead added successfully:", response);



      // Check if using mock data and show appropriate message
      const isMock = response.isMockData || false;
      const successMessage = isMock
        ? "Lead added successfully!\n\n⚠️ Note: Using mock data - changes are NOT saved to the external database."
        : `Lead added successfully!\n\n✅ Data has been saved to the backend API.\n\nServer Response: ${response.debugResponse}`;

      alert(successMessage);

      // Redirect to leads list page
      router.push("/enquiry/new-enquiry");
    } catch (error) {
      console.error("Error submitting lead:", error);
      alert(`Failed to add lead: ${error.message}\n\nPlease try again or contact support if the issue persists.`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/enquiry/new-enquiry");
  };

  return (
    <div className="w-full p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
          <Settings className="w-4 h-4 text-red-600" />
        </div>
        <h1 className="text-xl font-bold text-red-600 dark:text-red-500">
          LEAD
        </h1>
      </div>

      {/* Form */}
      <Card className="border-gray-200 dark:border-gray-800">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: Lead No and Lead Date */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="leadNo" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Lead No.
                </Label>
                <Input
                  id="leadNo"
                  value={formData.leadNo}
                  onChange={(e) => handleInputChange("leadNo", e.target.value)}
                  className="border-gray-300 dark:border-gray-700 bg-gray-100 w-full"
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="leadDate" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Lead Date
                </Label>
                <Input
                  id="leadDate"
                  type="date"
                  value={formData.leadDate}
                  onChange={(e) => handleInputChange("leadDate", e.target.value)}
                  className="border-gray-300 dark:border-gray-700 w-full"
                />
              </div>
            </div>

            {/* Row 2: First Name and Last Name */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  required
                  className="border-gray-300 dark:border-gray-700 w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  placeholder="Enter Last Name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="border-gray-300 dark:border-gray-700 w-full"
                />
              </div>
            </div>

            {/* Row 3: Date of Birth and Age */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date of Birth
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  placeholder="Date of Birth"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  className="border-gray-300 dark:border-gray-700 w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Age
                </Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter Age"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  className="border-gray-300 dark:border-gray-700 w-full"
                />
              </div>
            </div>

            {/* Row 4: Gender and Email */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Gender
                </Label>
                <RadioGroup
                  value={formData.gender}
                  onValueChange={(value) => handleInputChange("gender", value)}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male" className="cursor-pointer font-normal">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female" className="cursor-pointer font-normal">Female</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="border-gray-300 dark:border-gray-700 w-full"
                />
              </div>
            </div>

            {/* Row 5: Address and Area */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Address
                </Label>
                <Textarea
                  id="address"
                  placeholder="Enter Address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  rows={3}
                  className="border-gray-300 dark:border-gray-700 resize-none w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="area" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Area
                </Label>
                <Textarea
                  id="area"
                  placeholder="Enter Area"
                  value={formData.area}
                  onChange={(e) => handleInputChange("area", e.target.value)}
                  rows={3}
                  className="border-gray-300 dark:border-gray-700 resize-none w-full"
                />
              </div>
            </div>

            {/* Row 6: Country and State */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="country" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Country
                </Label>
                <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                  <SelectTrigger className="border-gray-300 dark:border-gray-700 w-full">
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="India">India</SelectItem>
                    <SelectItem value="USA">USA</SelectItem>
                    <SelectItem value="UK">UK</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="state" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  State
                </Label>
                <Select value={formData.state} onValueChange={(value) => handleInputChange("state", value)}>
                  <SelectTrigger className="border-gray-300 dark:border-gray-700 w-full">
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="Gujarat">Gujarat</SelectItem>
                    <SelectItem value="Karnataka">Karnataka</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 7: City and Lead Source */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  City
                </Label>
                <Select value={formData.city} onValueChange={(value) => handleInputChange("city", value)}>
                  <SelectTrigger className="border-gray-300 dark:border-gray-700 w-full">
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mumbai">Mumbai</SelectItem>
                    <SelectItem value="Pune">Pune</SelectItem>
                    <SelectItem value="Panvel">Panvel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="leadSource" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Lead Source <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.leadSource} onValueChange={(value) => handleInputChange("leadSource", value)}>
                  <SelectTrigger className="border-gray-300 dark:border-gray-700 w-full">
                    <SelectValue placeholder="--- Select Source ---" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google">Google</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="justdial">JustDial</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="walkin">Walk-in</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 8: Mobile No 1 and Mobile No 2 */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="mobileNo1" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mobile No 1. <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="mobileNo1"
                  type="tel"
                  placeholder="Enter Mobile"
                  value={formData.mobileNo1}
                  onChange={(e) => handleInputChange("mobileNo1", e.target.value)}
                  required
                  className="border-gray-300 dark:border-gray-700 w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobileNo2" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mobile No 2.
                </Label>
                <Input
                  id="mobileNo2"
                  type="tel"
                  placeholder="Enter Telephone"
                  value={formData.mobileNo2}
                  onChange={(e) => handleInputChange("mobileNo2", e.target.value)}
                  className="border-gray-300 dark:border-gray-700 w-full"
                />
              </div>
            </div>

            {/* Row 9: Contact Type and Clinic Name */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contact Type
                </Label>
                <RadioGroup
                  value={formData.contactType}
                  onValueChange={(value) => handleInputChange("contactType", value)}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="doctors" id="doctors" />
                    <Label htmlFor="doctors" className="cursor-pointer font-normal">Doctors</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="telecaller" id="telecaller" />
                    <Label htmlFor="telecaller" className="cursor-pointer font-normal">Telecaller</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="receptionist" id="receptionist" />
                    <Label htmlFor="receptionist" className="cursor-pointer font-normal">Receptionist</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="clinicName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Clinic Name <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.clinicName} onValueChange={(value) => handleInputChange("clinicName", value)}>
                  <SelectTrigger className="border-gray-300 dark:border-gray-700 w-full">
                    <SelectValue placeholder="Select Clinic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Panvel">Panvel</SelectItem>
                    <SelectItem value="Pune">Pune</SelectItem>
                    <SelectItem value="Mumbai">Mumbai</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 10: Assign To */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="assignTo" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Assign To <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.assignTo} onValueChange={(value) => handleInputChange("assignTo", value)}>
                  <SelectTrigger className="border-gray-300 dark:border-gray-700 w-full">
                    <SelectValue placeholder="--- Select ---" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="doctor1">Dr. Kinnari Lade</SelectItem>
                    <SelectItem value="doctor2">Dr. Rajesh Kumar</SelectItem>
                    <SelectItem value="doctor3">Dr. Priya Singh</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Patient / Followup <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={formData.patientFollowup}
                  onValueChange={(value) => handleInputChange("patientFollowup", value)}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="patient" id="patient" />
                    <Label htmlFor="patient" className="cursor-pointer font-normal">Patient</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="followup" id="followup" />
                    <Label htmlFor="followup" className="cursor-pointer font-normal">Followup</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Row 11: Interest Level and Conversation Details */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Interest Level <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={formData.interestLevel}
                  onValueChange={(value) => handleInputChange("interestLevel", value)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="level1" />
                    <Label htmlFor="level1" className="cursor-pointer font-normal">1</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2" id="level2" />
                    <Label htmlFor="level2" className="cursor-pointer font-normal">2</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3" id="level3" />
                    <Label htmlFor="level3" className="cursor-pointer font-normal">3</Label>
                  </div>

                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="conversationDetails" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Conversation details
                </Label>
                <Textarea
                  id="conversationDetails"
                  placeholder="Enter conversation details"
                  value={formData.conversationDetails}
                  onChange={(e) => handleInputChange("conversationDetails", e.target.value)}
                  rows={3}
                  className="border-gray-300 dark:border-gray-700 resize-none w-full"
                />
              </div>
            </div>

            {/* Row 12: Patient Status and Enquiry For */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Patient Status
                </Label>
                <RadioGroup
                  value={formData.patientStatus}
                  onValueChange={(value) => handleInputChange("patientStatus", value)}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="less-cooperative" id="less-cooperative" />
                    <Label htmlFor="less-cooperative" className="cursor-pointer font-normal">Less Co-operative</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cooperative" id="cooperative" />
                    <Label htmlFor="cooperative" className="cursor-pointer font-normal">Co-operative</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="very-cooperative" id="very-cooperative" />
                    <Label htmlFor="very-cooperative" className="cursor-pointer font-normal">Very Co-operative</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="leadFor" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Lead For <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.leadFor} onValueChange={(value) => handleInputChange("leadFor", value)}>
                  <SelectTrigger className="border-gray-300 dark:border-gray-700 w-full">
                    <SelectValue placeholder="-- Select Treatment--" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="physiotherapy">Physiotherapy</SelectItem>
                    <SelectItem value="consultation">General Consultation</SelectItem>
                    <SelectItem value="treatment">Specialized Treatment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-4 pt-6">
              <Button
                type="submit"
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white px-8 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Submit"}
              </Button>
              <Button
                type="button"
                onClick={handleCancel}
                className="bg-red-600 hover:bg-red-700 text-white px-8"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
