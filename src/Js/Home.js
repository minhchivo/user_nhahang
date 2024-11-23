import React, { useEffect, useState } from 'react';
import '../Css/Home.css';
import Menu from './Menu'; // Đảm bảo bạn đã import component Menu

function Home() {
  const [foods, setFoods] = useState([]);
  const images = [
    './banner1.jpg',
    './banner2.jpg',
    './banner3.jpg',
    './banner4.jpg',
    './banner5.jpg',
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activePage, setActivePage] = useState('home'); // Quản lý trang hiện tại

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    fetch('https://admin-quanlinhahang.onrender.com/api/foods')
      .then((response) => response.json())
      .then((data) => setFoods(data))
      .catch((error) => console.error('Lỗi khi tải thực đơn:', error));
  }, []);

  const mainFoods = foods.filter(food => food.category === 'Món chính');

  return (
    <div className="container_trangchu">
      {activePage === 'home' ? (
        <>
          <div className="banner_trangchu">
            <img src={images[currentImageIndex]} alt="banner" className="banner_image" />
          </div>

          <div className="menu_trangchu">
            <h1 className="tieudemenu">Các món ăn chính</h1>
            <div className="main-foods-container">
              {mainFoods.length > 0 ? (
                mainFoods.map((food) => (
                  <div key={food.id} className="menu-item-home">
                    <img
                      className="menu-item-image-home"
                      src={`https://admin-quanlinhahang.onrender.com${food.imageUrl}`}
                      alt={food.foodName}
                    />
                    <h2 className="menu-item-name-home">{food.foodName}</h2>
                    <p className="menu-item-price-home">Giá: {food.price} VND</p>
                  </div>
                ))
              ) : (
                <p>Không có món ăn chính.</p>
              )}
            </div>
            <span className="xemmonan_giaodien" onClick={() => setActivePage('menu')}>Xem tất cả món ăn</span>
          </div>

          <div className="gioithieu">
            <div className="text_gioithieu">
              <h1 className="tieudegioithieu">Giới thiệu</h1>
              <p>Chào mừng đến với nhà hàng của chúng tôi! </p>
              <p>Với không gian ấm cúng và phong cách phục vụ tận tâm,</p> 
              <p>chúng tôi mong muốn mang đến cho bạn những trải nghiệm ẩm thực tuyệt vời. Tại đây, bạn sẽ tìm thấy một thực đơn phong phú, từ các món ăn truyền thống đậm đà hương vị Việt Nam đến những món ăn phương Tây hiện đại. Tất cả đều được chế biến từ nguyên liệu tươi ngon, chất lượng cao, đảm bảo sức khỏe và sự hài lòng của thực khách. Hãy đến và trải nghiệm, chúng tôi luôn sẵn sàng chào đón bạn!</p>
            </div>

            <div className="imagegioithieu">
              <img src="/gioithieu.jpg" alt="introduction" className="anhgioithieu"/>
            </div>
          </div>
        </>
      ) : (
        <Menu /> // Hiển thị trang menu khi activePage là 'menu'
      )}
    </div>
  );
}

export default Home;
