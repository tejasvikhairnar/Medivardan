"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export default function TreatmentUpdates() {
  const [patient, setPatient] = useState("");
  const [treatment, setTreatment] = useState("");
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState("");

  const patients = ["John Doe", "Jane Smith", "Alex Johnson"];
  const ongoingTreatments = ["Root Canal", "Crown Fixing", "Teeth Cleaning"];
  const dateOfProcedure = "2025-11-10";

  const handleUpdate = () => {
    const data = { patient, treatment, dateOfProcedure, details, status };
    // TODO: Replace with proper toast notification
    // Treatment update submitted successfully
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 flex items-start justify-center">
      <div className="w-full max-w-4xl mt-8">
        <Card className="w-full shadow-md border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
          <CardHeader className="bg-medivardaan-blue p-6">
            <h2 className="text-2xl font-semibold text-white text-center">
              Treatment Updates
            </h2>
          </CardHeader>

          <CardContent className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Patient Selection */}
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Patient</Label>
                <Select onValueChange={setPatient}>
                  <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-medivardaan-teal-light focus:border-medivardaan-teal-light w-full">
                    <SelectValue placeholder="Select Patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((p, idx) => (
                      <SelectItem key={idx} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Ongoing Treatment Selection */}
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Ongoing Treatment</Label>
                <Select onValueChange={setTreatment}>
                  <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-medivardaan-teal-light focus:border-medivardaan-teal-light w-full">
                    <SelectValue placeholder="Select Treatment" />
                  </SelectTrigger>
                  <SelectContent>
                    {ongoingTreatments.map((t, idx) => (
                      <SelectItem key={idx} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date of Procedure */}
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Date of Procedure</Label>
              <Input
                type="text"
                value={dateOfProcedure}
                disabled
                className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 rounded-md w-full cursor-not-allowed"
              />
            </div>

            {/* Details */}
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Details</Label>
              <Textarea
                placeholder="Enter procedure details..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-medivardaan-teal-light focus:border-medivardaan-teal-light min-h-[120px] w-full text-gray-700 dark:text-gray-300"
              />
            </div>

            {/* Status */}
            <div className="w-full md:w-1/2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Status</Label>
              <Select onValueChange={setStatus}>
                <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-medivardaan-teal-light focus:border-medivardaan-teal-light w-full">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Hold">Hold</SelectItem>
                  <SelectItem value="Ongoing">Ongoing</SelectItem>
                  <SelectItem value="Given to Lab">Given to Lab</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Update Button */}
            <div className="pt-6 flex justify-center">
              <Button
                onClick={handleUpdate}
                className="px-12 py-3 text-base font-medium rounded-md bg-medivardaan-teal-light hover:bg-[#3a9d92] text-white shadow-md hover:shadow-lg transition-all duration-200 w-full md:w-auto"
              >
                Update Treatment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
