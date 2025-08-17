import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { EditOutlined } from "@ant-design/icons";
import { Button, Modal, Spin, message, Form } from "antd";
import { usePrivacyPolicy } from "../../services/privacyService";
import IsLoading from "../../components/IsLoading";
import IsError from "../../components/IsError";

function PrivacyPolicy() {
  const { privacyPolicyData, isLoading, isError, error, refetch } = usePrivacyPolicy();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [content, setContent] = useState("");
  const [form] = Form.useForm();

  const handleEdit = () => {
    setIsModalOpen(true);
    setContent(privacyPolicyData.content);
    form.setFieldsValue({
      content: privacyPolicyData.content,
    });
  };


  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setContent("");
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setIsSaving(true);

      // await API.put(`/settings/terms/update/${privacyPolicyData.id}`, {
      //   ...values,
      //   content,
      // });

      message.success("Terms information updated successfully");
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      message.error(error.message || "Failed to update terms.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <IsLoading />;
  }

  if (isError) {
    return <IsError error={error} refetch={refetch} />;
  }


  return (
    <div className=" min-h-[65vh] flex items-center justify-center">
      <div className="p-6 shadow-lg w-full">
        <div className="flex justify-between">
          <div>
            <p className="mb-2">
              <span className="font-bold">Terms:</span>
            </p>
          </div>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={handleEdit}
          >
            Edit
          </Button>
        </div>

        <p className="mb-2">
          <span className="font-bold">Last Updated:</span>{" "}
          {new Date(privacyPolicyData.updated_at).toLocaleString()}
        </p>

        <div dangerouslySetInnerHTML={{ __html: privacyPolicyData.content }} />
      </div>

      {/* Modal for Editing Terms */}
      <Modal
        title="Edit Terms Information"
        open={isModalOpen}
        onCancel={handleCancel}
        width={1000}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="save"
            type="primary"
            loading={isSaving}
            onClick={handleSave}
          >
            Save
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="content"
            label="Content"
            rules={[{ required: true, message: "Content is required" }]}
          >
            <ReactQuill theme="snow" value={content} onChange={(val) => {
              setContent(val);
              form.setFieldsValue({ content: val }); // sync with form
            }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default PrivacyPolicy;
