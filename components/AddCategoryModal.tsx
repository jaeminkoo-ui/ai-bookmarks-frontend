import React, { useState } from 'react';

interface AddCategoryModalProps {
  onClose: () => void;
  onAddCategory: (categoryName: string) => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ onClose, onAddCategory }) => {
  const [categoryName, setCategoryName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (categoryName.trim()) {
      onAddCategory(categoryName.trim());
      onClose();
    }
  };
  
  const isFormValid = categoryName.trim() !== '';

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
        <h2 className="text-xl font-bold mb-6">새 카테고리 추가</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="category-name" className="block text-sm font-medium text-gray-700 mb-1">
              카테고리 이름
            </label>
            <input
              type="text"
              id="category-name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="예: Business"
              autoFocus
            />
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

export default AddCategoryModal;