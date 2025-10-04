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
import apiClient from './api'; // ★ 1. apiClient를 import 합니다.

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
  const { user, logout } = useAuth(); // ★ logout 함수도 가져옵니다.

  const dragItemIndex = useRef<number | null>(null);
  const dragOverItemIndex = useRef<number | null>(null);
  
  // ★ API 에러를 공통으로 처리하는 함수
  const handleApiError = (error: any) => {
    console.error('API Error:', error);
    // 인증 에러(401, 403)가 발생하면 자동으로 로그아웃 처리
    if (error.response && [401, 403].includes(error.response.status)) {
      alert('세션이 만료되었습니다. 다시 로그인해주세요.');
      logout();
    } else {
      alert('데이터 처리 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    // 사용자가 로그인한 경우에만 데이터를 불러옵니다.
    if (user) {
      loadUserData();
    }
  }, [user]);

  // ★ 2. loadUserData 함수를 apiClient로 수정
  const loadUserData = async () => {
    try {
      // 이제 URL에 email을 넣을 필요가 없습니다. 토큰이 모든 것을 처리합니다.
      const [toolsResponse, overridesResponse] = await Promise.all([
        apiClient.get('/api/user/tools'),
        apiClient.get('/api/user/tool-overrides')
      ]);

      const toolsData = toolsResponse.data;
      const overridesData = overridesResponse.data;

      const updatedCategories = INITIAL_TOOL_CATEGORIES.map(cat => ({
        ...cat,
        tools: [...cat.tools]
      }));

      if (overridesData.overrides && overridesData.overrides.length > 0) {
        overridesData.overrides.forEach((override: any) => {
          const categoryIndex = updatedCategories.findIndex(cat => cat.id === override.categoryId);
          if (categoryIndex !== -1) {
            if (override.action === 'hide') {
              updatedCategories[categoryIndex].tools = updatedCategories[categoryIndex].tools.filter(t => t.name !== override.toolName);
            } else if (override.action === 'edit') {
              updatedCategories[categoryIndex].tools = updatedCategories[categoryIndex].tools.map(t => {
                if (t.name === override.toolName) {
                  return { ...t, name: override.newName || t.name, url: override.newUrl || t.url, icon: override.newIconUrl ? <ToolIcon src={override.newIconUrl} alt={`${override.newName || t.name} icon`} /> : t.icon };
                }
                return t;
              });
            }
          }
        });
      }

      if (toolsData.tools && toolsData.tools.length > 0) {
        toolsData.tools.forEach((dbTool: any) => {
          const categoryIndex = updatedCategories.findIndex(cat => cat.id === dbTool.categoryId);
          if (categoryIndex !== -1) {
            const newTool: Tool = { name: dbTool.toolName, url: dbTool.toolUrl, dbId: dbTool.id, icon: dbTool.iconUrl ? <ToolIcon src={dbTool.iconUrl} alt={`${dbTool.toolName} icon`} /> : <PlaceholderIcon /> };
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
      handleApiError(error);
    }
  };

  const handleDragStart = (index: number) => { dragItemIndex.current = index; };
  const handleDragEnter = (index: number) => { dragOverItemIndex.current = index; };
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

  const handleOpenAddToolModal = (title: string) => { setCategoryToAddTool(title); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setCategoryToAddTool(null); };

  // ★ 3. handleAddTool 함수를 apiClient로 수정
  const handleAddTool = async (toolName: string, toolUrl: string, iconUrl: string | null) => {
    if (!categoryToAddTool || !user) return;
    const category = categories.find(cat => cat.title === categoryToAddTool);
    if (!category) return;

    try {
      // userEmail을 보낼 필요가 없습니다.
      const response = await apiClient.post('/api/user/tools', {
        categoryId: category.id,
        toolName,
        toolUrl,
        iconUrl,
      });

      const newTool: Tool = { name: toolName, url: toolUrl, dbId: response.data.tool.id, icon: iconUrl ? <ToolIcon src={iconUrl} alt={`${toolName} icon`} /> : <PlaceholderIcon /> };

      setCategories(prevCategories => 
        prevCategories.map(cat => {
          if (cat.title === categoryToAddTool) {
            const addButtonIndex = cat.tools.findIndex(t => t.isAddButton);
            const newTools = [...cat.tools];
            if (addButtonIndex !== -1) { newTools.splice(addButtonIndex, 0, newTool); } else { newTools.push(newTool); }
            return { ...cat, tools: newTools };
          }
          return cat;
        })
      );
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleAddCategory = (name: string) => {
    if (!name.trim()) return;
    const newCategory: ToolCategory = { id: `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`, title: name.trim(), tools: [{ name: '', icon: <div/>, isAddButton: true }] };
    setCategories(prev => [...prev, newCategory]);
    setIsAddCategoryModalOpen(false);
  };
  
  // ★ 4. handleEditTool 함수를 apiClient로 수정
  const handleEditTool = async (originalToolName: string, newName: string, newUrl: string, newIconUrl: string | null) => {
    if (!toolToEdit || !user) return;
    const { categoryId, tool } = toolToEdit;

    try {
      if (tool.dbId) { // 사용자가 추가한 도구 (PUT)
        await apiClient.put(`/api/user/tools/${tool.dbId}`, { toolName: newName, toolUrl: newUrl, iconUrl: newIconUrl });
      } else { // 기본 도구 (오버라이드 POST)
        await apiClient.post('/api/user/tool-overrides', { categoryId, toolName: originalToolName, action: 'edit', newName, newUrl, newIconUrl });
      }

      setCategories(prevCategories =>
        prevCategories.map(category => {
          if (category.id === categoryId) {
            return { ...category, tools: category.tools.map(t => t.name === originalToolName ? { ...t, name: newName, url: newUrl, icon: newIconUrl ? <ToolIcon src={newIconUrl} alt={`${newName} icon`} /> : <PlaceholderIcon /> } : t) };
          }
          return category;
        })
      );
      setToolToEdit(null);
    } catch (error) {
      handleApiError(error);
    }
  };
  
  const handleOpenContextMenu = (event: React.MouseEvent, categoryId: string, toolName: string) => {
    event.preventDefault();
    if (!user) return;
    setContextMenu({ x: event.clientX, y: event.clientY, categoryId, toolName });
  };
  const handleCloseContextMenu = () => { setContextMenu(null); };

  // ★ 5. handleDeleteTool 함수를 apiClient로 수정
  const handleDeleteTool = async (categoryId: string, toolName: string) => {
    if (!user) return;

    const category = categories.find(c => c.id === categoryId);
    const tool = category?.tools.find(t => t.name === toolName);

    try {
      if (tool?.dbId) { // 사용자가 추가한 도구 (DELETE)
        await apiClient.delete(`/api/user/tools/${tool.dbId}`);
      } else { // 기본 도구 (오버라이드 POST - 숨김)
        await apiClient.post('/api/user/tool-overrides', { categoryId, toolName, action: 'hide' });
      }

      setCategories(prevCategories =>
        prevCategories.map(cat => {
          if (cat.id === categoryId) {
            return { ...cat, tools: cat.tools.filter(t => t.name !== toolName) };
          }
          return cat;
        })
      );
      handleCloseContextMenu();
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans text-gray-800 flex flex-col">
      <Header />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <NewsTicker />
        <div className="space-y-16 mt-12">
          {categories.map((category, index) => (
            <ToolSection key={category.id} id={category.id} title={category.title} tools={category.tools} index={index} onDragStart={handleDragStart} onDragEnter={handleDragEnter} onDragEnd={handleDragEnd} onOpenAddToolModal={handleOpenAddToolModal} onOpenContextMenu={handleOpenContextMenu} />
          ))}
        </div>
        {user && (
          <div className="text-center mt-16">
            <button onClick={() => setIsAddCategoryModalOpen(true)} className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              + 새 카테고리 추가
            </button>
          </div>
        )}
      </main>
      <Footer />
      
      {isModalOpen && categoryToAddTool && ( <AddToolModal onClose={handleCloseModal} onAddTool={handleAddTool} /> )}
      {toolToEdit && ( <EditToolModal tool={toolToEdit.tool} onClose={() => setToolToEdit(null)} onEditTool={handleEditTool} /> )}
      {isAddCategoryModalOpen && ( <AddCategoryModal onClose={() => setIsAddCategoryModalOpen(false)} onAddCategory={handleAddCategory} /> )}
      {contextMenu && (
        <ContextMenu x={contextMenu.x} y={contextMenu.y} onClose={handleCloseContextMenu}
          onAddSubscription={() => { console.log('Add subscription for:', contextMenu.toolName); handleCloseContextMenu(); }}
          onEdit={() => {
            if (contextMenu) {
              const { categoryId, toolName } = contextMenu;
              const category = categories.find(c => c.id === categoryId);
              const tool = category?.tools.find(t => t.name === toolName);
              if (category && tool) { setToolToEdit({ categoryId, tool }); }
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