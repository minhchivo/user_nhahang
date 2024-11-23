import React, { useEffect, useState } from 'react';
import '../Css/Menu.css';

function Menu({ userInfo, addToCart }) {
  const [foods, setFoods] = useState([]);
  const [filter, setFilter] = useState('all'); // State để lưu bộ lọc
  const [quantity, setQuantity] = useState({}); // State để lưu số lượng mỗi món
  const [successMessage, setSuccessMessage] = useState(''); // State để lưu thông báo

  useEffect(() => {
    fetch('https://admin-quanlinhahang.onrender.com/api/foods')
      .then((response) => response.json())
      .then((data) => setFoods(data))
      .catch((error) => console.error('Lỗi khi tải thực đơn:', error));
  }, []);

  const handleFilterChange = (event) => {
    setFilter(event.target.value); // Cập nhật bộ lọc
  };

  const handleQuantityChange = (foodId, value) => {
    setQuantity({
      ...quantity,
      [foodId]: value,
    });
  };

  const handleAddToCart = (food) => {
    const product = {
      userId: userInfo.userId,
      productId: food.id,
      productName: food.foodName,
      quantity: parseInt(quantity[food.id]) || 1,
      price: food.price,
      type: 'food',
      imageUrl: food.imageUrl, // Thêm trường imageUrl
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
        console.log('Sản phẩm đã được thêm vào giỏ hàng:', data);
        setSuccessMessage('Thêm vào giỏ hàng thành công!');
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      })
      .catch((error) => console.error('Lỗi khi thêm vào giỏ hàng:', error));
  };
  
  const filteredFoods =
    filter === 'all'
      ? foods
      : foods.filter((food) => food.category === filter); // Lọc theo phân loại mới

  return (
    <div className="menu-container_thucan">
      <h1 className="menu-title_thucan">Thực đơn</h1>

      {/* Hiển thị thông báo */}
      {successMessage && (
        <div className="success-message_thucan">{successMessage}</div>
      )}

      {/* Bộ lọc loại thức ăn */}
      <div className="filter-container_thucan">
        <label htmlFor="filter_thucan">Lọc theo loại thức ăn:</label>
        <select id="filter_thucan" value={filter} onChange={handleFilterChange}>
          <option value="all">Tất cả</option>
          <option value="Món khai vị">Món khai vị</option>
          <option value="Món chính">Món chính</option>
          <option value="Món tráng miệng">Món tráng miệng</option>
          <option value="Món nhậu">Món nhậu</option>
        </select>
      </div>

      <div className="menu-grid_thucan">
  {filteredFoods.length > 0 ? (
    filteredFoods.map((food) => (
      <div key={food.id} className="menu-item_thucan">
        <img
          className="menu-item-image_thucan"
          src={`https://admin-quanlinhahang.onrender.com${food.imageUrl}`}
          alt={food.foodName}
        />
        <h2 className="menu-item-name_thucan">{food.foodName}</h2>
        <p className="menu-item-price_thucan">Giá: {food.price} VND</p>
        <div className="menu-item-quantity_thucan">
          <input
            type="number"
            min="1"
            value={quantity[food.id] || 1}
            onChange={(e) => handleQuantityChange(food.id, e.target.value)}
          />
          <button onClick={() => handleAddToCart(food)}>
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    ))
  ) : (
    <p className="no-food-message">Không có món ăn phù hợp.</p> // Thông báo khi không có món ăn
  )}
</div>

    </div>
  );
}

export default Menu;
