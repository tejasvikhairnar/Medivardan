"use client";
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function DoctorDashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4DB8AC]/5 to-[#1E6B8C]/5 dark:from-gray-900 dark:to-gray-950 p-6 flex flex-col items-center justify-center">
      <Card className="w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur border border-[#4DB8AC]/20 shadow-xl">
        <CardContent className="p-8 text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Doctor Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">
            This section is currently under construction.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
