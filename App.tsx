import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import NewsTicker from './components/NewsTicker';
import ToolSection from './components/ToolSection';
import AddToolModal from './components/AddToolModal';
import EditToolModal from './components/EditToolModal';
import AddCategoryModal from './components/AddCategoryModal';
import Footer from './components/Footer';
import ContextMenu from './components/ContextMenu';
import { INITIAL_TOOL_CATEGORIES } from './constants';
import { ToolCategory, Tool } from './types';
import { useAuth } from './contexts/AuthContext';
import ToolIcon from './components/ToolIcon';

const BACKEND_URL = 'https://ai-bookmarks-backends.onrender.com';

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

  useEffect(() => {
    if (user?.email) {
      loadUserData(user.email);
    }
  }, [user]);

  const loadUserData = async (email: string) => {
    try {
      // 사용자가 추가한 툴과 오버라이드 정보를 동시에 가져오기
      const [toolsResponse, overridesResponse] = await Promise.all([
        fetch(`${BACKEND_URL}/api/user/tools/${email}`),
        fetch(`${BACKEND_URL}/api/user/tool-overrides/${email}`)
      ]);

      if (!toolsResponse.ok || !overridesResponse.ok) {
        throw new Error('Failed to load user data');
      }

      const toolsData = await toolsResponse.json();
      const overridesData = await overridesResponse.json();

      // 기본 카테고리 복사
      const updatedCategories = INITIAL_TOOL_CATEGORIES.map(cat => ({
        ...cat,
        tools: [...cat.tools]
      }));

      // 오버라이드 적용 (기본 도구 수정/삭제)
      if (overridesData.overrides && overridesData.overrides.length > 0) {
        overridesData.overrides.forEach((override: any) => {
          const categoryIndex = updatedCategories.findIndex(
            cat => cat.id === override.categoryId
          );

          if (categoryIndex !== -1) {
            if (override.action === 'hide') {
              // 도구 숨기기
              updatedCategories[categoryIndex].tools = updatedCategories[categoryIndex].tools.filter(
                t => t.name !== override.toolName
              );
            } else if (override.action === 'edit') {
              // 도구 수정
              updatedCategories[categoryIndex].tools = updatedCategories[categoryIndex].tools.map(t => {
                if (t.name === override.toolName) {
                  return {
                    ...t,
                    name: override.newName || t.name,
                    url: override.newUrl || t.url,
                    icon: override.newIconUrl 
                      ? <ToolIcon src={override.newIconUrl} alt={`${override.newName || t.name} icon`} />
                      : t.icon
                  };
                }
                return t;
              });
            }
          }
        });
      }

      // 사용자가 추가한 도구 추가
      if (toolsData.tools && toolsData.tools.length > 0) {
        toolsData.tools.forEach((dbTool: any) => {
          const categoryIndex = updatedCategories.findIndex(
            cat => cat.id === dbTool.categoryId
          );

          if (categoryIndex !== -1) {
            const newTool: Tool = {
              name: dbTool.toolName,
              url: dbTool.toolUrl,
              dbId: dbTool.id,
              icon: dbTool.iconUrl 
                ? <ToolIcon src={dbTool.iconUrl} alt={`${dbTool.toolName} icon`} />
                : <PlaceholderIcon />,
            };

            const addButtonIndex = updatedCategories[categoryIndex].tools.findIndex(t => t.isAddButton);
            if (addButtonIndex !== -1) {
              updatedCategories[categoryIndex].tools.splice(addButtonIndex, 0, newTool);
            } else {
              updatedCategories[categoryIndex].tools.push(newTool);
            }
          }
        });
      }

      setCategories(updatedCategories);
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

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

  const handleAddTool = async (toolName: string, toolUrl: string, iconUrl: string | null) => {
    if (!categoryToAddTool || !user?.email) return;

    const category = categories.find(cat => cat.title === categoryToAddTool);
    if (!category) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/user/tools`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: user.email,
          categoryId: category.id,
          toolName,
          toolUrl,
          iconUrl,
        }),
      });

      if (!response.ok) throw new Error('Failed to save tool');

      const data = await response.json();

      const newTool: Tool = {
        name: toolName,
        url: toolUrl,
        dbId: data.tool.id,
        icon: iconUrl ? <ToolIcon src={iconUrl} alt={`${toolName} icon`} /> : <PlaceholderIcon />,
      };

      setCategories(prevCategories => 
        prevCategories.map(cat => {
          if (cat.title === categoryToAddTool) {
            const addButtonIndex = cat.tools.findIndex(t => t.isAddButton);
            const newTools = [...cat.tools];
            if (addButtonIndex !== -1) {
              newTools.splice(addButtonIndex, 0, newTool);
            } else {
              newTools.push(newTool);
            }
            return { ...cat, tools: newTools };
          }
          return cat;
        })
      );
    } catch (error) {
      console.error('Failed to add tool:', error);
      alert('툴 추가에 실패했습니다.');
    }
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
  
  const handleEditTool = async (originalToolName: string, newName: string, newUrl: string, newIconUrl: string | null) => {
    if (!toolToEdit || !user?.email) return;
    const { categoryId, tool } = toolToEdit;

    // 사용자가 추가한 도구인 경우
    if (tool.dbId) {
      try {
        const response = await fetch(`${BACKEND_URL}/api/user/tools/${tool.dbId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            toolName: newName,
            toolUrl: newUrl,
            iconUrl: newIconUrl,
          }),
        });

        if (!response.ok) throw new Error('Failed to update tool');
      } catch (error) {
        console.error('Failed to update tool:', error);
        alert('툴 수정에 실패했습니다.');
        return;
      }
    } else {
      // 기본 도구인 경우 - 오버라이드 저장
      try {
        const response = await fetch(`${BACKEND_URL}/api/user/tool-overrides`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userEmail: user.email,
            categoryId,
            toolName: originalToolName,
            action: 'edit',
            newName,
            newUrl,
            newIconUrl,
          }),
        });

        if (!response.ok) throw new Error('Failed to save tool override');
      } catch (error) {
        console.error('Failed to save tool override:', error);
        alert('툴 수정에 실패했습니다.');
        return;
      }
    }

    // 로컬 상태 업데이트
    setCategories(prevCategories =>
      prevCategories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            tools: category.tools.map(t =>
              t.name === originalToolName
                ? { ...t, 
                    name: newName, 
                    url: newUrl, 
                    icon: newIconUrl 
                          ? <ToolIcon src={newIconUrl} alt={`${newName} icon`} />
                          : <PlaceholderIcon />
                  }
                : t
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

  const handleDeleteTool = async (categoryId: string, toolName: string) => {
    if (!user?.email) return;

    const category = categories.find(c => c.id === categoryId);
    const tool = category?.tools.find(t => t.name === toolName);

    // 사용자가 추가한 도구인 경우
    if (tool?.dbId) {
      try {
        const response = await fetch(`${BACKEND_URL}/api/user/tools/${tool.dbId}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete tool');
      } catch (error) {
        console.error('Failed to delete tool:', error);
        alert('툴 삭제에 실패했습니다.');
        return;
      }
    } else {
      // 기본 도구인 경우 - 오버라이드 저장 (숨김)
      try {
        const response = await fetch(`${BACKEND_URL}/api/user/tool-overrides`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userEmail: user.email,
            categoryId,
            toolName,
            action: 'hide',
          }),
        });

        if (!response.ok) throw new Error('Failed to save tool override');
      } catch (error) {
        console.error('Failed to save tool override:', error);
        alert('툴 삭제에 실패했습니다.');
        return;
      }
    }

    // 로컬 상태 업데이트
    setCategories(prevCategories =>
      prevCategories.map(cat => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            tools: cat.tools.filter(t => t.name !== toolName),
          };
        }
        return cat;
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