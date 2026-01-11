// src/config/bottomTabs.js

import {
  Home,
  ClipboardList,
  PlusCircle,
  Users,
  UserCircle,
} from "lucide-react";

export const bottomTabs = [
  {
    name: "home",
    icon: Home,
    route: "",
  },
  {
    name: "history",
    icon: ClipboardList,
    route: "/transactions-history",
  },
  {
    name: "addCustomer",
    icon: PlusCircle,
    center: true,
    route: "select-customers",
  },
  {
    name: "customers",
    icon: Users,
    route: "/customers",
  },
  {
    name: "account",
    icon: UserCircle,
    route: "/account",
  },
];
