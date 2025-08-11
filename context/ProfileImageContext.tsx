// ProfileImageContext.tsx
import React, { createContext, useContext, useState } from 'react';

type ProfileImageContextType = {
  profileImage: string | null;
  setProfileImage: (uri: string | null) => void;
};

const ProfileImageContext = createContext<ProfileImageContextType>({
  profileImage: null,
  setProfileImage: () => {},
});

export const useProfileImage = () => useContext(ProfileImageContext);

export const ProfileImageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  return (
    <ProfileImageContext.Provider value={{ profileImage, setProfileImage }}>
      {children}
    </ProfileImageContext.Provider>
  );
};
