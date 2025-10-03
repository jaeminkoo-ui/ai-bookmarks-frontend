import React from 'react';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onAddSubscription: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose, onAddSubscription, onEdit, onDelete }) => {
  const menuStyle: React.CSSProperties = {
    top: y,
    left: x,
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} onContextMenu={(e) => { e.preventDefault(); onClose(); }} />
      <div
        style={menuStyle}
        className="fixed bg-white rounded-lg shadow-xl py-2 w-40 z-50 animate-fade-in-fast"
        onClick={(e) => e.stopPropagation()}
      >
        <ul className="divide-y divide-gray-100">
          <li onClick={onAddSubscription} className="flex items-center px-4 py-2.5 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>구독 추가</span>
          </li>
          <li onClick={onEdit} className="flex items-center px-4 py-2.5 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
            </svg>
            <span>수정</span>
          </li>
          <li onClick={onDelete} className="flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 cursor-pointer transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>삭제</span>
          </li>
        </ul>
      </div>
    </>
  );
};

export default ContextMenu;