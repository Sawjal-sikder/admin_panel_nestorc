import React, { useEffect, useState } from "react";
import API from "../../services/api.jsx";
import defaultprofile from "../../assets/icon/profile.jpg";
import {
  Modal,
  Typography,
  Avatar,
  Divider,
  Space,
} from "antd";
import {
  UserOutlined,
  MailOutlined,

} from "@ant-design/icons";

const { Title, Text } = Typography;

function UserDetailsModal({ id, isOpen, onClose }) {
  const [userDetailsData, setUserDetailsData] = useState(null);

  const fetchUserDetails = async (id) => {
    try {
      const response = await API.get(`/auth/users/${id}/`);
      setUserDetailsData(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    if (isOpen && id) {
      fetchUserDetails(id);
    }
  }, [isOpen, id]);

  return (
    <Modal
      title={
        <Title level={3} className="!text-[#FE7400] !mb-0">
          User Details
        </Title>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={600}
      className="user-details-modal"
    >

      <div className="text-center mb-6">
        <Avatar
          size={120}
          src={<img src={userDetailsData?.profile || defaultprofile} alt="avatar" />}
          className="border-4 border-black"
        />
        <Title level={3} className="!mt-2 !mb-1">
          {userDetailsData?.full_name || "Full Name"}
        </Title>
      </div>

      <Divider className="!my-4" />

      <div className="">
        <Space align="center">
          <UserOutlined className="text-[#FE7400] text-[18px]" />
          <Text strong>
            <span className="text-[18px]">Name:</span>
          </Text>
        </Space>
        <Text className="ml-1 text-[18px] text-[#1F2937]">
          {userDetailsData?.full_name || "Full Name"}
        </Text>
      </div>

      <div className="mt-2">
        <Space align="center">
          <MailOutlined className="text-[#FE7400] text-[18px]" />
          <Text strong>
            <span className="text-[18px]">Email:</span>
          </Text>
        </Space>
        <Text className="ml-1 text-[18px] text-[#1F2937]">
          {userDetailsData?.email || "email@example.com"}
        </Text>
      </div>
    </Modal>
  );
}

export default UserDetailsModal;
