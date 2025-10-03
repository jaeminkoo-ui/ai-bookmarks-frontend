import React from 'react';
import { Tool } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface ToolCardProps {
  tool: Tool;
  onOpenAddToolModal?: () => void;
  categoryId?: string;
  onOpenContextMenu?: (event: React.MouseEvent, categoryId: string, toolName: string) => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, onOpenAddToolModal, categoryId, onOpenContextMenu }) => {
  const { user } = useAuth();

  if (tool.isAddButton) {
    const handleClick = () => {
      if (user && onOpenAddToolModal) {
        onOpenAddToolModal();
      }
    };

    return (
      <div 
        className={`flex flex-col items-center text-center group ${user ? 'cursor-pointer' : 'cursor-not-allowed'}`}
        onClick={handleClick}
        aria-label="Add new tool"
      >
        <div className={`w-16 h-16 rounded-full border-2 border-dashed flex items-center justify-center transition-colors ${user ? 'border-gray-300 bg-gray-50 group-hover:bg-gray-100' : 'border-gray-200 bg-gray-50'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${user ? 'text-gray-400' : 'text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <span className={`mt-3 text-xs ${user ? 'text-gray-500' : 'text-gray-400'}`}>
            {user ? '추가' : '로그인이 필요합니다'}
        </span>
      </div>
    );
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    if (user && onOpenContextMenu && categoryId && tool.name) {
      onOpenContextMenu(e, categoryId, tool.name);
    }
  };

  return (
    <a 
      href={tool.url || '#'} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="flex flex-col items-center text-center group cursor-pointer no-underline"
      onContextMenu={handleContextMenu}
    >
      <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center group-hover:shadow-lg transition-shadow overflow-hidden">
        {tool.icon}
      </div>
      <span className="mt-3 text-sm font-medium text-gray-700">{tool.name}</span>
    </a>
  );
};

export default ToolCard;