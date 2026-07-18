import { Edit, Sparkles, PenTool } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import { Card, PageHeader, Input, Button, ResultPanel } from '../components/ui';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const WriteArticle = () => {
   const articlelength = [
    {length: 800, text: 'Short (500-800 words)'},
    {length: 1200, text: 'Medium (800-1200 words)'},
    {length: 1600, text: 'Long (1200+ words)'},
  ];
  
  const [selectedlength, setselectedlength] = useState(articlelength[0]);
  const [input, setinput] = useState('');
  const [loading, setloading] = useState(false);
  const [content, setcontent] = useState('');

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
     
    try {
      setloading(true);
      const prompt = `Write an article about ${input} in ${selectedlength.text}`;
      const { data } = await axios.post('/api/ai/generate-article', {prompt, length: selectedlength.length}, {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      });

      if (data.success) {
        setcontent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setloading(false);
  };

  return (
    <div className='flex flex-col lg:flex-row gap-6 max-w-[1400px] mx-auto h-[calc(100vh-140px)] text-app-text transition-colors'>
        {/* Left Column - Configuration */}
        <Card isForm onSubmit={onSubmitHandler} className='w-full lg:w-[35%] shrink-0 h-full overflow-y-auto custom-scrollbar'>
            <PageHeader icon={Sparkles} title="Article Configuration" />

            <Input 
              label="Article Topic"
              value={input}
              onChange={(e) => setinput(e.target.value)}
              placeholder='e.g. The future of AI...'
              required
            />
            
            <div className="mb-8">
              <label className='text-xs font-bold text-app-text-sec mb-3 uppercase tracking-wider block'>Article Length</label>
              <div className='flex gap-2 flex-wrap'>
                {articlelength.map((item, index) => (
                  <button 
                    key={index}
                    type="button"
                    onClick={() => setselectedlength(item)} 
                    className={`text-xs px-4 py-2.5 rounded-xl transition-all duration-200 border ${selectedlength.text === item.text ? 'bg-primary/20 text-primary border-primary/40 shadow-sm' : 'text-app-text-sec border-app-hover hover:bg-black/5 dark:hover:bg-white/5 hover:border-app-border-hover'}`}  
                  >
                    {item.text}
                  </button>
                ))}
              </div>
            </div>

            <Button isLoading={loading} icon={PenTool} type="submit">
                Generate Article
            </Button>
        </Card>

        {/* Right Column - Result */}
        <ResultPanel 
          content={content} 
          icon={Edit} 
          title="Generated Article" 
          emptyText={<>Enter a topic and click "Generate Article" <br/>to get started</>} 
        />
    </div>
  );
};

export default WriteArticle;