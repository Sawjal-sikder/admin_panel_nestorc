import React, { useState } from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import { Link } from "react-router-dom";
// import { API } from "../../api/api";

const Login = () => {
  const [loading, setLoading] = useState(false); // Loading state for login button

  const onFinish = async (values) => {
    setLoading(true); // Start loading when submitting form
    try {
      // const response = await API.post("/admin/login", {
      //   email: values.email,
      //   password: values.password,
      // });

      // // If successful, save the token in localStorage
      // localStorage.setItem("token", response.data.data.token);

      // Show success message
      message.success("Login successful!");

      // Redirect to the admin dashboard (replace with your route)
      window.location.href = "/";
    } catch (error) {
      // Show error message
      message.error(
         "Login failed. Please try again." // error.response?.data?.message
      );
    } finally {
      setLoading(false); // Stop loading after request
    }
  };

  const onFinishFailed = (errorInfo) => {
    message.error("Please input valid email and password.");
  };



  return (
    <div className="flex justify-center items-center min-h-screen ">
      <div className=" p-8 py-24 shadow-2xl rounded-lg w-[530px] h-[635px]">
        <h2 className="text-[30px] text-[#222222] font-bold text-center mb-6">Sign In to Account</h2>
        <h6 className="text-center text-[#4E4E4E] mb-6 text-[18px]">Please enter your email and password to continue</h6>
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          // autoComplete="off"
        >
          {/* Email Field */}
          <div className="mb-4">
            <label className="text-[18px] text-[#222222] block mb-1">Email address:</label>
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input type="email" className="p-3" placeholder="Enter your email..." />
            </Form.Item>
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label className="text-[18px] text-[#222222] block mb-1">Password:</label>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password className="p-3" placeholder="Enter your password..." />
            </Form.Item>
          </div>

          {/* Remember Me */}
          <div className="mb-4 flex justify-between">
            <Form.Item name="remember" valuePropName="checked">
              <Checkbox><span className="text-[16px] text-[#4E4E4E]">Remember me</span></Checkbox>
            </Form.Item>
            {/* <Link to='/forget-password' className="text-[#3F5EAB] text-[16px]" >Forget Password?</Link> */}
          </div>

          {/* Submit Button */}
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
