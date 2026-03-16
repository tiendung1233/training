# Phân tích và Dịch tài liệu bài kiểm tra cuối khóa

Đây là tuần cuối cùng của chương trình đào tạo, và bạn sẽ xây dựng một ứng dụng Shopify thực tế có tên: **Simple Sales Notification**. Thông qua việc tạo ra ứng dụng này, bạn sẽ được tự tay xây dựng một ứng dụng Shopify hoạt động đầy đủ và trải nghiệm quy trình phát triển tương tự như đội ngũ của Avada.

Dưới đây là một vài điều cần lưu ý:
- Đây sẽ là bài kiểm tra cuối cùng của bạn trong chương trình đào tạo.
- Vì đây là một trải nghiệm thực tế, bạn sẽ có thời hạn (deadline). Công việc phải được hoàn thành trong vòng 2 tuần làm việc.
- Yêu cầu ứng dụng và hướng dẫn sẽ được chia thành nhiều phần để dễ quản lý. Sau khi hoàn thành mỗi phần, bạn cần thông báo cho người đào tạo để xem xét (review) công việc và sau đó quyết định xem bạn có thể chuyển sang phần tiếp theo hay không.
- Nghiêm cấm sao chép code từ các học viên khác.

---

## Mô tả
- **Tên ứng dụng:** Simple Sales Notifications
- **Mô tả:** Đây là một ứng dụng Shopify giúp các nhà bán hàng (merchant) hiển thị các thông báo mua hàng gần đây ngay trên cửa hàng của họ. Bất cứ khi nào có đơn hàng mới, danh sách thông báo cũng sẽ được cập nhật. Với ứng dụng này, các chủ quán có thể dễ dàng tùy chỉnh cách hiển thị của popup từ giao diện quản trị (backend) của chúng ta với thiết kế đẹp mắt.

## Yêu cầu (Requirements)
Để tạo ra ứng dụng này, bạn cần tuân thủ các logic nghiệp vụ được mô tả trong các yêu cầu của ứng dụng. Dưới đây là danh sách các yêu cầu (hay các chức năng) mà ứng dụng này cần có.

## Lộ trình (Roadmap)
Lộ trình thực hiện ứng dụng này sẽ được chia thành từng phần nhỏ để chúng ta có thể thực hiện từng bước. Mỗi phần sẽ bao gồm hướng dẫn và các mẹo để hoàn thành nhiệm vụ. Vui lòng đọc kỹ và làm theo một cách nghiêm ngặt.

### Trước khi bắt đầu
**Phần 0: Lấy boilerplate (bản mẫu) của ứng dụng.**
Trước khi bắt đầu làm ứng dụng Shopify, bạn cần lấy app boilerplate từ Avada CLI. Vui lòng xem hướng dẫn này: Getting started with Avada CLI.

### Phần 1: Xây dựng cấu trúc cho React App
Như bạn đã học ở tuần 2 về React app đóng vai trò là frontend cho ứng dụng của chúng ta. Trước khi đi sâu vào code backend chứa logic nghiệp vụ nặng, bước đầu tiên bạn cần làm là thiết lập giao diện (layout) ứng dụng theo đúng bản thiết kế mẫu (mockup) trên Figma.
Thiết kế của popup thông báo bán hàng có thể tìm thấy ở đây: [Figma source]. Bạn có thể inspect và lấy mã CSS từ trang.

**Có một số điểm QUAN TRỌNG mà bạn cần lưu ý trong phần này:**
- Bạn chỉ cần thiết kế biểu mẫu (form) bằng các component của Polaris. Chưa cần viết logic `onChange` cho các trường nhập liệu.
- Thiết kế của notification cần được đóng gói thành một React component có khả năng tái sử dụng (reusable).
- Thiết kế của bạn PHẢI sử dụng Shopify Polaris. Đừng cố dùng thẻ HTML thuần và tự viết style cho những phần đã được hỗ trợ trong Polaris (chẳng hạn như LegacyStack, InlineStack, v.v.).
- Thiết kế của bạn phải giống bản mockup ít nhất 90%. Bạn nên dùng bản Shopify Polaris 12. Nếu bản thiết kế dùng các phiên bản Polaris cũ hơn, hãy tìm các component hoặc cài đặt tương đương để ghép vào.

### Phần 2.1: Bắt tay vào thiết kế cấu trúc dữ liệu
**Thiết lập cấu trúc dữ liệu:**
Database của bạn cần phải chứa thêm 2 collection nữa, ngoài 3 collection mặc định do Avada Core tạo sẵn (`shopInfos`, `shops`, `subscriptions`).

