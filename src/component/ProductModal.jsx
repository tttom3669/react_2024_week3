import PropTypes from 'prop-types';
import { Modal } from 'bootstrap';
const { VITE_BASE_URL: API_URL, VITE_APP_PATH: API_PATH } = import.meta.env;
import axios from 'axios';
/**
 *  產品 Modal
 */
const ProductModal = ({
  tempProduct,
  modalRef,
  setTempProduct,
  modalStatus,
  getProducts,
  paginationData,
}) => {
  const closeModal = () => {
    const modalInstance = Modal.getInstance(modalRef.current);
    modalInstance.hide();
  };
  const handleTempProductData = (e) => {
    const name = e.target.name;
    const value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setTempProduct({
      ...tempProduct,
      [name]: value,
    });
  };
  const handleImagesChange = (e, index) => {
    const newImages = [...tempProduct.imagesUrl];
    newImages[index] = e.target.value;
    setTempProduct({
      ...tempProduct,
      imagesUrl: newImages,
    });
  };
  const handlerProductData = async () => {
    const apiMethod = modalStatus === 'create' ? 'POST' : 'PUT';
    const apiUrl =
      modalStatus === 'create'
        ? `${API_URL}/v2/api/${API_PATH}/admin/product`
        : `${API_URL}/v2/api/${API_PATH}/admin/product/${tempProduct.id}`;
    try {
      await axios({
        url: apiUrl,
        method: apiMethod,
        data: {
          data: {
            ...tempProduct,
            price: Number(tempProduct.price),
            origin_price: Number(tempProduct.origin_price),
            is_enabled: tempProduct.is_enabled ? 1 : 0,
          },
        },
      });
      closeModal();
      getProducts(paginationData.current_page);
    } catch (error) {
      alert(error.response.data.message);
      console.log(error);
    }
  };

  return (
    <>
      <div
        id="productModal"
        className="modal"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        ref={modalRef}
      >
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content border-0 shadow">
            <div className="modal-header border-bottom">
              <h5 className="modal-title fs-4">
                {modalStatus === 'create' ? '新增' : '編輯'}產品
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={closeModal}
              ></button>
            </div>

            <div className="modal-body p-4">
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="mb-4">
                    <label htmlFor="primary-image" className="form-label">
                      主圖
                    </label>
                    <div className="input-group">
                      <input
                        name="imageUrl"
                        type="text"
                        id="primary-image"
                        className="form-control"
                        placeholder="請輸入圖片連結"
                        value={tempProduct.imageUrl}
                        onChange={handleTempProductData}
                      />
                    </div>
                    <img
                      src={tempProduct.imageUrl}
                      alt=""
                      className="img-fluid"
                    />
                  </div>

                  {/* 副圖 */}
                  <div className="border border-2 border-dashed rounded-3 p-3">
                    {tempProduct.imagesUrl?.map((image, index) => (
                      <div key={index} className="mb-2">
                        <label
                          htmlFor={`imagesUrl-${index + 1}`}
                          className="form-label"
                        >
                          副圖 {index + 1}
                        </label>
                        <input
                          id={`imagesUrl-${index + 1}`}
                          type="text"
                          placeholder={`圖片網址 ${index + 1}`}
                          className="form-control mb-2"
                          value={image}
                          onChange={(e) => handleImagesChange(e, index)}
                        />
                        {image && (
                          <img
                            src={image}
                            alt={`副圖 ${index + 1}`}
                            className="img-fluid mb-2"
                          />
                        )}
                      </div>
                    ))}
                    <div className="btn-group w-100">
                      {tempProduct.imagesUrl.length < 5 &&
                      tempProduct.imagesUrl[
                        tempProduct.imagesUrl.length - 1
                      ] !== '' ? (
                        <>
                          <button
                            className="btn btn-outline-primary btn-sm w-100"
                            onClick={() => {
                              const newImages = [...tempProduct.imagesUrl];
                              newImages.push('');
                              setTempProduct({
                                ...tempProduct,
                                imagesUrl: newImages,
                              });
                            }}
                          >
                            新增圖片
                          </button>
                        </>
                      ) : (
                        ''
                      )}
                      {tempProduct.imagesUrl.length > 1 ? (
                        <>
                          <button
                            className="btn btn-outline-danger btn-sm w-100"
                            onClick={() => {
                              const newImages = [...tempProduct.imagesUrl];
                              newImages.pop();
                              setTempProduct({
                                ...tempProduct,
                                imagesUrl: newImages,
                              });
                            }}
                          >
                            取消圖片
                          </button>
                        </>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-md-8">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      標題
                    </label>
                    <input
                      name="title"
                      id="title"
                      type="text"
                      className="form-control"
                      placeholder="請輸入標題"
                      value={tempProduct.title}
                      onChange={handleTempProductData}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="category" className="form-label">
                      分類
                    </label>
                    <input
                      name="category"
                      id="category"
                      type="text"
                      className="form-control"
                      placeholder="請輸入分類"
                      value={tempProduct.category}
                      onChange={handleTempProductData}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="unit" className="form-label">
                      單位
                    </label>
                    <input
                      name="unit"
                      id="unit"
                      type="text"
                      className="form-control"
                      placeholder="請輸入單位"
                      value={tempProduct.unit}
                      onChange={handleTempProductData}
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label htmlFor="origin_price" className="form-label">
                        原價
                      </label>
                      <input
                        name="origin_price"
                        id="origin_price"
                        type="number"
                        min="0"
                        className="form-control"
                        placeholder="請輸入原價"
                        value={tempProduct.origin_price}
                        onChange={handleTempProductData}
                      />
                    </div>
                    <div className="col-6">
                      <label htmlFor="price" className="form-label">
                        售價
                      </label>
                      <input
                        name="price"
                        id="price"
                        type="number"
                        min="0"
                        className="form-control"
                        placeholder="請輸入售價"
                        value={tempProduct.price}
                        onChange={handleTempProductData}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      產品描述
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      className="form-control"
                      rows={4}
                      placeholder="請輸入產品描述"
                      value={tempProduct.description}
                      onChange={handleTempProductData}
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="content" className="form-label">
                      說明內容
                    </label>
                    <textarea
                      name="content"
                      id="content"
                      className="form-control"
                      rows={4}
                      placeholder="請輸入說明內容"
                      value={tempProduct.content}
                      onChange={handleTempProductData}
                    ></textarea>
                  </div>

                  <div className="form-check">
                    <input
                      name="is_enabled"
                      type="checkbox"
                      className="form-check-input"
                      id="isEnabled"
                      checked={tempProduct.is_enabled}
                      onChange={handleTempProductData}
                    />
                    <label className="form-check-label" htmlFor="isEnabled">
                      是否啟用
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer border-top bg-light">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeModal}
              >
                取消
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handlerProductData}
              >
                確認
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

ProductModal.propTypes = {
  tempProduct: PropTypes.object,
  modalRef: PropTypes.object,
  setTempProduct: PropTypes.func,
  modalStatus: PropTypes.string,
  getProducts: PropTypes.func,
  paginationData: PropTypes.object,
};

export default ProductModal;
