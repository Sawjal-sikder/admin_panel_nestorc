import React, { useState } from 'react';
import { Button, DatePicker, Form, Input, Select, Spin, Upload, } from 'antd';
import ImgCrop from "antd-img-crop";
import useFetchData from './select/selectHook';



const { Option } = Select;
const { RangePicker } = DatePicker;
const formItemLayout = {
      labelCol: {
            xs: { span: 24 },
            sm: { span: 6 },
      },
      wrapperCol: {
            xs: { span: 24 },
            sm: { span: 14 },
      },
};

const CreateVenue = () => {
      const [form] = Form.useForm();
      const variant = Form.useWatch('variant', form);
      const { data: cities, loading } = useFetchData("/services/cities/");
      const { data: places, loading: placesLoading } = useFetchData("/services/places/");
      const handleSubmit = (values) => {
            console.log(values);
      };

      const [fileList, setFileList] = useState([]);

      const onChange = ({ fileList: newFileList }) => {
            setFileList(newFileList);
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

      return (
            <Form
                  {...formItemLayout}
                  form={form}
                  variant={variant || 'filled'}
                  style={{ maxWidth: 600 }}
                  initialValues={{ variant: 'filled' }}
                  className='pt-10 border-t-2 border-gray-200'
                  onFinish={handleSubmit}
            >
                  {/* <Form.Item label="Form variant" name="variant">
                        <Segmented options={['outlined', 'filled', 'borderless', 'underlined']} />
                  </Form.Item> */}

                  <Form.Item label="Venue Name" name="venue_name" rules={[{ required: true, message: 'Please Venue Name!' }]}>
                        <Input />
                  </Form.Item>
                  <Form.Item label="Lat & Lon" name="latitude&longitude" rules={[{ required: true, message: 'Please input latitude and longitude!' }]}>
                        <Input />
                  </Form.Item>

                  <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: 'Please input description!' }]}
                  >
                        <Input.TextArea />
                  </Form.Item>

                  <Form.Item
                        label="City"
                        name="city"
                        rules={[{ required: true, message: 'Please select a city!' }]}
                  >
                        <div style={{ display: "flex", alignItems: "center" }}>
                              <Select
                                    placeholder="Select a city"
                                    allowClear
                                    loading={loading}
                                    disabled={loading}
                                    style={{ flex: 1 }}
                              >
                                    {cities
                                          .filter(city => city.id !== null && city.id !== undefined)
                                          .map((city) => (
                                                <Select.Option key={city.id} value={city.id}>
                                                      {city.name}
                                                </Select.Option>
                                          ))}
                              </Select>
                              {loading && <Spin size="small" style={{ marginLeft: 8 }} />}
                        </div>
                  </Form.Item>

                  <Form.Item
                        label="Place"
                        name="place"
                        rules={[{ required: true, message: 'Please select a place!' }]}
                  >
                        <div style={{ display: "flex", alignItems: "center" }}>
                              <Select
                                    placeholder="Select a place"
                                    allowClear
                                    loading={placesLoading}
                                    disabled={placesLoading}
                                    style={{ flex: 1 }}
                              >
                                    {places
                                          .filter(place => place.id !== null && place.id !== undefined)
                                          .map((place) => (
                                                <Select.Option key={place.id} value={place.id}>
                                                      {place.name}
                                                </Select.Option>
                                          ))}
                              </Select>
                              {placesLoading && <Spin size="small" style={{ marginLeft: 8 }} />}
                        </div>
                  </Form.Item>
                  <Form.Item
                        label="Upload Image"
                        name="image"
                        rules={[{ required: true, message: "Please upload an image!" }]}
                  >
                        <ImgCrop rotationSlider>
                              <Upload
                                    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                                    listType="picture-card"
                                    fileList={fileList}
                                    onChange={onChange}
                                    onPreview={onPreview}
                              >
                                    {fileList.length < 5 && "+ Upload"}
                              </Upload>
                        </ImgCrop>
                  </Form.Item>

                  <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                              Submit
                        </Button>
                  </Form.Item>
            </Form>
      );
};

export default CreateVenue
