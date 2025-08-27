import React, { useState } from "react";
import { Button, DatePicker, Form, Input, Select, Spin, Upload, message } from "antd";
import ImgCrop from "antd-img-crop";
import useFetchData from "./select/selectHook";
import API from "../../../services/api";

const { RangePicker } = DatePicker;

const formItemLayout = {
      labelCol: { xs: { span: 24 }, sm: { span: 6 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 14 } },
};

const CreateVenue = ({ onSuccess }) => {
      const [form] = Form.useForm();
      const [loading, setLoading] = useState(false);
      const variant = Form.useWatch("variant", form);
      const { data: cities, loading: citiesLoading } = useFetchData("/services/cities/");
      const { data: places, loading: placesLoading } = useFetchData("/services/places/");

      // Single image state
      const [fileList, setFileList] = useState([]);

      const onChange = ({ fileList: newFileList }) => {
            setFileList(newFileList.slice(-1)); // keep only 1 image
      };

      const onPreview = async (file) => {
            let src = file.url;
            if (!src) {
                  src = await new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.readAsDataURL(file.originFileObj);
                        reader.onload = () => resolve(reader.result);
                  });
            }
            const image = new Image();
            image.src = src;
            const imgWindow = window.open(src);
            imgWindow?.document.write(image.outerHTML);
      };

      const handleSubmit = async (values) => {
            setLoading(true);

            try {
                  const [latitude, longitude] = values["latitude&longitude"]
                        .split(",")
                        .map((v) => parseFloat(v.trim()));

                  const formData = new FormData();
                  formData.append("venue_name", values.venue_name);
                  formData.append("latitude", latitude);
                  formData.append("longitude", longitude);
                  formData.append("description", values.description);
                  formData.append("city", Number(values.city));
                  formData.append("type_of_place", Number(values.place));

                  if (fileList[0]?.originFileObj) {
                        formData.append("image", fileList[0].originFileObj);
                  }

                  const res = await API.post("/services/venues/create/", formData, {
                        headers: {
                              "Content-Type": "multipart/form-data",
                        },
                  });

                  // Reset form fields
                  form.resetFields();
                  // Clear image upload
                  setFileList([]);

                  // Call the success callback with the created venue data
                  if (onSuccess) {
                        onSuccess(res.data); // Pass the created venue data
                  }

            } catch (err) {
                  console.error(err.response?.data || err);
                  message.error("Failed to create venue. Please try again.");
            } finally {
                  setLoading(false);
            }
      };


      return (
            <Form
                  {...formItemLayout}
                  form={form}
                  variant={variant || "filled"}
                  style={{ maxWidth: 600 }}
                  initialValues={{ variant: "filled" }}
                  className="pt-10 border-t-2 border-gray-200"
                  onFinish={handleSubmit}
            >
                  {/* Venue Name */}
                  <Form.Item
                        label="Venue Name"
                        name="venue_name"
                        rules={[{ required: true, message: "Please input Venue Name!" }]}
                  >
                        <Input />
                  </Form.Item>

                  {/* Latitude & Longitude */}
                  <Form.Item
                        label="Lat & Lon"
                        name="latitude&longitude"
                        rules={[{ required: true, message: "Please input latitude and longitude!" }]}
                  >
                        <Input placeholder="Example: 32.665067, -96.774068" />
                  </Form.Item>

                  {/* Description */}
                  <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: "Please input description!" }]}
                  >
                        <Input.TextArea />
                  </Form.Item>

                  {/* City */}
                  <Form.Item
                        label="City"
                        name="city"
                        rules={[{ required: true, message: "Please select a city!" }]}
                  >
                        <Select
                              placeholder="Select a city"
                              allowClear
                              loading={citiesLoading}
                              disabled={citiesLoading}
                              options={cities.map((city) => ({ label: city.name, value: city.id }))}
                        />
                  </Form.Item>

                  {/* Place */}
                  <Form.Item
                        label="Place"
                        name="place"
                        rules={[{ required: true, message: "Please select a place!" }]}
                  >
                        <Select
                              placeholder="Select a place"
                              allowClear
                              loading={placesLoading}
                              disabled={placesLoading}
                              options={places.map((place) => ({ label: place.name, value: place.id }))}
                        />
                  </Form.Item>

                  {/* Upload Image */}
                  <Form.Item
                        label="Upload Image"
                        name="image"
                        valuePropName="fileList"  // this tells Form to use fileList as value
                        getValueFromEvent={(e) => {
                              // e is UploadChangeParam
                              if (Array.isArray(e)) return e;
                              return e?.fileList;
                        }}
                  // rules={[{ required: true, message: "Please upload an image!" }]}
                  >
                        <ImgCrop rotationSlider>
                              <Upload
                                    listType="picture-card"
                                    fileList={fileList}
                                    onChange={({ fileList: newFileList }) => setFileList(newFileList.slice(-1))}
                                    onPreview={onPreview}
                                    beforeUpload={() => false}
                                    maxCount={1}
                              >
                                    {fileList.length < 1 && "+ Upload"}
                              </Upload>
                        </ImgCrop>
                  </Form.Item>


                  {/* Submit */}
                  <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                        <Button type="primary" htmlType="submit" loading={loading}>
                              {loading ? "Creating..." : "Submit"}
                        </Button>
                  </Form.Item>
            </Form>
      );
};

export default CreateVenue;
