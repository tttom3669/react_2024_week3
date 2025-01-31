import axios from 'axios';
import PropTypes from 'prop-types';
import { useState } from 'react';

const { VITE_BASE_URL: API_URL } = import.meta.env;
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

export default LoginPanel;