import React, { useState, useEffect } from 'react';
import { 
  Menu, MessageSquare, TrendingUp, FileText, Settings, 
  User, LogOut, ChevronLeft, ChevronRight, Send, Command,
  ThumbsUp, ThumbsDown, Copy, Clock, Sparkles, AlertTriangle,
  TrendingDown, DollarSign, LineChart, Target, ChevronDown,
  Info, BookOpen, Wallet, PieChart, History, Award,
  Newspaper, Globe, Bell, Rss
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'chart' | 'insight' | 'recommendation';
  feedback?: 'up' | 'down' | null;
}

interface SuggestedPrompt {
  text: string;
  icon: React.ReactNode;
  category: string;
}

interface SidebarSection {
  icon: React.ReactNode;
  text: string;
  items?: { text: string; icon: React.ReactNode }[];
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const sidebarSections: SidebarSection[] = [
    {
      icon: <MessageSquare size={20} />,
      text: "Chat",
      items: [
        { text: "New Chat", icon: <MessageSquare size={16} /> },
        { text: "Saved Chats", icon: <BookOpen size={16} /> },
        { text: "Chat History", icon: <History size={16} /> }
      ]
    },
    {
      icon: <TrendingUp size={20} />,
      text: "Portfolio",
      items: [
        { text: "Overview", icon: <PieChart size={16} /> },
        { text: "Investments", icon: <Wallet size={16} /> },
        { text: "Performance", icon: <TrendingUp size={16} /> },
        { text: "Transactions", icon: <History size={16} /> }
      ]
    },
    {
      icon: <Newspaper size={20} />,
      text: "News & Updates",
      items: [
        { text: "Market News", icon: <Globe size={16} /> },
        { text: "Company Updates", icon: <Bell size={16} /> },
        { text: "Industry Trends", icon: <TrendingUp size={16} /> },
        { text: "Watchlist Updates", icon: <Rss size={16} /> }
      ]
    },
    {
      icon: <FileText size={20} />,
      text: "Reports",
      items: [
        { text: "Weekly Analysis", icon: <FileText size={16} /> },
        { text: "Monthly Summary", icon: <FileText size={16} /> },
        { text: "Custom Reports", icon: <FileText size={16} /> }
      ]
    },
    {
      icon: <Target size={20} />,
      text: "Goals",
      items: [
        { text: "Investment Goals", icon: <Target size={16} /> },
        { text: "Progress Tracking", icon: <TrendingUp size={16} /> },
        { text: "Achievements", icon: <Award size={16} /> }
      ]
    },
    {
      icon: <Settings size={20} />,
      text: "Settings",
      items: [
        { text: "Profile", icon: <User size={16} /> },
        { text: "Preferences", icon: <Settings size={16} /> },
        { text: "Data Sources", icon: <Info size={16} /> }
      ]
    }
  ];

  const suggestedPrompts: SuggestedPrompt[] = [
    { text: "Analyze my portfolio risk", icon: <AlertTriangle size={16} />, category: "Portfolio" },
    { text: "Show market trends this week", icon: <TrendingUp size={16} />, category: "Market" },
    { text: "Generate monthly report", icon: <FileText size={16} />, category: "Reports" },
    { text: "Compare tech stocks", icon: <LineChart size={16} />, category: "Analysis" },
    { text: "Calculate potential returns", icon: <DollarSign size={16} />, category: "Investment" },
    { text: "Show market sentiment", icon: <TrendingDown size={16} />, category: "Market" },
  ];

