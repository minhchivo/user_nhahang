import React, { useEffect, useState } from 'react';
import '../Css/Cart.css'

function Cart({ userId }) {
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [updatedQuantities, setUpdatedQuantities] = useState({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cash'); // Default to cash
  const [showInvoices, setShowInvoices] = useState(false); // Hiển thị hóa đơn
  const [invoices, setInvoices] = useState([]);

  
  useEffect(() => {
    if (userId) {
      fetch(`https://admin-quanlinhahang.onrender.com/api/cart/${userId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch cart');
          }
          return response.json();
        })
        .then((data) => {
          // Đảm bảo luôn có items và totalAmount
          const itemsArray = data.items ? Object.values(data.items) : [];
          setCart({ items: itemsArray, totalAmount: data.totalAmount || 0 });
          setError(null); // Xóa lỗi nếu có
        })
        .catch(() => {
          setCart({ items: [], totalAmount: 0 }); // Đặt giá trị mặc định nếu lỗi xảy ra
          setError(null); // Không hiển thị lỗi khi không tải được
        });
    }
  }, [userId]);
  

  const handleQuantityChange = (productId, quantity) => {
    if (!quantity || isNaN(quantity) || quantity < 1) {
      alert('Số lượng phải là số và lớn hơn 0.');
      return;
    }

    setUpdatedQuantities((prev) => ({
      ...prev,
      [productId]: parseInt(quantity, 10),
    }));
  };

  const handleUpdateQuantity = (productId) => {
    const newQuantity = updatedQuantities[productId];
    if (!newQuantity || isNaN(newQuantity) || newQuantity < 1) {
      alert('Vui lòng nhập số lượng hợp lệ.');
      return;
    }
  
    fetch(`https://admin-quanlinhahang.onrender.com/api/cart/${userId}/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, newQuantity }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update quantity');
        }
        return response.json();
      })
      .then((data) => {
        setCart((prevCart) => {
          const updatedItems = prevCart.items.map((item) =>
            item.productId === productId
              ? {
                  ...item,
                  quantity: newQuantity,
                  totalPrice: item.price * newQuantity,
                }
              : item
          );
          const updatedTotalAmount = updatedItems.reduce(
            (sum, item) => sum + item.totalPrice,
            0
          );
          return { items: updatedItems, totalAmount: updatedTotalAmount };
        });
  
        setSuccessMessage('Cập nhật số lượng thành công!');
        setTimeout(() => setSuccessMessage(''), 3000);
      })
      .catch(() => {
        setError('Lỗi khi cập nhật số lượng.');
        setTimeout(() => setError(null), 3000);
      });
  };
  
  const handleRemoveItem = (productId) => {
    if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng không?')) {
      return;
    }
  
    fetch(`https://admin-quanlinhahang.onrender.com/api/cart/${userId}/remove`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to remove item');
        }
        return response.json();
      })
      .then((data) => {
        setCart((prevCart) => {
          const updatedItems = prevCart.items.filter((item) => item.productId !== productId);
          return { items: updatedItems, totalAmount: data.totalAmount };
        });
  
        setSuccessMessage('Sản phẩm đã được xóa khỏi giỏ hàng!');
        setTimeout(() => setSuccessMessage(''), 3000);
      })
      .catch(() => {
        setError('Lỗi khi xóa sản phẩm.');
        setTimeout(() => setError(null), 3000);
      });
  };
  
  const handleCheckout = () => {
    if (cart.totalAmount <= 0) {
      setSuccessMessage('Không thể thanh toán vì giỏ hàng trống!');
      setTimeout(() => setSuccessMessage(''), 3000);
      return;
    }
    setShowPaymentModal(true); // Mở modal chọn phương thức thanh toán
  };

  const handleViewInvoices = () => {
    fetch(`https://admin-quanlinhahang.onrender.com/api/invoices/${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Không thể lấy danh sách hóa đơn');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Hóa đơn nhận được từ API:', data); // Kiểm tra dữ liệu trả về
        setInvoices(data);
        setShowInvoices(true);
      })
      .catch((error) => {
        console.error('Lỗi khi lấy hóa đơn:', error);
        setInvoices([]);
        setShowInvoices(true);
      });
  };
  
  

  const closeInvoicesModal = () => {
    setShowInvoices(false); // Đóng modal hóa đơn
  };

  const handleConfirmPayment = () => {
    if (selectedPaymentMethod === 'cash') {
      processCashPayment();
    } else if (selectedPaymentMethod === 'transfer') {
      processVNPayPayment(); 
    }
  };

  const processCashPayment = () => {
    const payload = {
      userId: Number(userId), // Chuyển thành số nếu cần
      items: cart.items,
      totalAmount: cart.totalAmount,
      paymentMethod: 'cash',
      status: 'Chưa thanh toán',
      createdAt: new Date().toISOString(),
    };
  
    fetch('https://admin-quanlinhahang.onrender.com/api/invoices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to process cash payment');
        }
        return response.json();
      })
      .then(() => {
        setCart({ items: [], totalAmount: 0 });
        setSuccessMessage('Thanh toán thành công!');
        setShowPaymentModal(false);
        setTimeout(() => setSuccessMessage(''), 3000);
      })
      .catch((error) => {
        console.error('Lỗi khi xử lý thanh toán:', error);
        setError('Lỗi khi xử lý thanh toán.');
        setTimeout(() => setError(null), 3000);
      });
  };
  
  

  const processVNPayPayment = async () => {
    const payload = {
      userId: Number(userId),
      amount: cart.totalAmount,
      orderInfo: 'Thanh toán đơn hàng',
      returnUrl: 'https://giaodiennguoidung.web.app/vnpay-return',
      createdAt: new Date().toISOString(),
    };
  
    console.log('Payload gửi lên backend:', payload);
  
    try {
      const response = await fetch('https://admin-quanlinhahang.onrender.com/api/vnpay-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        console.error('Lỗi từ backend:', await response.text());
        throw new Error('Lỗi khi tạo URL thanh toán VNPay');
      }
  
      const data = await response.json();
  
      if (data.paymentUrl) {
        console.log('URL thanh toán VNPay:', data.paymentUrl);
        // Chuyển hướng người dùng tới URL thanh toán
        window.location.href = data.paymentUrl; // Chuyển hướng trực tiếp
      } else {
        throw new Error('Không nhận được URL thanh toán từ backend');
      }
    } catch (error) {
      console.error('Lỗi khi tạo URL thanh toán VNPay:', error);
      setError('Lỗi khi tạo URL thanh toán.');
      setTimeout(() => setError(null), 3000);
    }
  };
  
  
  


      
  return (
    
    <div className="cart-container">
    {/* Thông báo nổi */}
    {successMessage && (
      <div className="toast success-toast">
        {successMessage}
      </div>
    )}
    {error && (
      <div className="toast error-toast">
        {error}
      </div>
    )}
      <div className="cart-items">

      <h1 className="cart-header">Giỏ hàng</h1>

      {/* Thông báo giỏ hàng trống */}
      {(!cart.items || cart.items.length === 0) && <p>Giỏ hàng của bạn đang trống.</p>}



      {cart.items.map((item, index) => (
        <div key={index} className="cart-item">
          <img
            src={`https://admin-quanlinhahang.onrender.com${item.imageUrl}`}
            alt={item.productName}
            onError={(e) => (e.target.src = 'https://admin-quanlinhahang.onrender.com/default-image.jpg')}
          />
          <div className="cart-item-info">
            <h3>{item.productName}</h3>
            <p>Giá: {item.price} VND</p>
            
          </div>
          <div className="quantity-controls">
            <input
              type="number"
              min="1"
              value={updatedQuantities[item.productId] || item.quantity}
              onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value))}
            />
            <button onClick={() => handleUpdateQuantity(item.productId)}>Lưu</button>
          </div>
          <div className="cart-item-total">
            <p>Số lượng: {item.quantity}</p>
            <p>{item.totalPrice} VND</p>
          </div>
          <button
            className="delete-button"
            onClick={() => handleRemoveItem(item.productId)}
          >
            🗑️
          </button>
        </div>
      ))}
      </div>
      <div className="cart-summary">
      <h3>Tóm tắt đơn hàng</h3>
        <div className="summary-line">
        <span>Tổng cộng</span>
        <span>{cart.totalAmount} VND</span>
        </div>
        <button className="checkout-button" onClick={handleViewInvoices}> Xem Hóa Đơn</button>
        <button className="checkout-button" onClick={handleCheckout}>Thanh toán</button>
      </div>
      {showPaymentModal && (
        <div className="payment-modal">
          <h3>Chọn phương thức thanh toán</h3>
          <div>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={selectedPaymentMethod === 'cash'}
                onChange={() => setSelectedPaymentMethod('cash')}
              />
              Tiền mặt
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="transfer"
                checked={selectedPaymentMethod === 'transfer'}
                onChange={() => setSelectedPaymentMethod('transfer')}
              />
              Chuyển khoản
            </label>
          </div>
          <button onClick={handleConfirmPayment}>Xác nhận</button>
          <button onClick={() => setShowPaymentModal(false)}>Hủy</button>
        </div>
      )}
      {showInvoices && (
  <div className="invoice-modal">
    <h3>Danh sách hóa đơn</h3>
    {invoices.length > 0 ? (
      invoices.map((invoice, index) => (
        <div key={index} style={{ marginBottom: '15px', border: '1px solid #ccc', padding: '10px' }}>
          <h4>Hóa đơn #{index + 1}</h4>
          <p>Ngày: {new Date(invoice.createdAt).toLocaleString()}</p>
          <p>Tổng tiền: {invoice.totalAmount} VND</p>
          <p>Phương thức thanh toán: {invoice.paymentMethod}</p>
          <p>Trạng thái: {invoice.status}</p>
          <h5>Chi tiết:</h5>
          <ul>
            {invoice.items.map((item, idx) => (
              <li key={idx}>
                {item.productName} - {item.quantity} x {item.price} VND
              </li>
            ))}
          </ul>
        </div>
      ))
    ) : (
      <p>Không có hóa đơn nào.</p>
    )}
    <button onClick={closeInvoicesModal}>Đóng</button>
  </div>
)}

    </div>
    
  );
}

export default Cart;
