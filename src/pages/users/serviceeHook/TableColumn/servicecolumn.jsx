import React from "react";
import { Space, Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { MdBlock } from "react-icons/md";

const TableColumn = ({ handleUserDetails, blockLoading, handleToggleActive }) => {
      return [
            {
                  title: "Venue name",
                  dataIndex: "venue_name",
                  key: "venue_name",
                  render: (text) => <a>{text}</a>,
            },
            {
                  title: "Latitude",
                  dataIndex: "latitude",
                  key: "latitude",
                  render: (text) => <a>{text}</a>,
            },
            {
                  title: "Longitude",
                  dataIndex: "longitude",
                  key: "longitude",
                  render: (text) => <a>{text}</a>,
            },
            {
                  title: "City",
                  dataIndex: "city",
                  key: "city",
                  render: (text) => <a>{text}</a>,
            },
            {
                  title: "Type of place",
                  dataIndex: "type_of_place",
                  key: "type_of_place",
            },
            {
                  title: "Action",
                  key: "action",
                  render: (_, record) => (
                        <Space size="middle">
                              <EyeOutlined
                                    onClick={() => handleUserDetails(record)}
                                    className="text-[23px] cursor-pointer text-black-300"
                              />
                              <Button
                                    type="text"
                                    loading={blockLoading}
                                    onClick={() => handleToggleActive && handleToggleActive(record.id)}
                                    icon={<MdBlock className="text-[23px] text-red-600" />}
                              />
                        </Space>
                  ),
            },
      ];
};

export default TableColumn;
