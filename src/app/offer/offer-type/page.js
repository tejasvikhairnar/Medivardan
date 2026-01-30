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

export default function OfferType() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [offerTypeName, setOfferTypeName] = useState("");

  // Mock data for Offer Type
  const [offerTypes, setOfferTypes] = useState([
    { id: 1, vendorType: "Treatment Offer" },
    { id: 2, vendorType: "Default Offer" }
  ]);

  // Search Logic
  const filteredData = offerTypes.filter(item => 
    item.vendorType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handlers
  const handleAddNew = () => {
      setEditingItem(null);
      setOfferTypeName("");
      setIsDialogOpen(true);
  };

  const handleEdit = (item) => {
      setEditingItem(item);
      setOfferTypeName(item.vendorType);
      setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
      if(confirm("Are you sure you want to delete?")) {
          setOfferTypes(offerTypes.filter(item => item.id !== id));
      }
  };

  const handleSubmit = (e) => {
      e.preventDefault();
      if(editingItem) {
          // Update
          setOfferTypes(offerTypes.map(item => 
              item.id === editingItem.id ? { ...item, vendorType: offerTypeName } : item
          ));
      } else {
          // Add
          const newId = Math.max(...offerTypes.map(i => i.id), 0) + 1;
          setOfferTypes([...offerTypes, { id: newId, vendorType: offerTypeName }]);
      }
      setIsDialogOpen(false);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-4">
        <Settings className="w-5 h-5 text-primary" />
        <h1 className="text-lg font-bold text-primary uppercase tracking-wide">
          OFFER TYPE
        </h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div className="flex-1 w-full md:max-w-xl flex gap-2 items-center">
            <Input
                placeholder="Offer Type"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 flex-1"
            />
             <Button className="bg-primary hover:bg-primary/90 text-white px-6 font-medium shadow-sm transition-all whitespace-nowrap">
                Search
            </Button>
            <Button 
                onClick={handleAddNew}
                className="bg-primary hover:bg-primary/90 text-white px-6 font-medium shadow-sm transition-all whitespace-nowrap"
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
          <TableHeader className="bg-primary/10 dark:bg-gray-800">
            <TableRow className="hover:bg-primary/10 dark:hover:bg-gray-700/50 border-gray-200 dark:border-gray-700">
              <TableHead className="font-bold text-gray-700 dark:text-gray-300 w-[60px]">Sr. No.</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-300">Vendor Type</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-gray-300 w-[100px] text-center"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((row, index) => (
              <TableRow key={row.id} className="border-gray-200 dark:border-gray-700 dark:hover:bg-gray-800/50">
                <TableCell className="dark:text-gray-300">{index + 1}</TableCell>
                <TableCell className="dark:text-gray-300">{row.vendorType}</TableCell>
                <TableCell className="dark:text-gray-300">
                    <div className="flex items-center justify-center gap-4">
                        <Button 
                            variant="ghost" size="icon" 
                            className="h-4 w-4 text-gray-600 hover:text-blue-600"
                            onClick={() => handleEdit(row)}
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                            variant="ghost" size="icon" 
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
                    <TableCell colSpan={3} className="text-center h-24 text-gray-500">
                        No offer types found.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

       {/* Pagination (Static) */}
       <div className="flex justify-end items-center pt-2">
       </div>

      {/* Add/Edit Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl overflow-hidden">
             <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 p-4">
                <Settings className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-primary uppercase tracking-wide">
                    OFFER TYPE
                </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Offer Type
                    </label>
                    <Input 
                        value={offerTypeName}
                        onChange={(e) => setOfferTypeName(e.target.value)}
                        className="w-full"
                        required
                    />
                </div>

                <div className="flex justify-center gap-4 pt-4 bg-gray-50 dark:bg-gray-800/50 -mx-6 -mb-6 p-4 mt-6">
                    <Button type="submit" className="bg-[#419456] hover:bg-[#347845] text-white px-8">
                        Submit
                    </Button>
                    <Button 
                        type="button" 
                        variant="destructive"
                        onClick={() => setIsDialogOpen(false)}
                        className="bg-[#C0392B] hover:bg-[#A93226] text-white px-8"
                    >
                        Cancel
                    </Button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
