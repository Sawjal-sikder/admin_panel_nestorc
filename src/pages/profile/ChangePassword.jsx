import React, { useState } from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import { Link } from "react-router-dom";

function ChangePassword() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    if (values.password !== values.confirmPassword) {
      message.error("Password and Confirm Password do not match!");
      return;
    }

    setLoading(true); // Start loading when submitting form
    try {
      console.log(values);
      // const response = await API.post("/admin/set-new-password", {
      //   password: values.password,
      // });

      // // If successful, save the token in localStorage
      // localStorage.setItem("token", response.data.data.token);

      // Show success message
      message.success("Password updated successfully!");

      // Redirect to the admin dashboard (replace with your route)
      //   window.location.href = "/";
    } catch (error) {
      // Show error message
      message.error(
        "Password update failed. Please try again." // error.response?.data?.message
      );
    } finally {
      setLoading(false); // Stop loading after request
    }
  };

  const onFinishFailed = (errorInfo) => {
    message.error("Please input valid password.");
  };

  return (
    <div className=" text-left mt-4 mx-[-70px] ">
      <h2 className="text-[24px] text-center">Change Password</h2>

      <Form
        form={form}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        {/* Password Field */}
        <div className="mb-4">
          <label className="text-[18px]  block mb-1">
            Current Password:
          </label>
          <Form.Item
            name="current_password"
            rules={[
              {
                required: true,
                message: "Please input your Current Password!",
              },
            ]}
          >
            <Input.Password
              className="p-3 text-[16px]"
              placeholder="Enter your Current password..."
            />
          </Form.Item>
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <label className="text-[18px]  block mb-1">
            New Password:
          </label>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please input your New Password!" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password
              className="p-3 text-[16px]"
              placeholder="Enter your new password..."
            />
          </Form.Item>
        </div>

        {/* Confirm Password Field */}
        <div className="mb-4">
          <label className="text-[18px]  block mb-1">
            Confirm Password:
          </label>
          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password
              className="p-3 text-[16px] "
              placeholder="Confirm your password..."
            />
          </Form.Item>
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
              {loading ? "Saving..." : "Save Change"}
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
}

export default ChangePassword;
