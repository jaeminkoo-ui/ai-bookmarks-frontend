import React from 'react';

export interface Tool {
  name: string;
  icon: React.ReactNode;
  url?: string;
  isAddButton?: boolean;
  dbId?: number; // 데이터베이스 ID (백엔드에서 받은 툴만 가짐)
}

export interface ToolCategory {
  id: string;
  title: string;
  tools: Tool[];
}