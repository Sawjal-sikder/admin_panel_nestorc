import { useState } from "react";
import { Table, Space, Avatar, Button, Modal, notification, } from "antd";
import { key } from "localforage";
import { MdBlock } from "react-icons/md";
import UserDetailsModal from "./UserDetailsModal";

import { EyeOutlined, ExclamationCircleOutlined, } from "@ant-design/icons";
import IsLoading from "../../components/IsLoading";
import IsError from "../../components/IsError";
import { useAllUsers } from "../../services/usersServices";
import API from "../../services/api.jsx";

const { confirm } = Modal;

function UsersPage() {
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
    search: "",
    ordering: "-created_at"  // newest first
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
    console.error(error);
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

  const handleToggleActive = async (id, currentStatus) => {
    const action = currentStatus ? "Deactivate" : "Activate";
    confirm({
      title: `Are you sure you want to ${action} this user?`,
      icon: <ExclamationCircleOutlined />,
      content: `Do you want to ${action} this user?`,
      okText: `Yes, ${action}`,
      okType: currentStatus ? "danger" : "primary",
      cancelText: "Cancel",
      onOk: async () => {

        try {
          const response = await API.patch(`/auth/users/activate/${id}/`, {
            is_active: !currentStatus,
          });
          notification.success({
            message: "Success",
            description: `User ${action.toLowerCase()}d successfully`,
            placement: "topRight",
            duration: 3,
          });
          refetch();
        } catch (error) {
          notification.error({
            message: "Error",
            description: error.response?.data?.detail || `Failed to ${action.toLowerCase()} user`,
            placement: "topRight",
            duration: 3,
          });
        }

      },
    });
  };

  const handleBlock = async (id) => {
    setBlockLoading(true);
    try {
      await API.post(`/auth/users/${id}/block/`);
      openNotification("success", "Success", "User blocked successfully");
      refetch();
    } catch (error) {
      openNotification("error", "Error", error.response?.data?.detail || "Failed to block user");
    } finally {
      setBlockLoading(false);
    }
  };

  const handleUserDetails = (id) => {
    setUserDetailsData(id);
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
      title: <span className="text-md !text-center">User</span>,
      dataIndex: "full_name",
      key: "full_name",
      render: (text, record) => (
        <Space size="middle" key={record.email}>
          <Avatar className="w-[40px] h-[40px]">{text?.[0]?.toUpperCase()}</Avatar>
          <span className="text-sm">{text}</span>
        </Space>
      ),
    },
    {
      title: <span className="text-md">E-mail address</span>,
      dataIndex: "email",
      key: "email",
      render: (email) => (
        <span className="text-sm">{email}</span>
      ),
    },
    {
      title: <span className="text-md">Phone</span>,
      dataIndex: "phone_number",
      key: "phone_number",
      render: (phone) => (
        <span className="text-sm">{phone}</span>
      ),
    }, {
      title: <span className="text-md">Status</span>,
      dataIndex: "is_active",
      key: "is_active",
      render: (isActive) => (
        <span className="text-sm">{isActive ? "Active" : "Inactive"}</span>
      ),
    },
    {
      title: <span className="text-md">Action</span>,
      key: "action",
      render: (_, record) => (
        <Space size="middle" key={record.email}>
          <EyeOutlined
            onClick={() => handleUserDetails(record.id)}
            className="text-[23px] cursor-pointer"
          />

          <Button
            type="text"
            loading={blockLoading}
            onClick={() => handleToggleActive(record.id, record.is_active)} // Using email instead of id
            icon={<MdBlock className="text-[23px] text-red-400 hover:text-red-300" />}
          />
        </Space>
      ),
    },
  ];

  const handleSearch = (value) => {
    setFilter(prev => ({
      ...prev,
      search: value,
      page: 1 // Reset to first page on new search
    }));
  };

  return (
    <div className="space-y-4">

      <Table
        columns={columns}
        dataSource={allUsers}
        rowKey="email" // Using email as the unique identifier
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
        id={userDetailsData}
        isOpen={isViewModalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
}

export default UsersPage;
