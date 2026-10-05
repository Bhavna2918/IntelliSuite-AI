import { Hash, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { Card, PageHeader, Input, Button, ResultPanel } from '../components/ui';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const BlogTitles = () => {
  const blogCategories = [
    'General', 'Technology', 'Business', 'Health', 'Lifestyle', 'Education', 'Travel', 'Food'
  ];
  
  const [selectedcategory, setselectcategory] = useState('General');
  const [input, setinput] = useState('');
  const [loading, setloading] = useState(false);
  const [content, setcontent] = useState('');
  
  const { getToken } = useAuth();
  
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setloading(true);
      const prompt = `Generate a blog title for the keyword ${input} in the category ${selectedcategory}`;
      const { data } = await axios.post('/api/ai/generate-blog-title', 
        { prompt }, 
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

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
    <div className='min-h-[calc(100vh-140px)] lg:h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-6 max-w-[1400px] mx-auto text-app-text transition-colors'>
        {/* col left */}
        <Card isForm onSubmit={onSubmitHandler} className='w-full lg:w-[35%] shrink-0 h-full overflow-y-auto custom-scrollbar'>
            <PageHeader icon={Hash} title="AI Title Generator" />

            <Input 
              label="Keyword"
              value={input}
              onChange={(e) => setinput(e.target.value)}
              placeholder='The future of AI is ...'
              required
            />
            
            <div className="mb-8">
              <label className='text-xs font-bold text-app-text-sec mb-3 uppercase tracking-wider block'>Category</label>
              <div className='flex gap-2 flex-wrap'>
                {blogCategories.map((item) => (
                  <button 
                    type="button"
                    onClick={() => setselectcategory(item)} 
                    className={`text-xs px-4 py-2.5 rounded-xl transition-all duration-200 border ${selectedcategory === item ? 'bg-primary/20 text-primary border-primary/40 shadow-sm' : 'text-app-text-sec border-app-hover hover:bg-black/5 dark:hover:bg-white/5 hover:border-app-border-hover'}`}  
                    key={item}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <Button isLoading={loading} icon={Hash} type="submit">
               Generate Title
            </Button>
        </Card>

        {/* right col */}
        <ResultPanel 
          content={content} 
          icon={Sparkles} 
          title="Generated Title" 
          emptyText={<>Enter a topic and click "Generate Title" <br/>to get started</>} 
        />
    </div>
  );
};

export default BlogTitles;
