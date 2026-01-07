"use client";

import React, { useState } from "react";
import { Settings, Save } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner"; // Assuming sonner is installed, if not will use alert

const MODULES = [
  "Inventory",
  "Appointment",
  "Patient",
  "Report",
  "Invoice",
  "Settings",
  "Accounts",
  "Clinic Settings",
  "Laboratory",
];

const UserAccessPage = () => {
    const [selectedRole, setSelectedRole] = useState("");
    // Start with all false
    const [permissions, setPermissions] = useState(
        MODULES.reduce((acc, module) => {
            acc[module] = { view: false, add: false, edit: false, delete: false };
            return acc;
        }, {})
    );

    const handlePermissionChange = (module, type) => {
        setPermissions(prev => ({
            ...prev,
            [module]: {
                ...prev[module],
                [type]: !prev[module][type]
            }
        }));
    };

    const handleSelectAll = (module, checked) => {
         setPermissions(prev => ({
            ...prev,
            [module]: {
                view: checked,
                add: checked,
                edit: checked,
                delete: checked
            }
        }));
    }

    const handleSave = () => {
        if (!selectedRole) {
            alert("Please select a user role first.");
            return;
        }
        console.log("Saving permissions for:", selectedRole, permissions);
        alert(`Permissions saved successfully for ${selectedRole}`);
    };

  return (
    <div className="w-full p-6 space-y-6 bg-background text-foreground min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
          <Settings className="w-4 h-4 text-[#0f7396] dark:text-[#0f7396]" />
        </div>
        <h1 className="text-xl font-bold text-[#0f7396] dark:text-[#0f7396]">
          USER ACCESS
        </h1>
      </div>

      <Card className="border-gray-200 dark:border-gray-800">
        <CardContent className="p-6 space-y-6">
          <div className="w-full max-w-sm">
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-full bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700">
                <SelectValue placeholder="--- Select User Role ---" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="branch-admin">Branch Admin</SelectItem>
                <SelectItem value="super-admin">Super Admin</SelectItem>
                <SelectItem value="doctor">Doctor</SelectItem>
                <SelectItem value="accountant">Accountant</SelectItem>
                <SelectItem value="receptionist">Receptionist</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
          </div>
            
            {selectedRole && (
                <div className="rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-[#E8F8F5] dark:bg-green-900/20">
                            <TableRow className="border-b border-gray-200 dark:border-gray-700 hover:bg-transparent">
                            <TableHead className="w-[300px] text-gray-700 dark:text-gray-200 font-bold">Module Name</TableHead>
                            <TableHead className="text-center text-gray-700 dark:text-gray-200 font-bold">View</TableHead>
                            <TableHead className="text-center text-gray-700 dark:text-gray-200 font-bold">Add</TableHead>
                            <TableHead className="text-center text-gray-700 dark:text-gray-200 font-bold">Edit</TableHead>
                            <TableHead className="text-center text-gray-700 dark:text-gray-200 font-bold">Delete</TableHead>
                             <TableHead className="text-center text-gray-700 dark:text-gray-200 font-bold">Select All</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {MODULES.map((module) => (
                                <TableRow key={module} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <TableCell className="font-medium">{module}</TableCell>
                                    <TableCell className="text-center">
                                        <Checkbox 
                                            checked={permissions[module].view} 
                                            onCheckedChange={() => handlePermissionChange(module, 'view')} 
                                        />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Checkbox 
                                            checked={permissions[module].add} 
                                            onCheckedChange={() => handlePermissionChange(module, 'add')} 
                                        />
                                    </TableCell>
                                    <TableCell className="text-center">
                                         <Checkbox 
                                            checked={permissions[module].edit} 
                                            onCheckedChange={() => handlePermissionChange(module, 'edit')} 
                                        />
                                    </TableCell>
                                    <TableCell className="text-center">
                                         <Checkbox 
                                            checked={permissions[module].delete} 
                                            onCheckedChange={() => handlePermissionChange(module, 'delete')} 
                                        />
                                    </TableCell>
                                     <TableCell className="text-center">
                                         <Checkbox 
                                            checked={
                                                permissions[module].view && 
                                                permissions[module].add && 
                                                permissions[module].edit && 
                                                permissions[module].delete
                                            } 
                                            onCheckedChange={(checked) => handleSelectAll(module, checked)} 
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {selectedRole && (
                <div className="flex justify-end pt-4">
                    <Button 
                        onClick={handleSave}
                        className="bg-[#1F618D] hover:bg-[#154360] text-white dark:bg-blue-700 dark:hover:bg-blue-800 w-40"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                    </Button>
                </div>
            )}

        </CardContent>
      </Card>
    </div>
  );
};

export default UserAccessPage;
