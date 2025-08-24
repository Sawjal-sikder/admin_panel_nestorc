import React, { useState, useEffect } from "react"; // 
import { Form, Input, Button, message } from "antd";
import API from "../../services/api";

function EditProfile({ userDataMain }) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await API.get("/auth/users/update/");
        const userData = response.data;
        // console.log("Fetched user data:", userData);

        form.setFieldsValue({
          user_name: userData.full_name || "",
          email: userData.email || "",
          contact_no: userData.phone_number || "",

        });
        // full_name and profile_image
        userDataMain(userData.full_name || "", userData.profile_image || "", userData.email || "", userData.phone_number || "");
      } catch (error) {
        // console.error("Failed to fetch user data:", error);
      }
    };

    fetchUser();
  }, [form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        full_name: values.user_name,
        email: values.email,
        phone_number: values.contact_no,
        is_active: true,
      };

      const response = await API.patch("/auth/users/update/", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      message.success("Profile updated successfully.");
      // console.log("Updated:", response.data);
    } catch (error) {
      // console.error(error.response?.data || error);
      message.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = () => {
    message.error("Please input valid information.");
  };

  return (
    <div className="text-left mt-4 mx-[-70px]">
      <h2 className="text-[24px] text-center">Edit Your Profile</h2>

      <Form
        form={form}
        name="edit-profile"
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="User Name"
          name="user_name"
          rules={[{ required: true, message: "Please input your User Name!" }]}
        >
          <Input className="p-3 text-[16px]" placeholder="Enter your User Name..." />
        </Form.Item>

        <Form.Item
          label="Email Address"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input type="email" className="p-3" placeholder="Enter your email..." />
        </Form.Item>

        <Form.Item
          label="Contact No"
          name="contact_no"
          rules={[{ required: true, message: "Please input your Contact no!" }]}
        >
          <Input className="p-3 text-[16px]" placeholder="Enter your Contact no..." />
        </Form.Item>


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
      </Form>
    </div>
  );
}

export default EditProfile;
