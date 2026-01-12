import { Route, Routes } from "react-router-dom";

// routes
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";

// pages
import WelcomeScreen from "../pages/screens/WelcomeScreen";
import LoginScreen from "../pages/auth/LoginScreen";
import HomePage from "../pages/screens/HomePage";
import AllCustomers from "../pages/customers/AllCustomers";
import SelectCustomerPage from "../pages/customers/SelectCustomerPage";
import CustomerLedger from "../pages/customers/CustomerLedger";
import AddCustomer from "../pages/customers/AddCustomer";
import TransactionsHistoryPage from "../pages/transtion/TransactionsHistoryPage";
// layouts
import MerchantHomeLayout from "../layout/MerchantHomeLayout";

// merchant account

import MerchantAccount from "../pages/account/MerchantAccount";

import MerchantEditProfile from "../pages/account/MerchantEditProfile";
import ManageCustomers from "../pages/customers/ManageCustomers";

const MerchantRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC PAGES */}
      <Route element={<PublicRoute />}>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/login" element={<LoginScreen />} />
      </Route>

      {/* PROTECTED PAGES */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<MerchantHomeLayout />}>
          <Route index element={<HomePage />} />
          <Route path="customers" element={<AllCustomers />} />
          <Route path="account" element={<MerchantAccount />} />

          <Route path="customers-remind" element={<AllCustomers />} />
          <Route
            path="customers/:customerId/ledger"
            element={<CustomerLedger />}
          />
        </Route>

        <Route path="account/edit" element={<MerchantEditProfile />} />

        <Route path="add-customer" element={<AddCustomer />} />
        <Route path="customers/:id/edit" element={<AddCustomer />} />

        <Route
          path="transactions-history"
          element={<TransactionsHistoryPage />}
        />
        <Route path="customers/manage" element={<ManageCustomers />} />
        <Route path="select-customers" element={<SelectCustomerPage />} />
      </Route>

      {/* STATIC PAGES */}
      {/* <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/company" element={<CompanyPage />} /> */}
    </Routes>
  );
};

export default MerchantRoutes;
