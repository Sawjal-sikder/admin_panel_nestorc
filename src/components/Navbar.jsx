import React, { useState } from "react";
import { Avatar, Dropdown, Button, Drawer, Badge, Space } from "antd";
import { Link, useNavigate } from "react-router-dom";
// import logoImage from "../assets/mainLogo.svg";
import {
  MenuOutlined,
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const Navbar = ({ showDrawer }) => {
  const navigate = useNavigate();

  const [drawerVisible, setDrawerVisible] = useState(false);

  const handleSignOut = () => {
    // signOutAdmin();
    navigate("/login");
  };

  const profileMenuItems = [
    {
      key: "profile",
      label: (
        <Link to="/profile" className="flex items-center gap-2 px-1 py-2">
          <UserOutlined /> Profile
        </Link>
      ),
    },
    {
      key: "logout",
      label: (
        <span
          onClick={handleSignOut}
          className="flex items-center gap-2 px-1 py-2 hover:bg-gray-100"
        >
          <LogoutOutlined /> Logout
        </span>
      ),
    },
  ];

  return (
    <header className="w-full bg-[#FFFFFF] shadow-sm fixed top-0 z-50 py-[6px] ">
      <div className=" mx-2 lg:ml-[30px] lg:mr-24 ">
        <div className="flex items-center justify-between h-16 ">
          {/* Left section */}
          <div className="flex items-center">
            <Button
              type="text"
              className="md:hidden mr-2"
              icon={<MenuOutlined className="text-lg" />}
              onClick={showDrawer}
            />

            <button
              // onClick={hinddleOnClick}
              className="flex items-center space-x-1 lg:space-x-2 xl:space-x-3 logo-container cursor-pointer lg:mr-4"
            >
              <div className="relative hidden lg:block">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <svg
                    className="w-7 h-7 text-white transform -rotate-3"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                  </svg>
                </div>
                <div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-[#00ff8c] rounded-full animate-pulse"
                  style={{ animation: "pulse-glow 2s ease-in-out infinite" }}
                ></div>
              </div>
              <div className="mt-3">
                <h2 className="text-2xl font-bold logo-gradient leading-tight">
                  ViralScript
                  <span className="text-[#ff3898]">Library</span>
                </h2>
              </div>
            </button>

            {/* <Link 
              to="/" 
              className="text-3xl font-bold  text-purple-500 whitespace-nowrap"
            >
                ViralScriptLibrary
            </Link> */}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-4 lg:gap-8">
            <Badge
              count={10}
              size="small"
              className="cursor-pointer p-2 rounded-full bg-gray-300 hover:text-blue-500 transition-colors"
            >
              <BellOutlined
                className="text-2xl"
                onClick={() => setDrawerVisible(true)}
              />
            </Badge>

            <Dropdown
              menu={{ items: profileMenuItems }}
              trigger={["click"]}
              placement="bottomRight"
              overlayClassName="w-48"
            >
              <Avatar
                icon={<UserOutlined className="" />}
                size="large"
                className="cursor-pointer border border-gray-300 hover:opacity-80 transition-opacity"
              />
            </Dropdown>
          </div>
        </div>
      </div>

      <Drawer
        title="Notifications"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={300}
        bodyStyle={{ padding: 0 }}
      >
        <div className="p-4">
          <p>No new notifications</p>
        </div>
      </Drawer>
    </header>
  );
};

export default Navbar;
