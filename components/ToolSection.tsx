import React from 'react';
import { Tool } from '../types';
import ToolCard from './ToolCard';

interface ToolSectionProps {
  id: string;
  title: string;
  tools: Tool[];
  index: number;
  onDragStart: (index: number) => void;
  onDragEnter: (index: number) => void;
  onDragEnd: () => void;
  onOpenAddToolModal: (title: string) => void;
  onOpenContextMenu: (event: React.MouseEvent, categoryId: string, toolName: string) => void;
}

const ToolSection: React.FC<ToolSectionProps> = ({ id, title, tools, index, onDragStart, onDragEnter, onDragEnd, onOpenAddToolModal, onOpenContextMenu }) => {
  return (
    <section 
      draggable 
      onDragStart={() => onDragStart(index)}
      onDragEnter={() => onDragEnter(index)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
      className="select-none"
    >
      <div className="flex items-center mb-6">
        <div className="cursor-move" aria-label={`Drag to reorder ${title} section`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500">
                <circle cx="6" cy="6" r="1.5" fill="currentColor"/>
                <circle cx="12" cy="6" r="1.5" fill="currentColor"/>
                <circle cx="18" cy="6" r="1.5" fill="currentColor"/>
                <circle cx="6" cy="12" r="1.5" fill="currentColor"/>
                <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
                <circle cx="18" cy="12" r="1.5" fill="currentColor"/>
                <circle cx="6" cy="18" r="1.5" fill="currentColor"/>
                <circle cx="12" cy="18" r="1.5" fill="currentColor"/>
                <circle cx="18" cy="18" r="1.5" fill="currentColor"/>
            </svg>
        </div>
        <h2 className="text-2xl font-bold ml-3">{title}</h2>
      </div>
      {tools.length > 0 ? (
        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-x-4 gap-y-8">
            {tools.map((tool, toolIndex) => (
              <ToolCard
                key={tool.name || toolIndex}
                tool={tool}
                onOpenAddToolModal={() => onOpenAddToolModal(title)}
                categoryId={id}
                onOpenContextMenu={onOpenContextMenu}
              />
            ))}
        </div>
      ) : null}
    </section>
  );
};

export default ToolSection;