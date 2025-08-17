import React, { useState, useEffect } from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../../services/api"; // your global Axios instance
import { useAuth } from "../../hook/useAuth";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useAuth();

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const user = localStorage.getItem("user");
    if (token && user) {
      navigate("user-management", { replace: true });
    }
  }, [navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await API.post("/auth/login/", {
        email: values.email,
        password: values.password,
      });

      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      login(res.data.user);

      message.success("Login successful!");
      navigate("/user-management", { replace: true });
    } catch (error) {
      message.error(error.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    message.error("Please input valid email and password.");
  };

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <div className=" p-8 py-24 shadow-2xl rounded-lg w-[530px] h-[635px]">
        <h2 className="text-[30px] text-[#222222] font-bold text-center mb-6">
          Sign In to Account
        </h2>
        <h6 className="text-center text-[#4E4E4E] mb-6 text-[18px]">
          Please enter your email and password to continue
        </h6>
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <div className="mb-4">
            <label className="text-[18px] text-[#222222] block mb-1">
              Email address:
            </label>
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input type="email" className="p-3" placeholder="Enter your email..." />
            </Form.Item>
          </div>

          <div className="mb-4">
            <label className="text-[18px] text-[#222222] block mb-1">
              Password:
            </label>
            <Form.Item
              name="password"
              rules={[{ required: true, message: "Please input your password!" }]}
            >
              <Input.Password className="p-3" placeholder="Enter your password..." />
            </Form.Item>
          </div>

          <div className="mb-4 flex justify-between">
            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>
                <span className="text-[16px] text-[#4E4E4E]">Remember me</span>
              </Checkbox>
            </Form.Item>
          </div>

          <div className="mb-4">
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full py-6 text-[18px] font-semibold my-main-button"
                loading={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