  const handleSendMessage = async (e: React.FormEvent, promptText?: string) => {
    e.preventDefault();
    const messageText = promptText || input;
    if (!messageText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Here's your analysis based on current market data...",
        sender: 'ai',
        timestamp: new Date(),
        type: 'insight',
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleFeedback = (messageId: string, feedback: 'up' | 'down') => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, feedback } : msg
    ));
  };

  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`bg-indigo-700 text-white transition-all duration-300 flex flex-col ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-4 flex items-center justify-between">
          <h1 className={`font-bold text-xl ${!sidebarOpen && 'hidden'}`}>FINAlchemy</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-indigo-600 rounded-lg transition-transform hover:scale-105"
          >
            {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        {/* Scrollable Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto">
          {sidebarSections.map((section) => (
            <div key={section.text} className="mb-1">
              <button
                onClick={() => setExpandedSection(expandedSection === section.text ? null : section.text)}
                className={`w-full flex items-center justify-between px-4 py-3 transition-all hover:bg-indigo-600 ${
                  activeTab === section.text.toLowerCase() ? 'bg-indigo-800' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  {section.icon}
                  {sidebarOpen && <span>{section.text}</span>}
                </div>
                {sidebarOpen && section.items && (
                  <ChevronDown
                    size={16}
                    className={`transform transition-transform ${
                      expandedSection === section.text ? 'rotate-180' : ''
                    }`}
                  />
                )}
              </button>
              {/* Dropdown Items */}
              {sidebarOpen && expandedSection === section.text && section.items && (
                <div className="bg-indigo-800">
                  {section.items.map((item) => (
                    <button
                      key={item.text}
                      className="w-full flex items-center gap-3 px-8 py-2 text-sm hover:bg-indigo-900 transition-colors"
                    >
                      {item.icon}
                      <span>{item.text}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-indigo-600">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center">
              <User size={20} />
            </div>
            {sidebarOpen && (
              <div>
                <p className="font-medium">John Doe</p>
                <p className="text-sm text-indigo-200">Premium Plan</p>
              </div>
            )}
          </div>
          <button className="w-full flex items-center gap-3 px-4 py-2 text-indigo-100 hover:bg-indigo-600 rounded-lg transition-all">
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Menu size={24} className="text-gray-500" />
              <h2 className="text-xl font-semibold text-gray-800">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h2>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Command size={20} />
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Welcome Message */}
          {messages.length === 0 && (
            <div className="text-center py-8">
              <h3 className="text-2xl font-bold text-gray-700 mb-4">Welcome to FINAlchemy! 🎯</h3>
              <p className="text-gray-600 mb-8">Your AI-powered financial assistant is ready to help.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={(e) => handleSendMessage(e, prompt.text)}
                    className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all hover:scale-105 text-left"
                  >
                    <span className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                      {prompt.icon}
                    </span>
                    <div>
                      <p className="font-medium text-gray-800">{prompt.text}</p>
                      <p className="text-sm text-gray-500">{prompt.category}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-4 group relative ${
                  message.sender === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white shadow-sm text-gray-800'
                }`}
              >
                {message.text}
                
                {/* Message Actions */}
                {message.sender === 'ai' && (
                  <div className="absolute -bottom-8 left-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleFeedback(message.id, 'up')}
                      className={`p-1 rounded hover:bg-gray-100 ${message.feedback === 'up' ? 'text-green-500' : 'text-gray-400'}`}
                    >
                      <ThumbsUp size={14} />
                    </button>
                    <button
                      onClick={() => handleFeedback(message.id, 'down')}
                      className={`p-1 rounded hover:bg-gray-100 ${message.feedback === 'down' ? 'text-red-500' : 'text-gray-400'}`}
                    >
                      <ThumbsDown size={14} />
                    </button>
                    <button
                      onClick={() => handleCopyMessage(message.text)}
                      className="p-1 rounded hover:bg-gray-100 text-gray-400"
                    >
                      <Copy size={14} />
                    </button>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock size={12} />
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 text-gray-500">
              <Sparkles size={16} className="animate-pulse" />
              <span className="text-sm">FINAlchemy is thinking...</span>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t bg-white p-4">
          <form onSubmit={handleSendMessage} className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about market trends, portfolio analysis, or investment strategies..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all hover:scale-105"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;