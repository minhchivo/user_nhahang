import React, { useEffect, useState, useCallback } from 'react';
import Modal from 'react-modal'; // Import React Modal
import '../Css/BookTable.css';

Modal.setAppElement('#root'); // Đảm bảo modal được đặt đúng vùng truy cập

function BookTable({ userInfo }) {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [bookings, setBookings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBookingsModalOpen, setIsBookingsModalOpen] = useState(false); // Modal cho danh sách booking

  const userId = userInfo?.userId || null;

  const fetchUserBookings = useCallback(async () => {
    try {
      const response = await fetch(`https://admin-quanlinhahang.onrender.com/api/bookings?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      const data = await response.json();
      console.log('Fetched bookings:', data); // Kiểm tra dữ liệu
      setBookings(data); // Đặt dữ liệu bao gồm `tableName`
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setErrorMessage('Lỗi khi tải danh sách đặt bàn.');
    }
  }, [userId]);
  
  

  useEffect(() => {
    fetchTables();
    fetchUserBookings();
  }, [userId, userInfo, fetchUserBookings]);


  const fetchTables = async () => {
    try {
      const response = await fetch('https://admin-quanlinhahang.onrender.com/api/tables');
      const data = await response.json();

      if (!Array.isArray(data) || !data.every((table) => table.tableID)) {
        console.error("Invalid data format from API:", data);
        setErrorMessage("Lỗi dữ liệu từ server.");
        return;
      }

      setTables(data);
    } catch (error) {
      console.error('Error fetching tables:', error);
      setErrorMessage('Lỗi khi tải danh sách bàn.');
    }
  };

  const handleTableSelect = (table) => {
    if (!table || !table.tableID) {
      setErrorMessage("Bàn không hợp lệ.");
      return;
    }

    setSelectedTable(table);
    setIsModalOpen(true); // Mở modal khi chọn bàn
  };

  const handleBooking = async () => {
    if (!selectedTable || !selectedTable.tableID || !bookingDate || !bookingTime) {
      setErrorMessage('Please select a valid table, date, and time.');
      return;
    }

    const bookingData = {
      tableID: selectedTable.tableID,
      bookingDate: `${bookingDate}T${bookingTime}:00.000Z`,
      expiredTime: `${bookingDate}T${parseInt(bookingTime.split(':')[0]) + 2}:${bookingTime.split(':')[1]}:00.000Z`,
      userId,
    };

    try {
      const response = await fetch('https://admin-quanlinhahang.onrender.com/api/book-table', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        setSuccessMessage('Table booked successfully!');
        setErrorMessage('');
        setSelectedTable(null);
        setBookingDate('');
        setBookingTime('');
        setIsModalOpen(false); // Đóng modal khi đặt bàn thành công
        fetchTables();
        fetchUserBookings();

        setTimeout(() => setSuccessMessage(''), 3000); // Ẩn thông báo sau 3 giây
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Error while booking the table.');
      }
    } catch (error) {
      setErrorMessage('Server connection error.');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    const isConfirmed = window.confirm('Bạn có chắc chắn muốn hủy đặt bàn này không?');
    if (!isConfirmed) return;
  
    try {
      const response = await fetch(`https://admin-quanlinhahang.onrender.com/api/delete-booking/${bookingId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        setSuccessMessage('Booking đã được hủy thành công.');
        fetchUserBookings(); // Cập nhật danh sách booking
        fetchTables(); // Cập nhật trạng thái bàn
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Lỗi khi hủy booking.');
      }
    } catch (error) {
      setErrorMessage('Lỗi khi kết nối đến server.');
    }
  };
  
  
  
  

  return (
    <div className="book-table-container">
      <h1 className="book-table-title">Đặt bàn</h1>

      {successMessage && <div className="toast success-toast">{successMessage}</div>}
      {errorMessage && <div className="toast error-toast">{errorMessage}</div>}


      <div className="table-grid">
        {tables.map((table) => (
          <button
            key={table.tableID}
            onClick={() => handleTableSelect(table)}
            disabled={table.status !== '1'}
            className={`table-btn ${table.status === '1' ? 'available' : 'booked'}`}
          >
           {table.tableName} - {table.status === '1' ? 'Available' : 'Booked'}
          </button>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="modal-content">
          <h3>Selected Table: {selectedTable?.tableName}</h3>
          <label>
            Booking Date:
            <input
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
            />
          </label>
          <label>
            Booking Time:
            <input
              type="time"
              value={bookingTime}
              onChange={(e) => setBookingTime(e.target.value)}
            />
          </label>
          <button onClick={handleBooking} className="confirm-booking-btn">
            Confirm Booking
          </button>
          <button onClick={() => setIsModalOpen(false)} className="close-modal-btn">
            Close
          </button>
        </div>
      </Modal>

      <button
        className="show-bookings-btn"
        onClick={() => setIsBookingsModalOpen(true)}
      >
        Show Bookings
      </button>

      <Modal
        isOpen={isBookingsModalOpen}
        onRequestClose={() => setIsBookingsModalOpen(false)}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="modal-content">
          <h2>Your Booked Tables</h2>
          <ul className="bookings-list">
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <li key={booking.id} className="booking-item">
                  <div>
                    <p><strong>Table Name:</strong> {booking.tableName}</p>
                    <p><strong>Booking Date:</strong> {booking.bookingDate.split('T')[0]}</p>
                    <p><strong>Booking Time:</strong> {booking.bookingDate.split('T')[1].slice(0, 5)}</p>
                  </div>
                  <div>
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="cancel-booking-btn"
                    >
                      Cancel Booking
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p>No bookings found.</p>
            )}
          </ul>
          <button onClick={() => setIsBookingsModalOpen(false)} className="close-modal-btn">
            Close
          </button>
        </div>
      </Modal>



    </div>
  );
}

export default BookTable;
