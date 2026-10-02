import React, { useState } from 'react';
import { Plus, MessageSquare, Trash2, Edit2, Check, X, Heart } from 'lucide-react';
import type { ConversationSummary } from '../types/chat';

interface ConversationSidebarProps {
  conversations: ConversationSummary[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onRename: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  conversations,
  activeId,
  onSelect,
  onNew,
  onRename,
  onDelete,
  isOpen,
  onClose
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const startEditing = (conv: ConversationSummary, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(conv.id);
    setEditTitle(conv.title);
    setDeletingId(null);
  };

  const saveEditing = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      onRename(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const cancelEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const handleConfirmDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(null);
    onDelete(id);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-stone-900/40 z-30 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-72 bg-champagne-50/90 border-r border-rose-200/60 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-rose-200/50 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-rose-800 font-serif font-semibold">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            <span>Memories Archive</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 text-stone-500 hover:text-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <button
            onClick={() => {
              onNew();
              onClose();
            }}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-blush-500 text-white font-medium text-sm shadow-sm hover:shadow-md hover:from-rose-600 hover:to-blush-600 transition-all cursor-pointer group"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            <span>New Memory Chat</span>
          </button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {conversations.length === 0 ? (
            <div className="text-center py-8 text-stone-400 text-xs">
              No conversations yet.<br />Start your first memory chat!
            </div>
          ) : (
            conversations.map((conv) => {
              const isActive = conv.id === activeId;
              const isEditing = conv.id === editingId;
              const isDeleting = conv.id === deletingId;

              return (
                <div
                  key={conv.id}
                  onClick={() => {
                    onSelect(conv.id);
                    onClose();
                  }}
                  className={`group relative flex items-center justify-between p-2.5 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                    isActive
                      ? 'bg-white shadow-xs border border-rose-200/80 text-rose-900 font-semibold'
                      : 'hover:bg-rose-100/50 text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                    <MessageSquare className={`w-4 h-4 shrink-0 ${isActive ? 'text-rose-600' : 'text-stone-400'}`} />
                    
                    {isEditing ? (
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 bg-white border border-rose-300 rounded px-1.5 py-0.5 text-xs text-stone-800 outline-none focus:ring-1 focus:ring-rose-500"
                        autoFocus
                      />
                    ) : (
                      <span className="truncate">{conv.title}</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-1 transition-opacity ml-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={(e) => saveEditing(conv.id, e)}
                          className="p-1 hover:text-emerald-600 text-stone-500"
                          title="Save title"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="p-1 hover:text-rose-600 text-stone-500"
                          title="Cancel"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : isDeleting ? (
                      <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => handleConfirmDelete(conv.id, e)}
                          className="px-2 py-0.5 rounded-md bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] shadow-xs transition-all active:scale-95"
                          title="Click to permanently delete"
                        >
                          Delete
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingId(null);
                          }}
                          className="p-1 text-stone-400 hover:text-stone-700 rounded"
                          title="Cancel"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => startEditing(conv, e)}
                          className="p-1 hover:text-rose-600 text-stone-400"
                          title="Rename"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingId(conv.id);
                          }}
                          className="p-1 hover:text-rose-600 text-stone-400"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-rose-200/50 text-[11px] text-stone-400 text-center flex items-center justify-center gap-1">
          Made with love for Akku & Saki <Heart className="w-3 h-3 text-rose-400 fill-current inline" />
        </div>
      </aside>
    </>
  );
};
