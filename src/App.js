import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function App({ setUserInfo }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setErrorMessage('');
    setSuccessMessage('');
  };

  // Xử lý phản hồi từ backend trong App.js
const handleSubmit = async (event) => {
  event.preventDefault();

  const endpoint = isLogin
    ? 'https://admin-quanlinhahang.onrender.com/api/login'
    : 'https://admin-quanlinhahang.onrender.com/api/register';

  const payload = isLogin
    ? { email, password }
    : { name, password, email, phone, address };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (response.ok) {
    if (isLogin) {
      console.log("User info received from backend:", data.userInfo); 
      setUserInfo(data.userInfo); 
      localStorage.setItem('userInfo', JSON.stringify(data.userInfo)); 
      console.log("Dữ liệu trong localStorage sau khi đăng nhập:", localStorage.getItem('userInfo'));
      navigate('/giaodien');
    } else {
      setSuccessMessage('Đăng ký thành công! Hãy xác minh tài khoản của bạn để hoàn thành đăng kí!');
      setName('');
      setPassword('');
      setEmail('');
      setPhone('');
      setAddress('');
    }
  } else {
    setErrorMessage(data.error || 'Có lỗi xảy ra trong quá trình đăng nhập/đăng ký. Vui lòng thử lại.');
    setSuccessMessage('');
  }
};

  

  return (
    <div className="body-login">
      <div className="container">
        <input type="checkbox" id="flip" checked={!isLogin} onChange={toggleForm} style={{ display: 'none' }} />
        <div className="forms">
          <div className="form-content">
            {isLogin ? (
              <div className="login-form">
                <div className="title">Đăng Nhập Người Dùng</div>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                <form onSubmit={handleSubmit}>
                  <div className="input-boxes">
                    <div className="input-box">
                      <i className="fas fa-envelope"></i>
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="input-box">
                      <i className="fas fa-lock"></i>
                      <input
                        type="password"
                        placeholder="Mật Khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="button input-box">
                      <input type="submit" value="Đăng Nhập" />
                    </div>
                    <div className="text sign-up-text">
                      Chưa có tài khoản? <label onClick={toggleForm} style={{ cursor: 'pointer', color: 'blue' }}>Đăng Ký</label>
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              <div className="signup-form">
                <div className="title">Đăng Ký Người Dùng</div>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                <form onSubmit={handleSubmit}>
                  <div className="input-boxes">
                    <div className="input-box">
                      <i className="fas fa-user"></i>
                      <input
                        type="text"
                        placeholder="Tên người dùng"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="input-box">
                      <i className="fas fa-envelope"></i>
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="input-box">
                      <i className="fas fa-lock"></i>
                      <input
                        type="password"
                        placeholder="Mật Khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="input-box">
                      <i className="fas fa-phone"></i>
                      <input
                        type="text"
                        placeholder="Số Điện Thoại"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                    <div className="input-box">
                      <i className="fas fa-map-marker-alt"></i>
                      <input
                        type="text"
                        placeholder="Địa Chỉ"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                      />
                    </div>
                    <div className="button input-box">
                      <input type="submit" value="Đăng Ký" />
                    </div>
                    <div className="text sign-up-text">
                      Đã có tài khoản? <label onClick={toggleForm} style={{ cursor: 'pointer', color: 'blue' }}>Đăng Nhập</label>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
