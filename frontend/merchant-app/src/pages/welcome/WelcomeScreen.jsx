import { useNavigate } from "react-router-dom";
import WelcomeNavbar from "../../components/welcome/welcomeNavbar";

const WelcomeScreen = () => {
  const navigate = useNavigate();

  // Function to redirect to /login
  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Navbar */}
      <WelcomeNavbar />

      {/* Image Section */}
      <div
        className="relative flex-1 flex items-center justify-center cursor-pointer"
        onClick={goToLogin} // Click anywhere on this div triggers redirect
      >
        <img
          src="/banner/welcomeAppBanner.jpg"
          alt="Welcome"
          className="w-full h-full object-cover object-top"
        />
      </div>
    </div>
  );
};

export default WelcomeScreen;
