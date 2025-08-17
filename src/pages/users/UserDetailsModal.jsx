import React from "react";
import {
  Modal,
  Typography,
  Avatar,
  Divider,
  Tag,
  Row,
  Col,
  Space,
  Statistic,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  StarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

function UserDetailsModal({ userDetailsData, isOpen, onClose }) {
  const statusColor = userDetailsData?.status === "active" ? "green" : "red";
  const statusIcon =
    userDetailsData?.status === "active" ? (
      <CheckCircleOutlined />
    ) : (
      <CloseCircleOutlined />
    );

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
      {/* <Text type="secondary" className="block mb-6">
        Detailed information about {userDetailsData?.name}
      </Text> */}

      <div className="text-center mb-6">
        <Avatar
          size={120}
          src={<img src={userDetailsData?.profile} alt="avatar" />}
          className="border-2 border-[#FE7400]"
        />
        <Title level={3} className="!mt-2 !mb-1">
          {userDetailsData?.name}
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
          {userDetailsData?.name}
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
          {userDetailsData?.email}
        </Text>
      </div>

      <div className="mt-2">
        <Space align="center">
          <EnvironmentOutlined className="text-[#FE7400] text-[18px]" />
          <Text strong>
            <span className="text-[18px]">Location:</span>
          </Text>
        </Space>
        <Text className="ml-1 text-[18px] text-[#1F2937]">
          {userDetailsData?.location}
        </Text>
      </div>

      <div className="mt-2">
        <Space align="center">
          <ClockCircleOutlined className="text-[#FE7400] text-[18px]" />
          <Text strong>
            <span className="text-[18px]">Age:</span>
          </Text>
        </Space>
        <Text className="ml-1 text-[18px] text-[#1F2937]">
          {userDetailsData?.age}
        </Text>
      </div>

      <div className="mt-2">
        <Space align="center">
          <ClockCircleOutlined className="text-[#FE7400] text-[18px]" />
          <Text strong>
            <span className="text-[18px] mr-2">Status:</span>
          </Text>
        </Space>

        <Tag
          icon={statusIcon}
          color={statusColor}
          className="!text-sm !py-1 !px-3"
        >
          {userDetailsData?.status}
        </Tag>
      </div>

      {/* <Divider className="!my-4" /> */}

      {/* <Row justify="center">
        <Col>
          <Statistic
            title={
              <Space>
                <StarOutlined className="text-[#FE7400]" />
                <Text>XP Earned</Text>
              </Space>
            }
            value={userDetailsData?.xp_earned}
            valueStyle={{ color: "#FE7400" }}
            className="text-center"
          />
        </Col>
      </Row> */}

      <style jsx global>{`
        .user-details-modal .ant-modal-body {
          padding: 24px;
        }
      `}</style>
    </Modal>
  );
}

export default UserDetailsModal;
