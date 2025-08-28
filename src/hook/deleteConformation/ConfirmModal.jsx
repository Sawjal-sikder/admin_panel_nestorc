// ConfirmModal.jsx
import React from "react";
import { Modal } from "antd";

/**
 * Reusable confirmation modal
 * @param {boolean} visible - whether modal is visible
 * @param {string} title - modal title
 * @param {string} content - modal message
 * @param {function} onConfirm - function to run on confirm
 * @param {function} onCancel - function to run on cancel
 */
const ConfirmModal = ({ visible, title, content, onConfirm, onCancel }) => {
      return (
            <Modal
                  title={title || "Are you sure?"}
                  open={visible}
                  onOk={onConfirm}
                  onCancel={onCancel}
                  okText="Confirm"
                  cancelText="Cancel"
                  okType="danger"
            >
                  <p>{content || "This action cannot be undone."}</p>
            </Modal>
      );
};

export default ConfirmModal;
