"use client";

import React, { useState } from "react";
import { Settings, Search, Edit, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

const ENQUIRY_SOURCES_DATA = [
  { id: 1, name: "Facebook" },
  { id: 2, name: "Google" },
  { id: 3, name: "Newspaper Ads" },
  { id: 4, name: "Pamphlets" },
  { id: 5, name: "Banners" },
  { id: 6, name: "Reference" },
  { id: 7, name: "Justdial" },
  { id: 8, name: "Practo" },
  { id: 9, name: "Website" },
  { id: 10, name: "Tele Calling" },
];

const EnquirySettingsPage = () => {
  const [sources, setSources] = useState(ENQUIRY_SOURCES_DATA);
  const [filteredSources, setFilteredSources] = useState(ENQUIRY_SOURCES_DATA);
  const [searchName, setSearchName] = useState("");
  
  // Edit State
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  // Add State
  const [newSourceName, setNewSourceName] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleSearch = () => {
    let result = sources;
    if (searchName) {
      result = result.filter((source) =>
        source.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }
    setFilteredSources(result);
  };

  const handleDelete = (id) => {
    const updatedSources = sources.filter((source) => source.id !== id);
    setSources(updatedSources);
    
    // Update filtered list based on current search
    if (searchName) {
      setFilteredSources(updatedSources.filter((source) =>
        source.name.toLowerCase().includes(searchName.toLowerCase())
      ));
    } else {
      setFilteredSources(updatedSources);
    }
  };

  const handleEditClick = (source) => {
    setEditingId(source.id);
    setEditValue(source.name);
  };

  const handleSave = (id) => {
    const updatedSources = sources.map((source) => {
      if (source.id === id) {
        return { ...source, name: editValue };
      }
      return source;
    });

    setSources(updatedSources);
    
    // Update filtered list
    if (searchName) {
      setFilteredSources(updatedSources.filter((source) =>
        source.name.toLowerCase().includes(searchName.toLowerCase())
      ));
    } else {
      setFilteredSources(updatedSources);
    }

    setEditingId(null);
    setEditValue("");
  };

  const handleAdd = () => {
    if (!newSourceName.trim()) return;

    const newSource = {
      id: sources.length > 0 ? Math.max(...sources.map(s => s.id)) + 1 : 1,
      name: newSourceName.trim(),
    };

    const updatedSources = [...sources, newSource];
    setSources(updatedSources);

    // Update filtered list
    if (searchName) {
      setFilteredSources(updatedSources.filter((source) =>
        source.name.toLowerCase().includes(searchName.toLowerCase())
      ));
    } else {
      setFilteredSources(updatedSources);
    }

    setNewSourceName("");
    setIsAddDialogOpen(false);
  };

  return (
    <div className="w-full p-6 space-y-6 bg-background text-foreground min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
          <Settings className="w-4 h-4 text-[#0f7396] dark:text-[#0f7396]" />
        </div>
        <h1 className="text-xl font-bold text-[#0f7396] dark:text-[#0f7396]">
          ENQUIRY SOURCE
        </h1>
      </div>

      {/* Main Content Card */}
      <Card className="border-gray-200 dark:border-gray-800">
        <CardContent className="p-6 space-y-6">
          
          {/* Controls: Search and Add New */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex gap-2 w-full max-w-2xl">
               <div className="relative flex-1">
                 <Input 
                   placeholder="Name" 
                   className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 pl-3"
                   value={searchName}
                   onChange={(e) => setSearchName(e.target.value)}
                 />
               </div>
              <Button 
                className="bg-[#0f7396] hover:bg-[#0b5c7a] text-white dark:bg-[#0f7396] dark:hover:bg-[#0b5c7a]"
                onClick={handleSearch}
              >
                Search
              </Button>
              
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#1F618D] hover:bg-[#154360] text-white dark:bg-blue-700 dark:hover:bg-blue-800">
                    Add New
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Enquiry Source</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <Input 
                      placeholder="Source Name" 
                      value={newSourceName}
                      onChange={(e) => setNewSourceName(e.target.value)}
                    />
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAdd}>Add</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Total : {filteredSources.length}
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            <Table>
              <TableHeader className="bg-[#E8F8F5] dark:bg-green-900/20">
                <TableRow className="border-b border-gray-200 dark:border-gray-700 hover:bg-transparent">
                  <TableHead className="w-24 text-gray-700 dark:text-gray-200 font-semibold">Sr. No.</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-200 font-semibold">Enquiry Source Name</TableHead>
                  <TableHead className="w-24 text-right text-gray-700 dark:text-gray-200 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSources.map((source, index) => (
                  <TableRow 
                    key={source.id} 
                    className="border-b last:border-b-0 border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <TableCell className="font-medium text-gray-900 dark:text-gray-100">{index + 1}</TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">
                      {editingId === source.id ? (
                        <Input 
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="h-8 w-full max-w-sm"
                        />
                      ) : (
                        source.name
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {editingId === source.id ? (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleSave(source.id)}
                            className="h-8 w-8 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                          >
                            <Save size={16} />
                          </Button>
                        ) : (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEditClick(source)}
                            className="h-8 w-8 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                          >
                            <Edit size={16} />
                          </Button>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(source.id)}
                          className="h-8 w-8 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Footer / Pagination Placeholder */}
          <div className="flex justify-end text-xs text-blue-500 dark:text-blue-400 font-medium pt-2">
            1234
          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default EnquirySettingsPage;
