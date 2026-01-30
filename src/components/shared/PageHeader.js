import React from 'react';
import { Settings } from 'lucide-react';
import { cn } from "@/lib/utils";

export const PageHeader = ({ title, icon: Icon = Settings, count, className }) => {
  return (
    <div className={cn("flex items-center gap-3 border-b border-gray-200 dark:border-gray-800 pb-4 mb-6", className)}>
        <div className="w-8 h-8 rounded-full bg-[#0f7396]/10 flex items-center justify-center">
            <Icon className="w-4 h-4 text-[#0f7396] animate-spin-slow" />
        </div>
        <div className="flex items-baseline gap-3">
             <h1 className="text-xl font-bold text-[#0f7396] uppercase tracking-wide">{title}</h1>
             {count !== undefined && (
                <span className="text-sm font-medium text-muted-foreground bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                    Total: {count}
                </span>
             )}
        </div>
    </div>
  );
};
