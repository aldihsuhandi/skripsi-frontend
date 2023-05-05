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
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <div
            className="cursor-pointer"
            // onMouseEnter={() => setMenuOpen(!menuOpen)}
          >
            <Avatar src={image} alt="profile-picture" rounded />
          </div>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            // className="absolute right-2 top-10 flex w-52 flex-col rounded-md border border-gray-600 bg-white p-2 py-2"
            className="min-w-[220px] rounded-md border-gray-600 bg-white p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform]"
            // ref={ref}
            side="bottom"
            sideOffset={5}
          >
            <DropdownMenu.Item className="">{children}</DropdownMenu.Item>
            {/* The pop-up menu */}
            {/* {menuOpen && (
              <div
                className="absolute right-2 top-10 flex w-52 flex-col rounded-md border border-gray-600 bg-white p-2 py-2"
                ref={ref}
                onMouseLeave={() => setMenuOpen(false)}
              >
                {children}
              </div>
            )} */}
            <DropdownMenu.Arrow
              className="border-gray-600 fill-white"
              height={8}
            />
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

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
