'use client';

import { useState } from 'react';
import { GlassPanel } from '@/components/ui/glass-panel';
import { Button } from '@/components/ui/button';
import { Search, Send, Plus, User, Bot } from 'lucide-react';

export default function ConversationsPage() {
  const [activeConversation, setActiveConversation] = useState('1');
  const [messageInput, setMessageInput] = useState('');

  // Mock data for conversations
  const conversations = [
    {
      id: '1',
      title: 'Revenue Forecast Discussion',
      agent: 'Finance Assistant',
      lastMessage: 'Here is the Q2 revenue forecast you requested.',
      updatedAt: '2023-05-15T10:30:00Z',
      unread: false,
    },
    {
      id: '2',
      title: 'Marketing Campaign Planning',
      agent: 'Marketing Assistant',
      lastMessage: "I've analyzed the previous campaign results.",
      updatedAt: '2023-05-14T15:20:00Z',
      unread: true,
    },
    {
      id: '3',
      title: 'Customer Support Inquiry',
      agent: 'Support Assistant',
      lastMessage: 'The customer issue has been resolved.',
      updatedAt: '2023-05-13T11:45:00Z',
      unread: false,
    },
  ];

  // Mock data for messages in the active conversation
  const messages = [
    {
      id: '1',
      conversationId: '1',
      content: 'Can you help me with the Q2 revenue forecast?',
      sender: 'user',
      timestamp: '2023-05-15T10:15:00Z',
    },
    {
      id: '2',
      conversationId: '1',
      content: "Of course! I'll analyze the data and provide you with a detailed forecast. Give me a moment.",
      sender: 'agent',
      timestamp: '2023-05-15T10:17:00Z',
    },
    {
      id: '3',
      conversationId: '1',
      content: "Based on the current trends and historical data, here is the Q2 revenue forecast you requested. We're projecting a 15% increase compared to Q1, with the strongest growth in the enterprise segment.",
      sender: 'agent',
      timestamp: '2023-05-15T10:20:00Z',
    },
    {
      id: '4',
      conversationId: '1',
      content: "That's great news! Can you break it down by product line?",
      sender: 'user',
      timestamp: '2023-05-15T10:25:00Z',
    },
    {
      id: '5',
      conversationId: '1',
      content: 'Here is the breakdown by product line:\n\n- Product A: 42% of revenue, 18% growth\n- Product B: 35% of revenue, 12% growth\n- Product C: 23% of revenue, 14% growth\n\nProduct A continues to be our strongest performer.',
      sender: 'agent',
      timestamp: '2023-05-15T10:30:00Z',
    },
  ];

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // In a real app, this would send the message to the backend
      console.log('Sending message:', messageInput);
      setMessageInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] p-4">
      {/* Conversations Sidebar */}
      <div className="w-80 flex flex-col border-r border-border pr-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Conversations</h1>
          <Button variant="ghost" size="icon">
            <Plus size={18} />
          </Button>
        </div>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          <input 
            type="text" 
            placeholder="Search conversations..." 
            className="pl-10 pr-4 py-2 w-full rounded-md bg-background/50 border border-border text-sm"
          />
        </div>
        
        <div className="space-y-2 overflow-y-auto flex-1">
          {conversations.map((conversation) => (
            <div 
              key={conversation.id} 
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                conversation.id === activeConversation 
                  ? 'bg-card/60 border border-primary/20' 
                  : 'hover:bg-card/30 border border-transparent'
              }`}
              onClick={() => setActiveConversation(conversation.id)}
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-medium text-sm line-clamp-1">{conversation.title}</h3>
                <span className="text-xs text-muted-foreground">
                  {new Date(conversation.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-start">
                <p className="text-xs text-muted-foreground line-clamp-2">
                  <span className="font-medium mr-1">{conversation.agent}:</span>
                  {conversation.lastMessage}
                </p>
                {conversation.unread && (
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Chat Area */}
      <div className="flex-1 flex flex-col ml-4">
        <GlassPanel className="flex-1 flex flex-col overflow-hidden p-0">
          {/* Chat Header */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="font-semibold">
                {conversations.find(c => c.id === activeConversation)?.title}
              </h2>
              <p className="text-xs text-muted-foreground">
                {conversations.find(c => c.id === activeConversation)?.agent}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Save</Button>
              <Button variant="outline" size="sm">Share</Button>
            </div>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[75%] rounded-lg p-3 ${
                    message.sender === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-card/50 border border-border'
                  }`}
                >
                  <div className="flex items-center mb-1">
                    {message.sender === 'agent' && (
                      <Bot size={14} className="mr-1 text-muted-foreground" />
                    )}
                    {message.sender === 'user' && (
                      <User size={14} className="mr-1 text-primary-foreground" />
                    )}
                    <span className="text-xs font-medium">
                      {message.sender === 'user' ? 'You' : conversations.find(c => c.id === activeConversation)?.agent}
                    </span>
                    <span className="text-xs ml-2 opacity-70">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  <p className="whitespace-pre-line text-sm">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Message Input */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center">
              <textarea
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1 resize-none border rounded-l-md p-3 h-12 focus:outline-none focus:ring-1 focus:ring-primary"
                rows={1}
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
                className="h-12 rounded-l-none"
              >
                <Send size={18} />
              </Button>
            </div>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
} 