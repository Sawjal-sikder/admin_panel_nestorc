import React, { useState, useEffect } from "react";
import { Breadcrumb, Layout, Drawer } from "antd";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const { Header, Content, Sider } = Layout;

const MainLayout = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
  const location = useLocation();
  const navigate = useNavigate();

  // Breadcrumb create
  const generateBreadcrumbItems = () => {
    const pathnames = location.pathname.split("/").filter((x) => x);
    return [
      { title: "Dashboard", href: "/" },
      ...pathnames.map((value, index) => {
        const url = `/${pathnames.slice(0, index + 1).join("/")}`;
        return {
          title: value.charAt(0).toUpperCase() + value.slice(1),
          href: url,
        };
      }),
    ];
  };

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Layout>
      {/* Header */}
      <Header className="bg-[#FFFFFF] sticky top-0 z-10 w-full flex items-center p-0 h-16">
        <Navbar showDrawer={showDrawer} />
      </Header>

      <Layout>
        {isLargeScreen && (
          <Sider
            className="hidden lg:block h-screen fixed left-0 top-[76px]"
            width={320}
            style={{
              backgroundColor: "#FFFFFF",
              overflow: "auto",
              height: "100vh",
              position: "fixed",
              insetInlineStart: 0,
              bottom: 64,
              scrollbarWidth: "thin",
              scrollbarGutter: "stable",
            }}
          >
            <Sidebar />
          </Sider>
        )}

        <Drawer
          title="Navigation"
          placement="left"
          onClose={closeDrawer}
          open={drawerVisible}
          styles={{
            body: { padding: 0 },
          }}
        >
          <Sidebar onClick={closeDrawer} />
        </Drawer>

        <Layout style={{ marginLeft: isLargeScreen ? 320 : 0 }}>
          <Content>
            <div
              className="p-4 lg:px-12  min-h-[93vh]"
              // style={{ background: "#FFF7EB" }}
            >
              <div className="flex items-center gap-x-2 mb-5">
                <ArrowLeftOutlined
                  onClick={handleGoBack}
                  className="text-gray-500 text-[20px] lg:text-[30px] mt-1 font-semibold cursor-pointer hover:text-black"
                />

                <Breadcrumb
                  separator={<span style={{ color: "gray" }}>/</span>}
                  className=" text-[20px] lg:text-[32px] font-semibold"
                >
                  {generateBreadcrumbItems().map((item, index) => (
                    <Breadcrumb.Item key={index}>
                      <Link
                        to={item.href}
                      >
                        {item.title}
                      </Link>
                    </Breadcrumb.Item>
                  ))}
                </Breadcrumb>
              </div>

              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
  {/* <style jsx global>{`
        .custom-dark-table .ant-table {
          background-color: #4f6572;
          // border: 1px solid #989898;
          color: white;
        }
        .custom-dark-table .ant-table-thead > tr > th {
          background-color: #3a4a5a !important;
          color: white !important;
          border-bottom: 1px solid #5d6d7e;
        }

        .custom-dark-table .ant-table-thead > tr > th::before {
          display: none !important;
        }

        .custom-dark-table .ant-table-tbody > tr > td {
          background-color: #4f6572;
          border-bottom: 1px solid #5d6d7e;
        }
        .custom-dark-table .ant-table-tbody > tr:hover > td {
          background-color: #5d6d7e !important;
        }
        .dark-table-row {
          color: white;
        }
        .custom-dark-table .ant-pagination-item a {
          color: black;
        }
        .custom-dark-table .ant-pagination-item a:hover {
          color: white;
        }
        .custom-dark-table .ant-pagination-item-active {
          background-color: #cb5d00;
          border-color: #5d6d7e;
        }
        .custom-dark-table .ant-pagination-item-active a {
          color: white;
        }
        .custom-dark-table .ant-select-selector {
          background-color: #3a4a5a !important;
          color: white !important;
          border-color: #5d6d7e !important;
        }
        .custom-dark-table .ant-select-arrow {
          color: white !important;
        }
      `}</style> */}
    </Layout>
  );
};

export default MainLayout;
