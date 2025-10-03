import React from 'react';
import { ToolCategory } from './types';

// Placeholder generic icons
const PlaceholderIcon = ({ color = 'bg-gray-200' }: { color?: string }) => (
    <div className={`w-8 h-8 rounded-full ${color}`}></div>
);

const OpenAIIcon = () => (
    <svg width="32" height="32" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M35.63 20.5C35.63 28.98 28.98 35.63 20.5 35.63C12.02 35.63 5.37 28.98 5.37 20.5C5.37 12.02 12.02 5.37 20.5 5.37C28.98 5.37 35.63 12.02 35.63 20.5Z" fill="black"/>
        <path d="M20.5001 1.00004C31.2309 1.00004 39.9999 9.76906 39.9999 20.5C39.9999 22.846 39.5939 25.0935 38.846 27.1691L32.9995 19.3486C32.9242 17.5103 32.2272 15.7753 31.0251 14.4705C29.823 13.1657 28.192 12.3807 26.4313 12.2464L14.5262 10.7046C14.7937 10.6698 15.064 10.6425 15.3371 10.6231L25.4385 11.9678C26.6343 12.1151 27.7126 12.6565 28.4831 13.4832C29.2536 14.3099 29.66 15.3473 29.619 16.4116L28.2721 26.4313C28.1251 27.627 27.5835 28.7054 26.7568 29.4758C25.9301 30.2463 24.8928 30.6533 23.8284 30.6123L13.727 29.2676C13.566 29.2443 13.4064 29.2154 13.2488 29.1813L19.103 37.009C19.5636 37.042 20.029 37.0601 20.5 37.0601C29.8691 37.0601 37.3101 29.619 37.3101 20.25C37.3101 15.1121 35.0311 10.597 31.396 7.6041L25.0343 1.24248C23.4731 1.08584 21.991 1.00004 20.5001 1.00004ZM9.49254 13.2415L15.3486 21.062C15.4242 22.9003 16.1212 24.6353 17.3232 25.9401C18.5253 27.2449 20.1563 28.0299 21.917 28.1642L33.8221 29.706C33.5546 29.7408 33.2843 29.7681 33.0112 29.7875L22.9098 28.4428C21.714 28.2955 20.6357 27.7541 19.8652 26.9274C19.0947 26.1007 18.688 25.0633 18.7289 24.0004L20.0758 13.9792C20.2228 12.7835 20.7644 11.705 21.5911 10.9346C22.4178 10.1641 23.4551 9.75713 24.5195 9.80004L34.6209 11.1447C34.7819 11.168 34.9415 11.1969 35.0991 11.231L29.245 3.3959C28.7844 3.36292 28.319 3.34484 27.8546 3.34484C18.4855 3.34484 11.0445 10.7858 11.0445 20.1549C11.0445 25.2928 13.3235 29.8079 16.9585 32.8008L21.3202 37.1625C19.759 37.3191 18.2769 37.4049 16.8858 37.4049C7.51676 37.4049 0.174805 29.9639 0.174805 20.5949C0.174805 18.252 0.578846 16.0076 1.32488 13.9349L7.1748 21.7585C7.2488 21.491 7.33714 21.2291 7.43854 20.9728C7.4312 20.8178 7.42788 20.6625 7.42788 20.5069C7.42788 18.019 8.2612 15.688 9.73473 13.9189L9.49254 13.2415Z" fill="white"/>
    </svg>
);

const PerplexityIcon = () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="16" fill="black"/>
        <path d="M10 9H12.5V23H10V9Z" fill="white"/>
        <path d="M16.25 9H18.75V23H16.25V9Z" fill="white"/>
        <path d="M22.5 9H25V23H22.5V9Z" fill="white"/>
        <path d="M10 14.75H25V17.25H10V14.75Z" fill="white"/>
    </svg>
);

const GeminiIcon = () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 3L3 9.33V22.67L16 29L29 22.67V9.33L16 3Z" fill="url(#gemini_grad1)"/>
        <path d="M16 13.06L29 22.67V9.33L16 3V13.06Z" fill="url(#gemini_grad2)"/>
        <path d="M3 9.33L16 16V29L3 22.67V9.33Z" fill="url(#gemini_grad3)"/>
        <defs>
            <linearGradient id="gemini_grad1" x1="16" y1="3" x2="16" y2="29" gradientUnits="userSpaceOnUse">
                <stop stopColor="#4285F4"/>
                <stop offset="1" stopColor="#9B59B6"/>
            </linearGradient>
            <linearGradient id="gemini_grad2" x1="16" y1="3" x2="29" y2="22.67" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FBBC05"/>
                <stop offset="1" stopColor="#EA4335"/>
            </linearGradient>
            <linearGradient id="gemini_grad3" x1="3" y1="9.33" x2="16" y2="29" gradientUnits="userSpaceOnUse">
                <stop stopColor="#34A853"/>
                <stop offset="1" stopColor="#1E88E5"/>
            </linearGradient>
        </defs>
    </svg>
);

const ClaudeIcon = () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="16" fill="#D9B391"/>
        <path d="M16 8C11.5817 8 8 11.5817 8 16C8 20.4183 11.5817 24 16 24" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
);

