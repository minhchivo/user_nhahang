import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Giaodien from './Giaodien';
import VerifiEmail from './VerifiEmail';


function MainApp() {
  // Khởi tạo userInfo từ localStorage nếu có
  const [userInfo, setUserInfo] = useState(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    return storedUserInfo ? JSON.parse(storedUserInfo) : null;
  });

  // Cập nhật lại userInfo trong localStorage nếu có sự thay đổi
  useEffect(() => {
    if (userInfo) {
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    } else {
      localStorage.removeItem('userInfo');
    }
  }, [userInfo]);

  return (
    <Router>
  <Routes>
    <Route path="/" element={<App setUserInfo={setUserInfo} />} />
    <Route path="/giaodien" element={<Giaodien userInfo={userInfo} setUserInfo={setUserInfo} />} />
    <Route path="/verify-email/:token" element={<VerifiEmail />} />
  </Routes>
</Router>

  );
}

export default MainApp;
