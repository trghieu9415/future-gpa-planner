# 🎓 Future GPA Planner & Scheduler

Một công cụ hỗ trợ học tập toàn diện dành cho sinh viên đại học. Ứng dụng giúp bạn lên kế hoạch đạt được điểm GPA mục tiêu cho thời gian học còn lại, đồng thời cung cấp công cụ xếp thời khóa biểu trực quan, thông minh với nhiều tiện ích nâng cao.

## 🌟 Tính năng nổi bật

### 1. 📊 Máy tính GPA Tốt nghiệp (GPA Calculator)

- **Tính toán lộ trình mục tiêu:** Nhập GPA hiện tại, số tín chỉ đã tích lũy và số tín chỉ yêu cầu. Hệ thống sẽ tự động tính toán ra các tổ hợp điểm (A, B, C, D) cần thiết cho các tín chỉ còn lại để đạt các mốc xếp loại (Xuất sắc, Giỏi, Khá) hoặc mốc GPA tùy chỉnh.
- **Mô phỏng cải thiện điểm:** Tính năng "Lên kế hoạch tùy chỉnh" cho phép bạn nhập số tín chỉ dự kiến học mới hoặc học cải thiện (tăng 1, 2, 3 bậc điểm) để xem sự thay đổi của GPA tích lũy.
- **Hỗ trợ nhiều hệ điểm:** Hỗ trợ hệ chữ truyền thống (A, B, C, D), hệ điểm có dấu cộng (A, B+, B, C+,...) và cho phép **tạo hệ điểm tùy chỉnh** (Custom Grading Scale) lưu trữ tại LocalStorage.

### 2. 📅 Trình xếp Thời khóa biểu (Schedule Planner)

- **Giao diện trực quan:** Hiển thị thời khóa biểu dạng lưới (Thứ 2 - Thứ 7, Tiết 1 - 15). Dễ dàng tùy chỉnh màu sắc cho từng môn học.
- **Phát hiện xung đột thông minh:**
  - Cảnh báo/Ngăn chặn đăng ký trùng giờ, trùng lịch.
  - **Cảnh báo di chuyển cơ sở:** Tự động phát hiện và cảnh báo nếu bạn có 2 môn học liên tiếp ở 2 cơ sở khác nhau mà thời gian di chuyển quá ngắn (ví dụ: chỉ có 20 phút giữa tiết 2 và tiết 3).
- **Tìm kiếm mạnh mẽ:** Bộ lọc tìm kiếm nâng cao hỗ trợ Regex (Xem phần cú pháp bên dưới).
- **Quản lý đa không gian (Tabs):** Tạo và lưu tối đa 5 thời khóa biểu khác nhau (Tabs) để so sánh các phương án.
- **Xuất/Nhập dữ liệu:**
  - Lưu thời khóa biểu thành file ảnh `.png` hoặc copy trực tiếp vào Clipboard.
  - Sao lưu và phục hồi dữ liệu qua file `.json`.

## 🔍 Cú pháp tìm kiếm môn học nâng cao

Trong tab Thời khóa biểu, thanh tìm kiếm hỗ trợ cú pháp lọc cực kỳ mạnh mẽ để tìm môn học nhanh chóng:

| Cú pháp      | Ví dụ                 | Ý nghĩa                                           |
| :----------- | :-------------------- | :------------------------------------------------ |
| `tc:[số]`    | `tc: 3`               | Lọc các môn có đúng 3 tín chỉ                     |
| `khoa:[tên]` | `khoa: cntt`          | Lọc các môn thuộc khoa Công nghệ thông tin        |
| `gv:[tên]`   | `gv: nguyen van a`    | Lọc các môn do giảng viên Nguyễn Văn A dạy        |
| _Kết hợp_    | `tc:3 khoa:cntt gv:A` | Kết hợp tất cả các điều kiện trên + từ khóa tự do |

## 🛠 Công nghệ sử dụng

Dự án được xây dựng dựa trên các công nghệ hiện đại:

- **Core:** [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Tiện ích khác:** `html-to-image` (chụp ảnh TKB), `sonner` (Toast notifications), `react-router-dom`.

## 🚀 Cài đặt và Chạy cục bộ

Làm theo các bước sau để khởi chạy dự án trên máy của bạn:

**1. Clone kho lưu trữ:**

```bash
git clone https://github.com/your-username/trghieu9415-future-gpa-planner.git
cd trghieu9415-future-gpa-planner
```

**2. Cài đặt các dependencies:**
Cần có Node.js cài sẵn trên máy (khuyến nghị phiên bản 18+).

```bash
npm install
```

**3. Khởi chạy Server Development:**

```bash
npm run dev
```

Truy cập `http://localhost:8080` (hoặc port được hiển thị trong terminal) để xem ứng dụng.

**4. Build cho Production:**

```bash
npm run build
```

## 📂 Cấu trúc thư mục (Tóm tắt)

```text
src/
├── components/      # Các component UI dùng chung (shadcn ui) và layout (Header, Footer)
├── consts/          # Khai báo biến hằng, hệ thống điểm mặc định
├── hooks/           # Các custom hooks (useToast, useMobile, useGradingStorage...)
├── lib/             # Các utility func của thư viện (cn, tailwind-merge)
├── pages/
│   ├── gpa-calculator/  # Logic và giao diện của Máy tính GPA
│   │   ├── math/        # Các hàm thuật toán tính toán GPA, tối ưu điểm
│   └── scheduler/       # Logic và giao diện của Thời khóa biểu
├── store/           # Zustand stores (AcademicStatus, CourseStore, ScheduleStore)
└── utils/           # Các hàm helper (xử lý file, logic lọc course, xử lý text)
```

## 📄 Bản quyền và Giấy phép

Dự án được phân phối dưới giấy phép **MIT**. Xem tệp `LICENSE` để biết thêm chi tiết.

_Copyright (c) 2026 Tr. Hiếu (HnS - SVSGU)_