**Bạn sẽ tạo thêm 2 collection sau để lưu trữ dữ liệu ứng dụng:** `settings` và `notifications`.

**1. Collection `settings`:** Dùng để lưu các thông số từ form ở trang Cài đặt (Settings page).
- **Tên:** `settings`
- **Cấu trúc dữ liệu:**
  - `position` (string): Vị trí sẽ xuất hiện thông báo trên cửa hàng (Giá trị: `bottom-left`, `bottom-right`, `top-left`, `top-right`).
  - `hideTimeAgo` (boolean): Có ẩn phần thời gian (ví dụ "10 phút trước") không. (Giá trị: `true`, `false`).
  - `truncateProductName` (boolean): Có cắt bớt tên sản phẩm nếu nó quá dài hay không.
  - `displayDuration` (number - integer): Số giây mà mỗi thông báo sẽ hiển thị.
  - `firstDelay` (number - integer): Số giây chờ trước khi popup đầu tiên xuất hiện.
  - `popsInterval` (number - integer): Số giây giữa các lần hiện popup.
  - `maxPopsDisplay` (number - integer): Số lượng thông báo tối đa trên mỗi lần tải trang.
  - `includedUrls` (string): Danh sách URL trang mà popup được phép hiển thị, cách nhau bằng dấu xuống dòng.
  - `excludedUrls` (string): Danh sách URL trang mà popup KHÔNG ĐƯỢC PHÉP hiển thị, cách nhau bằng dấu xuống dòng.
  - `allowShow` (string): Hiển thị tất cả hay các trang cụ thể (Giá trị: `all` - `specific`).
  - `shopId` (string - Firestore ID): ID của shop đang sở hữu setting này.

**2. Collection `notifications`:** Danh sách các popup thông báo dựa trên lịch sử mua hàng thật.
- **Tên:** `notifications`
- **Cấu trúc dữ liệu:**
  - `firstName` (string): Tên khách hàng.
  - `city` (string): Thành phố đặt hàng.
  - `productName` (string): Tên sản phẩm khách hàng đã mua.
  - `country` (string): Quốc gia đặt hàng.
  - `productId` (number - integer): ID sản phẩm bên Shopify.
  - `timestamp` (Date): Dấu thời gian (thời điểm) đặt đơn.
  - `productImage` (string): Đường link ảnh sản phẩm.

*(Tiếp theo, bạn sẽ cần liên kết map cấu trúc dữ liệu này vào các input của React app).*

### Phần 2.2: Hoàn thành backend API
Trong phần này, bạn cần thực hiện các công việc sau:
1. Tạo một KoaJS API endpoint để lưu trữ (save) đầu vào của thiết lập (setting input).
2. Tạo một KoaJS API endpoint để lấy danh sách các thông báo (notifications).
3. Kết nối (Map) KoaJS API với React App. Hãy nhớ sử dụng `useFetchApi` mà chúng ta đã học ở Tuần 2: React.

**Các API Endpoints cần triển khai:**
- `GET /api/settings`: Lấy setting của `shopId` hiện tại trong session.
- `PUT /api/settings`: Cập nhật setting của `shopId` hiện tại trong session.
- `GET /api/notifications`: Lấy danh sách các thông báo.

### Phần 3: Logic thực thi sau khi cài đặt (After installation)
Trong phần 3, chúng ta sẽ viết logic xử lý quá trình cài đặt ứng dụng. Sẽ chỉ có hai logic chính:
1. Đồng bộ 30 đơn hàng đầu tiên (first 30 orders) của store để sinh ra `notifications`.
2. Tạo setting (thiết lập) mặc định cho cửa hàng. Hãy nhớ đây chỉ là cài đặt mặc định khởi tạo.

**Lưu ý:**
- Đây là phần phức tạp nhất, đòi hỏi bạn tận dụng tối đa kỹ năng NodeJS. Hãy nhớ xử lý các hàm NodeJS bất đồng bộ (async) một cách tối ưu nhất.
- Tại phần này, bạn nên xem xét sử dụng **GraphQL** thay vì REST API nếu cần để tiết kiệm nguồn tài lực query với Shopify API.

### Phần 4: Webhook
Trong phần này, bạn cần:
1. Đăng ký webhook sau khi install (cài đặt ứng dụng).
2. Tạo một endpoint (URL xử lý) để tạo `notification` mới mỗi khi có một đơn hàng mới chuyển đến store.
3. Hàm convert đơn hàng thành `notifications` cần được dùng lại chung với logic đồng bộ đơn hàng ở Phần 3.

