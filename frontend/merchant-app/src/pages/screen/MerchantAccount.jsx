import InviteFriendCard from "../../components/inviteFriend/InviteFriendCard";
import BusinessProfileHeader from "../../components/shopProfile/BusinessProfileHeader";
import OtherOptions from "../../components/shopProfile/OtherOptions";
import ServicesGrid from "../../components/shopProfile/ServicesGrid";
import { BusinessLang } from "../../data/language/BuisnessLanguages";

const MerchantAccount = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <BusinessProfileHeader businessName="businessName" />
      <ServicesGrid />
      <OtherOptions />
      <InviteFriendCard />
    </div>
  );
};

export default MerchantAccount;
