import React from "react";

const InviteFriendCard = () => {
  return (
    <div className="flex items-center gap-4 p-4 bg-white ">
      {/* Left Image */}
      <div className="w-16 h-16 shrink-0">
        <img
          src="/inviteFriend.webp"
          alt="Invite Friend"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {/* Right Content */}
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-gray-900">
          Invite your friend
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Invite your friends to use the{" "}
          <span className="font-medium">UdhaarSathi</span> app
        </p>

        <button className="mt-2 text-xs text-indigo-600 font-medium">
          Invite Now →
        </button>
      </div>
    </div>
  );
};

export default InviteFriendCard;
