import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import { MessageSquare, User, Bot, Send, Sparkles, Settings2 } from 'lucide-react';
import Markdown from 'react-markdown';
import { PageHeader, Card, Button } from '../components/ui';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const AiChat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your IntelliSuite AI assistant. How can I help you today?' }
  ]);
  const [tone, setTone] = useState('Professional');

  const tones = ['Professional', 'Friendly', 'Academic', 'Creative'];

  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    
    try {
      const { data } = await axios.post('/api/ai/generate-chat', { messages: newMessages, tone }, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });

      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([{ role: 'assistant', content: 'Hello! I am your IntelliSuite AI assistant. How can I help you today?' }]);
    toast.success('Chat cleared');
  };

  return (
    <div className='flex flex-col lg:flex-row gap-6 max-w-[1400px] mx-auto h-[calc(100vh-140px)] text-app-text transition-colors'>
      {/* Left Column - Configuration */}
      <Card className='w-full lg:w-[35%] shrink-0 h-full overflow-y-auto custom-scrollbar'>
        <PageHeader icon={Settings2} title="Chat Settings" />

        <div className="mb-8 flex-1">
          <label className='text-xs font-bold text-app-text-sec mb-3 uppercase tracking-wider block'>Assistant Tone</label>
          <div className='flex gap-2 flex-wrap'>
            {tones.map((item, index) => (
              <button 
                key={index}
                type="button"
                onClick={() => setTone(item)} 
                className={`text-xs px-4 py-2.5 rounded-xl transition-all duration-200 border ${tone === item ? 'bg-primary/20 text-primary border-primary/40 shadow-sm' : 'text-app-text-sec border-app-hover hover:bg-black/5 dark:hover:bg-white/5 hover:border-app-border-hover'}`}  
              >
                {item}
              </button>
            ))}
          </div>
          
          <div className="mt-8 p-4 rounded-xl bg-primary/5 border border-primary/10">
             <h4 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
               <Sparkles className="w-4 h-4" /> IntelliSuite AI
             </h4>
             <p className="text-xs text-app-text-sec leading-relaxed">
               I am a highly capable AI assistant ready to brainstorm, solve problems, write code, or analyze data with you. My tone is currently set to <strong>{tone.toLowerCase()}</strong>.
             </p>
          </div>
        </div>

        <Button type="button" onClick={handleClear} variant="secondary">
          Clear Conversation
        </Button>
      </Card>

      {/* Right Column - Chat Area */}
      <Card className='flex-1 flex flex-col p-0 sm:p-0 overflow-hidden h-full'>
        {/* Chat History */}
        <div className='flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar relative z-10'>
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-gradient-to-br from-primary to-secondary text-white shadow-[0_0_10px_rgba(79,140,255,0.3)]' : 'bg-app-card-sec border border-app-border text-primary'}`}>
                {msg.role === 'user' ? <User className='w-4 h-4' /> : <Bot className='w-4 h-4' />}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-5 py-4 text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-r from-primary to-secondary text-white rounded-tr-none shadow-md shadow-primary/10 border border-primary/20' 
                  : 'bg-app-card-sec text-app-text rounded-tl-none border border-app-border'
              }`}>
                {msg.role === 'user' ? (
                  msg.content
                ) : (
                  <div className='prose prose-invert max-w-none prose-p:leading-relaxed prose-p:text-app-text-sec prose-headings:text-app-text prose-a:text-primary text-sm'>
                    <Markdown>{msg.content}</Markdown>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className='p-4 bg-app-card border-t border-app-border relative z-10'>
          <form onSubmit={handleSend} className='relative flex items-center max-w-4xl mx-auto'>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message IntelliSuite AI..." 
              className='w-full bg-app-input border border-transparent rounded-xl pl-5 pr-14 py-4 text-sm text-app-text outline-none focus:border-primary/50 transition-all placeholder-app-placeholder shadow-inner' 
            />
            <button 
              type="submit" 
              disabled={!input.trim() || loading}
              className='absolute right-2 p-2.5 bg-gradient-to-r from-primary to-secondary hover:shadow-[0_0_15px_rgba(139,92,246,0.4)] hover:-translate-y-0.5 text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center'
            >
              {loading ? <span className='w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin'></span> : <Send className='w-4 h-4' />}
            </button>
          </form>
          <div className='flex items-center justify-center gap-2 mt-3 text-[11px] text-app-text-sec opacity-70'>
            <Sparkles className='w-3 h-3' /> AI can make mistakes. Consider verifying important information.
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AiChat;
