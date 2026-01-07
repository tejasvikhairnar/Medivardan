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

export default function Treatments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'create'
  const [editingId, setEditingId] = useState(null);

  // Form State
  const initialFormState = {
    treatmentName: "",
    cost: "",
    group: ""
  };
  const [formData, setFormData] = useState(initialFormState);

  // Mock data for Treatments
  const [treatments, setTreatments] = useState([
    { id: 1, treatmentName: "ABUTMENT", cost: "12000", group: "Implant" },
    { id: 2, treatmentName: "ALIGNER - EXCLUSIVE", cost: "75000", group: "Aligner" },
    { id: 3, treatmentName: "ALIGNER - EXCLUSIVE", cost: "75000", group: "Aligner" },
    { id: 4, treatmentName: "ALIGNER ATTACHMENT", cost: "500", group: "Aligner" },
    { id: 5, treatmentName: "ALIGNER-CLASSIC", cost: "35000", group: "Aligner" },
    { id: 6, treatmentName: "ALIGNER-CLASSIC", cost: "35000", group: "Aligner" },
    { id: 7, treatmentName: "ALIGNER-CLASSIC BOTH ARCHES", cost: "50000", group: "Aligner" },
    { id: 8, treatmentName: "ALIGNER-PREMIUM", cost: "100000", group: "Aligner" },
    { id: 9, treatmentName: "ALIGNER-PREMIUM", cost: "100000", group: "Aligner" },
    { id: 10, treatmentName: "ALVEOPLASTY - DOUBLE ARCH", cost: "20000", group: "General" }
  ]);

  const filteredData = treatments.filter(item => 
      item.treatmentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
      if(confirm("Are you sure you want to delete this treatment?")) {
          setTreatments(treatments.filter(t => t.id !== id));
      }
  };

  const handleEdit = (treatment) => {
      setFormData({
          treatmentName: treatment.treatmentName,
          cost: treatment.cost,
          group: treatment.group || "General" // Defaulting if missing
      });
      setEditingId(treatment.id);
      setViewMode("create");
  };

  const handleAddNew = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setViewMode("create");
  };

  const handleSubmit = (e) => {
      e.preventDefault();
      if (editingId) {
          setTreatments(treatments.map(t => t.id === editingId ? {
              ...t,
              treatmentName: formData.treatmentName,
              cost: formData.cost,
              group: formData.group
          } : t));
          alert("Treatment Updated Successfully!");
      } else {
          const newId = Math.max(...treatments.map(t => t.id), 0) + 1;
          const newTreatment = {
              id: newId,
              treatmentName: formData.treatmentName,
              cost: formData.cost,
              group: formData.group
          };
          setTreatments([...treatments, newTreatment]);
          alert("Treatment Created Successfully!");
      }
      setViewMode("list");
  };

  if (viewMode === "create") {
      return (
        <div className="p-6 bg-white dark:bg-gray-900 min-h-screen space-y-6">
             <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-4">
                <Settings className="w-5 h-5 text-[#0f7396]" />
                <h1 className="text-lg font-bold text-[#0f7396] uppercase tracking-wide">TREATMENT</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                         <label className="text-sm text-gray-600 dark:text-gray-400">Treatment Name <span className="text-red-500">*</span></label>
                         <Input required value={formData.treatmentName} onChange={e => setFormData({...formData, treatmentName: e.target.value})} />
                     </div>
                     <div className="space-y-2">
                         <label className="text-sm text-gray-600 dark:text-gray-400">Treatment Cost</label>
                         <Input value={formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})} />
                     </div>
                     <div className="space-y-2">
                         <label className="text-sm text-gray-600 dark:text-gray-400">Treatment Group</label>
                         <select 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.group}
                            onChange={e => setFormData({...formData, group: e.target.value})}
                         >
                             <option value="">-- Select Group Name --</option>
                             <option value="General">General</option>
                             <option value="Implant">Implant</option>
                             <option value="Damon">Damon</option>
                             <option value="Braces">Braces</option>
                             <option value="Aligner">Aligner</option>
                         </select>
                     </div>
                </div>

                <div className="flex gap-4">
                     <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6">Submit</Button>
                     <Button type="button" className="bg-[#0f7396] hover:bg-[#0f7396] text-white px-6" onClick={() => setViewMode("list")}>Cancel</Button>
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
          TREATMENT
        </h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div className="flex-1 w-full md:max-w-xl flex gap-2 items-center">
            <Input
                placeholder="Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 flex-1"
            />
             <Button className="bg-[#D35400] hover:bg-[#A04000] text-white px-6 font-medium shadow-sm transition-all whitespace-nowrap">
                Search
            </Button>
            <Button 
                onClick={handleAddNew}
                className="bg-[#1E6B8C] hover:bg-[#15526d] text-white px-6 font-medium shadow-sm transition-all whitespace-nowrap"
            >
                Add New
            </Button>
        </div>
        
         <div className="text-sm text-gray-500">
            Total : {filteredData.length}
        </div>
      </div>

      {/* Table */}
       <div className="border border-gray-200 dark:border-gray-700 rounded-t-lg overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader className="bg-[#E8F8F5] dark:bg-gray-800">
            <TableRow className="hover:bg-[#E8F8F5] dark:hover:bg-gray-700/50 border-gray-200 dark:border-gray-700">
              <TableHead className="font-bold text-gray-700 dark:text-gray-300 w-[60px]">Sr. No.</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-300">Treatment Name</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-300">Cost</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-300 w-[100px] text-center"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((row, index) => (
              <TableRow key={row.id} className="border-gray-200 dark:border-gray-700 dark:hover:bg-gray-800/50">
                <TableCell className="dark:text-gray-300">{index + 1}</TableCell>
                <TableCell className="dark:text-gray-300">{row.treatmentName}</TableCell>
                <TableCell className="dark:text-gray-300">{row.cost}</TableCell>
                <TableCell className="dark:text-gray-300">
                    <div className="flex items-center justify-center gap-4">
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
                <TableCell colSpan={4} className="text-center h-24 text-gray-500">
                  No treatments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

        {/* Footer / Pagination */}
       <div className="flex justify-end items-center pt-2">
          <div className="flex gap-2 text-sm text-blue-600 dark:text-blue-400">
             <span className="cursor-pointer hover:underline p-1">12345678910... &gt;&gt;</span>
          </div>
        </div>
    </div>
  );
}
