import mongoose from "mongoose";
import { Caterory } from "../model/Caterory.js";
import { Product } from "../model/product.js";
import { User } from "../model/User.js";

// Sample categories
const categories = [
  { name: "Bút viết", isActive: true },
  { name: "Giấy & Sổ", isActive: true },
  { name: "Dụng cụ học tập", isActive: true },
  { name: "Đồ dùng văn phòng", isActive: true },
  { name: "Bìa & Kẹp tài liệu", isActive: true },
  { name: "Dụng cụ vẽ", isActive: true },
];

// Sample products (will be populated after getting category IDs)
const getProducts = (categoryIds, adminId) => [
  // Bút viết
  {
    name: "Bút bi Thiên Long TL-027",
    caterori: categoryIds[0],
    brand: "Thiên Long",
    origin: "Việt Nam",
    price: 3000,
    variants: [
      { color: "Xanh", price: 3000, quantity: 500, status: true },
      { color: "Đen", price: 3000, quantity: 600, status: true },
      { color: "Đỏ", price: 3000, quantity: 400, status: true },
      { color: "Tím", price: 3000, quantity: 300, status: true },
    ],
    imageUrl: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=500&q=80",
    abumImage: [
      "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=500&q=80",
      "https://images.unsplash.com/photo-1565188455165-23081a90eed5?w=500&q=80",
      "https://images.unsplash.com/photo-1564846287817-4f23e30e5d39?w=500&q=80",
    ],
    discount: 5,
    description: "Bút bi Thiên Long TL-027 là dòng bút bi chất lượng cao, mực viết trơn mượt, không lem, không nhòe. Thân bút nhựa trong suốt giúp dễ dàng quan sát lượng mực còn lại. Thiết kế ergonomic thoải mái khi cầm nắm lâu. Phù hợp cho học sinh, sinh viên và dân văn phòng.",
    status: true,
    quantity: 1800,
    createdBy: adminId,
  },
  {
    name: "Bút gel Pentel Energel BL437",
    caterori: categoryIds[0],
    brand: "Pentel",
    origin: "Nhật Bản",
    price: 12000,
    variants: [
      { color: "Đen", price: 12000, quantity: 300, status: true },
      { color: "Xanh", price: 12000, quantity: 250, status: true },
      { color: "Đỏ", price: 12000, quantity: 200, status: true },
    ],
    imageUrl: "https://images.unsplash.com/photo-1565188455165-23081a90eed5?w=500&q=80",
    abumImage: [
      "https://images.unsplash.com/photo-1565188455165-23081a90eed5?w=500&q=80",
      "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=500&q=80",
    ],
    discount: 10,
    description: "Bút gel Pentel Energel BL437 với công nghệ mực gel độc quyền khô nhanh, không lem, viết êm và mượt mà. Thiết kế thân cao su chống trượt, cầm vừa tay. Ngòi 0.7mm phù hợp viết chữ đẹp, rõ ràng. Sản phẩm chất lượng Nhật Bản.",
    status: true,
    quantity: 750,
    createdBy: adminId,
  },
  {
    name: "Bút lông dầu Artline Supreme EPF-700",
    caterori: categoryIds[0],
    brand: "Artline",
    origin: "Nhật Bản",
    price: 28000,
    variants: [
      { color: "Đen", price: 28000, quantity: 150, status: true },
      { color: "Xanh", price: 28000, quantity: 120, status: true },
      { color: "Đỏ", price: 28000, quantity: 100, status: true },
    ],
    imageUrl: "https://images.unsplash.com/photo-1564846287817-4f23e30e5d39?w=500&q=80",
    abumImage: [
      "https://images.unsplash.com/photo-1564846287817-4f23e30e5d39?w=500&q=80",
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=500&q=80",
    ],
    discount: 8,
    description: "Bút lông dầu Artline Supreme EPF-700 với mực dầu bền màu, không phai, viết được trên nhiều chất liệu. Đầu bút 0.7mm cho nét viết sắc nét. Thân bút cao cấp, thiết kế sang trọng. Lý tưởng cho công việc văn phòng, ký tài liệu quan trọng.",
    status: true,
    quantity: 370,
    createdBy: adminId,
  },

  // Giấy & Sổ
  {
    name: "Giấy A4 Double A 70gsm (500 tờ)",
    caterori: categoryIds[1],
    brand: "Double A",
    origin: "Thái Lan",
    price: 98000,
    variants: [
      { color: "Trắng 70gsm", price: 98000, quantity: 200, status: true },
      { color: "Trắng 80gsm", price: 115000, quantity: 180, status: true },
    ],
    imageUrl: "https://images.unsplash.com/photo-1587885173078-06d17fda2a14?w=500&q=80",
    abumImage: [
      "https://images.unsplash.com/photo-1587885173078-06d17fda2a14?w=500&q=80",
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80",
    ],
    discount: 5,
    description: "Giấy A4 Double A 70gsm (định lượng 70g/m²) chất lượng cao, độ trắng 150 CIE, bề mặt mịn màng. Không gây kẹt giấy khi in, photocopy. Thích hợp cho máy in laser, inkjet, photocopy. Gói 500 tờ tiêu chuẩn, bao bì chắc chắn. Sản phẩm giấy số 1 Đông Nam Á.",
    status: true,
    quantity: 380,
    createdBy: adminId,
  },
  {
    name: "Sổ tay Colokit A5 200 trang",
    caterori: categoryIds[1],
    brand: "Colokit",
    origin: "Việt Nam",
    price: 45000,
    variants: [
      { color: "Đen", price: 45000, quantity: 100, status: true },
      { color: "Xanh dương", price: 45000, quantity: 90, status: true },
      { color: "Hồng", price: 45000, quantity: 80, status: true },
      { color: "Cam", price: 45000, quantity: 70, status: true },
    ],
    imageUrl: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=500&q=80",
    abumImage: [
      "https://images.unsplash.com/photo-1517842645767-c639042777db?w=500&q=80",
      "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500&q=80",
    ],
    discount: 12,
    description: "Sổ tay Colokit A5 với 200 trang giấy định lượng 70gsm, ô ly 5mm tiện lợi cho việc ghi chú, vẽ sơ đồ. Bìa cứng bọc da PU cao cấp, chống thấm nước. Đóng gáy xoắn chắc chắn, mở phẳng 180 độ. Kích thước A5 (14,8 x 21cm) gọn nhẹ, dễ mang theo.",
    status: true,
    quantity: 340,
    createdBy: adminId,
  },
  {
    name: "Giấy note màu Post-it 76x76mm",
    caterori: categoryIds[1],
    brand: "3M Post-it",
    origin: "Mỹ",
    price: 35000,
    variants: [
      { color: "Vàng", price: 35000, quantity: 150, status: true },
      { color: "Nhiều màu", price: 38000, quantity: 120, status: true },
    ],
    imageUrl: "https://images.unsplash.com/photo-1587925358603-c2eea5305bbc?w=500&q=80",
    abumImage: [
      "https://images.unsplash.com/photo-1587925358603-c2eea5305bbc?w=500&q=80",
      "https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=500&q=80",
    ],
    discount: 7,
    description: "Giấy note Post-it 76x76mm với keo dính đặc biệt, dán chắc nhưng dễ dàng gỡ ra không để lại vết. Giấy chất lượng cao, viết mượt bằng mọi loại bút. Kích thước 76x76mm vuông vắn, tiện lợi. Mỗi tập 100 tờ. Sản phẩm Post-it chính hãng 3M.",
    status: true,
    quantity: 270,
    createdBy: adminId,
  },

  // Dụng cụ học tập
  {
    name: "Bút chì gỗ 2B Staedtler Noris",
    caterori: categoryIds[2],
    brand: "Staedtler",
    origin: "Đức",
    price: 7000,
    variants: [
      { color: "Vàng đen 2B", price: 7000, quantity: 400, status: true },
      { color: "Vàng đen HB", price: 7000, quantity: 350, status: true },
    ],
    imageUrl: "https://images.unsplash.com/photo-1588776814546-daab30f310ce?w=500&q=80",
    abumImage: [
      "https://images.unsplash.com/photo-1588776814546-daab30f310ce?w=500&q=80",
      "https://images.unsplash.com/photo-1595475884562-073c30d45670?w=500&q=80",
    ],
    discount: 5,
    description: "Bút chì gỗ Staedtler Noris 2B chính hãng Đức với lõi chì chất lượng cao, độ đen đậm vừa phải, viết mượt không gãy. Vỏ gỗ dẻo dai, dễ dàng gọt nhọn. Độ cứng 2B phù hợp cho việc viết chữ, vẽ phác thảo và tô bài thi trắc nghiệm. Sản phẩm tin cậy cho học sinh.",
    status: true,
    quantity: 750,
    createdBy: adminId,
  },
  {
    name: "Thước kẻ nhựa 30cm Thiên Long",
    caterori: categoryIds[2],
    brand: "Thiên Long",
    origin: "Việt Nam",
    price: 8000,
    variants: [
      { color: "Trong suốt", price: 8000, quantity: 300, status: true },
      { color: "Xanh trong", price: 8000, quantity: 250, status: true },
    ],
    imageUrl: "https://images.unsplash.com/photo-1611530541407-b94124e41fc8?w=500&q=80",
    abumImage: [
      "https://images.unsplash.com/photo-1611530541407-b94124e41fc8?w=500&q=80",
      "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=500&q=80",
    ],
    discount: 10,
    description: "Thước kẻ nhựa 30cm Thiên Long làm từ nhựa trong suốt cao cấp, độ dày vừa phải, không dễ gãy. Vạch chia độ in rõ nét, chính xác từ 0 đến 30cm. Cạnh thước sắc nét, kẻ đường thẳng chuẩn. Thiết kế trong suốt giúp dễ dàng quan sát khi kẻ.",
    status: true,
    quantity: 550,
    createdBy: adminId,
  },
  {
    name: "Gôm tẩy Pentel Hi-Polymer",
    caterori: categoryIds[2],
    brand: "Pentel",
    origin: "Nhật Bản",
    price: 5000,
    variants: [
      { color: "Trắng", price: 5000, quantity: 500, status: true },
      { color: "Đen", price: 6000, quantity: 300, status: true },
    ],
    imageUrl: "https://images.unsplash.com/photo-1597484661973-ee6cd0b6482c?w=500&q=80",
    abumImage: [
      "https://images.unsplash.com/photo-1597484661973-ee6cd0b6482c?w=500&q=80",
      "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=500&q=80",
    ],
    discount: 8,
    description: "Gôm tẩy Pentel Hi-Polymer chất liệu polymer cao cấp, tẩy sạch chữ viết bút chì không để lại vết ố vàng trên giấy. Không chứa PVC, an toàn cho sức khỏe. Ít bám bẩn, ít vụn rơi khi tẩy. Hình chữ nhật nhỏ gọn, tiện lợi. Đóng trong vỏ giấy bảo vệ.",
    status: true,
    quantity: 800,
    createdBy: adminId,
  },

  // Đồ dùng văn phòng
  {
    name: "Kéo văn phòng 21cm Deli E6027",
    caterori: categoryIds[3],
    brand: "Deli",
    origin: "Trung Quốc",
    price: 25000,
    variants: [
      { color: "Xanh lá", price: 25000, quantity: 200, status: true },
      { color: "Đỏ", price: 25000, quantity: 180, status: true },
    ],
    imageUrl: "https://images.unsplash.com/photo-1612214938629-0a139814d690?w=500&q=80",
    abumImage: [
      "https://images.unsplash.com/photo-1612214938629-0a139814d690?w=500&q=80",
      "https://images.unsplash.com/photo-1565967511849-76a60a516170?w=500&q=80",
    ],
    discount: 15,
    description: "Kéo văn phòng Deli E6027 với lưỡi kéo làm từ thép không gỉ sắc bén, cắt mượt mà, bền lâu. Tay cầm nhựa ABS phủ cao su chống trượt, cầm vừa tay, sử dụng lâu không mỏi. Chiều dài 21cm phù hợp cho đa dụng văn phòng. Thiết kế ergonomic hiện đại.",
    status: true,
    quantity: 380,
    createdBy: adminId,
  },
  {
    name: "Bấm kim số 10 Deli 0479",
    caterori: categoryIds[3],
    brand: "Deli",
    origin: "Trung Quốc",
    price: 18000,
    variants: [
      { color: "Đen", price: 18000, quantity: 250, status: true },
      { color: "Trắng", price: 18000, quantity: 200, status: true },
      { color: "Xanh", price: 18000, quantity: 150, status: true },
    ],
    imageUrl: "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=500&q=80",
    abumImage: [
      "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=500&q=80",
      "https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=500&q=80",
    ],
    discount: 12,
    description: "Bấm kim số 10 Deli 0479 thiết kế nhỏ gọn, nhẹ nhàng, dễ dàng bấm kim với lực nhẹ. Dung tích 50 chiếc kim, bấm được tối đa 20 tờ giấy. Thân kim loại bền chắc, mạ chống gỉ. Đế cao su chống trượt. Sử dụng kim tiêu chuẩn số 10 phổ biến.",
    status: true,
    quantity: 600,
    createdBy: adminId,
  },
  {
    name: "Băng keo trong 2.4cm x 40y Deli",
    caterori: categoryIds[3],
    brand: "Deli",
    origin: "Trung Quốc",
    price: 15000,
    variants: [
      { color: "Trong suốt", price: 15000, quantity: 400, status: true },
    ],
    imageUrl: "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=500&q=80",
    abumImage: [
      "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=500&q=80",
      "https://images.unsplash.com/photo-1611530541407-b94124e41fc8?w=500&q=80",
    ],
    discount: 8,
    description: "Băng keo trong Deli 2.4cm x 40 yard (36m) với lớp keo acrylic dính chắc, bền lâu, không bong tróc theo thời gian. Độ trong suốt cao, dán gần như vô hình. Dễ dàng xé tay, không cần dụng cụ. Phù hợp dán giấy, bao bì, đóng gói hàng hóa. Cuộn tiết kiệm.",
    status: true,
    quantity: 400,
    createdBy: adminId,
  },

  // Bìa & Kẹp tài liệu
  {
    name: "Bìa trình ký A4 Deli E310",
    caterori: categoryIds[4],
    brand: "Deli",
    origin: "Trung Quốc",
    price: 45000,
    variants: [
      { color: "Đen", price: 45000, quantity: 150, status: true },
      { color: "Xanh dương", price: 45000, quantity: 120, status: true },
      { color: "Đỏ", price: 45000, quantity: 100, status: true },
    ],
    imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80",
    abumImage: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80",
      "https://images.unsplash.com/photo-1587885173078-06d17fda2a14?w=500&q=80",
    ],
    discount: 10,
    description: "Bìa trình ký A4 Deli E310 làm từ nhựa PVC cao cấp, bền đẹp, chống thấm nước. Kẹp gài kim loại chắc chắn giữ tài liệu chặt chẽ. Dung lượng kẹp tối đa 40 tờ giấy A4 80gsm. Thiết kế thanh lịch, chuyên nghiệp phù hợp cho văn phòng, trình ký tài liệu.",
    status: true,
    quantity: 370,
    createdBy: adminId,
  },
  {
    name: "Kẹp bướm 25mm (hộp 12 cái)",
    caterori: categoryIds[4],
    brand: "Deli",
    origin: "Trung Quốc",
    price: 8000,
    variants: [
      { color: "Đen", price: 8000, quantity: 300, status: true },
      { color: "Nhiều màu", price: 9000, quantity: 250, status: true },
    ],
    imageUrl: "https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=500&q=80",
    abumImage: [
      "https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=500&q=80",
      "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=500&q=80",
    ],
    discount: 5,
    description: "Kẹp bướm 25mm Deli làm từ kim loại mạ chống gỉ, lò xo giữ chắc chuyên dùng kẹp tài liệu, giấy tờ. Kích thước 25mm (chiều rộng miệng kẹp) kẹp được khoảng 100 tờ giấy. Có tay kẹp gập lại tiện lợi. Hộp 12 cái tiện dụng cho văn phòng.",
    status: true,
    quantity: 550,
    createdBy: adminId,
  },
  {
    name: "File lá A4 PVC Deli (10 chiếc)",
    caterori: categoryIds[4],
    brand: "Deli",
    origin: "Trung Quốc",
    price: 25000,
    variants: [
      { color: "Trắng", price: 25000, quantity: 200, status: true },
      { color: "Xanh", price: 25000, quantity: 180, status: true },
    ],
    imageUrl: "https://images.unsplash.com/photo-1587885173078-06d17fda2a14?w=500&q=80",
    abumImage: [
      "https://images.unsplash.com/photo-1587885173078-06d17fda2a14?w=500&q=80",
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80",
    ],
    discount: 7,
    description: "File lá A4 PVC Deli chất liệu nhựa PVC dày dặn, trong suốt nhìn rõ nội dung tài liệu. Lỗ đục chuẩn 11 lỗ phù hợp hầu hết các loại còng, bìa lưu trữ. Miệng file đầu phía trên dễ lật xem. Gói 10 chiếc tiện lợi, bảo vệ tài liệu khỏi bụi bẩn, nước.",
    status: true,
    quantity: 380,
    createdBy: adminId,
  },

  // Dụng cụ vẽ
  {
    name: "Bộ màu nước 12 màu Thiên Long C-02",
    caterori: categoryIds[5],
    brand: "Thiên Long",
    origin: "Việt Nam",
    price: 35000,
    variants: [
      { color: "12 màu", price: 35000, quantity: 150, status: true },
      { color: "18 màu", price: 52000, quantity: 100, status: true },
    ],
    imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&q=80",
    abumImage: [
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&q=80",
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&q=80",
    ],
    discount: 10,
    description: "Bộ màu nước 12 màu Thiên Long C-02 với màu sắc tươi sáng, dễ pha trộn, dễ tô. Chất lượng mực tốt, không độc hại, an toàn cho trẻ em. Hộp nhựa chắc chắn với ngăn pha màu tiện lợi. Phù hợp cho học sinh tiểu học, mầm non tập tô màu, vẽ tranh.",
    status: true,
    quantity: 250,
    createdBy: adminId,
  },
  {
    name: "Bộ màu sáp 24 màu Thiên Long C-019",
    caterori: categoryIds[5],
    brand: "Thiên Long",
    origin: "Việt Nam",
    price: 28000,
    variants: [
      { color: "12 màu", price: 18000, quantity: 200, status: true },
      { color: "24 màu", price: 28000, quantity: 150, status: true },
    ],
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&q=80",
    abumImage: [
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&q=80",
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&q=80",
    ],
    discount: 8,
    description: "Bộ màu sáp 24 màu Thiên Long C-019 chất liệu sáp mềm, tô dễ dàng, màu sắc tươi đẹp. Không độc hại, không mùi khó chịu, an toàn tuyệt đối cho trẻ nhỏ. Hộp giấy cứng bền đẹp. Kích thước thanh sáp vừa tay trẻ. Sản phẩm lý tưởng cho các bé tập tô màu, sáng tạo.",
    status: true,
    quantity: 350,
    createdBy: adminId,
  },
  {
    name: "Bút lông màu Artline Marker 12 màu",
    caterori: categoryIds[5],
    brand: "Artline",
    origin: "Nhật Bản",
    price: 65000,
    variants: [
      { color: "12 màu", price: 65000, quantity: 80, status: true },
      { color: "24 màu", price: 125000, quantity: 50, status: true },
    ],
    imageUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=500&q=80",
    abumImage: [
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=500&q=80",
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&q=80",
    ],
    discount: 12,
    description: "Bút lông màu Artline Marker chính hãng Nhật Bản với mực nước cao cấp, màu sắc sống động, bền màu. Đầu bút chống bẹp dù ấn mạnh. Nắp có lỗ thông khí an toàn. Thân bút PP chắc chắn. Tô vẽ mượt mà, không lem. Phù hợp cho học sinh, sinh viên và họa sĩ.",
    status: true,
    quantity: 130,
    createdBy: adminId,
  },
];

