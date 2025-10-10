import React, { useState, useEffect } from 'react';
import apiClient from '../api';

interface ReleaseNote {
  id: number;
  version: string;
  content: string;
  releaseDate: string;
}

const Footer: React.FC = () => {
  const [latestRelease, setLatestRelease] = useState<ReleaseNote | null>(null);

  useEffect(() => {
    const fetchLatestRelease = async () => {
      try {
        const response = await apiClient.get('/api/release-notes?limit=1');
        if (response.data.releaseNotes.length > 0) {
          setLatestRelease(response.data.releaseNotes[0]);
        }
      } catch (error) {
        console.error('Failed to fetch release notes:', error);
      }
    };
    fetchLatestRelease();
  }, []);

  if (!latestRelease) {
    return null; // 릴리즈 노트가 없으면 표시하지 않음
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}`;
  };

  // content의 첫 줄만 표시
  const firstLine = latestRelease.content.split('\n')[0];

  return (
    <footer className="w-full mt-auto pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-green-50 text-green-800 rounded-lg p-4 flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <span className="font-bold bg-green-200 text-green-800 text-xs px-2 py-1 rounded">
              RELEASE
            </span>
            <span className="font-bold">{latestRelease.version}</span>
            <span className="font-semibold text-gray-800">
              {firstLine}
            </span>
          </div>
          <span className="text-gray-500">{formatDate(latestRelease.releaseDate)}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
