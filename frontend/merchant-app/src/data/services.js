// services.js
import {
  CurrencyRupeeIcon,
  DocumentTextIcon,
  CubeIcon,
  UserPlusIcon,
  CalendarDaysIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

export const services = [
  {
    name: "Cashbook",
    icon: CurrencyRupeeIcon,
    bg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    name: "Bills",
    icon: DocumentTextIcon,
    bg: "bg-red-100",
    iconColor: "text-red-600",
  },
  {
    name: "Items",
    icon: CubeIcon,
    bg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    name: "Staff",
    icon: UserPlusIcon,
    bg: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    name: "Collection",
    icon: CalendarDaysIcon,
    bg: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    name: "Shop Insurance",
    icon: ShieldCheckIcon,
    bg: "bg-pink-100",
    iconColor: "text-pink-600",
  },
];