const seedData = async () => {
  try {
    console.log("🔄 Đang kết nối MongoDB...");
    await mongoose.connect(
      process.env.DB_URI || "mongodb://localhost:27017/do_an_freelance"
    );
    console.log("✅ Kết nối MongoDB thành công\n");

    // Xóa dữ liệu cũ
    console.log("🗑️  Xóa dữ liệu cũ...");
    await Caterory.deleteMany({});
    await Product.deleteMany({});
    console.log("✅ Đã xóa dữ liệu cũ\n");

    // Lấy admin user
    console.log("🔍 Tìm tài khoản admin...");
    let admin = await User.findOne({ role: "manage" });
    if (!admin) {
      admin = await User.findOne({ role: "admin" });
    }
    if (!admin) {
      console.error("❌ Không tìm thấy tài khoản admin!");
      console.log("💡 Chạy: npm run seed:admin để tạo tài khoản admin");
      process.exit(1);
    }
    console.log(`✅ Tìm thấy admin: ${admin.username}\n`);

    // Seed categories
    console.log("📁 Đang tạo danh mục...");
    const createdCategories = await Caterory.insertMany(categories);
    console.log(`✅ Đã tạo ${createdCategories.length} danh mục`);
    createdCategories.forEach((cat) => {
      console.log(`   - ${cat.name}`);
    });
    console.log("");

    // Seed products
    console.log("📦 Đang tạo sản phẩm...");
    const categoryIds = createdCategories.map((cat) => cat._id);
    const products = getProducts(categoryIds, admin._id);
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Đã tạo ${createdProducts.length} sản phẩm`);
    createdProducts.forEach((prod) => {
      console.log(`   - ${prod.name} (${prod.variants.length} variants)`);
    });
    console.log("");

    // Summary
    console.log("==========================================");
    console.log("✅ SEED DỮ LIỆU THÀNH CÔNG!");
    console.log("==========================================");
    console.log(`📁 Danh mục: ${createdCategories.length}`);
    console.log(`📦 Sản phẩm: ${createdProducts.length}`);
    console.log(`🎨 Tổng variants: ${createdProducts.reduce((sum, p) => sum + p.variants.length, 0)}`);
    console.log("==========================================\n");

    await mongoose.disconnect();
    console.log("✅ Ngắt kết nối MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi:", error.message);
    console.error(error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedData();
