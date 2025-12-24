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
  Activity,
  Package,
  CircleHelp,
  UserCog
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
    'Inventory': Package,
    'Accounts': CreditCard,
    'Help': CircleHelp,
    'Enquiry Settings': Settings,
    'User Settings': UserCog,
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
      },
      {
        menuID: 'view-todays-confirmed',
        menuName: 'View today\'s confirmed appointment',
        menuPath: '/appointments/view-todays-confirmed-appointment'
      },
      {
        menuID: 'appointments-report',
        menuName: 'Appointments Report',
        menuPath: '/appointments/appointments-report'
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
        menuName: 'Cheque Invoice',
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
      },
      {
        menuID: 'finance-reconciliation',
        menuName: 'Finance Reconciliation',
        menuPath: '/invoice/finance-reconciliation'
      },
      {
        menuID: 'payment-collection',
        menuName: 'Payment Collection',
        menuPath: '/invoice/payment-collection'
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
      },
      {
        menuID: 'pending-followups',
        menuName: 'Pending Followups',
        menuPath: '/enquiry/pending-followups'
      },
      {
        menuID: 'follow-up-report',
        menuName: 'Followups',
        menuPath: '/enquiry/follow-up-report'
      },
      {
        menuID: 'non-converted-leads',
        menuName: 'Non-Converted Leads',
        menuPath: '/enquiry/non-converted-leads'
      },
      {
        menuID: 'upload-leads',
        menuName: 'Upload Leads',
        menuPath: '/enquiry/upload-leads'
      },
      {
        menuID: 'area-manager-leads',
        menuName: 'Area Manager Leads',
        menuPath: '/enquiry/area-manager-leads'
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
      },
      {
        menuID: 'new-patient-report',
        menuName: 'New Patient Report',
        menuPath: '/MIS/new-patient-report'
      },
      {
        menuID: 'patient-visit-report',
        menuName: 'Patient Visit Report',
        menuPath: '/MIS/patient-visit-report'
      },
      {
        menuID: 'repeat-patient-report',
        menuName: 'Repeat Patient Report',
        menuPath: '/MIS/repeat-patient-report'
      },
      {
        menuID: 'patient-clinic-transfer',
        menuName: 'Patient Clinic Transfer',
        menuPath: '/MIS/patient-clinic-transfer'
      },
      {
        menuID: 'patient-merge-delete',
        menuName: 'Patient Merge and Delete',
        menuPath: '/MIS/patient-merge-delete'
      },
      {
        menuID: 'visitor',
        menuName: 'Visitor',
        menuPath: '/MIS/visitor'
      },
      {
        menuID: 'consent',
        menuName: 'Consent',
        menuPath: '/MIS/consent'
      }
    ]
  };

  // Add Report menu
  const reportMenu = {
    menuID: 'report-menu-local',
    menuName: 'Report',
    menuPath: null,
    menuChild: [
      {
        menuID: 'doctor-report',
        menuName: 'Doctor Collection Report',
        menuPath: '/report/doctor-collection-report'
      },
      {
        menuID: 'contact-details',
        menuName: 'Contact Details',
        menuPath: '/report/contact-details'
      },
      {
        menuID: 'order-history',
        menuName: 'Order History',
        menuPath: '/report/order-history'
      },
      {
        menuID: 'doctor-attendance-report',
        menuName: 'Doctor Attendance Report',
        menuPath: '/report/doctor-attendance-report'
      },
      {
        menuID: 'medicines-collection-report',
        menuName: 'Medicines Collection Report',
        menuPath: '/report/medicines-collection-report'
      },
      {
        menuID: 'treatments-report',
        menuName: 'Treatments Report',
        menuPath: '/report/treatments-report'
      },
      {
        menuID: 'login-details',
        menuName: 'Login Details',
        menuPath: '/report/login-details'
      },
      {
        menuID: 'treatments-count-report',
        menuName: 'Treatments Count Report',
        menuPath: '/report/treatments-count-report'
      },
      {
        menuID: 'revenue-report',
        menuName: 'Revenue Report',
        menuPath: '/report/revenue-report'
      },
      {
        menuID: 'transaction-report',
        menuName: 'Transaction Report',
        menuPath: '/report/transaction-report'
      },
      {
        menuID: 'cheque-report',
        menuName: 'Cheque Report',
        menuPath: '/report/cheque-report'
      },
      {
        menuID: 'patientwise-collection-report',
        menuName: 'Patientwise Collection Report',
        menuPath: '/report/patientwise-collection-report'
      },
      {
        menuID: 'payment-mode-report',
        menuName: 'Payment Mode Report',
        menuPath: '/report/payment-mode-report'
      },
      {
        menuID: 'payment-mode-clinic-report',
        menuName: 'Payment Mode Clinic Report',
        menuPath: '/report/payment-mode-clinic-report'
      }
    ]
  };

  // Add Accounts menu
  const accountsMenu = {
    menuID: 'accounts-menu-local',
    menuName: 'Accounts',
    menuPath: null,
    menuChild: [
      {
        menuID: 'patients-medicines-collection-report',
        menuName: 'Patients Medicines Collection Report',
        menuPath: '/accounts/patients-medicines-collection-report'
      },
      {
        menuID: 'accountant-expense',
        menuName: 'Accountant Expense',
        menuPath: '/accounts/accountant-expense'
      },
      {
        menuID: 'area-manager-report',
        menuName: 'Area Manager Report',
        menuPath: '/accounts/area-manager-report'
      },
      {
        menuID: 'area-manager-collection-report',
        menuName: 'Area Manager Collection Report',
        menuPath: '/accounts/area-manager-collection-report'
      },
      {
        menuID: 'clinic-medicines-collection-report',
        menuName: 'Clinic Medicines Collection Report',
        menuPath: '/accounts/clinic-medicines-collection-report'
      },
      {
        menuID: 'expense-entry',
        menuName: 'Expense Entry',
        menuPath: '/accounts/expense-entry'
      },
      {
        menuID: 'expense-report',
        menuName: 'Expense Report',
        menuPath: '/accounts/expense-report'
      },
      {
        menuID: 'clinic-expense-report',
        menuName: 'Clinic Expense Report',
        menuPath: '/accounts/clinic-expense-report'
      },
      {
        menuID: 'clinic-collection-report',
        menuName: 'Clinic Collection Report',
        menuPath: '/accounts/clinic-collection-report'
      },

      {
        menuID: 'accounts-patientwise-collection-report',
        menuName: 'Patientwise Collection Report',
        menuPath: '/report/patientwise-collection-report'
      },
      {
        menuID: 'accounts-payment-mode-report',
        menuName: 'Payment Mode Report',
        menuPath: '/report/payment-mode-report'
      },
      {
        menuID: 'accounts-payment-mode-clinic-report',
        menuName: 'Payment Mode Clinic Report',
        menuPath: '/report/payment-mode-clinic-report'
      }
    ]
  };

  // Add Inventory menu
  const inventoryMenu = {
    menuID: 'inventory-menu',
    menuName: 'Inventory',
    menuPath: null,
    menuChild: [
      {
        menuID: 'clinic-stock',
        menuName: 'Clinic Stock',
        menuPath: '/inventory/clinic-stock'
      },
      {
        menuID: 'head-office-stock',
        menuName: 'Head Office Stock',
        menuPath: '/inventory/head-office-stock'
      },
      {
        menuID: 'request-inventory',
        menuName: 'Request Inventory',
        menuPath: '/inventory/request-inventory'
      },
      {
        menuID: 'view-request-inventory',
        menuName: 'View Request Inventory',
        menuPath: '/inventory/view-request-inventory'
      },
      {
        menuID: 'view-order-history',
        menuName: 'View Order History',
        menuPath: '/inventory/view-order-history'
      },
      {
        menuID: 'clinic-stock-report',
        menuName: 'Clinic Stock Report',
        menuPath: '/inventory/clinic-stock-report'
      },
      {
        menuID: 'purchase-order',
        menuName: 'Purchase Order',
        menuPath: '/inventory/purchase-order'
      },
      {
        menuID: 'purchase-order-received',
        menuName: 'Purchase Order Received',
        menuPath: '/inventory/purchase-order-received'
      },
      {
        menuID: 'purchase-order-receive-report',
        menuName: 'Purchase Order Receive Report',
        menuPath: '/inventory/purchase-order-receive-report'
      },
      {
        menuID: 'clinic-request-stock-send-report',
        menuName: 'Clinic Request Stock Send Report',
        menuPath: '/inventory/clinic-request-stock-send-report'
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

  // Add Help menu
  const helpMenu = {
    menuID: 'help-menu',
    menuName: 'Help',
    menuPath: '/help',
    menuChild: []
  };


  // Add Enquiry Settings menu
  const enquirySettingsMenu = {
    menuID: 'enquiry-settings-menu',
    menuName: 'Enquiry Settings',
    menuPath: '/enquiry-settings',
    menuChild: []
  };

  // Add User Settings menu
  const userSettingsMenu = {
    menuID: 'user-settings-menu',
    menuName: 'User Settings',
    menuPath: null,
    menuChild: [
      {
        menuID: 'employee',
        menuName: 'Employee',
        menuPath: '/user-settings/employee'
      },
      {
        menuID: 'user-access',
        menuName: 'User Access',
        menuPath: '/user-settings/user-access'
      },
      {
        menuID: 'area-manager',
        menuName: 'Area Manager',
        menuPath: '/user-settings/area-manager'
      }
    ]
  };

  // Add Inventory Settings menu
  const inventorySettingsMenu = {
    menuID: 'inventory-settings-menu',
    menuName: 'Inventory Settings',
    menuPath: null,
    menuChild: [
      {
        menuID: 'vendor',
        menuName: 'Vendor',
        menuPath: '/inventory-settings/vendor'
      },
      {
        menuID: 'item-master',
        menuName: 'Item Master',
        menuPath: '/inventory-settings/item-master'
      },
      {
        menuID: 'brand',
        menuName: 'Brand',
        menuPath: '/inventory-settings/brand'
      },
      {
        menuID: 'packaging-type',
        menuName: 'Packaging Type',
        menuPath: '/inventory-settings/packaging-type'
      }
    ]
  };

  // Append Appointment, Invoice, Lead, Patient Details, Doctor, Accounts, and Report menus to the data
  // Append Appointment, Invoice, Lead, Patient Details, Doctor, Accounts, and Report menus to the data
  const menuData = data ? [...data, doctorMenu, appointmentMenu, leadMenu, invoiceMenu, patientDetailsMenu, reportMenu, inventoryMenu, inventorySettingsMenu, accountsMenu, helpMenu, enquirySettingsMenu, userSettingsMenu] : [doctorMenu, appointmentMenu, leadMenu, invoiceMenu, patientDetailsMenu, reportMenu, inventoryMenu, inventorySettingsMenu, accountsMenu, helpMenu, enquirySettingsMenu, userSettingsMenu];

  if (isLoading) return <div>Loading...</div>;

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 h-screen flex flex-col transition-all duration-300 border-r border-[#4DB8AC]/30 shadow-sm bg-gradient-to-b from-[#4DB8AC]/5 via-white/90 to-[#1E6B8C]/5 dark:bg-gradient-to-b dark:from-[#1E6B8C]/20 dark:via-gray-900/90 dark:to-[#4DB8AC]/10 text-foreground",
        open ? "w-64" : "w-16"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-center h-20 py-6 border-b border-[#4DB8AC]/30 flex-shrink-0">
        {open ? (
          <Image src="/medivardaan-logo.png" width={60} height={25} alt="MediVardaan Logo" className="object-contain" />
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
