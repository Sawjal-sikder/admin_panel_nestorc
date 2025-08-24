import React, { useState } from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import { Link } from "react-router-dom";
import API from "../../services/api";

function ChangePassword() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await API.post("/auth/change-password/", {
        old_password: values.current_password,
        new_password: values.password,
        confirm_password: values.confirmPassword,
      });
      console.log("Password change response:", response.data);
      message.success("Password updated successfully!");
      form.resetFields(); // reset form after success
    } catch (error) {
      if (error.response && error.response.data) {
        const data = error.response.data;
        if (data.old_password) message.error(data.old_password[0]);
        else if (data.new_password) message.error(data.new_password[0]);
        else if (data.confirm_password) message.error(data.confirm_password[0]);
        else message.error("Password update failed.");
        console.error("Error response:", data);
      } else {
        message.error("Password update failed. Please try again.");
        console.error("Error:", error);
      }
    } finally {
      setLoading(false);
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
