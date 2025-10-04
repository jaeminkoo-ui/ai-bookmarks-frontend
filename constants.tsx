import React from 'react';
import { ToolCategory } from './types';

// URL에서 도메인을 추출하여 Google 파비콘 서비스 URL을 생성하는 함수
const getFaviconUrl = (url: string) => {
  try {
    const domain = new URL(url).hostname;
    return `https://icon.horse/icon/${domain}`;
  } catch (error) {
    return ''; // 유효하지 않은 URL일 경우 빈 문자열 반환
  }
};

export const INITIAL_TOOL_CATEGORIES: ToolCategory[] = [
  {
    id: 'ai-agent',
    title: 'AI Agent',
    tools: [
      { name: 'ChatGPT', url: 'https://chat.openai.com/', icon: <img src={getFaviconUrl('https://chat.openai.com/')} alt="ChatGPT icon" /> },
      { name: 'Perplexity', url: 'https://www.perplexity.ai/', icon: <img src={getFaviconUrl('https://www.perplexity.ai/')} alt="Perplexity icon" /> },
      { name: 'Gemini', url: 'https://gemini.google.com/', icon: <img src={getFaviconUrl('https://gemini.google.com/')} alt="Gemini icon" /> },
      { name: 'Genspark', url: 'https://www.genspark.ai/', icon: <img src={getFaviconUrl('https://www.genspark.ai/')} alt="Genspark icon" /> },
      { name: 'Flowith', url: 'https://flowith.me/', icon: <img src={getFaviconUrl('https://flowith.me/')} alt="Flowith icon" /> },
      { name: 'Claude', url: 'https://claude.ai/', icon: <img src={getFaviconUrl('https://claude.ai/')} alt="Claude icon" /> },
      { name: 'Manus', url: 'https://manus.ai/', icon: <img src={getFaviconUrl('https://manus.ai/')} alt="Manus icon" /> },
      { name: '', icon: <div/>, isAddButton: true },
    ],
  },
  {
    id: 'image',
    title: 'Image',
    tools: [
      { name: 'Midjourney', url: 'https://www.midjourney.com/', icon: <img src={getFaviconUrl('https://www.midjourney.com/')} alt="Midjourney icon" /> },
      { name: 'Nano Banana', url: 'https://nanobanana.io/', icon: <img src={getFaviconUrl('https://nanobanana.io/')} alt="Nano Banana icon" /> },
      { name: 'Flux', url: 'https://flux.ai/', icon: <img src={getFaviconUrl('https://flux.ai/')} alt="Flux icon" /> },
      { name: 'Sora', url: 'https://openai.com/sora', icon: <img src={getFaviconUrl('https://openai.com/sora')} alt="Sora icon" /> },
      { name: 'Whisk', url: 'https://whisk.com/', icon: <img src={getFaviconUrl('https://whisk.com/')} alt="Whisk icon" /> },
      { name: 'Dreamina', url: 'https://dreamina.com/', icon: <img src={getFaviconUrl('https://dreamina.com/')} alt="Dreamina icon" /> },
      { name: 'Qwen', url: 'https://huggingface.co/Qwen', icon: <img src={getFaviconUrl('https://huggingface.co/Qwen')} alt="Qwen icon" /> },
      { name: '', icon: <div/>, isAddButton: true },
    ],
  },
  {
    id: 'video',
    title: 'Video',
    tools: [
        { name: 'VEO', url: 'https://deepmind.google/technologies/veo/', icon: <img src={getFaviconUrl('https://deepmind.google/technologies/veo/')} alt="VEO icon" /> },
        { name: 'Midjourney', url: 'https://www.midjourney.com/', icon: <img src={getFaviconUrl('https://www.midjourney.com/')} alt="Midjourney icon" /> },
        { name: 'Hailuo', url: 'https://hailuo.ai/', icon: <img src={getFaviconUrl('https://hailuo.ai/')} alt="Hailuo icon" /> },
        { name: 'Higgsfield', url: 'https://www.higgsfield.ai/', icon: <img src={getFaviconUrl('https://www.higgsfield.ai/')} alt="Higgsfield icon" /> },
        { name: 'Kling', url: 'https://kling.kuaishou.com/', icon: <img src={getFaviconUrl('https://kling.kuaishou.com/')} alt="Kling icon" /> },
        { name: 'Runway', url: 'https://runwayml.com/', icon: <img src={getFaviconUrl('https://runwayml.com/')} alt="Runway icon" /> },
        { name: 'Pika Labs', url: 'https://pika.art/', icon: <img src={getFaviconUrl('https://pika.art/')} alt="Pika Labs icon" /> },
        { name: 'Luma AI', url: 'https://lumalabs.ai/', icon: <img src={getFaviconUrl('https://lumalabs.ai/')} alt="Luma AI icon" /> },
        { name: 'Topaz', url: 'https://www.topazlabs.com/', icon: <img src={getFaviconUrl('https://www.topazlabs.com/')} alt="Topaz icon" /> },
        { name: 'Freepik', url: 'https://www.freepik.com/', icon: <img src={getFaviconUrl('https://www.freepik.com/')} alt="Freepik icon" /> },
        { name: '', icon: <div/>, isAddButton: true },
    ],
  },
  {
    id: 'voice-lip-sync',
    title: 'Voice/Lip-Sync',
    tools: [
        { name: 'Elevenlabs', url: 'https://elevenlabs.io/', icon: <img src={getFaviconUrl('https://elevenlabs.io/')} alt="Elevenlabs icon" /> },
        { name: 'Perso', url: 'https://www.perso.ai/', icon: <img src={getFaviconUrl('https://www.perso.ai/')} alt="Perso icon" /> },
        { name: 'Supertone', url: 'https://supertone.ai/', icon: <img src={getFaviconUrl('https://supertone.ai/')} alt="Supertone icon" /> },
        { name: 'Typecast', url: 'https://typecast.ai/', icon: <img src={getFaviconUrl('https://typecast.ai/')} alt="Typecast icon" /> },
        { name: 'Heygen', url: 'https://www.heygen.com/', icon: <img src={getFaviconUrl('https://www.heygen.com/')} alt="Heygen icon" /> },
        { name: 'Hedra', url: 'https://www.hedra.com/', icon: <img src={getFaviconUrl('https://www.hedra.com/')} alt="Hedra icon" /> },
        { name: '', icon: <div/>, isAddButton: true },
    ],
  },
  {
    id: 'vibe-coding',
    title: 'Vibe Coding',
    tools: [
        { name: 'Google AI Studio', url: 'https://aistudio.google.com/', icon: <img src={getFaviconUrl('https://aistudio.google.com/')} alt="Google AI Studio icon" /> },
        { name: 'Claude', url: 'https://claude.ai/', icon: <img src={getFaviconUrl('https://claude.ai/')} alt="Claude icon" /> },
        { name: 'Cursor', url: 'https://cursor.sh/', icon: <img src={getFaviconUrl('https://cursor.sh/')} alt="Cursor icon" /> },
        { name: 'Lovable', url: 'https://lovable.dev/', icon: <img src={getFaviconUrl('https://lovable.dev/')} alt="Lovable icon" /> },
        { name: 'Replit AI', url: 'https://replit.com/ai', icon: <img src={getFaviconUrl('https://replit.com/ai')} alt="Replit AI icon" /> },
        { name: 'Base44', url: 'https://base4.4/', icon: <img src={getFaviconUrl('https://base4.4/')} alt="Base44 icon" /> },
        { name: 'Bolt', url: 'https://bolt.dev/', icon: <img src={getFaviconUrl('https://bolt.dev/')} alt="Bolt icon" /> },
        { name: '', icon: <div/>, isAddButton: true },
    ]
  },
  {
      id: 'music',
      title: 'Music',
      tools: [
          { name: 'Suno AI', url: 'https://suno.ai/', icon: <img src={getFaviconUrl('https://suno.ai/')} alt="Suno AI icon" /> },
          { name: 'Udio', url: 'https://www.udio.com/', icon: <img src={getFaviconUrl('https://www.udio.com/')} alt="Udio icon" /> },
          { name: 'AIVA', url: 'https://www.aiva.ai/', icon: <img src={getFaviconUrl('https://www.aiva.ai/')} alt="AIVA icon" /> },
          { name: '', icon: <div/>, isAddButton: true },
      ]
  },
  {
      id: 'edit',
      title: 'Edit',
      tools: [
          { name: 'Opus Clip', url: 'https://www.opus.pro/', icon: <img src={getFaviconUrl('https://www.opus.pro/')} alt="Opus Clip icon" /> },
          { name: 'Cutback', url: 'https://cutback.ai/', icon: <img src={getFaviconUrl('https://cutback.ai/')} alt="Cutback icon" /> },
          { name: 'Capcut', url: 'https://www.capcut.com/', icon: <img src={getFaviconUrl('https://www.capcut.com/')} alt="Capcut icon" /> },
          { name: '', icon: <div/>, isAddButton: true },
      ]
  },
  {
      id: 'business',
      title: 'Business',
      tools: [
          { name: 'Gamma', url: 'https://gamma.app/', icon: <img src={getFaviconUrl('https://gamma.app/')} alt="Gamma icon" /> },
          { name: 'Notebook LM', url: 'https://notebooklm.google.com/', icon: <img src={getFaviconUrl('https://notebooklm.google.com/')} alt="Notebook LM icon" /> },
          { name: '', icon: <div/>, isAddButton: true },
      ]
  }
];

