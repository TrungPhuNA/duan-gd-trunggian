# Hệ thống Trung Gian Giao Dịch An Toàn

## 1. Checklist Tính Năng

### 1.1. Người mua (Buyer)
- Tạo giao dịch (nhập thông tin seller, sản phẩm, số tiền)
- Thanh toán vào ví trung gian (QR / chuyển khoản)
- Xác nhận nhận hàng
- Khiếu nại nếu có vấn đề

### 1.2. Người bán (Seller)
- Nhận thông báo giao dịch
- Xác nhận thông tin
- Gửi hàng
- Nhận tiền sau khi buyer xác nhận hoặc admin phân xử

### 1.3. Admin
- Quản lý giao dịch
- Quản lý khiếu nại
- Cấu hình phí % trung gian
- Thống kê & báo cáo

---

## 2. Luồng Hoạt Động

### Luồng giao dịch cơ bản
1. Buyer & Seller thỏa thuận ngoài group
2. Buyer tạo yêu cầu giao dịch
3. Seller xác nhận
4. Buyer thanh toán vào ví trung gian
5. Seller gửi hàng
6. Buyer nhận hàng
7. Buyer xác nhận hoàn tất
8. Hệ thống giải ngân cho Seller (trừ phí)

### Luồng có tranh chấp
1. Buyer khiếu nại
2. Admin yêu cầu bằng chứng
3. Admin phân xử:
   - Buyer đúng → Hoàn tiền Buyer
   - Seller đúng → Giải ngân Seller

---

## 3. Nghiệp vụ cho từng action

| Action | Thực hiện bởi | Mô tả |
|--------|---------------|-------|
| Tạo yêu cầu giao dịch | Buyer | Lưu thông tin vào DB với trạng thái `Chờ xác nhận Seller` |
| Xác nhận giao dịch | Seller | Cập nhật trạng thái `Chờ thanh toán` |
| Thanh toán | Buyer | Xác nhận giao dịch và chuyển trạng thái `Đã thanh toán` |
| Gửi hàng | Seller | Cập nhật trạng thái `Đang giao` |
| Xác nhận nhận hàng | Buyer | Cập nhật trạng thái `Hoàn tất` và giải ngân cho Seller |
| Khiếu nại | Buyer | Tạo ticket khiếu nại, lưu bằng chứng |
| Giải quyết khiếu nại | Admin | Phân xử, cập nhật kết quả giao dịch |
| Cấu hình phí | Admin | Lưu vào DB, áp dụng cho giao dịch mới |

---

## 4. Sơ đồ Flow Chart

![Flow Chart](flow_giao_dich_trung_gian.png)
