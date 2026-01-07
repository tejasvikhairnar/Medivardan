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
import { Settings, FileX } from "lucide-react"; 

// Hooks
import { useDoctors } from "@/hooks/useDoctors";
import { useSaveCancellationTreatment } from "@/hooks/useAccounts";
import { toast } from "sonner";

export default function CancellationTreatmentPage() {
  const { data: doctors = [] } = useDoctors();
  const { mutate: saveCancellation, isPending } = useSaveCancellationTreatment();

  const [formData, setFormData] = useState({
    patientName: "",
    clinicName: "",
    doctorName: "",
    cancellationDate: new Date().toISOString().split("T")[0],
    reason: "",
    refundAmount: "0",
    creditNoteAmount: "0",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.patientName || !formData.clinicName) {
        toast.error("Please fill in all required fields.");
        return;
    }
    saveCancellation(formData);
  };

  return (
    <div className="w-full p-6 space-y-6 min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 pb-2 border-b border-gray-200 dark:border-gray-800">
         <Settings className="w-5 h-5 text-[#0f7396] animate-spin-slow" />
        <h1 className="text-xl font-bold text-[#0f7396] uppercase tracking-wide">
          CANCELLATION TREATMENT
        </h1>
      </div>

      {/* Form Content */}
      <Card className="border border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900">
        <CardContent className="p-6 space-y-8">
          
          {/* Row 1: Patient, Clinic, Doctor, Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Patient Name</Label>
              <Input
                className="h-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                placeholder="Enter Patient Name"
                value={formData.patientName}
                onChange={(e) => handleInputChange("patientName", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Clinic Name</Label>
              <Select
                value={formData.clinicName}
                onValueChange={(val) => handleInputChange("clinicName", val)}
              >
                <SelectTrigger className="h-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                  <SelectValue placeholder="Select Clinic" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="panvel">Panvel</SelectItem>
                <SelectItem value="pune">Pune</SelectItem>
                <SelectItem value="mumbai">Mumbai</SelectItem>
                <SelectItem value="nashik">Nashik</SelectItem>
                <SelectItem value="dwarka">Dwarka</SelectItem>
                <SelectItem value="borivali">Borivali</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Doctor Name</Label>
               <Select
                value={formData.doctorName}
                onValueChange={(val) => handleInputChange("doctorName", val)}
              >
                <SelectTrigger className="h-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                  <SelectValue placeholder="Select Doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doc) => (
                    <SelectItem key={doc.doctorID} value={doc.name}>
                      {doc.name}
                    </SelectItem>
                  ))}
                  {!doctors.length && <SelectItem value="dr-smith">Dr. Smith (Mock)</SelectItem>}
                </SelectContent>
              </Select>
            </div>

             <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Cancellation Date</Label>
              <Input
                type="date"
                className="h-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                value={formData.cancellationDate}
                onChange={(e) => handleInputChange("cancellationDate", e.target.value)}
              />
            </div>
          </div>

          {/* Row 2: Totals Display - Teal Theme */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             <div className="space-y-2">
               <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Cost</Label>
               <div className="h-10 flex items-center px-3 bg-[#E8F8F5] dark:bg-teal-900/30 border border-teal-100 dark:border-teal-800 rounded-md text-sm font-semibold text-teal-800 dark:text-teal-400">
                  ₹ 0.00
               </div>
             </div>
             <div className="space-y-2">
               <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Discount</Label>
               <div className="h-10 flex items-center px-3 bg-[#E8F8F5] dark:bg-teal-900/30 border border-teal-100 dark:border-teal-800 rounded-md text-sm font-semibold text-teal-800 dark:text-teal-400">
                  ₹ 0.00
               </div>
             </div>
             <div className="space-y-2">
               <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Tax</Label>
               <div className="h-10 flex items-center px-3 bg-[#E8F8F5] dark:bg-teal-900/30 border border-teal-100 dark:border-teal-800 rounded-md text-sm font-semibold text-teal-800 dark:text-teal-400">
                  ₹ 0.00
               </div>
             </div>
             <div className="space-y-2">
               <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Grand Total</Label>
               <div className="h-10 flex items-center px-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-md text-sm font-bold text-red-600 dark:text-red-400">
                  ₹ 0.00
               </div>
             </div>
          </div>

           {/* Row 3: Paid/Pending Display */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             <div className="space-y-2">
               <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Paid Amount</Label>
               <div className="h-10 flex items-center px-3 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-md text-sm font-bold text-green-600 dark:text-green-400">
                  ₹ 0.00
               </div>
             </div>
             <div className="space-y-2">
               <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Pending Amount</Label>
               <div className="h-10 flex items-center px-3 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 rounded-md text-sm font-bold text-orange-600 dark:text-orange-400">
                  ₹ 0.00
               </div>
             </div>
          </div>

          {/* Row 4: Reason */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Reason for Cancellation</Label>
            <Textarea 
                className="min-h-[100px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 resize-none focus-visible:ring-1 focus-visible:ring-red-500"
                placeholder="Please describe the reason for cancellation..."
                value={formData.reason}
                onChange={(e) => handleInputChange("reason", e.target.value)}
            />
          </div>

          {/* Row 5: Refund / Credit Note */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
             <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Refund Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                <Input
                    type="number"
                    className="h-10 pl-7 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                    value={formData.refundAmount}
                    onChange={(e) => handleInputChange("refundAmount", e.target.value)}
                />
              </div>
            </div>
             <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Credit Note Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                <Input
                    type="number"
                    className="h-10 pl-7 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                    value={formData.creditNoteAmount}
                    onChange={(e) => handleInputChange("creditNoteAmount", e.target.value)}
                />
              </div>
            </div>
          </div>

        </CardContent>
      </Card>
      
       {/* Submit Button */}
       <div className="flex justify-center">
            <Button 
                onClick={handleSubmit} 
                className="bg-[#D35400] hover:bg-[#A04000] text-white font-bold py-2 px-8 shadow-md"
            >
                Submit Cancellation
            </Button>
       </div>
    </div>
  );
}
