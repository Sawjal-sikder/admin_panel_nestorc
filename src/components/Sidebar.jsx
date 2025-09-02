import { Menu } from "antd";
import {
  AppstoreOutlined,
  ContainerOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUsers } from "react-icons/fa";
import { MdOutlinePayment, MdLeaderboard } from "react-icons/md";
import { FaBuildingFlag } from "react-icons/fa6";
import { SlBadge } from "react-icons/sl";
import { TbPackages } from "react-icons/tb";

// import { signOutAdmin } from "../api/api";

const { SubMenu } = Menu;

const Sidebar = ({ onClick }) => {
  const location = useLocation();

  const navigate = useNavigate();
  const handleSignOut = () => {
    // signOutAdmin();
    navigate("/login");
  };

  // Determine the selected key based on current route
  const getSelectedKey = () => {
    const path = location.pathname;
    // if (path === "/") return ["dashboard"];
    if (path === "/") return ["users"];
    if (path === "/venue") return ["venue"];
    if (path === "/profile") return ["settings", "setting-profile"];
    if (path === "/city") return ["settings", "city"];
    if (path === "/geo-fences") return ["settings", "geo-fences"];
    if (path === "/privacy-policy") return ["settings", "privacy-policy"];
    return ["dashboard"];
  };

  const sidebarItems = [
    // {
    //   key: "dashboard",
    //   icon: <AppstoreOutlined />,
    //   label: <Link to="/">Dashboard</Link>,
    // },
    {
      key: "users",
      icon: <FaUsers />,
      label: <Link to="/">User Management</Link>,
    },
    {
      key: "venue",
      icon: <TbPackages />,
      label: <Link to="/venue">Venue</Link>,
    },
    {
      key: "city",
      icon: <TbPackages />,
      label: <Link to="/city">City</Link>,
    },
    {
      key: "geo-fences",
      icon: <TbPackages />,
      label: <Link to="/geo-fences">Geo Fences</Link>,
    },
    // {
    //   key: "settings",
    //   icon: <SettingOutlined />,
    //   label: "Settings",
    //   className: "custom-submenu ", // Add this
    //   popupClassName: "custom-submenu-popup bg-red-500", // Add this
    //   children: [
    //     {
    //       key: "setting-profile",
    //       label: <Link to="/profile">Profile</Link>,
    //     },
    //     {
    //       key: "terms-conditions",
    //       label: <Link to="/terms-conditions">Terms & Conditions</Link>,
    //     },
    //     {
    //       key: "privacy-policy",
    //       label: <Link to="/privacy-policy">Privacy Policy</Link>,
    //     },
    //   ],
    // },

    // Add logout as a menu item at the bottom
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      className: "bottom-20",
      onClick: handleSignOut,
      style: {
        position: "absolute",
        width: "100%",
      },
      danger: true,
    },
  ];

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={getSelectedKey()}
        items={sidebarItems}
        onClick={onClick}
        style={{
          height: "calc(100% - 64px)",
          backgroundColor: "#ffffff",
          color: "#002436",
        }}
      // theme="dark"
      />
    </div>
  );
};

export default Sidebar;
