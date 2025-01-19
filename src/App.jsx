import axios from 'axios';
import PropTypes, { string } from 'prop-types';

import 'bootstrap/dist/css/bootstrap.min.css'; // 引入 CSS
import { useEffect, useState, useRef } from 'react';
import { Modal } from 'bootstrap';

const { VITE_BASE_URL: API_URL, VITE_APP_PATH: API_PATH } = import.meta.env;

const defaultModalState = {
  imageUrl: '',
  title: '',
  category: '',
  unit: '',
  origin_price: '',
  price: '',
  description: '',
  content: '',
  is_enabled: 0,
  imagesUrl: [''],
};

/**
 * 登入面板
 */
const LoginPanel = ({ isAuth, setIsAuth }) => {
  const [account, setAccount] = useState({});
  const accountHandler = (e) => {
    const { value, name } = e.target;
    setAccount({
      ...account,
      [name]: value,
    });
  };
  const signIn = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_URL}/v2/admin/signin`, account);
      const { token, expired } = res.data;
      document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
      axios.defaults.headers.common['Authorization'] = token;
      setIsAuth(true);
      alert('登入成功');
    } catch (error) {
      alert('帳號或密碼錯誤');
      setIsAuth(false);
      console.log(error);
    }
  };

  return (
    <>
      <div
        className={`flex-column justify-content-center align-items-center vh-100 ${
          isAuth ? 'd-none' : 'd-flex'
        }`}
      >
        <h1 className="mb-5">請先登入</h1>
        <form className="d-flex flex-column gap-3" onSubmit={signIn}>
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              name="username"
              id="username"
              placeholder="name@example.com"
              onChange={accountHandler}
            />
            <label htmlFor="username">Email address</label>
          </div>
          <div className="form-floating">
            <input
              type="password"
              name="password"
              className="form-control"
              id="password"
              placeholder="Password"
              onChange={accountHandler}
            />
            <label htmlFor="password">Password</label>
          </div>
          <button className="btn btn-primary">登入</button>
        </form>
        <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
      </div>
    </>
  );
};
LoginPanel.propTypes = {
  isAuth: PropTypes.bool,
  setIsAuth: PropTypes.func,
};

/**
 * 產品面板
 */
const ProductsPanel = ({ isAuth, setIsAuth }) => {
  const [tempProduct, setTempProduct] = useState(defaultModalState);
  const [products, setProducts] = useState([]);
  const [modalStatus, setModalStatus] = useState('create');
  const modalRef = useRef(null);
  const deleteRef = useRef(null);

  const getProducts = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/v2/api/${API_PATH}/admin/products`
      );
      const { products: productsResult } = res.data;

      setProducts([...productsResult]);
    } catch (error) {
      setIsAuth(false);
      console.log(error);
    }
  };
  const checkUser = async () => {
    try {
      const cookie = document.cookie.replace(
        /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
        '$1'
      );
      axios.defaults.headers.common['Authorization'] = cookie;
      await axios.post(`${API_URL}/v2/api/user/check`);
    } catch (error) {
      console.log(error);
    }
  };
  const openModal = (product) => {
    const modalInstance = Modal.getInstance(modalRef.current);
    if (!product) {
      setModalStatus('create');
      setTempProduct(defaultModalState);
    } else {
      setModalStatus('update');
      setTempProduct(product);
    }
    modalInstance.show();
  };
  const openDelModal = (product) => {
    setTempProduct(product);
    const modalInstance = Modal.getInstance(deleteRef.current);
    modalInstance.show();
  };

  useEffect(() => {
    if (!isAuth) {
      return;
    }
    checkUser();
    getProducts();
    new Modal(modalRef.current);
    new Modal(deleteRef.current);
  }, [isAuth]);

  return (
    <div className={`container py-5 ${!isAuth ? 'd-none' : 'd-block'}`}>
      <div className="row">
        <div className="col-12">
          <div className="d-flex align-items-center justify-content-between">
            <h2>產品列表</h2>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => openModal()}
            >
              建立新的產品
            </button>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th scope="col">產品名稱</th>
                <th scope="col">原價</th>
                <th scope="col">售價</th>
                <th scope="col">是否啟用</th>
                <th scope="col">查看細節</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <th scope="row">{product.title}</th>
                  <td>{product.origin_price}</td>
                  <td>{product.price}</td>
                  <td>{product.is_enabled ? '啟用' : '未啟用'}</td>
                  <td>
                    <div className="btn-group">
                      <button
                        type="button"
                        onClick={() => openModal(product)}
                        className="btn btn-outline-primary btn-sm"
                      >
                        編輯
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => openDelModal(product)}
                      >
                        刪除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="col-12">
          <nav aria-label="Page navigation example">
            <ul className="pagination">
              <li className="page-item">
                <a className="page-link" href="#" aria-label="Previous">
                  <span aria-hidden="true">&laquo;</span>
                </a>
              </li>
              {console.log([...new Array(paginationData.total_pages)])}
              <li className="page-item">
                <a className="page-link" href="#">
                  1
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#" aria-label="Next">
                  <span aria-hidden="true">&raquo;</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <ProductModal
        tempProduct={tempProduct}
        setTempProduct={setTempProduct}
        modalRef={modalRef}
        modalStatus={modalStatus}
        getProducts={getProducts}
      />
      <DeleteModal
        tempProduct={tempProduct}
        deleteRef={deleteRef}
        getProducts={getProducts}
      />
    </div>
  );
};

ProductsPanel.propTypes = {
  isAuth: PropTypes.bool,
  setIsAuth: PropTypes.func,
};

/**
 *  產品 Modal
 */
const ProductModal = ({
  tempProduct,
  modalRef,
  setTempProduct,
  modalStatus,
  getProducts,
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
      getProducts();
    } catch (error) {
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
};
/**
 *  刪除 Modal
 */
const DeleteModal = ({ deleteRef, tempProduct, getProducts }) => {
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
      getProducts();
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
};

function App() {
  const [isAuth, setIsAuth] = useState(false);
  useEffect(() => {
    const cookie = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      '$1'
    );
    cookie ? setIsAuth(true) : setIsAuth(false);
  }, []);

  return (
    <>
      <LoginPanel isAuth={isAuth} setIsAuth={setIsAuth} />
      <ProductsPanel isAuth={isAuth} setIsAuth={setIsAuth} />
    </>
  );
}

export default App;
