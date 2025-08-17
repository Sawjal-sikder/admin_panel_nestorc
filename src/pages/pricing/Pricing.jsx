import React, { useState } from "react";
import {
  Card,
  Button,
  Switch,
  Modal,
  Form,
  Input,
  InputNumber,
  Checkbox,
} from "antd";
import { GiConfirmed, GiCancel } from "react-icons/gi";
import { FiEdit } from "react-icons/fi";
import { usePricing } from "../../services/pricingService";
import IsLoading from "../../components/IsLoading";
import IsError from "../../components/IsError";

function Pricing() {
  const { pricingData, isLoading, isError, error, refetch } = usePricing();
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [form] = Form.useForm();

  if (isLoading) return <IsLoading />;
  if (isError) return <IsError error={error} refetch={refetch} />;

  const calculateDiscountPercentage = (regular, discount) => {
    const reg = parseFloat(regular);
    const dis = parseFloat(discount);
    return Math.round(((reg - dis) / reg) * 100);
  };

  const handleEditClick = (plan) => {
    setEditingPlan(plan);
    form.setFieldsValue({
      ...plan,
      access_scripts_per_month:
        plan.access_scripts_per_month === -1
          ? 0
          : plan.access_scripts_per_month,
    });
    setIsEditModalOpen(true);
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    form.resetFields();
  };

  const handleSaveChanges = (values) => {
    console.log("Saving changes:", values);
    // Here you would typically call an API to save changes
    setIsEditModalOpen(false);
    form.resetFields();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pricingData.map((plan) => {
          const isPopular = plan.id === 2;
          const discountPercentage =
            billingCycle === "monthly"
              ? calculateDiscountPercentage(
                  plan.regular_price_per_month,
                  plan.discount_price_per_month
                )
              : calculateDiscountPercentage(
                  plan.regular_price_per_year,
                  plan.discount_price_per_year
                );

          const price =
            billingCycle === "monthly"
              ? plan.discount_price_per_month
              : plan.discount_price_per_year;

          const regularPrice =
            billingCycle === "monthly"
              ? plan.regular_price_per_month
              : plan.regular_price_per_year;

          const billingText = billingCycle === "monthly" ? "month" : "year";

          return (
            <div
              key={plan.id}
              className={`relative h-full transform transition-all hover:scale-105 ${
                isPopular ? "scale-105" : "hover:-translate-y-2"
              }`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-sm font-bold px-4 py-1 rounded-full shadow-lg z-10">
                  MOST POPULAR
                </div>
              )}

              <Card
                bordered={false}
                className={`h-full rounded-xl shadow-lg overflow-hidden ${
                  isPopular
                    ? "border-2 border-blue-600"
                    : "border border-gray-200"
                }`}
              >
                {/* Edit icon in top-right corner */}
                <div className="absolute top-1 right-1 z-10">
                  <FiEdit
                    className="text-gray-600 hover:text-blue-600 cursor-pointer text-xl transition-colors"
                    onClick={() => handleEditClick(plan)}
                  />
                </div>

                <div
                  className={`p-1 text-center rounded-3xl pt-2 ${
                    plan.id === 2
                      ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                      : plan.id === 1
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500"
                      : "bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%"
                  }`}
                >
                  <h3
                    className={`text-xl font-bold ${
                      isPopular ? "text-white" : "text-gray-100"
                    }`}
                  >
                    {plan.title}
                  </h3>
                </div>

                <div className="p-6">
                  <div className="text-center mb-8">
                    <div className="flex justify-center items-baseline mt-4">
                      <span className="text-4xl font-bold text-gray-900">
                        ${price}
                      </span>
                      <span className="text-lg text-gray-600">
                        /{billingText}
                      </span>
                    </div>
                    <div className="mt-2">
                      <span className="line-through text-gray-400 mr-2">
                        ${regularPrice}
                      </span>
                      <span className="bg-green-100 text-green-800 text-sm font-semibold px-2 py-1 rounded">
                        Save {discountPercentage}%
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    <FeatureItem
                      available={true}
                      text={
                        plan.access_scripts_per_month === -1
                          ? "Unlimited scripts per month"
                          : `${plan.access_scripts_per_month} scripts per month`
                      }
                    />
                    <FeatureItem
                      available={plan.full_scripts_library_access}
                      text="Full scripts library access"
                    />
                    <FeatureItem
                      available={plan.downloadable_template}
                      text="Downloadable templates"
                    />
                    <FeatureItem
                      available={plan.ai_screept_generator}
                      text="AI Script Generator"
                    />
                  </ul>
                </div>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      <Modal
        title={`Edit ${editingPlan?.title} Plan`}
        open={isEditModalOpen}
        onCancel={handleCancelEdit}
        footer={[
          <Button key="cancel" onClick={handleCancelEdit}>
            Cancel
          </Button>,
          <Button
            key="save"
            type="primary"
            onClick={() => form.submit()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Save Changes
          </Button>,
        ]}
        centered
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveChanges}
          initialValues={editingPlan || {}}
        >
          <Form.Item
            name="title"
            label="Plan Title"
            rules={[{ required: true, message: "Please enter plan title" }]}
          >
            <Input />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="discount_price_per_month"
              label="Monthly Discount Price ($)"
              rules={[{ required: true, message: "Please enter price" }]}
            >
              <InputNumber min={0} step={0.01} className="w-full" />
            </Form.Item>

            <Form.Item
              name="regular_price_per_month"
              label="Monthly Regular Price ($)"
              rules={[{ required: true, message: "Please enter price" }]}
            >
              <InputNumber min={0} step={0.01} className="w-full" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="discount_price_per_year"
              label="Yearly Discount Price ($)"
              rules={[{ required: true, message: "Please enter price" }]}
            >
              <InputNumber min={0} step={0.01} className="w-full" />
            </Form.Item>

            <Form.Item
              name="regular_price_per_year"
              label="Yearly Regular Price ($)"
              rules={[{ required: true, message: "Please enter price" }]}
            >
              <InputNumber min={0} step={0.01} className="w-full" />
            </Form.Item>
          </div>

          <Form.Item
            name="access_scripts_per_month"
            label="Scripts per Month"
            help="Enter -1 for unlimited"
            rules={[{ required: true, message: "Please enter value" }]}
          >
            <InputNumber min={-1} className="w-full" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="full_scripts_library_access"
              valuePropName="checked"
              label="Full Library Access"
            >
              <Checkbox />
            </Form.Item>

            <Form.Item
              name="downloadable_template"
              valuePropName="checked"
              label="Downloadable Templates"
            >
              <Checkbox />
            </Form.Item>
          </div>

          <Form.Item
            name="ai_screept_generator"
            valuePropName="checked"
            label="AI Script Generator"
          >
            <Checkbox />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

const FeatureItem = ({ available, text }) => (
  <li className="flex items-start">
    {available ? (
      <GiConfirmed className="text-green-500 text-xl mr-2 flex-shrink-0 mt-1" />
    ) : (
      <GiCancel className="text-red-500 text-xl mr-2 flex-shrink-0 mt-1" />
    )}
    <span className={available ? "text-gray-700" : "text-gray-400"}>
      {text}
    </span>
  </li>
);

export default Pricing;
