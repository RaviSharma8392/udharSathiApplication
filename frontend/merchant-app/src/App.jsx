import InstallPWAButton from "./components/appInstall/InstallPWAButton";
import MerchantRoutes from "./routes/MerchantAppRoutes";

const App = () => {
  if (!window.indexedDB) {
    alert("IndexedDB not supported on this browser");
    return;
  }
  return (
    <>
      <InstallPWAButton />

      <MerchantRoutes />
    </>
  );
};

export default App;
