import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../api';

interface Category {
  id: string;
  title: string;
  order: number;
  tools?: DefaultTool[];
}

interface DefaultTool {
  id: number;
  name: string;
  url: string;
  categoryId: string;
  order: number;
  category?: { title: string };
}

interface News {
  id: number;
  title: string;
  content?: string;
  link?: string;
  publishedAt: string;
}

interface ReleaseNote {
  id: number;
  version: string;
  content: string;
  releaseDate: string;
}

interface Admin {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

type Tab = 'categories' | 'tools' | 'news' | 'releases' | 'admins';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [activeTab, setActiveTab] = useState<Tab>('categories');
  const [categories, setCategories] = useState<Category[]>([]);
  const [tools, setTools] = useState<DefaultTool[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [releaseNotes, setReleaseNotes] = useState<ReleaseNote[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingTool, setEditingTool] = useState<DefaultTool | null>(null);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [editingRelease, setEditingRelease] = useState<ReleaseNote | null>(null);

  const [newCategory, setNewCategory] = useState({ id: '', title: '', order: 0 });
  const [newTool, setNewTool] = useState({ name: '', url: '', categoryId: '', order: 0 });
  const [newNews, setNewNews] = useState({ title: '', content: '', link: '', publishedAt: '' });
  const [newRelease, setNewRelease] = useState({ version: '', content: '', releaseDate: '' });
  const [newAdminEmail, setNewAdminEmail] = useState('');

  useEffect(() => {
    if (!user) {
      alert('관리자 로그인이 필요합니다.');
      navigate('/');
      return;
    }
    if (!user.isAdmin) {
      alert('관리자 권한이 필요합니다.');
      navigate('/');
      return;
    }
    loadData();
  }, [user, activeTab]);

  const loadData = async () => {
    try {
      if (activeTab === 'categories') {
        const res = await apiClient.get('/api/categories');
        setCategories(res.data.categories);
        // Load all tools when categories tab is active
        const toolsRes = await apiClient.get('/api/categories');
        const allTools: DefaultTool[] = [];
        toolsRes.data.categories.forEach((cat: any) => {
          cat.tools.forEach((tool: any) => {
            allTools.push({
              ...tool,
              categoryId: cat.id,
              category: { title: cat.title }
            });
          });
        });
        setTools(allTools);
      } else if (activeTab === 'tools') {
        const res = await apiClient.get('/api/categories');
        const allTools: DefaultTool[] = [];
        res.data.categories.forEach((cat: any) => {
          cat.tools.forEach((tool: any) => {
            allTools.push({
              ...tool,
              categoryId: cat.id,
              category: { title: cat.title }
            });
          });
        });
        setTools(allTools);
      } else if (activeTab === 'news') {
        const res = await apiClient.get('/api/news?limit=50');
        setNews(res.data.news);
      } else if (activeTab === 'releases') {
        const res = await apiClient.get('/api/release-notes?limit=50');
        setReleaseNotes(res.data.releaseNotes);
      } else if (activeTab === 'admins') {
        const res = await apiClient.get('/api/admin/admins');
        setAdmins(res.data.admins);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  // Category handlers
  const handleCreateCategory = async () => {
    if (!newCategory.id || !newCategory.title) {
      alert('ID와 제목을 입력해주세요.');
      return;
    }
    try {
      await apiClient.post('/api/categories', newCategory);
      setNewCategory({ id: '', title: '', order: 0 });
      loadData();
    } catch (error) {
      console.error('Failed to create category:', error);
      alert('카테고리 생성에 실패했습니다.');
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;
    try {
      await apiClient.put(`/api/categories/${editingCategory.id}`, {
        title: editingCategory.title,
        order: editingCategory.order
      });
      setEditingCategory(null);
      loadData();
    } catch (error) {
      console.error('Failed to update category:', error);
      alert('카테고리 수정에 실패했습니다.');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await apiClient.delete(`/api/categories/${id}`);
      loadData();
    } catch (error) {
      console.error('Failed to delete category:', error);
      alert('카테고리 삭제에 실패했습니다.');
    }
  };

  // Tool handlers
  const handleCreateTool = async () => {
    if (!newTool.name || !newTool.url || !newTool.categoryId) {
      alert('모든 필드를 입력해주세요.');
      return;
    }
    try {
      await apiClient.post('/api/tools', newTool);
      setNewTool({ name: '', url: '', categoryId: '', order: 0 });
      loadData();
    } catch (error) {
      console.error('Failed to create tool:', error);
      alert('툴 생성에 실패했습니다.');
    }
  };

  const handleUpdateTool = async () => {
    if (!editingTool) return;
    try {
      await apiClient.put(`/api/tools/${editingTool.id}`, {
        name: editingTool.name,
        url: editingTool.url,
        categoryId: editingTool.categoryId,
        order: editingTool.order
      });
      setEditingTool(null);
      loadData();
    } catch (error) {
      console.error('Failed to update tool:', error);
      alert('툴 수정에 실패했습니다.');
    }
  };

  const handleDeleteTool = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await apiClient.delete(`/api/tools/${id}`);
      loadData();
    } catch (error) {
      console.error('Failed to delete tool:', error);
      alert('툴 삭제에 실패했습니다.');
    }
  };

  // News handlers
  const handleCreateNews = async () => {
    if (!newNews.title) {
      alert('제목을 입력해주세요.');
      return;
    }
    try {
      await apiClient.post('/api/news', newNews);
      setNewNews({ title: '', content: '', link: '', publishedAt: '' });
      loadData();
    } catch (error) {
      console.error('Failed to create news:', error);
      alert('뉴스 생성에 실패했습니다.');
    }
  };

  const handleUpdateNews = async () => {
    if (!editingNews) return;
    try {
      await apiClient.put(`/api/news/${editingNews.id}`, {
        title: editingNews.title,
        content: editingNews.content,
        link: editingNews.link,
        publishedAt: editingNews.publishedAt
      });
      setEditingNews(null);
      loadData();
    } catch (error) {
      console.error('Failed to update news:', error);
      alert('뉴스 수정에 실패했습니다.');
    }
  };

  const handleDeleteNews = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await apiClient.delete(`/api/news/${id}`);
      loadData();
    } catch (error) {
      console.error('Failed to delete news:', error);
      alert('뉴스 삭제에 실패했습니다.');
    }
  };

  // Release Note handlers
  const handleCreateRelease = async () => {
    if (!newRelease.version || !newRelease.content) {
      alert('버전과 내용을 입력해주세요.');
      return;
    }
    try {
      await apiClient.post('/api/release-notes', newRelease);
      setNewRelease({ version: '', content: '', releaseDate: '' });
      loadData();
    } catch (error) {
      console.error('Failed to create release note:', error);
      alert('릴리즈 노트 생성에 실패했습니다.');
    }
  };

  const handleUpdateRelease = async () => {
    if (!editingRelease) return;
    try {
      await apiClient.put(`/api/release-notes/${editingRelease.id}`, {
        version: editingRelease.version,
        content: editingRelease.content,
        releaseDate: editingRelease.releaseDate
      });
      setEditingRelease(null);
      loadData();
    } catch (error) {
      console.error('Failed to update release note:', error);
      alert('릴리즈 노트 수정에 실패했습니다.');
    }
  };

  const handleDeleteRelease = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await apiClient.delete(`/api/release-notes/${id}`);
      loadData();
    } catch (error) {
      console.error('Failed to delete release note:', error);
      alert('릴리즈 노트 삭제에 실패했습니다.');
    }
  };

  // Admin handlers
  const handleAddAdmin = async () => {
    if (!newAdminEmail || !newAdminEmail.includes('@')) {
      alert('유효한 이메일을 입력해주세요.');
      return;
    }
    try {
      await apiClient.post('/api/admin/admins', { email: newAdminEmail });
      setNewAdminEmail('');
      loadData();
      alert('관리자가 추가되었습니다.');
    } catch (error: any) {
      console.error('Failed to add admin:', error);
      if (error.response?.status === 404) {
        alert('해당 이메일의 사용자를 찾을 수 없습니다. 사용자가 최소 한 번 로그인해야 합니다.');
      } else if (error.response?.status === 400) {
        alert(error.response?.data?.message || '이미 관리자입니다.');
      } else {
        alert('관리자 추가에 실패했습니다.');
      }
    }
  };

  const handleRemoveAdmin = async (id: string) => {
    if (!confirm('정말 관리자 권한을 제거하시겠습니까?')) return;
    try {
      await apiClient.delete(`/api/admin/admins/${id}`);
      loadData();
      alert('관리자 권한이 제거되었습니다.');
    } catch (error: any) {
      console.error('Failed to remove admin:', error);
      if (error.response?.status === 400) {
        alert('자기 자신의 관리자 권한은 제거할 수 없습니다.');
      } else {
        alert('관리자 권한 제거에 실패했습니다.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">관리자 페이지</h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              홈으로
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {(['categories', 'tools', 'news', 'releases', 'admins'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab === 'categories' && '카테고리'}
                {tab === 'tools' && '기본 툴'}
                {tab === 'news' && '뉴스'}
                {tab === 'releases' && '릴리즈 노트'}
                {tab === 'admins' && '관리자'}
              </button>
            ))}
          </nav>
        </div>

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">카테고리 관리</h2>
            
            {/* Create Form */}
            <div className="mb-6 p-4 bg-gray-50 rounded border">
              <h3 className="font-semibold mb-3">새 카테고리 추가</h3>
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="ID (예: ai-agent)"
                  value={newCategory.id}
                  onChange={(e) => setNewCategory({ ...newCategory, id: e.target.value })}
                  className="px-3 py-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="제목 (예: AI Agent)"
                  value={newCategory.title}
                  onChange={(e) => setNewCategory({ ...newCategory, title: e.target.value })}
                  className="px-3 py-2 border rounded"
                />
                <input
                  type="number"
                  placeholder="순서"
                  value={newCategory.order}
                  onChange={(e) => setNewCategory({ ...newCategory, order: parseInt(e.target.value) || 0 })}
                  className="px-3 py-2 border rounded"
                />
              </div>
              <button
                onClick={handleCreateCategory}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                추가
              </button>
            </div>

            {/* List */}
            <div className="space-y-3">
              {categories.map((cat) => (
                <div key={cat.id} className="p-4 border rounded flex justify-between items-center">
                  {editingCategory?.id === cat.id ? (
                    <div className="flex-1 grid grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={editingCategory.title}
                        onChange={(e) => setEditingCategory({ ...editingCategory, title: e.target.value })}
                        className="px-3 py-2 border rounded"
                      />
                      <input
                        type="number"
                        value={editingCategory.order}
                        onChange={(e) => setEditingCategory({ ...editingCategory, order: parseInt(e.target.value) || 0 })}
                        className="px-3 py-2 border rounded"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleUpdateCategory}
                          className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          저장
                        </button>
                        <button
                          onClick={() => setEditingCategory(null)}
                          className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <div className="font-semibold">{cat.title}</div>
                        <div className="text-sm text-gray-500">ID: {cat.id} | 순서: {cat.order}</div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingCategory(cat)}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                        >
                          삭제
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tools Tab */}
        {activeTab === 'tools' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">기본 툴 관리</h2>
            
            {/* Create Form */}
            <div className="mb-6 p-4 bg-gray-50 rounded border">
              <h3 className="font-semibold mb-3">새 툴 추가</h3>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="툴 이름"
                  value={newTool.name}
                  onChange={(e) => setNewTool({ ...newTool, name: e.target.value })}
                  className="px-3 py-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="URL"
                  value={newTool.url}
                  onChange={(e) => setNewTool({ ...newTool, url: e.target.value })}
                  className="px-3 py-2 border rounded"
                />
                <select
                  value={newTool.categoryId}
                  onChange={(e) => setNewTool({ ...newTool, categoryId: e.target.value })}
                  className="px-3 py-2 border rounded"
                >
                  <option value="">카테고리 선택</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.title}</option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="순서"
                  value={newTool.order}
                  onChange={(e) => setNewTool({ ...newTool, order: parseInt(e.target.value) || 0 })}
                  className="px-3 py-2 border rounded"
                />
              </div>
              <button
                onClick={handleCreateTool}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                추가
              </button>
            </div>

            {/* List */}
            <div className="space-y-3">
              {tools.map((tool) => (
                <div key={tool.id} className="p-4 border rounded flex justify-between items-center">
                  {editingTool?.id === tool.id ? (
                    <div className="flex-1 grid grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={editingTool.name}
                        onChange={(e) => setEditingTool({ ...editingTool, name: e.target.value })}
                        className="px-3 py-2 border rounded"
                      />
                      <input
                        type="text"
                        value={editingTool.url}
                        onChange={(e) => setEditingTool({ ...editingTool, url: e.target.value })}
                        className="px-3 py-2 border rounded"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleUpdateTool}
                          className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          저장
                        </button>
                        <button
                          onClick={() => setEditingTool(null)}
                          className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <div className="font-semibold">{tool.name}</div>
                        <div className="text-sm text-gray-500">
                          {tool.url} | {tool.category?.title} | 순서: {tool.order}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingTool(tool)}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDeleteTool(tool.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                        >
                          삭제
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* News Tab */}
        {activeTab === 'news' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">뉴스 관리</h2>
            
            {/* Create Form */}
            <div className="mb-6 p-4 bg-gray-50 rounded border">
              <h3 className="font-semibold mb-3">새 뉴스 추가</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="제목"
                  value={newNews.title}
                  onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                />
                <textarea
                  placeholder="내용 (선택사항)"
                  value={newNews.content}
                  onChange={(e) => setNewNews({ ...newNews, content: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  rows={3}
                />
                <input
                  type="text"
                  placeholder="링크 (선택사항)"
                  value={newNews.link}
                  onChange={(e) => setNewNews({ ...newNews, link: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <button
                onClick={handleCreateNews}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                추가
              </button>
            </div>

            {/* List */}
            <div className="space-y-3">
              {news.map((item) => (
                <div key={item.id} className="p-4 border rounded">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-semibold">{item.title}</div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingNews(item)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDeleteNews(item.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                  {item.content && <div className="text-sm text-gray-600 mb-2">{item.content}</div>}
                  {item.link && <div className="text-sm text-blue-600">{item.link}</div>}
                  <div className="text-xs text-gray-400 mt-2">
                    {new Date(item.publishedAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Edit Modal */}
            {editingNews && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                  <h3 className="text-lg font-bold mb-4">뉴스 수정</h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editingNews.title}
                      onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                      className="w-full px-3 py-2 border rounded"
                    />
                    <textarea
                      value={editingNews.content || ''}
                      onChange={(e) => setEditingNews({ ...editingNews, content: e.target.value })}
                      className="w-full px-3 py-2 border rounded"
                      rows={4}
                    />
                    <input
                      type="text"
                      value={editingNews.link || ''}
                      onChange={(e) => setEditingNews({ ...editingNews, link: e.target.value })}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={handleUpdateNews}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      저장
                    </button>
                    <button
                      onClick={() => setEditingNews(null)}
                      className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                      취소
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Release Notes Tab */}
        {activeTab === 'releases' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">릴리즈 노트 관리</h2>
            
            {/* Create Form */}
            <div className="mb-6 p-4 bg-gray-50 rounded border">
              <h3 className="font-semibold mb-3">새 릴리즈 노트 추가</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="버전 (예: 1.0.0)"
                  value={newRelease.version}
                  onChange={(e) => setNewRelease({ ...newRelease, version: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                />
                <textarea
                  placeholder="내용"
                  value={newRelease.content}
                  onChange={(e) => setNewRelease({ ...newRelease, content: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  rows={4}
                />
              </div>
              <button
                onClick={handleCreateRelease}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                추가
              </button>
            </div>

            {/* List */}
            <div className="space-y-3">
              {releaseNotes.map((note) => (
                <div key={note.id} className="p-4 border rounded">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-semibold">버전 {note.version}</span>
                      <span className="ml-3 text-xs text-gray-400">
                        {new Date(note.releaseDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingRelease(note)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDeleteRelease(note.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap">{note.content}</div>
                </div>
              ))}
            </div>

            {/* Edit Modal */}
            {editingRelease && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                  <h3 className="text-lg font-bold mb-4">릴리즈 노트 수정</h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editingRelease.version}
                      onChange={(e) => setEditingRelease({ ...editingRelease, version: e.target.value })}
                      className="w-full px-3 py-2 border rounded"
                    />
                    <textarea
                      value={editingRelease.content}
                      onChange={(e) => setEditingRelease({ ...editingRelease, content: e.target.value })}
                      className="w-full px-3 py-2 border rounded"
                      rows={6}
                    />
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={handleUpdateRelease}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      저장
                    </button>
                    <button
                      onClick={() => setEditingRelease(null)}
                      className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                      취소
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Admins Tab */}
        {activeTab === 'admins' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">관리자 관리</h2>
            
            {/* Add Admin Form */}
            <div className="mb-6 p-4 bg-gray-50 rounded border">
              <h3 className="font-semibold mb-3">관리자 추가</h3>
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder="이메일 (예: user@example.com)"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded"
                />
                <button
                  onClick={handleAddAdmin}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  추가
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                * 사용자가 최소 한 번 로그인해야 관리자로 추가할 수 있습니다.
              </p>
            </div>

            {/* Admins List */}
            <div className="space-y-3">
              <h3 className="font-semibold">현재 관리자 목록</h3>
              {admins.map((admin) => (
                <div key={admin.id} className="p-4 border rounded flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    {admin.avatarUrl && (
                      <img 
                        src={admin.avatarUrl} 
                        alt={admin.name || admin.email} 
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                    <div>
                      <div className="font-semibold">{admin.name || admin.email}</div>
                      <div className="text-sm text-gray-500">{admin.email}</div>
                      <div className="text-xs text-gray-400">
                        추가일: {new Date(admin.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    {user?.email === admin.email && (
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        나
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveAdmin(admin.id)}
                    disabled={user?.email === admin.email}
                    className={`px-3 py-1 rounded text-sm ${
                      user?.email === admin.email
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    권한 제거
                  </button>
                </div>
              ))}
              {admins.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  등록된 관리자가 없습니다.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;

