"use client";

import React, { useState } from "react";
import { Settings, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { validateCost, validateRequired, hasErrors } from "@/lib/validations";

export default function Medicines() {
  const [searchTerm, setSearchTerm] = useState("");
  const [materialFilter, setMaterialFilter] = useState("");
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'create'
  const [editingId, setEditingId] = useState(null);

  // Form State
  const initialFormState = {
    medicinesType: "",
    medicineName: "",
    unit: "",
    price: "",
    companyName: ""
  };
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  // Mock data
  const [medicines, setMedicines] = useState([
    { id: 1, type: "Tablet", name: "Parafenac plus", unit: "In Use", price: "65.00", company: "signature" },
    { id: 2, type: "Tablet", name: "Framox 625", unit: "In Use", price: "123.00", company: "Fredun" },
    { id: 3, type: "Tablet", name: "Ketorotide - 10DT", unit: "In Use", price: "178.00", company: "Dr. morepen" },
    { id: 4, type: "Tablet", name: "Neurovil", unit: "In Use", price: "270.00", company: "Antex" },
    { id: 5, type: "GEL", name: "Dente 91", unit: "In Use", price: "1500.00", company: "Dente 91" },
    { id: 6, type: "Tablet", name: "Dentoflam SP", unit: "In Use", price: "135.00", company: "pharmadent remedies" },
    { id: 7, type: "DENTAL FLOSS", name: "Interdental Brush", unit: "In Use", price: "200.00", company: "Orthosquare" },
    { id: 8, type: "DENTAL FLOSS", name: "dental floss waxed &mint", unit: "In Use", price: "200.00", company: "Orthosquare" },
    { id: 9, type: "TOOTHBRUSH", name: "kids brush", unit: "In Use", price: "100.00", company: "Orthosquare" },
    { id: 10, type: "TOOTHBRUSH", name: "Orthodontic brush", unit: "In Use", price: "110.00", company: "Orthosquare" }
  ]);

  const filteredMedicines = medicines.filter(m => {
      const matchName = m.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = materialFilter ? m.type === materialFilter : true;
      return matchName && matchType;
  });

  const handleDelete = (id) => {
      if(confirm("Are you sure you want to delete this medicine?")) {
          setMedicines(medicines.filter(m => m.id !== id));
      }
  };

  const handleEdit = (medicine) => {
      setFormData({
          medicinesType: medicine.type,
          medicineName: medicine.name,
          unit: medicine.unit,
          price: medicine.price,
          companyName: medicine.company
      });
      setErrors({});
      setEditingId(medicine.id);
      setViewMode("create");
  };

  const handleAddNew = () => {
    setFormData(initialFormState);
    setErrors({});
    setEditingId(null);
    setViewMode("create");
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setFormData({...formData, price: value});
      const result = validateCost(value);
      setErrors(prev => ({...prev, price: result.error}));
    }
  };

  const handleSubmit = (e) => {
      e.preventDefault();

      // Validate all fields
      const newErrors = {};

      const typeResult = validateRequired(formData.medicinesType, "Medicine Type");
      if (!typeResult.isValid) newErrors.medicinesType = typeResult.error;

      const nameResult = validateRequired(formData.medicineName, "Medicine Name");
      if (!nameResult.isValid) newErrors.medicineName = nameResult.error;

      const unitResult = validateRequired(formData.unit, "Unit");
      if (!unitResult.isValid) newErrors.unit = unitResult.error;

      const priceResult = validateCost(formData.price);
      if (!priceResult.isValid) newErrors.price = priceResult.error;

      setErrors(newErrors);

      if (hasErrors(newErrors)) {
          return;
      }

      if (editingId) {
          setMedicines(medicines.map(m => m.id === editingId ? {
              ...m,
              type: formData.medicinesType,
              name: formData.medicineName,
              unit: formData.unit,
              price: formData.price,
              company: formData.companyName
          } : m));
          alert("Medicine Updated Successfully!");
      } else {
          const newId = Math.max(...medicines.map(m => m.id), 0) + 1;
          const newMedicine = {
              id: newId,
              type: formData.medicinesType,
              name: formData.medicineName,
              unit: formData.unit,
              price: formData.price,
              company: formData.companyName
          };
          setMedicines([...medicines, newMedicine]);
          alert("Medicine Created Successfully!");
      }
      setViewMode("list");
  };

  if (viewMode === "create") {
      return (
        <div className="p-6 bg-white dark:bg-gray-900 min-h-screen space-y-6">
             <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-4">
                <Settings className="w-5 h-5 text-[#0f7396]" />
                <h1 className="text-lg font-bold text-[#0f7396] uppercase tracking-wide">MEDICINES</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                         <Select required value={formData.medicinesType} onValueChange={(val) => setFormData({...formData, medicinesType: val})}>
                                <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                                <SelectValue placeholder="--- Select Material Type---" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Tablet">Tablet</SelectItem>
                                    <SelectItem value="GEL">GEL</SelectItem>
                                    <SelectItem value="DENTAL FLOSS">DENTAL FLOSS</SelectItem>
                                    <SelectItem value="TOOTHBRUSH">TOOTHBRUSH</SelectItem>
                                </SelectContent>
                         </Select>
                         
                          <Select required value={formData.unit} onValueChange={(val) => setFormData({...formData, unit: val})}>
                                <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                                <SelectValue placeholder="--- Select Unit---" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="In Use">In Use</SelectItem>
                                    <SelectItem value="Box">Box</SelectItem>
                                    <SelectItem value="Strip">Strip</SelectItem>
                                    <SelectItem value="Bottle">Bottle</SelectItem>
                                </SelectContent>
                         </Select>

                         <Input 
                            placeholder="Company Name" 
                            value={formData.companyName} 
                            onChange={e => setFormData({...formData, companyName: e.target.value})} 
                         />
                    </div>
                    <div className="space-y-4">
                        <Input 
                            placeholder="Medicine Name" 
                            required
                            value={formData.medicineName} 
                            onChange={e => setFormData({...formData, medicineName: e.target.value})} 
                         />
                         <Input 
                            placeholder="Price" 
                            value={formData.price} 
                            onChange={e => setFormData({...formData, price: e.target.value})} 
                         />
                    </div>
                </div>

                <div className="flex justify-center gap-4">
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
          MEDICINES
        </h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex-1 w-full flex gap-2 items-center flex-wrap">
             <Input
                placeholder="Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 max-w-xs"
            />
            <Select value={materialFilter} onValueChange={setMaterialFilter}>
                <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 max-w-xs">
                <SelectValue placeholder="--- Select Material Type---" />
                </SelectTrigger>
                <SelectContent>
                 <SelectItem value="Tablet">Tablet</SelectItem>
                 <SelectItem value="GEL">GEL</SelectItem>
                 <SelectItem value="DENTAL FLOSS">DENTAL FLOSS</SelectItem>
                 <SelectItem value="TOOTHBRUSH">TOOTHBRUSH</SelectItem>
                </SelectContent>
            </Select>
             <Button className="bg-[#0f7396] hover:bg-[#0b5c7a] text-white px-6 font-medium shadow-sm transition-all whitespace-nowrap">
                Search
            </Button>
             <Button 
                onClick={() => {setSearchTerm(""); setMaterialFilter("");}}
                className="bg-[#0f7396] hover:bg-[#0b5c7a] text-white px-6 font-medium shadow-sm transition-all whitespace-nowrap">
                Clear
            </Button>
              <Button 
                onClick={handleAddNew}
                className="bg-[#0f7396] hover:bg-[#0b5c7a] text-white px-6 font-medium shadow-sm transition-all whitespace-nowrap">
                Add New Medicines
            </Button>
        </div>
      </div>

      {/* Table */}
       <div className="border border-gray-200 dark:border-gray-700 rounded-t-lg overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader className="bg-[#0f7396]/10 dark:bg-gray-800">
            <TableRow className="hover:bg-[#0f7396]/10 dark:hover:bg-gray-700/50 border-gray-200 dark:border-gray-700">
              <TableHead className="font-bold text-gray-700 dark:text-gray-300 w-[60px]">Sr. No.</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-300">Medicines Type</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-300">Medicine Name</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-300">Unit</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-300">Price</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-300">Company</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-300 w-[100px] text-center"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMedicines.map((row, index) => (
              <TableRow key={row.id} className="border-gray-200 dark:border-gray-700 dark:hover:bg-gray-800/50">
                <TableCell className="dark:text-gray-300">{index + 1}</TableCell>
                <TableCell className="dark:text-gray-300">{row.type}</TableCell>
                <TableCell className="dark:text-gray-300">{row.name}</TableCell>
                <TableCell className="dark:text-gray-300">{row.unit}</TableCell>
                <TableCell className="dark:text-gray-300">{row.price}</TableCell>
                <TableCell className="dark:text-gray-300">{row.company}</TableCell>
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
             {filteredMedicines.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24 text-gray-500">
                  No medicines found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

        {/* Footer / Pagination */}
       <div className="flex justify-end items-center pt-2">
          {/* Pagination */}
        </div>
    </div>
  );
}
