import { FC } from "react";

interface UserProfileProps {
  image: string;
  displayName: string;
}

const UserProfile: FC<UserProfileProps> = ({ image, displayName }) => {
  
  return (
    <div className="flex items-center justify-between p-2 py-4">
      <div className="flex items-center">
      <img
        src={image}
        alt={`${displayName}'s profile`}
        className="w-10 h-10 rounded-full mr-4 outline outline-chessGreen outline-offset-2 outline-2"
      />
      <div className="text-md font-semibold ">{displayName}</div>
      </div>
    </div>
  );
};

export default UserProfile;
