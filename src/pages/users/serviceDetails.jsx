import React, { useState } from "react";
import { Modal } from "antd";
import DefaultImage from "../../assets/image.jpg";

const DetailsModal = ({ visible, data, onClose }) => {
      const [previewVisible, setPreviewVisible] = useState(false);

      if (!data) return null;

      return (
            <>
                  <Modal
                        title="Venue Details"
                        open={visible}
                        onCancel={onClose}
                        footer={<button onClick={onClose}>Close</button>}
                  >
                        {data.image ? (
                              <img
                                    src={data.image}
                                    alt={data.venue_name}
                                    className="w-full cursor-pointer"
                                    style={{ width: "100%", height: "300px", objectFit: "cover" }}
                                    onClick={() => setPreviewVisible(true)}
                              />
                        ) : (
                              <img
                                    src={DefaultImage}
                                    alt="Default"
                                    className="w-full"
                                    style={{ width: "100%", height: "300px", objectFit: "cover" }}
                              />
                        )}

                        <p className="mt-10"><strong>Venue Name:</strong> {data.venue_name}</p>
                        <p><strong>Latitude:</strong> {data.latitude}</p>
                        <p><strong>Longitude:</strong> {data.longitude}</p>
                        <p><strong>City:</strong> {data.city}</p>
                        <p><strong>Type of Place:</strong> {data.type_of_place}</p>
                  </Modal>

                  {/* Fullscreen preview */}
                  {data.image && (
                        <Modal
                              open={previewVisible}
                              footer={null}
                              onCancel={() => setPreviewVisible(false)}
                              centered
                              width="80%"
                        >
                              <img
                                    src={data.image}
                                    alt={data.venue_name}
                                    style={{ width: "100%", height: "auto" }}
                              />
                        </Modal>
                  )}
            </>
      );
};

export default DetailsModal;
