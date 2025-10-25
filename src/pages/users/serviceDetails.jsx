import React, { useState } from "react";
import { Modal } from "antd";
import DefaultImage from "../../assets/image.jpg";

const DetailsModal = ({ visible, data, onClose }) => {
      const [previewVisible, setPreviewVisible] = useState(false);
      // console.log("DetailsModal data:", data);

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

                        <div className="mt-4 text-center">
                              <h2 className="text-2xl font-semibold text-gray-800">{data.venue_name}</h2>
                        </div>
                        <div className="text-gray-400 font-semibold text-xl pb-5">Details:</div>
                        <div className="ps-8">

                              <p><strong>Latitude:</strong> {data.latitude}</p>
                              <p><strong>Longitude:</strong> {data.longitude}</p>
                              <p><strong>City:</strong> {data.city}</p>
                              <p><strong>Type of Place:</strong> {data.type_of_place}</p>
                              <p><strong>Stops (for free tours):</strong></p>
                              <ul className="list-disc pl-8">
                                    {data.stops && data.stops.length > 0 ? (
                                          data.stops.map((stop) => (
                                                <li key={stop.id}>
                                                      <p>{stop.name}</p>
                                                      <p>{stop.latitude} & {stop.longitude}</p>
                                                </li>
                                          ))
                                    ) : (
                                          <li>No stops available</li>
                                    )}
                              </ul>
                              <p><strong>Scavenger Hunts (for paid tours):</strong></p>
                              <ul className="list-disc pl-8">
                                    {data.scavenger_hunts && data.scavenger_hunts.length > 0 ? (
                                          data.scavenger_hunts.map((hunt) => (
                                                <li key={hunt.id}>
                                                      <p>{hunt.title}</p>
                                                      <p>{hunt.latitude} & {hunt.longitude}</p>
                                                </li>
                                          ))
                                    ) : (
                                          <li>No scavenger hunts</li>
                                    )}
                              </ul>
                              <p><strong>Messages for Venue:</strong></p>
                              <ul className="list-disc pl-8">
                                    {data.venue_message && data.venue_message.length > 0 ? (
                                          data.venue_message.map((message) => (
                                                <li key={message.id}>
                                                      <p>{message.message}</p>
                                                      {/* - Checked: {message.check?.checked ? "Yes" : "No"} */}
                                                      {/* {message.check?.uploaded_image && (
                                                      <div>
                                                      <img
                                                      src={`http://10.10.7.76:8000${message.check.uploaded_image}`}
                                                      alt={message.content}
                                                      className="mt-2 w-32 h-32 object-cover border"
                                                      />
                                                      </div>
                                                      )} */}
                                                </li>
                                          ))
                                    ) : (
                                          <li>No Messages</li>
                                    )}
                              </ul>
                        </div>

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
