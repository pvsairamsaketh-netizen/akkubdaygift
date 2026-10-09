import React, { useState, useRef, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { Header } from '../components/Header';
import { ConversationSidebar } from '../components/ConversationSidebar';
import { EmptyState } from '../components/EmptyState';
import { ChatMessage } from '../components/ChatMessage';
import { TypingIndicator } from '../components/TypingIndicator';
import { ChatInput } from '../components/ChatInput';
import { SettingsPanel } from '../components/SettingsPanel';
import { useConversations } from '../hooks/useConversations';
import { useChat } from '../hooks/useChat';
import { QuickAddMemoryModal } from '../components/QuickAddMemoryModal';
import { useMemoryPhotos } from '../context/MemoryPhotoContext';

export const ChatPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isQuickMemoryOpen, setIsQuickMemoryOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { triggerMemoryPhoto } = useMemoryPhotos();

  const {
    conversations,
    activeId,
    setActiveId,
    createNewConversation,
    renameConversation,
    deleteConversation,
    refreshConversations
  } = useConversations();

  const {
    messages,
    loading: chatLoading,
    sendMessage
  } = useChat(activeId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, chatLoading]);

  const handleSendMessage = async (text: string) => {
    if (!text || !text.trim() || chatLoading) return;

    // Trigger photo immediately before starting async LLM streaming
    triggerMemoryPhoto('chat');

    let targetConvId = activeId;
    if (!targetConvId) {
      const newConv = await createNewConversation("New Memory Chat");
      targetConvId = newConv.id;
      setActiveId(newConv.id);
    }

    await sendMessage(text, targetConvId);
    refreshConversations();
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-blush-50/70 via-cream-50/50 to-champagne-50/60 font-sans">
      {/* Sidebar */}
      <ConversationSidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={(id) => {
          setActiveId(id);
          setSidebarOpen(false);
        }}
        onNew={() => {
          createNewConversation("New Memory Chat");
          setSidebarOpen(false);
        }}
        onRename={renameConversation}
        onDelete={deleteConversation}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header with Hamburger for Mobile */}
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-3 text-stone-600 hover:text-stone-900 focus:outline-none"
            title="Open Conversations"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <Header
              onOpenSettings={() => setSettingsOpen(true)}
              totalVectors={13}
            />
          </div>
        </div>

        {/* Chat Message Scrollable Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.length === 0 && !chatLoading ? (
            <EmptyState onSelectPrompt={handleSendMessage} />
          ) : (
            <div className="max-w-3xl mx-auto space-y-4">
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                />
              ))}

              {chatLoading && <TypingIndicator />}

              <div ref={messagesEndRef} />
            </div>
          )}
        </main>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-gradient-to-t from-white via-white/90 to-transparent">
          <div className="max-w-3xl mx-auto">
            <ChatInput
              onSend={handleSendMessage}
              onOpenAddMemory={() => setIsQuickMemoryOpen(true)}
              disabled={chatLoading}
            />
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        totalVectors={7}
        onReindexed={refreshConversations}
      />

      {/* Quick Add Memory Modal */}
      <QuickAddMemoryModal
        isOpen={isQuickMemoryOpen}
        onClose={() => setIsQuickMemoryOpen(false)}
      />
    </div>
  );
};
