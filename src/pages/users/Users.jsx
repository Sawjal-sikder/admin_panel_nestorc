import { useState } from "react";
import {
  Table,
  Tag,
  Space,
  Avatar,
  Button,
  Modal,
  notification,
  Skeleton,
  Alert,
} from "antd";
import { key } from "localforage";
import { MdBlock } from "react-icons/md";
import UserDetailsModal from "./UserDetailsModal";

import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import IsLoading from "../../components/IsLoading";
import IsError from "../../components/IsError";
import { useAllUsers } from "../../services/usersServices";

const { confirm } = Modal;

function UsersPage() {
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
  });

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [userDetailsData, setUserDetailsData] = useState(null);
  const [blockLoading, setBlockLoading] = useState(false);

  const { allUsers, pagination, isLoading, isError, error, refetch } =
    useAllUsers(filter);

  if (isLoading) {
    return <IsLoading />;
  }

  if (isError) {
    return <IsError error={error} refetch={refetch} />;
  }

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      placement: "topRight",
      duration: 3,
    });
  };

  const showDeleteConfirm = (id) => {
    confirm({
      title: "Are you sure you want to Block this user?",
      icon: <ExclamationCircleOutlined />,
      content: "Do you want to Block this user?",
      okText: "Yes, Block",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        handleBlock(id);
      },
    });
  };

  const handleBlock = async (id) => {
    setBlockLoading(true);
    try {
      console.log(id);
      // await API.delete(`/courses/delete/${id}`);
      openNotification("success", "Success", "User blocked successfully");
      refetch();
    } catch (error) {
      openNotification("error", "Error", "Failed to block user");
    } finally {
      setBlockLoading(false);
    }
  };

  const handleUserDetails = (userData) => {
    setUserDetailsData(userData);
    setIsViewModalOpen(true);
  };

  const handleModalClose = () => {
    setUserDetailsData(null);
    setIsViewModalOpen(false);
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setFilter((prev) => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
    }));
  };

  const columns = [
    {
      title: <span className="text-[20px] !text-center">User</span>,
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Space size="middle">
          <Avatar className="w-[40px] h-[40px]" src={record.profile} />
          <span className=" text-[16px]">{text}</span>
        </Space>
      ),
    },

    {
      title: <span className="text-[20px]">Email</span>,
      dataIndex: "email",
      key: "email",
      render: (email) => (
        <span className=" text-[16px]">{email}</span>
      ),
    },
    {
      title: <span className="text-[20px]">Status</span>,
      key: "status",
      render: (_, record) => (
        <Tag
          className="w-full mr-5 text-center text-[20px] py-3"
          color={record.status === "active" ? "#359700" : "#FE7400B2"}
        >
          {record.status === "active" ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: <span className="text-[20px]">Action</span>,
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <EyeOutlined
            onClick={() => handleUserDetails(record)}
            className="text-[23px] cursor-pointer"
          />

          <MdBlock
            className="text-[23px] text-red-400 hover:text-red-300 cursor-pointer"
            loading={blockLoading}
            onClick={() => showDeleteConfirm(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="">
      <Table
        columns={columns}
        dataSource={allUsers}
        rowKey="id"
        pagination={{
          current: filter.page,
          pageSize: filter.limit,
          total: pagination.totalUser,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
        onChange={handleTableChange}
        loading={isLoading}
        // bordered
        className="custom-dark-table"
        rowClassName={() => "dark-table-row"}
      />

      <UserDetailsModal
        userDetailsData={userDetailsData}
        isOpen={isViewModalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
}

export default UsersPage;
