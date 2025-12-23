"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Calendar,
  FileText,
  ClipboardList,
  User,
  Stethoscope,
  Pill,
  Microscope,
  FileBarChart,
  Settings,
  Users,
  CreditCard,
  CalendarCheck,
  Receipt,
  Activity
} from "lucide-react";

import { useMenuData } from "@/hooks/useMenuData";
import { getUser } from "@/api/client/getUser";

// Function to get icon component for menu
const getMenuIcon = (menuName) => {
  const iconMap = {
    'Dashboard': LayoutDashboard,
    'Appointment': Calendar,
    'Invoice': FileText,
    'Lead': ClipboardList,
    'Patient': User,
    'Doctor': Stethoscope,
    'Medicine': Pill,
    'Lab': Microscope,
    'Report': FileBarChart,
    'Settings': Settings,
    'User': Users,
    'Users': Users,
    'Payment': CreditCard,
    'Schedule': CalendarCheck,
    'Billing': Receipt,
    'Pharmacy': Activity,
  };

  const IconComponent = iconMap[menuName] || Activity;
  return <IconComponent size={18} strokeWidth={2} />;
};

export default function Sidebar({ open }) {
  let userDetails = getUser();
  const UserRole = userDetails?.userData?.roleName;

  const { data, isLoading } = useMenuData(UserRole);

  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (menuID) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuID]: !prev[menuID],
    }));
  };

   // Add Doctor menu
  const doctorMenu = {
    menuID: 'doctor-menu',
    menuName: 'Doctor',
    menuPath: null,
    menuChild: [
      {
        menuID: 'doctor-registration',
        menuName: 'Doctor Registration',
        menuPath: '/doctor/doctor-registration'
      }
    ]
  };

  // Add Appointment menu
  const appointmentMenu = {
    menuID: 'appointment-menu',
    menuName: 'Appointment',
    menuPath: null,
    menuChild: [
      {
        menuID: 'book-appointment',
        menuName: 'Book Appointment',
        menuPath: '/appointments/Book-Appointments'
      },
      {
        menuID: 'all-appointments-list',
        menuName: 'All Appointments List',
        menuPath: '/appointments/all-appointments-list'
      }
    ]
  };

  // Add Invoice menu
  const invoiceMenu = {
    menuID: 'invoice-menu',
    menuName: 'Invoice',
    menuPath: null,
    menuChild: [
      {
        menuID: 'generate-invoice',
        menuName: 'Generate Invoice',
        menuPath: '/invoice/generate-invoice'
      },
      {
        menuID: 'view-invoice',
        menuName: 'View Invoice',
        menuPath: '/invoice/view-invoice'
      },
      {
        menuID: 'cheque-invoice',
        menuName: 'Cheque Details', // Using 'Details' as shown in design sidebar, or could use 'Invoice'
        menuPath: '/invoice/cheque-invoice'
      },
      {
        menuID: 'cancellation-treatment',
        menuName: 'Cancellation Treatment',
        menuPath: '/invoice/cancellation-treatment'
      },
      {
        menuID: 'upgradation',
        menuName: 'Upgradation',
        menuPath: '/invoice/upgradation'
      },
      {
        menuID: 'bajaj-scheme-invoice',
        menuName: 'Bajaj Scheme Invoice Report',
        menuPath: '/invoice/bajaj-scheme-invoice'
      },
      {
        menuID: 'online-payment-invoice',
        menuName: 'Card / UPI Invoice Report',
        menuPath: '/invoice/online-payment-invoice'
      }
    ]
  };

  // Add Lead menu
  const leadMenu = {
    menuID: 'lead-menu',
    menuName: 'Lead',
    menuPath: null,
    menuChild: [
      {
        menuID: 'new-lead',
        menuName: 'New Lead',
        menuPath: '/enquiry/new-enquiry'
      },
      {
        menuID: 'lead-followups',
        menuName: 'Lead Followups',
        menuPath: '/enquiry/enquiry-followups'
      }
    ]
  };

  // Add Patient Details menu (MIS)
  const patientDetailsMenu = {
    menuID: 'patient-details-menu',
    menuName: 'Patient',
    menuPath: null,
    menuChild: [
      {
        menuID: 'patient-search',
        menuName: 'Patient Search',
        menuPath: '/MIS/patient-search'
      },
      {
        menuID: 'consultation',
        menuName: 'Consultation',
        menuPath: '/MIS/consultation'
      }
    ]
  };

  // // Add Doctor menu
  // const doctorMenu = {
  //   menuID: 'doctor-menu',
  //   menuName: 'Doctor',
  //   menuPath: null,
  //   menuChild: [
  //     {
  //       menuID: 'doctor-registration',
  //       menuName: 'Doctor Registration',
  //       menuPath: '/doctor/doctor-registration'
  //     }
  //   ]
  // };


  // Append Appointment, Invoice, Lead, Patient Details, Doctor, and Accounts menus to the data
  const menuData = data ? [...data, doctorMenu, appointmentMenu, leadMenu, invoiceMenu, patientDetailsMenu] : [doctorMenu, appointmentMenu, leadMenu, invoiceMenu, patientDetailsMenu];

  if (isLoading) return <div>Loading...</div>;

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 h-screen flex flex-col transition-all duration-300 border-r border-[#4DB8AC]/30 shadow-sm bg-gradient-to-b from-[#4DB8AC]/5 via-white/90 to-[#1E6B8C]/5 dark:bg-gradient-to-b dark:from-[#1E6B8C]/20 dark:via-gray-900/90 dark:to-[#4DB8AC]/10 text-foreground",
        open ? "w-64" : "w-16"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b border-[#4DB8AC]/30 flex-shrink-0">
        {open ? (
          <Image src="/medivardaan-logo.png" width={50} height={60} alt="MediVardaan Logo" className="object-contain " />
        ) : (
          <Image src="/medivardaan-logo.png" width={40} height={40} alt="MediVardaan Logo" className="object-contain" />
        )}
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden mt-6 space-y-1 px-2 pb-6 scrollbar-thin scrollbar-thumb-[#4DB8AC]/20 scrollbar-track-transparent hover:scrollbar-thumb-[#4DB8AC]/40">
        {menuData?.map((menu) => {
          const hasChildren = menu.menuChild && menu.menuChild.length > 0;

          if (!hasChildren) {
            return (
              <Link
                key={menu.menuID}
                href={menu.menuPath || "#"}
                className={cn(
                  "flex items-center gap-3 px-2 py-2.5 text-sm font-medium rounded-lg hover:bg-[#4DB8AC]/10 hover:text-[#1E6B8C] transition-all duration-200",
                  open ? "justify-start" : "justify-center"
                )}
              >
                <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-gradient-to-br from-[#4DB8AC] to-[#1E6B8C] text-white shadow-md">
                  {getMenuIcon(menu.menuName)}
                </div>

                {open && <span className="font-medium">{menu.menuName}</span>}
              </Link>
            );
          }

          // ✔ Has Children → Show Collapsible
          return (
            <Collapsible
              key={menu.menuID}
              open={openMenus[menu.menuID]}
              onOpenChange={() => toggleMenu(menu.menuID)}
            >
              <CollapsibleTrigger asChild>
                <button
                  className={cn(
                    "w-full flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-[#4DB8AC]/10 hover:text-[#1E6B8C] transition-all duration-200 text-left"
                  )}
                >
                  <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-gradient-to-br from-[#4DB8AC] to-[#1E6B8C] text-white shadow-md">
                    {getMenuIcon(menu.menuName)}
                  </div>

                  {open && (
                    <>
                      <span className="flex-1 text-sm font-medium">
                        {menu.menuName}
                      </span>
                      {openMenus[menu.menuID] ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </>
                  )}
                </button>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="ml-12 mt-1 flex flex-col space-y-0.5">
                  {menu.menuChild.map((child, i) => (
                    <Link
                      key={child.menuID}
                      href={child.menuPath || "#"}
                      className={cn(
                        "text-sm rounded-md px-4 py-2 hover:bg-[#4DB8AC]/10 hover:text-[#1E6B8C] transition-all duration-200 border-l-2 border-transparent hover:border-[#4DB8AC]",
                        !open && "hidden"
                      )}
                    >
                      {child.menuName || `Child ${i + 1}`}
                    </Link>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </nav>
    </aside>
  );
}
