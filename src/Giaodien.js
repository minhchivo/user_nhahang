import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Menu from './Js/Menu';
import Drink from './Js/Drink';
import BookTable from './Js/BookTable'; 
import Cart from './Js/Cart'; 
import UserInfoModal from './Js/UserInfoModal'; 
import Home from './Js/Home';
import './Giaodien.css';

function Giaodien({ userInfo, setUserInfo }) {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showInfo, setShowInfo] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [cart] = useState({}); // Lưu giỏ hàng dưới dạng đối tượng

  const [isChatBoxOpen, setIsChatBoxOpen] = useState(false); // Điều khiển trạng thái chatbox
  const [messages, setMessages] = useState([]); // Lưu trữ các tin nhắn trong chat
  const [userMessage, setUserMessage] = useState(''); // Tin nhắn người dùng nhập

  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false); // Điều khiển trạng thái modal

  const sendMessage = async () => {
    if (!userMessage.trim()) return;

    // Thêm tin nhắn người dùng
    const newMessages = [...messages, { sender: 'user', text: userMessage }];
    setMessages(newMessages);
    setUserMessage('');

    // Gửi tin nhắn đến AI (ví dụ sử dụng ChatGPT API)
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer YOUR_OPENAI_API_KEY`, // Thay bằng API Key của bạn
        },
        body: JSON.stringify({
          model: 'gpt-4', // Hoặc "gpt-3.5-turbo"
          messages: [{ role: 'user', content: userMessage }],
        }),
      });

      const data = await response.json();
      const aiReply = data.choices[0].message.content;

      // Thêm tin nhắn từ AI
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'ai', text: aiReply },
      ]);
    } catch (error) {
      console.error('Error fetching AI reply:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'ai', text: 'Xin chào, chúng tôi sẽ cố gắng phản hồi nhanh nhất có thể.' },
      ]);
    }
  };

  // Cuộn xuống dưới cùng khi có tin nhắn mới
  useEffect(() => {
    const chatMessages = document.querySelector('.chatbox-messages');
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }, [messages]);
    

  const [addedToCartMessage, setAddedToCartMessage] = useState(''); // Thêm state cho thông báo

  useEffect(() => {
    if (!userInfo) {
      navigate('/');
    }
  }, [userInfo, navigate]);

  const handleSearch = () => {
    fetch(`https://admin-quanlinhahang.onrender.com/api/search?query=${searchQuery}`)
      .then((response) => response.json())
      .then((data) => {
        setSearchResults(data); // Set search results
        setActivePage('timkiem'); // Navigate to search results page
        setSearchQuery(''); // Xóa chữ trong ô tìm kiếm
      })
      .catch((err) => console.log('Error searching:', err));
  };
  

  // Define handleLogout function
  const handleLogout = () => {
    setUserInfo(null);
    localStorage.removeItem('userInfo');
    navigate('/'); 
  };

  const addToCart = (product) => {
    console.log('Sản phẩm thêm vào giỏ:', product); // Kiểm tra đối tượng product
  
    // Chuẩn bị dữ liệu gửi tới backend
    const payload = {
      userId: userInfo?.userId || 'guest',
      productId: product.id || product.productId,
      productName: product.foodName || product.name, // Tên sản phẩm (thức ăn/nước uống)
      quantity: 1, // Mặc định số lượng là 1
      price: product.price,
      type: product.foodName ? 'food' : 'drink', // Xác định loại sản phẩm
      imageUrl: product.imageUrl, // URL hình ảnh
    };
  
    fetch('https://admin-quanlinhahang.onrender.com/api/add-to-cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to add to cart');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Thêm vào giỏ hàng thành công:', data);
  
        // Hiển thị thông báo thành công
        setAddedToCartMessage('Thêm vào giỏ hàng thành công!');
        setTimeout(() => {
          setAddedToCartMessage('');
        }, 3000);
      })
      .catch((error) => {
        console.error('Lỗi khi thêm vào giỏ hàng:', error);
      });
  };
  
  
  
  

  const renderContent = () => {
    switch (activePage) {
      case 'home':
        return <Home userInfo={userInfo} addToCart={addToCart} />;
      case 'menu':
        return <Menu userInfo={userInfo} addToCart={addToCart} />;
      case 'drink':
        return <Drink userInfo={userInfo} addToCart={addToCart} />;
        case 'timkiem':
          return (
            <div className="search-results-container">
              <div className="search-results-header">
                <h1 className="search-results-title">Kết quả tìm kiếm</h1>
              </div>
              <div className="search-results-grid">
                {searchResults.length > 0 ? (
                  searchResults.map((item) => (
                    <div key={item.id} className="search-results-item">
                      <img
                        src={`https://admin-quanlinhahang.onrender.com${item.imageUrl}`}
                        alt={item.foodName || item.name}
                        className="search-results-item-image"
                      />
                      <h2 className="search-results-item-name">{item.foodName || item.name}</h2>
                      <p className="search-results-item-price">Giá: {item.price} VND</p>
                      <button
                        onClick={() => addToCart(item)} // Truyền sản phẩm hiện tại vào hàm addToCart
                        className="search-results-item-button"
                      >
                        Thêm vào giỏ hàng
                      </button>
                    </div>
                  ))
                ) : (
                  <p>Không tìm thấy kết quả.</p>
                )}
              </div>
            </div>
          );
        
      case 'booktable':
        return <BookTable userInfo={userInfo} />;
      case 'userinfomodal':
        return <UserInfoModal initialUserInfo={userInfo} />;
      case 'cart':
        return <Cart cart={cart} userId={userInfo?.userId} />
        ;
      default:
        return <Home />;
    }
  };

  return (
    <div className="container_giaodien">
      <header className="header_giaodien">
        <img src="./logo129.png" alt="logo" className="logo_giaodien" />
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Nhập món ăn hoặc thức uống..."
          />
          {searchQuery && (
            <button className="btn_timkiem" onClick={handleSearch}>Tìm kiếm</button>
          )}
        </div>
        <nav className="nav_giaodien">
          <span
            className={`menu-item ${activePage === 'home' ? 'active' : ''}`}
            onClick={() => setActivePage('home')}
          >
            Trang Chủ
          </span>
          <div
            className="menu-container_giaodien"
            onMouseEnter={() => setShowSubMenu(true)}
            onMouseLeave={() => setShowSubMenu(false)}
          >
            <span className={`menu-item ${activePage === 'menu' ? 'active' : ''}`}>
              Menu
            </span>
            {showSubMenu && (
              <div className="submenu_giaodien">
                <span
                  className={`submenu-item ${activePage === 'menu' ? 'active' : ''}`}
                  onClick={() => setActivePage('menu')}
                >
                  Thức ăn
                </span>
                <span
                  className={`submenu-item ${activePage === 'drink' ? 'active' : ''}`}
                  onClick={() => setActivePage('drink')}
                >
                  Nước uống
                </span>
              </div>
            )}
          </div>
          <span
            className={`menu-item ${activePage === 'booktable' ? 'active' : ''}`}
            onClick={() => setActivePage('booktable')}
          >
            BookTable
          </span>
          <span
            className={`menu-item ${activePage === 'cart' ? 'active' : ''}`}
            onClick={() => setActivePage('cart')}
          >
            Giỏ Hàng
          </span>
          <div
            className="info-container_giaodien"
            onMouseEnter={() => setShowInfo(true)}
            onMouseLeave={() => setShowInfo(false)}
          >
            <span className="info-button_giaodien">Thông Tin</span>
            {showInfo && (
              <div className="info-dropdown_giaodien">
                <span onClick={() => setActivePage('userinfomodal')}>Thông tin n.dùng</span>
                <button onClick={handleLogout} className="logout-button">Đăng xuất</button>
              </div>
            )}
          </div>
        </nav>
      </header>

      {addedToCartMessage && (
        <div className="cart-notification">{addedToCartMessage}</div>
      )}

      <main className="main-content_giaodien">{renderContent()}</main>
      <footer className="footer_giaodien">
        <div className="footer-content">
          <div className="footer-left">
            <h2>Nhà Hàng 4 Anh Em</h2>
            <p>Địa chỉ: 194/64 Đường số 8, Gò Vấp, HCM</p>
            <p>Số điện thoại: 0862002483</p>
            <p>Email: 4anhem.restaurant@gmail.com</p>
          </div>
          <div className="footer-center">
            <ul></ul>
          </div>
          <div className="footer-right">
            <h3>Theo dõi chúng tôi</h3>
            <ul>
              <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></li>
              <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Nhà Hàng 4 Anh Em. Tất cả quyền lợi được bảo lưu.</p>
        </div>
      </footer>

      <div className="floating-buttons">
        {/* Nút Gọi Điện */}
        <div
          className="floating-button"
          onClick={() => setIsPhoneModalOpen(true)}
        >
          📞
          <span className="floating-tooltip">Liên hệ</span>
        </div>
        {/* Modal hiển thị số điện thoại */}
          {isPhoneModalOpen && (
            <div className="phone-modal">
              <div className="phone-modal-content">
                <h3>Tư vấn hỗ trợ</h3>
                <p>Hotline: <strong>0374804085</strong></p>
                <div className="phone-modal-buttons">
                  <button
                    onClick={() => window.location.href = 'tel:0374804085'}
                    className="call-button"
                  >
                    Gọi ngay
                  </button>
                  <button
                    onClick={() => setIsPhoneModalOpen(false)}
                    className="close-button"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          )}
  
      
        {/* Nút Nhắn Tin */}
        <div
          className="floating-button"
          onClick={() => setIsChatBoxOpen(!isChatBoxOpen)}
        >
          💬
          <span className="floating-tooltip">Nhắn tin</span>
        </div>
        {/* Chatbox */}
          {isChatBoxOpen && (
            <div className="chatbox">
            <div className="chatbox-header">
              <span>Chat</span>
              <button onClick={() => setIsChatBoxOpen(false)}>✖</button>
            </div>
            <div className="chatbox-messages">
              {messages.length === 0 ? (
                <div style={{ textAlign: 'center', width: '100%' }}>
                  <p style={{ color: '#aaa', marginTop: '50px' }}>
                    Chào mừng! Hãy bắt đầu cuộc trò chuyện...
                  </p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`chatbox-message ${
                      msg.sender === 'user' ? 'chatbox-user' : 'chatbox-ai'
                    }`}
                  >
                    {msg.text}
                  </div>
                ))
              )}
            </div>
            <div className="chatbox-input-container">
              <input
                type="text"
                className="chatbox-input"
                placeholder="Nhập tin nhắn..."
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button className="chatbox-send-button" onClick={sendMessage}>
                Gửi
              </button>
            </div>
          </div>
          )}
  
      </div>

    </div>
  );
}

export default Giaodien;
