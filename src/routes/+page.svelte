<script lang="ts">
  import { chatStore } from '$stores/chatStore';
  import ChatMessage from '$lib/components/ChatMessage.svelte';
  import ModelSelector from '$lib/components/ModelSelector.svelte';

  let newMessage = '';
  let selectedModel = 'gpt-3.5-turbo';

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    
    // 添加用户消息
    $chatStore = [
      ...$chatStore,
      {
        id: Date.now().toString(),
        content: newMessage,
        isUser: true,
        timestamp: Date.now(),
        model: selectedModel,
        status: 'sent'
      }
    ];

    const currentMessage = newMessage;
    newMessage = '';

    // 添加临时AI响应消息
    $chatStore = [
      ...$chatStore,
      {
        id: `temp-${Date.now()}`,
        content: '',
        isUser: false,
        timestamp: Date.now(),
        model: selectedModel,
        status: 'pending'
      }
    ];

    // TODO: 实际API调用
    // 模拟响应
    setTimeout(() => {
      $chatStore = $chatStore.map(msg => 
        msg.id.startsWith('temp-') ? {
          ...msg,
          content: `This is a mock response to: ${currentMessage}`,
          status: 'sent'
        } : msg
      );
    }, 1000);
  };
</script>

<main class="chat-container">
  <div class="model-selector-wrapper">
    <ModelSelector bind:selectedModel />
  </div>
  
  <div class="messages">
    {#each $chatStore as message}
      <ChatMessage {message} />
    {/each}
  </div>

  <div class="input-area">
    <textarea
      bind:value={newMessage}
      on:keydown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
      placeholder="输入消息..."
    />
    <button on:click={handleSend}>发送</button>
  </div>
</main>

<style>
  .chat-container {
    max-width: 800px;
    margin: 0 auto;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .messages {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
  }

  .input-area {
    padding: 1rem;
    border-top: 1px solid #eee;
    display: flex;
    gap: 0.5rem;
    
    textarea {
      flex: 1;
      padding: 0.8rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      min-height: 50px;
      resize: none;
    }
    
    button {
      padding: 0.8rem 1.5rem;
      background: #007acc;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      
      &:hover {
        background: #0062a3;
      }
    }
  }
</style>
