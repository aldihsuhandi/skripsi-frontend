import { ImageDownload, ProcessImgBE } from "@/helper";
import { UserSummary } from "@/types/User";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Avatar } from "../Avatar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export interface UserMenuProps {
  userData: UserSummary;
  onLogoutClick: () => Promise<void>;
  children: ReactNode;
}

export const UserMenu = ({
  userData,
  onLogoutClick,
  children,
}: UserMenuProps) => {
  const [image, setImage] = useState<string | undefined>(undefined);
  const ref = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    async function ProcessImage() {
      if (userData.profilePicture) {
        const response = await ImageDownload({
          imageId: userData.profilePicture,
        });
        if (response?.status === 200 && response.data.byteLength !== 0) {
          const imgUrl = await ProcessImgBE(response.data);

          setImage(imgUrl);
        } else {
          setImage(undefined);
        }
      }
    }
    ProcessImage();
  }, [userData.profilePicture]);

  return (
    <div className="relative flex">
      <div className="cursor-pointer" onClick={() => setMenuOpen(!menuOpen)}>
        <Avatar src={image} alt="profile-picture" rounded />
      </div>
      {/* The pop-up menu */}
      {menuOpen && (
        <div
          className="absolute right-2 top-10 flex w-52 flex-col rounded border border-gray-600 bg-white p-2"
          ref={ref}
          onClick={() => setMenuOpen(false)}
        >
          {children}
        </div>
      )}

      {/* <div className="mx-1 self-center rounded-md border border-normal-blue bg-white hover:border-bright-blue hover:bg-bright-blue">
        <button
          onClick={onLogoutClick}
          className="h-8 px-1 text-xs text-normal-blue hover:text-white"
        >
          Logout
        </button>
      </div> */}
    </div>
  );
};