**Lưu ý:**
- Nếu bạn không thể đăng ký Webhook thông qua Shopify API vì lỗi 403, bạn cần thiết lập mục "Protected Customer Data".
- Bạn cần đăng ký webhook bằng Cloudflare URL (được sinh ra sau lệnh `npm run dev` và nằm trong file `.runtimeconfig.json`). Nhờ vậy, bạn có thể tạo cầu nối đường hầm (tunnel) tới Firebase Functions ở máy local thông qua giá trị `appConfig.baseUrl`.
- Trong Vite proxy (ở file `vite.config.js`), bạn cần điều hướng (proxy) tới endpoint `/webhook` để proxy này nối thông qua Firebase:
  ```javascript
  const proxyConfig = {
    ...
    '^/webhook(/|(\\?.*)?$)': proxyOptions,
  };
  ```
- Đôi khi bạn sẽ muốn bổ sung đoạn cài webhook tại `afterLogin` hook (trong `auth.js`) để đảm bảo các Webhooks luôn được đăng ký lại mỗi khi bạn chạy lại `npm run dev`.

### Phần 5: Client API
Trong phần này, bạn sẽ tạo một hàm public API trả về cấu trúc giống như sau:
```json
{
  "data": {
    "setting": {
      "position": "top-left",
      "hideTimeAgo": true,
      ...
    },
    "notifications": [
      {
        "id": "JKJFD9454jFdf",
        "city": "Hanoi",
        "productName": "Product name",
        ...
      }
    ]
  }
}
```

### Phần 6: Javascript SDK
**Lưu ý:** Trước khi vào phần này, cần download đoạn snippet scripttag: `https://cdnapps.avada.io/scripttag.zip`.

Đây là phần cuối cùng của project, nơi bạn sẽ thao tác logic hiển thị popup trực tiếp ngoài cửa hàng (Storefront). 

**Lưu ý:**
- Không sử dụng `setTimeout` với callback vì nó sẽ không chạy đúng. Hãy dùng Javascript `async/await` thay thế.

**Bạn sẽ cần phải code:**
1. Đăng ký Scripttag sau khi install.
2. Code logic hiển thị cho scripttag bên ngoài storefront.

**Lưu ý quan trọng:**
Do app của chúng ta dùng ViteJS, nên Firebase Hosting sẽ lấy thư mục `static` làm public. Khi dev, bạn có thể truy cập mã script tại: `http://localhost:5050/scripttag/avada-sale-pop.min.js`. Tuy nhiên, vì Shopify API không chấp nhận `http`, bạn không thể đăng ký đường link này để gắn scripttag.
Do đó, bạn phải bật ứng dụng bằng lệnh `avada start` với cú pháp: `npm run start -f 5050 -p 3000`. Khi đó máy sẽ cung cấp một đường link định dạng `https` tại cổng `3000`, và script sẽ tồn tại ở: `https://localhost:3000/scripttag/avada-sale-pop.min.js`.

### Phần 7: Theme App Extension - OS 2.0
*(Tại phần này chưa có thêm mô tả cho OS 2.0 app blocks).*

---

## Tóm tắt Luồng Hệ thống (System Flow)
Từ các định nghĩa trên, ứng dụng Notification này sẽ hoạt động theo luồng sau:
1. **Lần đầu cài app (Installation):** Tạo thiết lập (settings) mặc định xuống Database Firebase. Đồng bộ tối đa 30 đơn mua hàng cũ lên Firebase collection (`notifications`). Đăng ký webhook để nhận biết có đơn hàng mới sau này.
2. **Kích hoạt có đơn mới:** Khi có người mua, Shopify báo Webhook về cho backend. Backend ghi thêm `notification` vào Firebase database. Cập nhật này sẽ có mặt ở ngoài storefront ngay ở những lần truy cập sau.
3. **Tuỳ chỉnh Setting:** Merchant truy cập App, phần backend (ví dụ trang `/app/setting`), sử dụng giao diện React/Polaris chỉnh sửa options. Ứng dụng sẽ gửi API Call (Sử dụng hàm Client bạn vừa cấu hình) lên Firebase `PUT /settings` để lưu tuỳ chỉnh.
4. **Hiển thị ngoài web cửa hàng (Storefront):** Khách hàng vào web, mã nhúng `scripttag` (hoặc OS 2.0 block) sẽ gọi qua "Client API" lấy danh sách các notification và thiết lập Option để hiển thị lên cho khách hàng xem.
