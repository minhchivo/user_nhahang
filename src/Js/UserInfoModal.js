import React, { useState, useEffect } from 'react';
import '../Css/UserInfoModal.css'; // Import CSS

function UserInfoModal({ initialUserInfo, onClose }) {
  const [userInfo, setUserInfo] = useState(initialUserInfo);

  useEffect(() => {
    setUserInfo(initialUserInfo); // Cập nhật `userInfo` với dữ liệu ban đầu
    console.log('UserInfo received in modal:', initialUserInfo); // Kiểm tra giá trị initialUserInfo
  }, [initialUserInfo]);

  
  return (
    <div className="user-info-modal">
    <h1 className="modal-title">Thông tin người dùng</h1>
    <div className="user-info-section">
      <p>
        <strong>Tên:</strong> {userInfo?.name || 'Không có tên'}
      </p>
      <p>
        <strong>Email:</strong> {userInfo?.email || 'Không có email'}
      </p>
      <p>
        <strong>Số Điện Thoại:</strong> {userInfo?.phone || 'Không có số điện thoại'}
      </p>
      <p>
        <strong>Địa Chỉ:</strong> {userInfo?.address || 'Không có địa chỉ'}
      </p>
    </div>
    <button className="close-button" onClick={onClose}>
      Đổi mật khẩu
    </button>
  </div>
  );
}

export default UserInfoModal;
