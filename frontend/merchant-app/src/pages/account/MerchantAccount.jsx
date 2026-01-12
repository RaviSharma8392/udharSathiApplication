import InviteFriendCard from "../../components/inviteFriend/InviteFriendCard";
import OtherOptions from "../../components/shopProfile/OtherOptions";
import ServicesGrid from "../../components/shopProfile/ServicesGrid";

const MerchantAccount = () => {
  return (
    <div className=" min-h-screen">
      <ServicesGrid />
      <OtherOptions />
      <InviteFriendCard />
    </div>
  );
};

export default MerchantAccount;
