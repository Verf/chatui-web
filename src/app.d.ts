// See https://svelte.dev/docs/kit/types#app.d.ts
declare global {
  namespace App {
    interface PageData {
      user?: {
        id: string;
        email: string;
      };
      providers?: ProviderConfig[];
    }

    interface Error {
      message: string;
      code?: number;
    }
  }
  
  // 添加自定义类型
  interface ProviderConfig {
    name: string;
    baseUrl: string;
    apiKey: string;
    model: string;
    maxTokens?: number;
  }

  interface ChatMessage {
    id: string;
    content: string;
    isUser: boolean;
    timestamp: number;
    model?: string;
    status?: 'pending' | 'sent' | 'error';
  }
}

export {};
