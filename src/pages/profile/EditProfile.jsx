import React, { useState } from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import { Link } from "react-router-dom";

function EditProfile() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
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
    message.error("Please input valid information.");
  };

  return (
    <div className=" text-left mt-4 mx-[-70px] ">
      <h2 className="text-[24px] text-center">Edit Your Profile</h2>

      <Form
        form={form}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        {/* User name Field */}
        <div className="">
          <label className="text-[18px]  block mb-1">
            User Name:
          </label>
          <Form.Item
            name="user_name"
            rules={[
              {
                required: true,
                message: "Please input your User Name!",
              },
            ]}
          >
            <Input
              className="p-3 text-[16px]"
              placeholder="Enter your User Name..."
            />
          </Form.Item>
        </div>

        {/* Email Field */}
        <div className="">
          <label className="text-[18px]  block mb-1">
            Email address:
          </label>
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input
              type="email"
              className="p-3"
              placeholder="Enter your email..."
            />
          </Form.Item>
        </div>

        {/* Contact no Field */}
        <div className="">
          <label className="text-[18px]  block mb-1">
            Contact no:
          </label>
          <Form.Item
            name="contact_no"
            rules={[
              {
                required: true,
                message: "Please input your Contact no!",
              },
            ]}
          >
            <Input
              className="p-3 text-[16px]"
              placeholder="Enter your Contact no..."
            />
          </Form.Item>
        </div>

        {/* Address Field */}
        <div className="">
          <label className="text-[18px]  block mb-1">Address:</label>
          <Form.Item
            name="address"
            rules={[
              {
                required: true,
                message: "Please input your Address!",
              },
            ]}
          >
            <Input
              className="p-3 text-[16px]"
              placeholder="Enter your Address..."
            />
          </Form.Item>
        </div>

        {/* Submit Button */}
        <div className="">
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

export default EditProfile;
