import React, { useState } from 'react';

interface AddToolModalProps {
  onClose: () => void;
  onAddTool: (toolName: string, toolUrl: string, iconUrl: string | null) => void;
}

const AddToolModal: React.FC<AddToolModalProps> = ({ onClose, onAddTool }) => {
  const [toolName, setToolName] = useState('');
  const [toolUrl, setToolUrl] = useState('');
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);

  const handleFetchFavicon = async (url: string) => {
    if (!url || isDetecting) return;

    let domain;
    try {
      let fullUrl = url.trim();
      if (!fullUrl.startsWith('http')) {
        fullUrl = 'https://' + fullUrl;
      }
      domain = new URL(fullUrl).hostname;
    } catch (error) {
      setFaviconUrl(null);
      return;
    }

    setIsDetecting(true);
    const googleFaviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

    const img = new Image();
    img.src = googleFaviconUrl;
    img.onload = () => {
      setFaviconUrl(googleFaviconUrl);
      setIsDetecting(false);
    };
    img.onerror = () => {
      setFaviconUrl(null);
      setIsDetecting(false);
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (toolName.trim() && toolUrl.trim()) {
      let formattedUrl = toolUrl.trim();
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = 'https://' + formattedUrl;
      }
      onAddTool(toolName.trim(), formattedUrl, faviconUrl);
      onClose();
    }
  };
  
  const isFormValid = toolName.trim() !== '' && toolUrl.trim() !== '';

  const renderIconPreview = () => {
    if (isDetecting) {
      return <div className="text-gray-500 text-sm">아이콘 감지 중...</div>;
    }
    if (faviconUrl) {
      return (
        <div className="flex items-center">
          <img src={faviconUrl} alt="Favicon Preview" className="w-8 h-8 mr-3 rounded" />
          <span className="text-gray-700 text-sm">자동 감지됨</span>
        </div>
      );
    }
    return <div className="text-gray-400 text-sm">URL을 입력하면 파비콘이 자동 감지됩니다.</div>;
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" 
      aria-modal="true" 
      role="dialog" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md" 
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-6">AI 서비스 추가</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="service-name" className="block text-sm font-medium text-gray-700 mb-1">
              서비스 이름
            </label>
            <input
              type="text"
              id="service-name"
              value={toolName}
              onChange={(e) => setToolName(e.target.value)}
              className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="예: My AI Tool"
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="service-url" className="block text-sm font-medium text-gray-700 mb-1">
              URL
            </label>
            <input
              type="text"
              id="service-url"
              value={toolUrl}
              onChange={(e) => setToolUrl(e.target.value)}
              onBlur={() => handleFetchFavicon(toolUrl)}
              className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="예: myaitool.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              아이콘 미리보기
            </label>
            <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg min-h-[52px] flex items-center">
                {renderIconPreview()}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 text-gray-800 rounded-lg font-semibold hover:bg-gray-200"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
              disabled={!isFormValid}
            >
              추가
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddToolModal;