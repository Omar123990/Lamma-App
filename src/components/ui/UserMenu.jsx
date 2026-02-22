import { Sun, Moon, LogOut, Menu } from "lucide-react";
import {
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
} from "@heroui/react";

export default function UserMenu({
  userData,
  userPhoto,
  resolvedTheme,
  toggleTheme,
  handleLogout,
}) {
  return (
    <Dropdown placement="bottom-end" backdrop="blur">
      <DropdownTrigger>
        <button className="relative flex items-center gap-2 pl-3 pr-1 py-1 rounded-full border border-gray-300 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 transition-all">
          <Menu
            size={18}
            className="text-gray-600 dark:text-gray-300 relative"
          />
          <Avatar
            isBordered
            className="transition-transform w-8 h-8 cursor-pointer ring-2 ring-transparent bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300"
            name={userData?.name?.charAt(0)}
            size="sm"
            src={userPhoto}
            showFallback
          />
        </button>
      </DropdownTrigger>

      <DropdownMenu
        aria-label="Profile Actions"
        variant="flat"
        className="w-56"
      >
        <DropdownSection showDivider>
          <DropdownItem
            key="profile_info"
            className="h-14 gap-2 opacity-100 cursor-default"
            textValue={`Signed in as ${userData?.email}`}
          >
            <p className="font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase">
              Signed in as
            </p>
            <p className="font-bold text-gray-900 dark:text-white truncate">
              {userData?.email}
            </p>
          </DropdownItem>
        </DropdownSection>

        <DropdownSection showDivider>
          <DropdownItem
            key="theme"
            startContent={
              resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />
            }
            onPress={toggleTheme}
            endContent={
              <span className="text-xs text-gray-400 capitalize">
                {resolvedTheme}
              </span>
            }
            textValue="Switch Theme"
          >
            Switch Theme
          </DropdownItem>
        </DropdownSection>

        <DropdownItem
          key="logout"
          color="danger"
          className="text-danger"
          startContent={<LogOut size={18} />}
          onPress={handleLogout}
          textValue="Log Out"
        >
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
