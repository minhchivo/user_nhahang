import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function VerifyPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAccount = async () => {
      const response = await fetch(`https://admin-quanlinhahang.onrender.com/api/verify-email/${token}`);
      if (response.ok) {
        alert('Xác minh tài khoản thành công! Bạn có thể đăng nhập.');
        navigate('/'); // Chuyển về trang đăng nhập
      } else {
        alert('Link xác minh không hợp lệ hoặc đã hết hạn.');
      }
    };

    verifyAccount();
  }, [token, navigate]);

  return <div>Đang xác minh tài khoản...</div>;
}

export default VerifyPage;
