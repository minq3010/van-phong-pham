# SERVER-NODEJS

Hướng dẫn dựng backend từng bước cho dự án này, theo đúng thứ tự:

1. Chạy MongoDB bằng Docker
2. Cấu hình biến môi trường cho backend
3. Cài dependency và chạy backend
4. Seed tài khoản manager
5. Seed danh mục và sản phẩm mẫu

## 1. Yêu cầu cần có

- Node.js 18 trở lên
- npm
- Docker Desktop
- Docker Compose

Kiểm tra nhanh:

```bash
node -v
npm -v
docker -v
docker compose version
```

## 2. Di chuyển vào thư mục server

```bash
cd SERVER-NODEJS
```

## 3. Tạo file .env

Dự án này đã có file `.env`. Nếu cần tạo mới hoặc cập nhật, dùng nội dung sau:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_password_or_app_password
CLIENT_URL=http://localhost:5173
DB_URI=mongodb://localhost:27017/do_an_freelance?replicaSet=rs0
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
GEMINI_BASE_URL=https://generativelanguage.googleapis.com/v1beta
```

Lưu ý:

- `CLIENT_URL` nên để `http://localhost:5173` để khớp với frontend Vite.
- `DB_URI` cần có `?replicaSet=rs0` vì MongoDB được chạy bằng replica set trong Docker. Nếu bỏ phần này, các chức năng dùng transaction có thể lỗi.

## 4. Chạy MongoDB bằng Docker

Từ thư mục `SERVER-NODEJS`, chạy:

```bash
docker compose up -d
```

Kiểm tra container:

```bash
docker compose ps
```

Kỳ vọng:

- container `mongodb_dev` đang chạy
- container `mongo_express_dev` đang chạy

Nếu muốn xem log:

```bash
docker compose logs -f mongodb
docker compose logs -f mongo-express
```

## 5. Truy cập Mongo Express

Sau khi Docker lên thành công, có thể mở giao diện quản lý MongoDB tại:

```text
http://localhost:8081
```

Thông tin đăng nhập:

```text
username: admin
password: admin
```

## 6. Cài dependency backend

```bash
npm install
```

## 7. Chạy backend

```bash
npm run dev
```

Backend này đang dùng `vite-plugin-node`, nên lệnh chạy hiện tại là:

```bash
npm run dev
```

Khi backend chạy thành công, hãy giữ terminal này mở.

## 8. Seed tài khoản manager

Mở một terminal mới, vào lại thư mục server:

```bash
cd /SERVER-NODEJS
```

Chạy lệnh:

```bash
npm run seed:manager
```

Tài khoản được tạo mặc định:

```text
username: manager
email: manager@admin.com
password: Manager@123
role: manage
```

Nếu tài khoản đã tồn tại, script sẽ thông báo và không tạo trùng.

## 9. Seed dữ liệu danh mục và sản phẩm

Sau khi đã có tài khoản manager, chạy:

```bash
npm run seed:data
```

Script này sẽ:

- xóa dữ liệu cũ trong `Caterory`
- xóa dữ liệu cũ trong `Product`
- tạo lại danh mục mẫu
- tạo lại sản phẩm mẫu
- gán `createdBy` theo tài khoản `manage` hoặc `admin`

Nếu chưa có tài khoản manager/admin, script sẽ báo lỗi và yêu cầu tạo trước.

## 10. Thứ tự đúng để dựng lại từ đầu

Nếu bạn dựng máy mới hoặc gửi cho khách, đây là thứ tự ngắn gọn nhất:

```bash
cd /SERVER-NODEJS
docker compose up -d
npm install
npm run dev
```

Sau đó mở terminal khác và chạy:

```bash
cd /SERVER-NODEJS
npm run seed:manager
npm run seed:data
```

## 11. Lệnh hữu ích

Dùng Docker:

```bash
docker compose down
docker compose down -v
docker compose restart
```

Ý nghĩa:

- `docker compose down`: dừng container
- `docker compose down -v`: dừng container và xóa volume database
- `docker compose restart`: khởi động lại container

## 12. Các lỗi thường gặp

### Lỗi transaction MongoDB

Nếu gặp lỗi liên quan đến transaction hoặc replica set, kiểm tra lại `DB_URI`:

```env
DB_URI=mongodb://localhost:27017/do_an_freelance?replicaSet=rs0
```

Và đảm bảo MongoDB đang chạy bằng Docker Compose của project này.

### Lỗi không seed được manager

Kiểm tra:

- MongoDB đã chạy chưa
- `DB_URI` có đúng không
- đã chạy lệnh trong đúng thư mục `SERVER-NODEJS` chưa

### Lỗi không seed được data

Kiểm tra:

- đã chạy `npm run seed:manager` chưa
- database đã kết nối được chưa

## 13. Scripts hiện có

```bash
npm run dev
npm run seed:manager
npm run seed:data
```

## 14. Ghi chú

- Dữ liệu sản phẩm seed hiện tại không còn gắn ảnh trong file seed.
- Backend sẽ tự động tạo thư mục `uploads/` và `uploads/products/` khi chạy dự án.
- Có thể đưa `uploads/` vào `.gitignore` mà không làm lỗi chức năng upload ảnh.
- Ảnh sản phẩm khi tạo mới từ giao diện admin sẽ được lưu local trong server, không dùng Cloudinary nữa.
