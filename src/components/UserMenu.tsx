import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { FaUserCircle } from "react-icons/fa";
import useAuth from "@/hooks/useAuth";

export default function UserMenu() {
  const { user, signOut } = useAuth();

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 focus:outline-none">
        {user?.user_metadata?.avatar_url ? (
          <img
            src={user.user_metadata.avatar_url}
            alt={user.email || "User avatar"}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <FaUserCircle className="w-8 h-8" />
        )}
        <span className="hidden md:block text-sm font-medium">
          {user?.user_metadata?.full_name || user?.email?.split("@")[0]}
        </span>
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => signOut()}
                className={`${
                  active ? "bg-gray-100" : ""
                } block w-full px-4 py-2 text-left text-sm text-gray-700`}
              >
                Sign out
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
