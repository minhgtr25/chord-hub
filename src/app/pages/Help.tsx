import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import UserFlowDiagram from "../components/UserFlowDiagram";
import { 
  ChevronDown, 
  ChevronUp,
  HelpCircle,
  Music,
  Edit,
  Eye,
  Keyboard,
  Zap,
  Share2
} from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  icon: React.ReactNode;
}

export default function Help() {

  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: "Làm sao để tạo bài hát mới?",
      answer: 'Vào trang "Bài hát" và nhấn nút "Tạo mới" ở góc trên bên phải. Bạn sẽ được đưa đến trình soạn nhạc để bắt đầu nhập lời và hợp âm.',
      icon: <Music className="w-5 h-5" />,
    },
    {
      question: "Cách chỉnh sửa hợp âm trên Desktop?",
      answer: 'Sử dụng toolbar phía trên trình soạn nhạc. Bạn có thể thêm hợp âm mới, xóa hợp âm hiện tại, thay đổi key, và sử dụng các tính năng như Undo/Redo. Nhấn vào dòng lời để chọn vị trí thêm hợp âm.',
      icon: <Edit className="w-5 h-5" />,
    },
    {
      question: "Xem bài hát trên Mobile như thế nào?",
      answer: 'Trên mobile, nhấn nút "Xem" trên thẻ bài hát. Giao diện mobile được tối ưu để xem hợp âm và thêm ghi chú nhanh. Bạn có thể thêm note cho từng dòng bằng cách nhấn vào icon ghi chú bên phải mỗi dòng.',
      icon: <Eye className="w-5 h-5" />,
    },
    {
      question: "Các phím tắt hữu ích?",
      answer: 'Ctrl+Z: Hoàn tác | Ctrl+Y: Làm lại | Ctrl+S: Lưu | Ctrl++: Phóng to | Ctrl+-: Thu nhỏ | Space: Play/Pause. Bạn có thể sử dụng các phím tắt này để làm việc nhanh hơn.',
      icon: <Keyboard className="w-5 h-5" />,
    },
    {
      question: "Tính năng dò hợp âm tự động là gì?",
      answer: 'Tính năng này sử dụng AI để tự động nhận diện hợp âm từ file âm thanh hoặc microphone. Nhấn nút "Dò tự động" trên toolbar, upload file nhạc hoặc ghi âm trực tiếp, hệ thống sẽ tự động thêm hợp âm vào đúng thời điểm. (Đang phát triển)',
      icon: <Zap className="w-5 h-5" />,
    },
    {
      question: "Làm sao để chia sẻ bài hát với ban nhạc?",
      answer: 'Sau khi lưu bài hát, nhấn nút "Chia sẻ" để tạo link chia sẻ. Các thành viên trong ban nhạc có thể xem và thêm ghi chú riêng của họ. Tính năng này giúp cả ban dễ dàng phối hợp khi luyện tập. (Đang phát triển)',
      icon: <Share2 className="w-5 h-5" />,
    },
  ];

  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Trung tâm trợ giúp
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Tìm câu trả lời cho các câu hỏi thường gặp
          </p>
        </div>

        {/* User Flow Diagram */}
        <div className="mb-8">
          <UserFlowDiagram />
        </div>

        {/* Quick start guide */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Hướng dẫn nhanh</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="font-semibold mb-2">1. Tạo bài hát</div>
              <p className="text-sm text-blue-100">
                Bắt đầu bằng cách tạo bài hát mới và nhập lời
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="font-semibold mb-2">2. Thêm hợp âm</div>
              <p className="text-sm text-blue-100">
                Sử dụng toolbar để thêm hợp âm vào từng dòng
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="font-semibold mb-2">3. Điều chỉnh</div>
              <p className="text-sm text-blue-100">
                Thay đổi key, font size và các thuộc tính khác
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="font-semibold mb-2">4. Lưu và chia sẻ</div>
              <p className="text-sm text-blue-100">
                Lưu bài hát và chia sẻ với ban nhạc của bạn
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Câu hỏi thường gặp
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {faqs.map((faq, index) => (
              <div key={index} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 flex items-start gap-4 text-left"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                    {faq.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {faq.question}
                    </h3>
                    {expandedIndex === index && (
                      <p className="text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    {expandedIndex === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Contact section */}
        <div className="mt-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Vẫn cần trợ giúp?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Liên hệ với chúng tôi và đội ngũ hỗ trợ sẽ phản hồi trong vòng 24 giờ
          </p>
          <a
            href="mailto:support@chordhub.com"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Liên hệ hỗ trợ
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}