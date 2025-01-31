import PropTypes from 'prop-types';
import { Modal } from 'bootstrap';
const { VITE_BASE_URL: API_URL, VITE_APP_PATH: API_PATH } = import.meta.env;
import axios from 'axios';

/**
 *  刪除 Modal
 */
const DeleteModal = ({
  deleteRef,
  tempProduct,
  getProducts,
  paginationData,
}) => {
  const closeDelModal = () => {
    const modalInstance = Modal.getInstance(deleteRef.current);
    modalInstance.hide();
  };
  const deleteProduct = async () => {
    try {
      await axios.delete(
        `${API_URL}/v2/api/${API_PATH}/admin/product/${tempProduct.id}`
      );
      closeDelModal();
      getProducts(paginationData.current_page);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      ref={deleteRef}
      className="modal fade"
      id="delProductModal"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5">刪除產品</h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            你是否要刪除
            <span className="text-danger fw-bold">{tempProduct.title}</span>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeDelModal}
            >
              取消
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={deleteProduct}
            >
              刪除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

DeleteModal.propTypes = {
  deleteRef: PropTypes.object,
  tempProduct: PropTypes.object,
  getProducts: PropTypes.func,
  paginationData: PropTypes.object,
};

export default DeleteModal;
