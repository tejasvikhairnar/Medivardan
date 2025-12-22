"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export default function PaymentCollectionPage() {
  const [date, setDate] = useState(new Date());

  // Mock data for dropdowns
  const clinics = ["Vardaan Clinic", "City Care", "Health Plus"];
  const doctors = ["Dr. Sharma", "Dr. Gupta", "Dr. Lee"];
  const paymentModes = ["Cash", "Card", "UPI", "Net Banking"];

  // State for form fields
  const [formData, setFormData] = useState({
    patientName: "",
    clinicName: "",
    doctorName: "",
    paidAmount: "",
    isMembership: false,
    totalCost: "",
    totalDiscount: "",
    totalTax: "",
    grandTotal: "",
    paymentType: "finance", // finance | cheque | other
    isCreditNote: false,
    payAmount: "",
    pendingAmount: "",
    paymentMode: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", { ...formData, paymentDate: date });
    // Add submission logic here
  };

  return (
    <div className="w-full p-4 space-y-6 min-h-screen bg-white dark:bg-gray-950">
      <h1 className="text-xl font-bold text-red-500 uppercase tracking-wide border-b border-gray-200 pb-2">
        PAYMENT COLLECTION
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
        {/* Row 1: Patient Name, Clinic, Doctor, Payment Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <Label htmlFor="patientName" className="font-semibold text-gray-700">
              Patient Name
            </Label>
            <Input
              id="patientName"
              name="patientName"
              placeholder="Enter Patient Name"
              value={formData.patientName}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clinicName" className="font-semibold text-gray-700">
              Clinic Name
            </Label>
            <Select
              onValueChange={(val) => handleSelectChange("clinicName", val)}
              value={formData.clinicName}
            >
              <SelectTrigger id="clinicName">
                <SelectValue placeholder="Select Clinic" />
              </SelectTrigger>
              <SelectContent>
                {clinics.map((clinic) => (
                  <SelectItem key={clinic} value={clinic}>
                    {clinic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="doctorName" className="font-semibold text-gray-700">
              Doctor Name
            </Label>
            <Select
              onValueChange={(val) => handleSelectChange("doctorName", val)}
              value={formData.doctorName}
            >
              <SelectTrigger id="doctorName">
                <SelectValue placeholder="Select Doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doc) => (
                  <SelectItem key={doc} value={doc}>
                    {doc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 flex flex-col pt-1">
             <Label className="font-semibold text-gray-700 mb-1">Payment Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Row 2: Paid Amount, Membership Checkbox */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
            <div className="space-y-2">
                <Label htmlFor="paidAmount" className="font-semibold text-gray-700">
                Paid Amount
                </Label>
                <Input
                id="paidAmount"
                name="paidAmount"
                type="number"
                placeholder="Enter Amount"
                value={formData.paidAmount}
                onChange={handleInputChange}
                />
            </div>

            <div className="flex items-center space-x-2 pt-6">
                <Checkbox
                id="isMembership"
                checked={formData.isMembership}
                onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, isMembership: checked }))
                }
                />
                <Label htmlFor="isMembership" className="font-semibold text-gray-700 cursor-pointer">
                Membership
                </Label>
            </div>
        </div>

        {/* Row 3: Totals Section (Cost, Discount, Tax, Grand Total) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-md border border-gray-100 dark:border-gray-800">
          <div className="space-y-2">
            <Label htmlFor="totalCost" className="font-semibold text-gray-700 dark:text-gray-300">
              Total Cost
            </Label>
            <Input
              id="totalCost"
              name="totalCost"
              type="number"
              placeholder="0.00"
              value={formData.totalCost}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalDiscount" className="font-semibold text-gray-700 dark:text-gray-300">
              Total Discount
            </Label>
            <Input
              id="totalDiscount"
              name="totalDiscount"
              type="number"
              placeholder="0.00"
              value={formData.totalDiscount}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalTax" className="font-semibold text-gray-700 dark:text-gray-300">
              Total Tax
            </Label>
            <Input
              id="totalTax"
              name="totalTax"
              type="number"
              placeholder="0.00"
              value={formData.totalTax}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="grandTotal" className="font-bold text-gray-900 dark:text-white">
              Grand Total
            </Label>
            <Input
              id="grandTotal"
              name="grandTotal"
              type="number"
              placeholder="0.00"
              className="font-bold border-gray-400 dark:border-gray-600 dark:bg-gray-950 dark:text-white"
              value={formData.grandTotal}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Row 4: Payment Type Radio Buttons & Credit Note */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="col-span-1 md:col-span-2 space-y-2">
                <Label className="font-semibold text-gray-700">Payment Type</Label>
                <RadioGroup
                    defaultValue="finance"
                    onValueChange={(val) => handleSelectChange("paymentType", val)}
                    className="flex space-x-6 mt-1"
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="finance" id="pt-finance" />
                        <Label htmlFor="pt-finance" className="cursor-pointer">Finance</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cheque" id="pt-cheque" />
                        <Label htmlFor="pt-cheque" className="cursor-pointer">Cheque</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="pt-other" />
                        <Label htmlFor="pt-other" className="cursor-pointer">Other</Label>
                    </div>
                </RadioGroup>
            </div>

             <div className="flex items-center space-x-2 pt-8">
                <Checkbox
                id="isCreditNote"
                checked={formData.isCreditNote}
                onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, isCreditNote: checked }))
                }
                />
                <Label htmlFor="isCreditNote" className="font-semibold text-gray-700 cursor-pointer">
                Credit Note
                </Label>
            </div>
        </div>

        {/* Row 5: Pay Amount, Pending Amount, Payment Mode */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
                <Label htmlFor="payAmount" className="font-semibold text-gray-700">
                Pay Amount
                </Label>
                <Input
                id="payAmount"
                name="payAmount"
                type="number"
                placeholder="0.00"
                value={formData.payAmount}
                onChange={handleInputChange}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="pendingAmount" className="font-semibold text-gray-700">
                Pending Amount
                </Label>
                <Input
                id="pendingAmount"
                name="pendingAmount"
                type="number"
                placeholder="0.00"
                value={formData.pendingAmount}
                onChange={handleInputChange}
                readOnly
                className="bg-gray-50 text-gray-500"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="paymentMode" className="font-semibold text-gray-700">
                Payment Mode
                </Label>
                <Select
                onValueChange={(val) => handleSelectChange("paymentMode", val)}
                value={formData.paymentMode}
                >
                <SelectTrigger id="paymentMode">
                    <SelectValue placeholder="Select Mode" />
                </SelectTrigger>
                <SelectContent>
                    {paymentModes.map((mode) => (
                    <SelectItem key={mode} value={mode}>
                        {mode}
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-center gap-4 pt-6">
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white min-w-[120px]"
          >
            Submit
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="min-w-[120px]"
            onClick={() => console.log("Cancelled")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
