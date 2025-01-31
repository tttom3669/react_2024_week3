import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'bootstrap';
import axios from 'axios';
import ProductModal from '../component/ProductModal';
import DeleteModal from '../component/DeleteModal';
import Pagination from '../component/Pagination';
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
 * 產品面板
 */
const ProductsPanel = ({ isAuth, setIsAuth }) => {
  const [tempProduct, setTempProduct] = useState(defaultModalState);
  const [products, setProducts] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const [modalStatus, setModalStatus] = useState('create');
  const modalRef = useRef(null);
  const deleteRef = useRef(null);

  const getProducts = async (page = 1) => {
    try {
      const res = await axios.get(
        `${API_URL}/v2/api/${API_PATH}/admin/products?page=${page}`
      );
      const { products: productsResult, pagination: paginationResult } =
        res.data;
      setPaginationData({ ...paginationResult });
      console.log(paginationData);

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
          <Pagination
            getProducts={getProducts}
            paginationData={paginationData}
          />
        </div>
      </div>
      <ProductModal
        tempProduct={tempProduct}
        setTempProduct={setTempProduct}
        modalRef={modalRef}
        modalStatus={modalStatus}
        getProducts={getProducts}
        paginationData={paginationData}
      />
      <DeleteModal
        tempProduct={tempProduct}
        deleteRef={deleteRef}
        getProducts={getProducts}
        paginationData={paginationData}
      />
    </div>
  );
};

ProductsPanel.propTypes = {
  isAuth: PropTypes.bool,
  setIsAuth: PropTypes.func,
};

export default ProductsPanel;
