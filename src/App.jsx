import 'bootstrap/dist/css/bootstrap.min.css'; // 引入 CSS
import { useEffect, useState} from 'react';
import LoginPanel from './views/Login';
import ProductsPanel from './views/Product';

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
