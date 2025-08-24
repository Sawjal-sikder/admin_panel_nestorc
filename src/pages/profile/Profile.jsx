import React, { useRef, useState } from "react";
import { Avatar, Tabs, message } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { MdLockReset } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";
import { FiCamera } from "react-icons/fi";
import EditProfile from "./EditProfile";
import ChangePassword from "./ChangePassword";
import API from "../../services/api";

const { TabPane } = Tabs;

function Profile() {
  const [data, setData] = useState({ name: "", image: "", email: "", phone_number: "" });
  const fileInputRef = useRef(null);
  const [avatarUrl, setAvatarUrl] = useState(
    "https://cdn-icons-png.flaticon.com/512/6522/6522516.png"
  );

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profile_image", file);

    try {
      const response = await API.patch("/auth/users/update/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setData((prev) => ({
        ...prev,
        image: response.data.profile_image, // update avatar URL
      }));

      message.success("Profile picture updated successfully!");
    } catch (error) {
      console.error(error.response?.data || error);
      message.error("Failed to update profile picture.");
    }
  };
  const handleNameImageChange = (newName, newImage, newEmail, newPhoneNumber) => {
    setData({ name: newName, image: newImage, email: newEmail, phone_number: newPhoneNumber });
  };

  return (
    <div className="flex justify-center items-center">
      <div className="text-center relative">
        {/* Avatar */}
        <div className="relative w-[120px] h-[120px] mx-auto">
          <Avatar
            className="w-full h-full border-white border-[1px]"
            src={<img src={data.image} alt="avatar" />}
          />
          {/* Camera Icon */}
          <div
            onClick={handleAvatarClick}
            className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow cursor-pointer hover:bg-orange-500 transition duration-200"
            title="Change Profile Picture"
          >
            <FiCamera className="text-black text-[18px]" />
          </div>
          {/* Hidden File Input */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <h2 className="text-[30px] font-semibold  mt-4">
          {data.name || "User Name"}
        </h2>

        {/* Tabs */}
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: "1",
              label: (
                <span className="flex items-center gap-2">
                  <FaUserEdit /> Edit Profile
                </span>
              ),
              children: <EditProfile userDataMain={handleNameImageChange} />,
            },
            {
              key: "2",
              label: (
                <span className="flex items-center gap-2">
                  <MdLockReset /> Change Password
                </span>
              ),
              children: <ChangePassword />,
            },
          ]}
        />
      </div>


      <style >{`
        .custom-tabs .ant-tabs-tab {
          font-size: 16px;
          padding: 12px 16px;
        }

        .custom-tabs .ant-tabs-tab:hover {
          color: #fe7400 !important;
        }

        .custom-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
          color: #fe7400 !important;
          font-weight: 500;
        }

        .custom-tabs .ant-tabs-ink-bar {
          background: #fe7400 !important;
          height: 3px !important;
        }

        .custom-tabs .ant-tabs-nav::before {
          border-bottom: 1px solid #5d6d7e !important;
        }

        .custom-tabs .ant-tabs-tab + .ant-tabs-tab {
          margin-left: 24px;
        }
      `}</style>
    </div>
  );
}

export default Profile;
