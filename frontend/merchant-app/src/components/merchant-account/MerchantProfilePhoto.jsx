import { Camera } from "lucide-react";

const MerchantProfilePhoto = ({ getInitials, profile }) => {
  return (
    <div className="bg-gray-50 py-6 flex flex-col items-center">
      <div className="relative">
        {/* Profile Circle */}
        <div className="w-24 h-24 rounded-full bg-blue-50 border-4 border-blue-100 flex items-center justify-center overflow-hidden">
          {profile.photo ? (
            <img
              src={profile.photo}
              alt="profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xl font-bold text-blue-600">
              {getInitials(profile.merchantName)}
            </span>
          )}
        </div>

        {/* Camera Icon */}
        <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full border-2 border-white cursor-pointer">
          <Camera size={14} />
          <input type="file" className="hidden" />
        </label>
      </div>

      {/* Business Name */}
      <h2 className="mt-3 text-gray-800 font-semibold">
        {profile.businessName}
      </h2>

      {/* Merchant ID */}
      <p className="text-xs text-gray-400">Merchant ID: {profile.id}</p>
    </div>
  );
};

export default MerchantProfilePhoto;
