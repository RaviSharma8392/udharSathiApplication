import { Route, Routes } from "react-router-dom";
import MerchantHomeLayout from "../layout/MerchantHomeLayout";
import LoginScreen from "../pages/auth/LoginScreen";
import TermsPage from "../pages/terms-and-privacy/TermsPage";
import PrivacyPage from "../pages/terms-and-privacy/PrivacyPage";
import CompanyPage from "../pages/terms-and-privacy/CompanyPage";
import HomePage from "../pages/screen/HomePage";
import AddCustomer from "../pages/customers/AddCustomer";
import CustomerLedger from "../pages/customers/CustomerLedger";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import AllCustomers from "../pages/customers/AllCustomers";
import TransactionsHistoryPage from "../pages/transtion/TransactionsHistoryPage";
import SelectCustomerPage from "../pages/customers/SelectCustomerPage";
import MerchantAccount from "../pages/screen/MerchantAccount";
import WelcomeScreen from "../pages/welcome/WelcomeScreen";
import MerchantProfile from "../pages/account/MerchantEditProfile";
import MerchantEditProfile from "../pages/account/MerchantEditProfile";

const MerchantRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC ROUTE */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/welcome" element={<WelcomeScreen />} />
      </Route>

      {/* PROTECTED ROUTES */}
      {/* <Route element={<ProtectedRoute />}> */}
      <Route path="/" element={<MerchantHomeLayout />}>
        <Route index element={<HomePage />} />
        <Route path="customers" element={<AllCustomers />} />
        {/* <Route path="profile" element={<MerchantProfile />} /> */}
        <Route path="account" element={<MerchantAccount />} />
      </Route>

      <Route
        path="transactions-history"
        element={<TransactionsHistoryPage />}
      />
      <Route path="customers-remind" element={<AllCustomers />} />

      <Route path="select-customers" element={<SelectCustomerPage />} />

      <Route path="add-customer" element={<AddCustomer />} />
      <Route path="customers/:customerId/ledger" element={<CustomerLedger />} />
      <Route path="account/edit" element={<MerchantEditProfile />} />
      {/* </Route> */}

      {/* STATIC PAGES */}
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/company" element={<CompanyPage />} />
    </Routes>
  );
};

export default MerchantRoutes;