export const INITIAL_TOOL_CATEGORIES: ToolCategory[] = [
  {
    id: 'ai-agent',
    title: 'AI Agent',
    tools: [
      { name: 'ChatGPT', icon: <OpenAIIcon />, url: '#' },
      { name: 'Perplexity', icon: <PerplexityIcon/>, url: '#' },
      { name: 'Gemini', icon: <GeminiIcon/>, url: '#' },
      { name: 'Genspark', icon: <PlaceholderIcon color="bg-black" />, url: '#' },
      { name: 'Flowith', icon: <PlaceholderIcon color="bg-gray-700" />, url: '#' },
      { name: 'Claude', icon: <ClaudeIcon />, url: '#' },
      { name: 'Manus', icon: <PlaceholderIcon color="bg-green-200" />, url: '#' },
      { name: '', icon: <div/>, isAddButton: true },
    ],
  },
  {
    id: 'image',
    title: 'Image',
    tools: [
      { name: 'Midjourney', icon: <PlaceholderIcon color="bg-gray-400" />, url: '#' },
      { name: 'Nano Banana', icon: <PlaceholderIcon color="bg-black" />, url: '#' },
      { name: 'Flux', icon: <PlaceholderIcon color="bg-gray-300" />, url: '#' },
      { name: 'Sora', icon: <PlaceholderIcon color="bg-gray-200" />, url: '#' },
      { name: 'Whisk', icon: <PlaceholderIcon color="bg-pink-200" />, url: '#' },
      { name: 'Dreamina', icon: <PlaceholderIcon color="bg-indigo-400" />, url: '#' },
      { name: 'Qwen', icon: <PlaceholderIcon color="bg-purple-400" />, url: '#' },
      { name: '', icon: <div/>, isAddButton: true },
    ],
  },
  {
    id: 'video',
    title: 'Video',
    tools: [
      { name: 'VEO 3', icon: <PlaceholderIcon color="bg-purple-200" />, url: '#' },
      { name: 'Midjourney', icon: <PlaceholderIcon color="bg-gray-400" />, url: '#' },
      { name: 'Hailuo', icon: <PlaceholderIcon color="bg-white border" />, url: '#' },
      { name: 'Higgsfiled', icon: <PlaceholderIcon color="bg-yellow-300" />, url: '#' },
      { name: 'Kling', icon: <PlaceholderIcon color="bg-green-400" />, url: '#' },
      { name: 'Runway', icon: <PlaceholderIcon color="bg-black" />, url: '#' },
      { name: 'Pika Labs', icon: <PlaceholderIcon color="bg-gray-800" />, url: '#' },
      { name: 'Luma AI', icon: <PlaceholderIcon color="bg-gray-500" />, url: '#' },
      { name: 'Topaz', icon: <PlaceholderIcon color="bg-black" />, url: '#' },
      { name: 'Freepik', icon: <PlaceholderIcon color="bg-blue-300" />, url: '#' },
      { name: '', icon: <div/>, isAddButton: true },
    ],
  },
  {
    id: 'voice-lip-sync',
    title: 'Voice/Lip-Sync',
    tools: [
      { name: 'Elevenlabs', icon: <PlaceholderIcon color="bg-gray-200" />, url: '#' },
      { name: 'Perso', icon: <PlaceholderIcon color="bg-purple-200" />, url: '#' },
      { name: 'Supertone', icon: <PlaceholderIcon color="bg-blue-500" />, url: '#' },
      { name: 'Typecast', icon: <PlaceholderIcon color="bg-gray-800" />, url: '#' },
      { name: 'Heygen', icon: <PlaceholderIcon color="bg-purple-500" />, url: '#' },
      { name: 'Hedra', icon: <PlaceholderIcon color="bg-black" />, url: '#' },
      { name: '', icon: <div/>, isAddButton: true },
    ],
  },
  {
    id: 'vibe-coding',
    title: 'Vibe Coding',
    tools: [
      { name: 'Google AI Studio', icon: <PlaceholderIcon color="bg-black" />, url: '#' },
      { name: 'Claude', icon: <PlaceholderIcon color="bg-orange-200" />, url: '#' },
      { name: 'Cursor', icon: <PlaceholderIcon color="bg-gray-900" />, url: '#' },
      { name: 'Lovable', icon: <PlaceholderIcon color="bg-red-300" />, url: '#' },
      { name: 'Replit AI', icon: <PlaceholderIcon color="bg-orange-400" />, url: '#' },
      { name: 'Base44', icon: <PlaceholderIcon color="bg-orange-500" />, url: '#' },
      { name: 'Bolt', icon: <PlaceholderIcon color="bg-black" />, url: '#' },
      { name: '', icon: <div/>, isAddButton: true },
    ]
  },
  {
      id: 'music',
      title: 'Music',
      tools: [
          { name: 'Suno AI', icon: <PlaceholderIcon color="bg-red-500" />, url: '#' },
          { name: 'Udio', icon: <PlaceholderIcon color="bg-pink-400" />, url: '#' },
          { name: 'AIVA', icon: <PlaceholderIcon color="bg-blue-300" />, url: '#' },
          { name: '', icon: <div/>, isAddButton: true },
      ]
  },
  {
      id: 'edit',
      title: 'Edit',
      tools: [
          { name: 'opus', icon: <PlaceholderIcon color="bg-black" />, url: '#' },
          { name: 'Cutback', icon: <PlaceholderIcon color="bg-black" />, url: '#' },
          { name: 'Capcut', icon: <PlaceholderIcon color="bg-black" />, url: '#' },
          { name: '', icon: <div/>, isAddButton: true },
      ]
  },
  {
      id: 'business',
      title: 'Business',
      tools: [
          { name: 'Gamma', icon: <PlaceholderIcon color="bg-blue-500" />, url: '#' },
          { name: 'Notebook LM', icon: <PlaceholderIcon color="bg-yellow-400" />, url: '#' },
          { name: '', icon: <div/>, isAddButton: true },
      ]
  }
];