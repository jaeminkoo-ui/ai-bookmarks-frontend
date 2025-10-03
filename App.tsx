import React, { useState, useRef } from 'react';
import Header from './components/Header';
import NewsTicker from './components/NewsTicker';
import ToolSection from './components/ToolSection';
import FloatingActionButton from './components/FloatingActionButton';
import AddToolModal from './components/AddToolModal';
import EditToolModal from './components/EditToolModal';
import AddCategoryModal from './components/AddCategoryModal';
import Footer from './components/Footer';
import ContextMenu from './components/ContextMenu';
import { INITIAL_TOOL_CATEGORIES } from './constants';
import { ToolCategory, Tool } from './types';
import { useAuth } from './contexts/AuthContext';

const PlaceholderIcon = ({ color = 'bg-gray-200' }: { color?: string }) => (
    <div className={`w-8 h-8 rounded-full ${color}`}></div>
);

const App: React.FC = () => {
  const [categories, setCategories] = useState<ToolCategory[]>(INITIAL_TOOL_CATEGORIES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [categoryToAddTool, setCategoryToAddTool] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; categoryId: string; toolName: string; } | null>(null);
  const [toolToEdit, setToolToEdit] = useState<{ categoryId: string; tool: Tool } | null>(null);
  const { user } = useAuth();

  const dragItemIndex = useRef<number | null>(null);
  const dragOverItemIndex = useRef<number | null>(null);

  const handleDragStart = (index: number) => {
    dragItemIndex.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItemIndex.current = index;
  };

  const handleDragEnd = () => {
    if (dragItemIndex.current !== null && dragOverItemIndex.current !== null && dragItemIndex.current !== dragOverItemIndex.current) {
      const newCategories = [...categories];
      const draggedItem = newCategories.splice(dragItemIndex.current, 1)[0];
      newCategories.splice(dragOverItemIndex.current, 0, draggedItem);
      setCategories(newCategories);
    }
    dragItemIndex.current = null;
    dragOverItemIndex.current = null;
  };

  const handleOpenAddToolModal = (title: string) => {
    setCategoryToAddTool(title);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCategoryToAddTool(null);
  };

  // handleAddTool 함수가 새 Modal에 맞게 수정되었습니다.
  const handleAddTool = (toolName: string, toolUrl: string, iconUrl: string | null) => {
    if (!categoryToAddTool) return;

    const newTool: Tool = {
      name: toolName,
      url: toolUrl,
      icon: iconUrl ? <img src={iconUrl} alt={`${toolName} icon`} className="w-full h-full object-contain rounded" /> : <PlaceholderIcon />,
    };

    setCategories(prevCategories => 
      prevCategories.map(category => {
        if (category.title === categoryToAddTool) {
          const addButtonIndex = category.tools.findIndex(t => t.isAddButton);
          const newTools = [...category.tools];
          if (addButtonIndex !== -1) {
            newTools.splice(addButtonIndex, 0, newTool);
          } else {
            newTools.push(newTool);
          }
          return { ...category, tools: newTools };
        }
        return category;
      })
    );
  };

  const handleAddCategory = (name: string) => {
    if (!name.trim()) return;

    const newCategory: ToolCategory = {
      id: `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      title: name.trim(),
      tools: [{ name: '', icon: <div/>, isAddButton: true }]
    };

    setCategories(prev => [...prev, newCategory]);
    setIsAddCategoryModalOpen(false);
  };
  
  // handleEditTool 함수가 새 Modal에 맞게 수정되었습니다.
  const handleEditTool = (originalToolName: string, newName: string, newUrl: string, newIconUrl: string | null) => {
    if (!toolToEdit) return;
    const { categoryId } = toolToEdit;

    setCategories(prevCategories =>
      prevCategories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            tools: category.tools.map(tool =>
              tool.name === originalToolName
                ? { ...tool, 
                    name: newName, 
                    url: newUrl, 
                    icon: newIconUrl 
                          ? <img src={newIconUrl} alt={`${newName} icon`} className="w-full h-full object-contain rounded" /> 
                          : <PlaceholderIcon />
                  }
                : tool
            ),
          };
        }
        return category;
      })
    );
    setToolToEdit(null);
  };

  const handleOpenContextMenu = (event: React.MouseEvent, categoryId: string, toolName: string) => {
    event.preventDefault();
    if (!user) return;
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      categoryId,
      toolName,
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleDeleteTool = (categoryId: string, toolName: string) => {
    setCategories(prevCategories =>
      prevCategories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            tools: category.tools.filter(tool => tool.name !== toolName),
          };
        }
        return category;
      })
    );
    handleCloseContextMenu();
  };


  return (
    <div className="bg-white min-h-screen font-sans text-gray-800 flex flex-col">
      <Header />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <NewsTicker />
        <div className="space-y-16 mt-12">
          {categories.map((category, index) => (
            <ToolSection
              key={category.id}
              id={category.id}
              title={category.title}
              tools={category.tools}
              index={index}
              onDragStart={handleDragStart}
              onDragEnter={handleDragEnter}
              onDragEnd={handleDragEnd}
              onOpenAddToolModal={handleOpenAddToolModal}
              onOpenContextMenu={handleOpenContextMenu}
            />
          ))}
        </div>
        {user && (
          <div className="text-center mt-16">
            <button
              onClick={() => setIsAddCategoryModalOpen(true)}
              className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              + 새 카테고리 추가
            </button>
          </div>
        )}
      </main>
      <Footer />
      <FloatingActionButton />
      
      {/* Modal 호출 부분이 수정되었습니다. */}
      {isModalOpen && categoryToAddTool && (
        <AddToolModal
          onClose={handleCloseModal}
          onAddTool={handleAddTool}
        />
      )}
      {toolToEdit && (
        <EditToolModal
            tool={toolToEdit.tool}
            onClose={() => setToolToEdit(null)}
            onEditTool={handleEditTool}
        />
      )}

      {isAddCategoryModalOpen && (
        <AddCategoryModal 
          onClose={() => setIsAddCategoryModalOpen(false)}
          onAddCategory={handleAddCategory}
        />
      )}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={handleCloseContextMenu}
          onAddSubscription={() => {
            console.log('Add subscription for:', contextMenu.toolName);
            handleCloseContextMenu();
          }}
          onEdit={() => {
            if (contextMenu) {
              const { categoryId, toolName } = contextMenu;
              const category = categories.find(c => c.id === categoryId);
              const tool = category?.tools.find(t => t.name === toolName);
              if (category && tool) {
                setToolToEdit({ categoryId, tool });
              }
            }
            handleCloseContextMenu();
          }}
          onDelete={() => handleDeleteTool(contextMenu.categoryId, contextMenu.toolName)}
        />
      )}
    </div>
  );
};

export default App;