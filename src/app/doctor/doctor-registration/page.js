"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// Using Axios + React Query instead of old service
import { useDoctors } from "@/hooks/useDoctors";
import { useUpsertDoctor, useDeleteDoctor } from "@/hooks/useDoctorMutations";
import { getDoctorById } from "@/api/doctor";
import { transformAPItoForm } from "@/api/doctor/transformers";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Settings, Eye, Edit, Calendar, X, Loader2, Trash2, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import CustomPagination from "@/components/ui/custom-pagination";

export default function DoctorRegistrationPage() {
  const router = useRouter();
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [filters, setFilters] = useState({
    doctorName: "",
    mobileNo: "",
    doctorID: "",
    panel: "all",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // React Query hooks for data fetching and mutations
  const { data: doctors = [], isLoading, error, refetch } = useDoctors();
  const upsertMutation = useUpsertDoctor();
  const deleteMutation = useDeleteDoctor();

  const [formData, setFormData] = useState({
    // Clinic & Doctor Type
    clinicName: "",
    doctorType: "full-time",
    date: new Date().toISOString().split('T')[0],

    // Personal Information
    title: "Dr.",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "male",
    addressLine1: "",
    addressLine2: "",
    country: "India",
    state: "Maharashtra",
    city: "Mumbai",
    areaPin: "",
    mobileNo1: "",
    mobileNo2: "",
    email: "",
    bloodGroup: "",
    inTime: "",
    outTime: "",

    // Education
    educationList: [],
    currentEducation: {
      degree: "",
      board: "",
      upload: null,
    },

    // Speciality
    specialities: {
      asthesticDentist: false,
      generalDentist: false,
      orthodontics: false,
      periodontics: false,
      conservativeDentist: false,
      oralMaxillofacial: false,
      pedodontics: false,
      prosthodontics: false,
      endodontics: false,
      oralPathology: false,
    },

    // Documents
    profilePhoto: null,
    adharCardNo: "",
    adharCardImage: null,
    panCardNo: "",
    panCardImage: null,
    registrationNo: "",
    certificateImage: null,
    indemnityPolicyNo: "",
    indemnityPolicyImage: null,
  });

  // React Query handles all data fetching automatically
  // No need for manual useEffect or fetchDoctors function

  const handleInputChange = (field, value) => {
    // strict 10-digit restriction for mobile numbers
    if (field === "mobileNo1" || field === "mobileNo2" || field === "mobileNo") {
       // Allow only digits
       const numericValue = value.replace(/\D/g, "");
       // Limit to 10 digits
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

  const handleEducationChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      currentEducation: {
        ...prev.currentEducation,
        [field]: value,
      },
    }));
  };

  const handleSpecialityChange = (field, checked) => {
    setFormData((prev) => ({
      ...prev,
      specialities: {
        ...prev.specialities,
        [field]: checked,
      },
    }));
  };

  const handleAddEducation = () => {
    if (formData.currentEducation.degree && formData.currentEducation.board) {
      setFormData((prev) => ({
        ...prev,
        educationList: [...prev.educationList, prev.currentEducation],
        currentEducation: {
          degree: "",
          board: "",
          upload: null,
        },
      }));
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleEducationChange("upload", file);
    }
  };

  const handleDocumentUpload = (field, file) => {
    if (file) {
      handleInputChange(field, file);
    }
  };

  const handleNext = () => {
    if (activeTab === "personal") {
      setActiveTab("education");
    } else if (activeTab === "education") {
      setActiveTab("documents");
    }
  };

  /* File Upload Helper using direct Axios to avoid interceptor issues */
  const uploadFile = async (file) => {
    if (!file) return null;
    const uploadData = new FormData();
    uploadData.append("file", file);
    try {
        const res = await axios.post("/api/upload", uploadData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return res.data.url; 
    } catch (e) {
        console.error("Upload failed", e);
        return null;
    }
  };

  const handleFormSubmit = async () => {
    // Validate mandatory fields
    const mandatoryFields = {
      clinicName: "Clinic Name",
      firstName: "First Name",
      lastName: "Last Name",
      mobileNo1: "Mobile No 1",
      email: "Email",
      inTime: "In Time (HH:MM)",
      outTime: "Out Time (HH:MM)"
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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Validate mobile number format
    if (formData.mobileNo1.length < 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }

    // 1. Upload Files
    const profileUrl = await uploadFile(formData.profilePhoto);
    const adharUrl = await uploadFile(formData.adharCardImage);
    const panUrl = await uploadFile(formData.panCardImage);
    const regUrl = await uploadFile(formData.certificateImage); 
    const indemnityUrl = await uploadFile(formData.indemnityPolicyImage);
    
    // Education Uploads processing
    let deg1Url = null;
    let deg2Url = null;
    let basicDegree = formData.currentEducation.degree;
    
    // Prioritize education list
    if (formData.educationList.length > 0) {
          const edu1 = formData.educationList[0];
          deg1Url = await uploadFile(edu1.upload);
          basicDegree = edu1.degree;
          
          if (formData.educationList.length > 1) {
              const edu2 = formData.educationList[1];
              deg2Url = await uploadFile(edu2.upload);
          }
    } else if (formData.currentEducation.degree) {
          // Fallback if not added to list but typed in
          deg1Url = await uploadFile(formData.currentEducation.upload);
    }

    // 2. Prepare Data for Transformer
    // We pass formData + validation URLs to the mutation.
    // The mutation calls upsertDoctor -> checks transformFormDataToAPI
    const dataForTransformer = {
        ...formData,
        profileImageUrl: profileUrl,
        adharCardImageUrl: adharUrl,
        panCardImageUrl: panUrl,
        registrationImageUrl: regUrl,
        identityPolicyImageUrl: indemnityUrl,
        degreeUpload1: deg1Url,
        degreeUpload2: deg2Url,
        currentEducation: {
            ...formData.currentEducation,
            degree: basicDegree 
        }
    };
    
    console.log("Submitting with Files:", dataForTransformer);

    // Submit using React Query mutation
    upsertMutation.mutate(dataForTransformer, {
      onSuccess: (data) => {
        alert(`Doctor added successfully! Doctor ID: ${data.doctorID}`);
        
        // Explicitly refetch the list
        refetch();

        // Reset form data
        setFormData({
          clinicName: "",
          doctorType: "full-time",
          date: new Date().toISOString().split('T')[0],
          title: "Dr.",
          firstName: "",
          lastName: "",
          dateOfBirth: "",
          gender: "male",
          addressLine1: "",
          addressLine2: "",
          country: "India",
          state: "Maharashtra",
          city: "Mumbai",
          areaPin: "",
          mobileNo1: "",
          mobileNo2: "",
          email: "",
          bloodGroup: "",
          inTime: "",
          outTime: "",
          educationList: [],
          currentEducation: {
            degree: "",
            board: "",
            upload: null,
            degreeUpload1: null // Reset these too
          },
          specialities: {
            asthesticDentist: false,
            // ... reset all ... (simplified)
            generalDentist: false,
            orthodontics: false,
            periodontics: false,
            conservativeDentist: false,
            oralMaxillofacial: false,
            pedodontics: false,
            prosthodontics: false,
            endodontics: false,
            oralPathology: false,
          },
          profilePhoto: null,
          adharCardNo: "",
          adharCardImage: null,
          panCardNo: "",
          panCardImage: null,
          registrationNo: "",
          certificateImage: null,
          indemnityPolicyNo: "",
          indemnityPolicyImage: null,
        });

        // Close form and reset tab
        setShowAddForm(false);
        setActiveTab("personal");
      },
      onError: (error) => {
        alert(`Failed to add doctor: ${error.message}`);
      },
    });
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = () => {
    // Filter logic is handled in the render section
    // This function can be used to trigger any additional search actions if needed
    console.log("Search filters:", filters);
  };

  const handleExcelUpload = () => {
    // Add your excel upload logic here
  };

  const handleAddNew = () => {
    // Reset form data to default state (simplified for brevity, ensure full reset in production)
    setFormData({
        clinicName: "",
        doctorType: "full-time",
        date: new Date().toISOString().split('T')[0],
        title: "Dr.",
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "male",
        addressLine1: "",
        addressLine2: "",
        country: "India",
        state: "Maharashtra",
        city: "Mumbai",
        areaPin: "",
        mobileNo1: "",
        mobileNo2: "",
        email: "",
        bloodGroup: "",
        inTime: "",
        outTime: "",
        educationList: [],
        currentEducation: {
          degree: "",
          board: "",
          upload: null,
        },
        specialities: {
          asthesticDentist: false,
          generalDentist: false,
          orthodontics: false,
          periodontics: false,
          conservativeDentist: false,
          oralMaxillofacial: false,
          pedodontics: false,
          prosthodontics: false,
          endodontics: false,
          oralPathology: false,
        },
        profilePhoto: null,
        adharCardNo: "",
        adharCardImage: null,
        panCardNo: "",
        panCardImage: null,
        registrationNo: "",
        certificateImage: null,
        indemnityPolicyNo: "",
        indemnityPolicyImage: null,
      });
    setShowAddForm(true);
    setActiveTab("personal");
  };

  const handleEdit = async (doctor) => {
      try {
          console.log("[handleEdit] Doctor Object:", doctor);
          const doctorID = doctor.doctorID;
          console.log("[handleEdit] Extracted ID:", doctorID);

          if (!doctorID) {
              alert("Error: Doctor ID is missing");
              return;
          }

          // Fetch full details
          const apiData = await getDoctorById(doctorID);

          if (apiData) {
              const formDataFromApi = transformAPItoForm(apiData);
              if (formDataFromApi) {
                  setFormData(formDataFromApi);
                  setShowAddForm(true);
                  setActiveTab("personal");
              }
          }
      } catch (error) {
          console.error("Failed to fetch doctor details", error);
          alert("Failed to load doctor details for editing.");
      }
  };

  const handleDelete = (doctor) => {
      const doctorID = doctor.doctorID;
      const doctorName = doctor.name || "this doctor";

      if (!doctorID) {
          alert("Error: Doctor ID is missing");
          return;
      }

      // Confirmation dialog
      if (window.confirm(`Are you sure you want to delete ${doctorName} (ID: ${doctorID})? This action cannot be undone.`)) {
          deleteMutation.mutate(doctorID, {
              onSuccess: () => {
                  alert(`Doctor "${doctorName}" deleted successfully!`);
                  refetch();
              },
              onError: (error) => {
                  alert(`Failed to delete doctor: ${error.message}`);
              },
          });
      }
  };

  // Filter doctors based on search criteria
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesName = !filters.doctorName ||
      doctor.name.toLowerCase().includes(filters.doctorName.toLowerCase());

    const matchesMobile = !filters.mobileNo ||
      doctor.mobileNo.includes(filters.mobileNo);

    const matchesID = !filters.doctorID ||
      (doctor.doctorID && doctor.doctorID.toString().includes(filters.doctorID));

    const matchesPanel = !filters.panel || filters.panel === "all";

    return matchesName && matchesMobile && matchesPanel && matchesID;
  }).sort((a, b) => (b.doctorID || 0) - (a.doctorID || 0)); // Sort by Doctor ID descending

  // DEBUG: Log the first doctor to see field names
  if (doctors.length > 0) {
    console.log('Doctor Data Structure:', doctors[0]);
  }

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedDoctors = filteredDoctors.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="w-full p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#0f7396]/10 flex items-center justify-center">
          <Settings className="w-4 h-4 text-[#0f7396]" />
        </div>
        <h1 className="text-xl font-bold text-[#0f7396]">
          DOCTOR
        </h1>
      </div>

      {/* Add Doctor Form Section */}
      {showAddForm && (
        <Card className="border-2 border-blue-500 dark:border-blue-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#0f7396] dark:text-[#0f7396]">
                Add New Doctor
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddForm(false)}
                className="hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Clinic Name Selection */}
            <div className="space-y-2 mb-6">
              <Label htmlFor="clinicName" className="text-sm font-medium">
                Clinic Name <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.clinicName}
                onValueChange={(value) => handleInputChange("clinicName", value)}
              >
                <SelectTrigger className="border-gray-300 dark:border-gray-700">
                  <SelectValue placeholder="--- Select Clinic ---" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="panvel">Panvel</SelectItem>
                  <SelectItem value="pune">Pune</SelectItem>
                  <SelectItem value="mumbai">Mumbai</SelectItem>
                  <SelectItem value="nashik">Nashik</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tabs Section */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full grid grid-cols-3 bg-gray-100 dark:bg-gray-800">
                <TabsTrigger
                  value="personal"
                  className="data-[state=active]:bg-[#0f7396] data-[state=active]:text-white"
                >
                  Personal Information
                </TabsTrigger>
                <TabsTrigger
                  value="education"
                  className="data-[state=active]:bg-[#0f7396] data-[state=active]:text-white"
                >
                  Education
                </TabsTrigger>
                <TabsTrigger
                  value="documents"
                  className="data-[state=active]:bg-[#0f7396] data-[state=active]:text-white"
                >
                  Documents
                </TabsTrigger>
              </TabsList>

              {/* Personal Information Tab - Content will be added here */}
              <TabsContent value="personal" className="space-y-6 mt-6">
                {/* Doctor Type and Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="doctorType" className="text-sm font-medium">
                      Doctor Type
                    </Label>
                    <Select
                      value={formData.doctorType}
                      onValueChange={(value) => handleInputChange("doctorType", value)}
                    >
                      <SelectTrigger className="border-gray-300 dark:border-gray-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-Time Consultant</SelectItem>
                        <SelectItem value="part-time">Part-Time Consultant</SelectItem>
                        <SelectItem value="visiting">Visiting Consultant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-sm font-medium">
                      Date
                    </Label>
                    <Input
                      type="date"
                      id="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                      className="border-gray-300 dark:border-gray-700"
                    />
                  </div>
                </div>

                {/* Title, First Name, Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium">
                      Title
                    </Label>
                    <Select
                      value={formData.title}
                      onValueChange={(value) => handleInputChange("title", value)}
                    >
                      <SelectTrigger className="border-gray-300 dark:border-gray-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Dr.">Dr.</SelectItem>
                        <SelectItem value="Prof.">Prof.</SelectItem>
                        <SelectItem value="Mr.">Mr.</SelectItem>
                        <SelectItem value="Ms.">Ms.</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium">
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="border-gray-300 dark:border-gray-700"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium">
                      Last Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="border-gray-300 dark:border-gray-700"
                    />
                  </div>
                </div>

                {/* Date of Birth and Gender */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth" className="text-sm font-medium">
                      Date Of Birth
                    </Label>
                    <Input
                      type="date"
                      id="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                      className="border-gray-300 dark:border-gray-700"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Gender</Label>
                    <RadioGroup
                      value={formData.gender}
                      onValueChange={(value) => handleInputChange("gender", value)}
                      className="flex gap-6 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male" className="font-normal cursor-pointer">
                          Male
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female" className="font-normal cursor-pointer">
                          Female
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                {/* Address Line 1 and 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="addressLine1" className="text-sm font-medium">
                      Address Line 1
                    </Label>
                    <Textarea
                      id="addressLine1"
                      value={formData.addressLine1}
                      onChange={(e) => handleInputChange("addressLine1", e.target.value)}
                      className="border-gray-300 dark:border-gray-700 min-h-[80px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="addressLine2" className="text-sm font-medium">
                      Address Line 2
                    </Label>
                    <Textarea
                      id="addressLine2"
                      value={formData.addressLine2}
                      onChange={(e) => handleInputChange("addressLine2", e.target.value)}
                      className="border-gray-300 dark:border-gray-700 min-h-[80px]"
                    />
                  </div>
                </div>

                {/* Country and State */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-sm font-medium">
                      Country
                    </Label>
                    <Select
                      value={formData.country}
                      onValueChange={(value) => handleInputChange("country", value)}
                    >
                      <SelectTrigger className="border-gray-300 dark:border-gray-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="India">India</SelectItem>
                        <SelectItem value="USA">USA</SelectItem>
                        <SelectItem value="UK">UK</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-sm font-medium">
                      State
                    </Label>
                    <Select
                      value={formData.state}
                      onValueChange={(value) => handleInputChange("state", value)}
                    >
                      <SelectTrigger className="border-gray-300 dark:border-gray-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                        <SelectItem value="Gujarat">Gujarat</SelectItem>
                        <SelectItem value="Karnataka">Karnataka</SelectItem>
                        <SelectItem value="Delhi">Delhi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* City and Area Pin */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-medium">
                      City
                    </Label>
                    <Select
                      value={formData.city}
                      onValueChange={(value) => handleInputChange("city", value)}
                    >
                      <SelectTrigger className="border-gray-300 dark:border-gray-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mumbai">Mumbai</SelectItem>
                        <SelectItem value="Pune">Pune</SelectItem>
                        <SelectItem value="Nashik">Nashik</SelectItem>
                        <SelectItem value="Panvel">Panvel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="areaPin" className="text-sm font-medium">
                      Area Pin
                    </Label>
                    <Input
                      id="areaPin"
                      value={formData.areaPin}
                      onChange={(e) => handleInputChange("areaPin", e.target.value)}
                      className="border-gray-300 dark:border-gray-700"
                      placeholder="Enter PIN code"
                    />
                  </div>
                </div>

                {/* Mobile Numbers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="mobileNo1" className="text-sm font-medium">
                      Mobile No 1. <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="mobileNo1"
                      value={formData.mobileNo1}
                      onChange={(e) => handleInputChange("mobileNo1", e.target.value)}
                      className="border-gray-300 dark:border-gray-700"
                      placeholder="Enter mobile number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobileNo2" className="text-sm font-medium">
                      Mobile No 2.
                    </Label>
                    <Input
                      id="mobileNo2"
                      value={formData.mobileNo2}
                      onChange={(e) => handleInputChange("mobileNo2", e.target.value)}
                      className="border-gray-300 dark:border-gray-700"
                      placeholder="Enter mobile number"
                    />
                  </div>
                </div>

                {/* Email and Blood Group */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="border-gray-300 dark:border-gray-700"
                      placeholder="Enter email address"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup" className="text-sm font-medium">
                      Blood Group
                    </Label>
                    <Input
                      id="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={(e) => handleInputChange("bloodGroup", e.target.value)}
                      className="border-gray-300 dark:border-gray-700"
                      placeholder="Enter blood group"
                    />
                  </div>
                </div>

                {/* In Time and Out Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="inTime" className="text-sm font-medium">
                      In Time (HH:MM) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="time"
                      id="inTime"
                      value={formData.inTime}
                      onChange={(e) => handleInputChange("inTime", e.target.value)}
                      className="border-gray-300 dark:border-gray-700"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="outTime" className="text-sm font-medium">
                      Out Time (HH:MM) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="time"
                      id="outTime"
                      value={formData.outTime}
                      onChange={(e) => handleInputChange("outTime", e.target.value)}
                      className="border-gray-300 dark:border-gray-700"
                    />
                  </div>
                </div>

                {/* Next Button */}
                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleNext}
                    className="bg-[#0f7396] hover:bg-[#0b5c7a] text-white px-8"
                  >
                    Next
                  </Button>
                </div>
              </TabsContent>

              {/* Education Tab */}
              <TabsContent value="education" className="space-y-6 mt-6">
                {/* Degree, Board, and Upload */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                  <div className="space-y-2">
                    <Label htmlFor="degree" className="text-sm font-medium">
                      Degree
                    </Label>
                    <Select
                      value={formData.currentEducation.degree}
                      onValueChange={(value) => handleEducationChange("degree", value)}
                    >
                      <SelectTrigger className="border-gray-300 dark:border-gray-700">
                        <SelectValue placeholder="BDS" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BDS">BDS</SelectItem>
                        <SelectItem value="MDS">MDS</SelectItem>
                        <SelectItem value="MBBS">MBBS</SelectItem>
                        <SelectItem value="MD">MD</SelectItem>
                        <SelectItem value="DNB">DNB</SelectItem>
                        <SelectItem value="BPT">BPT</SelectItem>
                        <SelectItem value="MPT">MPT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="board" className="text-sm font-medium">
                      Board
                    </Label>
                    <Input
                      id="board"
                      value={formData.currentEducation.board}
                      onChange={(e) => handleEducationChange("board", e.target.value)}
                      className="border-gray-300 dark:border-gray-700"
                      placeholder="Maharashtra"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="upload" className="text-sm font-medium">
                      Upload
                    </Label>
                    <Input
                      type="file"
                      id="upload"
                      onChange={handleFileUpload}
                      className="border-gray-300 dark:border-gray-700"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </div>

                  <div className="space-y-2">
                    {formData.currentEducation.upload && (
                      <div className="w-24 h-24 border border-gray-300 dark:border-gray-600 rounded flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                        <img
                          src={URL.createObjectURL(formData.currentEducation.upload)}
                          alt="Upload preview"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Speciality Section */}
                <div className="space-y-4 pt-6">
                  <h3 className="text-lg font-semibold">Speciality</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="asthesticDentist"
                        checked={formData.specialities.asthesticDentist}
                        onChange={(e) => handleSpecialityChange("asthesticDentist", e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <Label htmlFor="asthesticDentist" className="font-normal cursor-pointer">
                        Asthestic dentist
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="generalDentist"
                        checked={formData.specialities.generalDentist}
                        onChange={(e) => handleSpecialityChange("generalDentist", e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <Label htmlFor="generalDentist" className="font-normal cursor-pointer">
                        General dentist
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="orthodontics"
                        checked={formData.specialities.orthodontics}
                        onChange={(e) => handleSpecialityChange("orthodontics", e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <Label htmlFor="orthodontics" className="font-normal cursor-pointer">
                        Orthodontics and Dentofacial Orthopedic
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="periodontics"
                        checked={formData.specialities.periodontics}
                        onChange={(e) => handleSpecialityChange("periodontics", e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <Label htmlFor="periodontics" className="font-normal cursor-pointer">
                        Periodontics
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="conservativeDentist"
                        checked={formData.specialities.conservativeDentist}
                        onChange={(e) => handleSpecialityChange("conservativeDentist", e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <Label htmlFor="conservativeDentist" className="font-normal cursor-pointer">
                        Conservative dentist
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="oralMaxillofacial"
                        checked={formData.specialities.oralMaxillofacial}
                        onChange={(e) => handleSpecialityChange("oralMaxillofacial", e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <Label htmlFor="oralMaxillofacial" className="font-normal cursor-pointer">
                        Oral and Maxillofacial surgeon
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="pedodontics"
                        checked={formData.specialities.pedodontics}
                        onChange={(e) => handleSpecialityChange("pedodontics", e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <Label htmlFor="pedodontics" className="font-normal cursor-pointer">
                        pedodontics
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="prosthodontics"
                        checked={formData.specialities.prosthodontics}
                        onChange={(e) => handleSpecialityChange("prosthodontics", e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <Label htmlFor="prosthodontics" className="font-normal cursor-pointer">
                        prosthodontics
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="endodontics"
                        checked={formData.specialities.endodontics}
                        onChange={(e) => handleSpecialityChange("endodontics", e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <Label htmlFor="endodontics" className="font-normal cursor-pointer">
                        Endodontics
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="oralPathology"
                        checked={formData.specialities.oralPathology}
                        onChange={(e) => handleSpecialityChange("oralPathology", e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <Label htmlFor="oralPathology" className="font-normal cursor-pointer">
                        Oral Pathology
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-end pt-6">
                  <Button
                    onClick={handleNext}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                  >
                    Next
                  </Button>
                </div>
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="space-y-6 mt-6">
                {/* Profile Photo */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div>
                    <Label className="text-sm font-medium">Profile Photo</Label>
                  </div>
                  <div>
                    <Input
                      type="file"
                      onChange={(e) => handleDocumentUpload("profilePhoto", e.target.files[0])}
                      className="border-gray-300 dark:border-gray-700"
                      accept="image/*"
                    />
                  </div>
                  <div>
                    {formData.profilePhoto && (
                      <div className="w-24 h-24 border border-gray-300 dark:border-gray-600 rounded flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                        <img
                          src={URL.createObjectURL(formData.profilePhoto)}
                          alt="Profile"
                          className="max-w-full max-h-full object-contain rounded"
                        />
                      </div>
                    )}
                    {!formData.profilePhoto && (
                      <div className="w-24 h-24 border border-gray-300 dark:border-gray-600 rounded flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                        <span className="text-xs text-gray-400">No Image</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Adhar Card No */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div>
                    <Label htmlFor="adharCardNo" className="text-sm font-medium">
                      Adhar Card No. (0000 0000 0000)
                    </Label>
                  </div>
                  <div className="md:col-span-2">
                    <Input
                      id="adharCardNo"
                      value={formData.adharCardNo}
                      onChange={(e) => handleInputChange("adharCardNo", e.target.value)}
                      className="border-gray-300 dark:border-gray-700"
                      placeholder="0000 0000 0000"
                      maxLength={14}
                    />
                  </div>
                </div>

                {/* Adhar Card Image */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div>
                    <Label className="text-sm font-medium">Adhar Card Image</Label>
                  </div>
                  <div>
                    <Input
                      type="file"
                      onChange={(e) => handleDocumentUpload("adharCardImage", e.target.files[0])}
                      className="border-gray-300 dark:border-gray-700"
                      accept="image/*,.pdf"
                    />
                  </div>
                  <div>
                    {formData.adharCardImage && (
                      <div className="w-24 h-24 border border-gray-300 dark:border-gray-600 rounded flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                        <img
                          src={URL.createObjectURL(formData.adharCardImage)}
                          alt="Adhar Card"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    )}
                    {!formData.adharCardImage && (
                      <div className="w-24 h-24 border border-gray-300 dark:border-gray-600 rounded flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                        <span className="text-xs text-gray-400">No Image</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pan Card No */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div>
                    <Label htmlFor="panCardNo" className="text-sm font-medium">
                      Pan Card No.
                    </Label>
                  </div>
                  <div className="md:col-span-2">
                    <Input
                      id="panCardNo"
                      value={formData.panCardNo}
                      onChange={(e) => handleInputChange("panCardNo", e.target.value)}
                      className="border-gray-300 dark:border-gray-700"
                      placeholder="Enter PAN card number"
                      maxLength={10}
                    />
                  </div>
                </div>

                {/* Pan Card Image */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div>
                    <Label className="text-sm font-medium">Pan Card Image</Label>
                  </div>
                  <div>
                    <Input
                      type="file"
                      onChange={(e) => handleDocumentUpload("panCardImage", e.target.files[0])}
                      className="border-gray-300 dark:border-gray-700"
                      accept="image/*,.pdf"
                    />
                  </div>
                  <div>
                    {formData.panCardImage && (
                      <div className="w-24 h-24 border border-gray-300 dark:border-gray-600 rounded flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                        <img
                          src={URL.createObjectURL(formData.panCardImage)}
                          alt="PAN Card"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    )}
                    {!formData.panCardImage && (
                      <div className="w-24 h-24 border border-gray-300 dark:border-gray-600 rounded flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                        <span className="text-xs text-gray-400">No Image</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Registration No */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div>
                    <Label htmlFor="registrationNo" className="text-sm font-medium">
                      Registration No.
                    </Label>
                  </div>
                  <div className="md:col-span-2">
                    <Input
                      id="registrationNo"
                      value={formData.registrationNo}
                      onChange={(e) => handleInputChange("registrationNo", e.target.value)}
                      className="border-gray-300 dark:border-gray-700"
                      placeholder="Enter registration number"
                    />
                  </div>
                </div>

                {/* Certificate Image */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div>
                    <Label className="text-sm font-medium">Certificate Image</Label>
                  </div>
                  <div>
                    <Input
                      type="file"
                      onChange={(e) => handleDocumentUpload("certificateImage", e.target.files[0])}
                      className="border-gray-300 dark:border-gray-700"
                      accept="image/*,.pdf"
                    />
                  </div>
                  <div>
                    {formData.certificateImage && (
                      <div className="w-24 h-24 border border-gray-300 dark:border-gray-600 rounded flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                        <img
                          src={URL.createObjectURL(formData.certificateImage)}
                          alt="Certificate"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    )}
                    {!formData.certificateImage && (
                      <div className="w-24 h-24 border border-gray-300 dark:border-gray-600 rounded flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                        <span className="text-xs text-gray-400">No Image</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Indemnity Policy No */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div>
                    <Label htmlFor="indemnityPolicyNo" className="text-sm font-medium">
                      Indemnity Policy No.
                    </Label>
                  </div>
                  <div className="md:col-span-2">
                    <Input
                      id="indemnityPolicyNo"
                      value={formData.indemnityPolicyNo}
                      onChange={(e) => handleInputChange("indemnityPolicyNo", e.target.value)}
                      className="border-gray-300 dark:border-gray-700"
                      placeholder="Enter indemnity policy number"
                    />
                  </div>
                </div>

                {/* Indemnity Policy No Image */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div>
                    <Label className="text-sm font-medium">Indemnity Policy No Image</Label>
                  </div>
                  <div>
                    <Input
                      type="file"
                      onChange={(e) => handleDocumentUpload("indemnityPolicyImage", e.target.files[0])}
                      className="border-gray-300 dark:border-gray-700"
                      accept="image/*,.pdf"
                    />
                  </div>
                  <div>
                    {formData.indemnityPolicyImage && (
                      <div className="w-24 h-24 border border-gray-300 dark:border-gray-600 rounded flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                        <img
                          src={URL.createObjectURL(formData.indemnityPolicyImage)}
                          alt="Indemnity Policy"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    )}
                    {!formData.indemnityPolicyImage && (
                      <div className="w-24 h-24 border border-gray-300 dark:border-gray-600 rounded flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                        <span className="text-xs text-gray-400">No Image</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit and Cancel Buttons */}
                <div className="flex justify-center gap-4 pt-6">
                  <Button
                    onClick={handleFormSubmit}
                    disabled={upsertMutation.isPending}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {upsertMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </Button>
                  <Button
                    onClick={() => setShowAddForm(false)}
                    disabled={upsertMutation.isPending}
                    variant="outline"
                    className="bg-[#0f7396] hover:bg-[#0f7396] text-white border-[#0f7396] px-8 disabled:opacity-50"
                  >
                    Cancel
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Search Filters - Hidden when form is open */}
      {!showAddForm && (
        <Card className="border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <Input
                placeholder="Doctor Name"
                value={filters.doctorName}
                onChange={(e) => handleFilterChange("doctorName", e.target.value)}
                className="border-gray-300 dark:border-gray-700"
              />
              <Input
                placeholder="Mobile No."
                value={filters.mobileNo}
                onChange={(e) => handleFilterChange("mobileNo", e.target.value)}
                className="border-gray-300 dark:border-gray-700"
              />
              <Input
                placeholder="Doctor ID"
                value={filters.doctorID}
                onChange={(e) => handleFilterChange("doctorID", e.target.value)}
                className="border-gray-300 dark:border-gray-700"
              />
              <Select
                value={filters.panel}
                onValueChange={(value) => handleFilterChange("panel", value)}
              >
                <SelectTrigger className="border-gray-300 dark:border-gray-700">
                  <SelectValue placeholder="Panvel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Panels</SelectItem>
                  <SelectItem value="panvel">Panvel</SelectItem>
                  <SelectItem value="pune">Pune</SelectItem>
                  <SelectItem value="mumbai">Mumbai</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleSearch}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                Search
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons - Hidden when form is open */}
      {!showAddForm && (
        <div className="flex items-center justify-end gap-3">
          {/* <Button
            onClick={handleExcelUpload}
            variant="outline"
            className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
          >
            Excel Upload
          </Button> */}
          <Button
             onClick={() => refetch()}
             variant="outline"
             className="bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300"
          >
            <Loader2 className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={handleAddNew}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Add New
          </Button>
        </div>
      )}

      {/* Error Message - Hidden when form is open */}
      {!showAddForm && error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 dark:border-red-700 rounded-lg p-6 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-red-600 dark:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-800 dark:text-[#0f7396] mb-1">Error Loading Doctors</h3>
              <p className="text-red-700 dark:text-red-300">{error.message}</p>
              <button
                onClick={() => refetch()}
                className="mt-3 px-4 py-2 bg-[#0f7396] hover:bg-[#0f7396] text-white rounded-md text-sm font-medium transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Doctors Table - Hidden when form is open */}
      {!showAddForm && (
        <Card className="border-gray-200 dark:border-gray-800">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Loading doctors...</p>
                  </div>
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-green-100 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/20">
                        <TableHead className="font-semibold text-gray-900 dark:text-gray-100">
                          Sr. No.
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900 dark:text-gray-100">
                          Doctor ID
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900 dark:text-gray-100">
                          Photo
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900 dark:text-gray-100">
                          Name
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900 dark:text-gray-100">
                          Mobile No.
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900 dark:text-gray-100">
                          Email ID
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900 dark:text-gray-100">
                          Reg Date
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900 dark:text-gray-100 text-center">
                          Actions *
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedDoctors.length > 0 ? (
                        paginatedDoctors.map((doctor, index) => (
                          <TableRow
                            key={index}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                          >
                            <TableCell className="text-gray-900 dark:text-gray-100">
                              {(currentPage - 1) * itemsPerPage + index + 1}
                            </TableCell>
                            <TableCell className="text-gray-900 dark:text-gray-100">
                              {doctor.doctorID}
                            </TableCell>
                            <TableCell>
                              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center overflow-hidden">
                                {doctor.photo && doctor.photo !== "/placeholder-doctor.png" ? (
                                  <img
                                    src={doctor.photo}
                                    alt={doctor.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    No Image
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-900 dark:text-gray-100">
                              {doctor.name}
                            </TableCell>
                            <TableCell className="text-gray-900 dark:text-gray-100">
                              {doctor.mobileNo}
                            </TableCell>
                            <TableCell className="text-gray-900 dark:text-gray-100">
                              {doctor.emailId}
                            </TableCell>
                            <TableCell className="text-gray-900 dark:text-gray-100">
                              {doctor.regDate}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                  onClick={() => handleEdit(doctor)}
                                >
                                  <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                </button>
                                <button
                                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                >
                                  <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                </button>
                                <button
                                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                >
                                  <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                </button>
                                <button
                                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                  onClick={() => handleDelete(doctor)}
                                  disabled={deleteMutation.isPending}
                                  title="Delete Doctor"
                                >
                                  {deleteMutation.isPending ? (
                                    <Loader2 className="w-4 h-4 text-red-400 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-4 h-4 text-gray-600 dark:text-red-400 hover:text-red-600" />
                                  )}
                                </button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                            No doctors found matching your Search criteria.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                  <div className="px-4 border-t border-gray-200 dark:border-gray-800">
                    <CustomPagination
                      totalItems={filteredDoctors.length}
                      itemsPerPage={itemsPerPage}
                      currentPage={currentPage}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                </>
              )}
          </div>
        </CardContent>
      </Card>
      )}

      {/* Excel Download Icon
      <div className="flex items-start">
        <div className="w-12 h-12 bg-green-600 rounded flex items-center justify-center cursor-pointer hover:bg-green-700 transition-colors">
          <svg
            className="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M12.9,14.5L15.8,19H14L12,15.6L10,19H8.2L11.1,14.5L8.2,10H10L12,13.4L14,10H15.8L12.9,14.5Z" />
          </svg>
        </div>
      </div> */}
    </div>
  );
}
