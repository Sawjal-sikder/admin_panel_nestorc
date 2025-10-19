import { useState } from "react";
import { Table, Space, Avatar, Button, Modal, notification, Input } from "antd";
import { key } from "localforage";
import { MdBlock } from "react-icons/md";
import UserDetailsModal from "./UserDetailsModal";

import { EyeOutlined, ExclamationCircleOutlined, SearchOutlined } from "@ant-design/icons";
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

const handlePremium = async (userId, checked) => {
  try {
    await API.post(`auth/users/premium/${userId}/`, { is_premium: checked });
    
    // Refresh the user data after successful update
    refetch();
    
    openNotification(
      "success", 
      "Success", 
      `Premium status ${checked ? 'enabled' : 'disabled'} successfully`
    );
  } catch (error) {
    openNotification(
      "error", 
      "Error", 
      error.response?.data?.detail || "Failed to update premium status"
    );
    return;
  }
};

  const columns = [
    {
      title: <span className="text-md !text-center">Full Name</span>,
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
    }, 
    {
      title: <span className="text-md">Status</span>,
      dataIndex: "is_active",
      key: "is_active",
      render: (isActive) => (
        <span className="text-sm">{isActive ? "Active" : "Inactive"}</span>
      ),
    },
    {
      title: <span className="text-md">Premium User</span>,
      dataIndex: "is_premium",
      key: "is_premium",
      render: (isPremium, record) => (
        <div className="flex items-center gap-2">
          {/* <input type="checkbox" checked={isPremium}  onClick={() => handlePremium(isPremium)}/> */}
          <input 
            type="checkbox" 
            checked={isPremium} 
            onChange={(e) => handlePremium(record.id, e.target.checked)} 
          />
          <span className="text-sm">{isPremium ? "Yes" : "No"}</span>
        </div>
      ),
    },
    {
      title: <span className="text-md">Action</span>,
      key: "action",
      render: (_, record) => (
        <Space size="middle" key={record.email}>
          <EyeOutlined
            onClick={() => handleUserDetails(record.id)}
            className="text-[23px] cursor-pointer text-black-300"
          />

          <Button
            type="text"
            className="text-red-600"
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
  const DownloadPdf = async () => {
    try {
      const response = await API.get('/auth/users/download/pdf/', {
        params: filter,
        responseType: 'blob', // Ensure the response is treated as a blob
      });

      // Create a URL for the blob and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'users_list.pdf'); // Set the file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      openNotification("error", "Download Failed", "Failed to download user list PDF.");
    }
  };

  const DownloadExcel = async () => {
    try {
      const response = await API.get('/auth/users/download/excel/', {
        params: filter,
        responseType: 'blob', // Ensure the response is treated as a blob
      });

      // Create a URL for the blob and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'users_list.xlsx'); // Set the file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading Excel:", error);
      openNotification("error", "Download Failed", "Failed to download user list Excel.");
    }
  };


  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Users List</h2>
        <div className="flex gap-3">
          <Button type="primary" className="bg-red-600" onClick={() => DownloadPdf()}>
            Download user list pdf
          </Button>
          <Button type="primary" className="bg-[#107c41]" onClick={() => DownloadExcel()}>
            Download user list excel
          </Button>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="flex justify-between items-center">
        <Input.Search
          placeholder="Search users by name, email, or phone..."
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          className="max-w-md"
          onSearch={handleSearch}
          onChange={(e) => {
            if (e.target.value === '') {
              handleSearch('');
            }
          }}
        />
      </div>
      
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
