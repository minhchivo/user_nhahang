import React, { useState } from 'react';
import '../Css/UserInfoModal.css'; // Import CSS

function UserInfoModal({ initialUserInfo, onClose }) {
  const [userInfo] = useState(initialUserInfo); // Thông tin người dùng
  const [isChangingPassword, setIsChangingPassword] = useState(false); // Trạng thái đổi mật khẩu
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      showToast('Vui lòng điền đầy đủ thông tin.', 'error');
      return;
    }

    try {
      const response = await fetch('https://admin-quanlinhahang.onrender.com/api/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userInfo.userId,
          currentPassword,
          newPassword,
        }),
      });

      if (response.ok) {
        showToast('Đổi mật khẩu thành công!', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setTimeout(() => setIsChangingPassword(false), 3000); // Đóng modal sau 3 giây
      } else {
        const errorData = await response.json();
        showToast(errorData.error || 'Đổi mật khẩu không thành công.', 'error');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      showToast('Lỗi kết nối đến server.', 'error');
    }
  };

  const showToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage('');
      setToastType('');
    }, 3000); // Toast disappears after 3 seconds
  };

  return (
    <div className="user-info-modal">
      {!isChangingPassword ? (
        <>
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
          <button
            className="close-button"
            onClick={() => setIsChangingPassword(true)}
          >
            Đổi mật khẩu
          </button>
        </>
      ) : (
        <div className="change-password-container">
          <h1>Đổi mật khẩu</h1>
          <label>
            Mật khẩu hiện tại:
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Nhập mật khẩu hiện tại"
            />
            </label>
            <label>
            Mật khẩu mới:
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nhập mật khẩu mới"
            />
          </label>
          <div className="password-actions">
            <button onClick={handleChangePassword} className="confirm-password-button">
              Xác nhận
            </button>
            <button
              onClick={() => setIsChangingPassword(false)}
              className="cancel-password-button"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className={`toast ${toastType === 'success' ? 'success-toast' : 'error-toast'}`}>
          {toastMessage}
        </div>
      )}
    </div>
  );
}

export default UserInfoModal;

