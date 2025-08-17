import React, { useRef, useState } from "react";
import { Avatar, Tabs } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { MdLockReset } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";
import { FiCamera } from "react-icons/fi";
import EditProfile from "./EditProfile";
import ChangePassword from "./ChangePassword";

const { TabPane } = Tabs;

function Profile() {
  const fileInputRef = useRef(null);
  const [avatarUrl, setAvatarUrl] = useState(
    "https://images.news18.com/ibnlive/uploads/2021/08/shah-rukh-khan-01-16300515664x3.jpg"
  );

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="text-center relative">
        {/* Avatar */}
        <div className="relative w-[120px] h-[120px] mx-auto">
          <Avatar
            className="w-full h-full border-white border-[1px]"
            src={<img src={avatarUrl} alt="avatar" />}
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
          Shah Rukh Khan
        </h2>

        {/* Tabs */}
        <Tabs defaultActiveKey="1" className="custom-tabs mb-6 mt-4">
          <TabPane
            tab={
              <span className="flex items-center gap-2">
                <FaUserEdit />
                <span>Edit Profile</span>
              </span>
            }
            key="1"
          >
            <EditProfile />
          </TabPane>

          <TabPane
            tab={
              <span className="flex items-center gap-2">
                <MdLockReset />
                <span>Change Password</span>
              </span>
            }
            key="2"
          >
            <ChangePassword />
          </TabPane>
        </Tabs>
      </div>

      
      <style jsx global>{`
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
