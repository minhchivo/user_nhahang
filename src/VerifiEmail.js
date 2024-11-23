import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function VerifyPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState(null);

  useEffect(() => {
    const verifyAccount = async () => {
      try {
        const response = await fetch(`https://admin-quanlinhahang.onrender.com/api/verify-email/${token}`);
        if (response.ok) {
          setVerificationStatus('success');
        } else {
          setVerificationStatus('error');
        }
      } catch (error) {
        setVerificationStatus('error');
      }
    };

    verifyAccount();
  }, [token]);

  const handleRedirect = () => {
    navigate('/');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      {verificationStatus === null && <div>Đang xác minh tài khoản...</div>}
      {verificationStatus === 'success' && (
        <div>
          <p>Xác minh tài khoản thành công! Bạn có thể đăng nhập.</p>
          <button onClick={handleRedirect} style={{ padding: '10px 20px', cursor: 'pointer' }}>
            Quay về trang đăng nhập
          </button>
        </div>
      )}
      {verificationStatus === 'error' && (
        <div>
          <p>Link xác minh không hợp lệ hoặc đã hết hạn.</p>
          <button onClick={handleRedirect} style={{ padding: '10px 20px', cursor: 'pointer' }}>
            Quay về trang đăng nhập
          </button>
        </div>
      )}
    </div>
  );
}

export default VerifyPage;
