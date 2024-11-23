import React, { useState, useEffect } from 'react';
import '../Css/Drink.css';

function Drink({ userInfo, addToCart }) {
  const [drinks, setDrinks] = useState([]);
  const [quantities, setQuantities] = useState({}); // State để lưu số lượng mỗi thức uống
  const [successMessage, setSuccessMessage] = useState(''); // Thông báo
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetch('https://admin-quanlinhahang.onrender.com/api/drinks')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch drinks');
        }
        return response.json();
      })
      .then((data) => setDrinks(data))
      .catch((error) => {
        console.error('Error fetching drinks:', error);
        setErrorMessage('Lỗi khi tải danh sách thức uống.');
      });
  }, []);

  const handleQuantityChange = (drinkId, value) => {
    setQuantities({
      ...quantities,
      [drinkId]: parseInt(value) || 1, // Cập nhật số lượng hoặc mặc định là 1
    });
  };

  const handleAddToCart = (drink) => {
    const product = {
      userId: userInfo.userId,
      productId: drink.id,
      productName: drink.name,
      quantity: quantities[drink.id] || 1,
      price: drink.price,
      type: 'drink',
      imageUrl: drink.imageUrl, // Thêm trường imageUrl
    };
  
    fetch('https://admin-quanlinhahang.onrender.com/api/add-to-cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Thức uống đã được thêm vào giỏ hàng:', data);
        setSuccessMessage('Thêm vào giỏ hàng thành công!');
        setTimeout(() => setSuccessMessage(''), 3000);
      })
      .catch((error) => console.error('Lỗi khi thêm vào giỏ hàng:', error));
  };
  

  return (
    <div className="nuocuong-container">
      <h1 className="nuocuong-title">Nước uống</h1>

      {/* Hiển thị thông báo lỗi */}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      {/* Hiển thị thông báo thành công */}
      {successMessage && (
        <div className="nuocuong-success-message">{successMessage}</div>
      )}

      <div className="nuocuong-grid">
        {drinks.map((drink) => (
          <div key={drink.id} className="nuocuong-item">
            <img
              className="nuocuong-item-image"
              src={`https://admin-quanlinhahang.onrender.com${drink.imageUrl}`}
              alt={drink.name}
            />
            <h2 className="nuocuong-item-name">{drink.name}</h2>
            <p className="nuocuong-item-price">Giá: {drink.price} VND</p>
            <div className="nuocuong-item-quantity">
              <input
                type="number"
                min="1"
                value={quantities[drink.id] || 1} // Hiển thị số lượng hiện tại
                onChange={(e) => handleQuantityChange(drink.id, e.target.value)}
              />
              <button
                className="nuocuong-item-button"
                onClick={() => handleAddToCart(drink)}
              >
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Drink;
