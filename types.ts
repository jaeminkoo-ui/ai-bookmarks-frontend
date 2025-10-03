import React from 'react';

export interface Tool {
  name: string;
  icon: React.ReactNode;
  url?: string;
  isAddButton?: boolean;
}

export interface ToolCategory {
  id: string;
  title: string;
  tools: Tool[];
}