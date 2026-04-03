import { vercelPreset } from '@vercel/react-router/vite';

export default {
  ssr: false,
  appDirectory: "src",
  presets: [vercelPreset()]
};
