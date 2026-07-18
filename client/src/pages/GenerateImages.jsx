import { Image, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import { Card, PageHeader, Button, ResultPanel, TextArea } from '../components/ui';

axios.defaults.baseURL=import.meta.env.VITE_BASE_URL;

const GenerateImages = () => {

  const imagestyle = [
   'Realistic' ,'Ghibli style' ,'Anime style','Cartoon style','Fantasy style','3D style','Portrait' 
  ];
  
  const [selectedstyle, setselectedstyle] = useState('Realistic');
  const [input, setinput] = useState('');
  const [publish, setpublish] = useState(false);
  const [loading, setloading] = useState(false);
  const [content, setcontent] = useState('');

  const { getToken } = useAuth();

  const onsubmithandler = async(e) => {
    e.preventDefault();

    try {
      setloading(true);
      const prompt = `Generate an image of ${input} in the ${selectedstyle} style`;
      const { data } = await axios.post('/api/ai/generate-image', 
        { prompt, publish },
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

  const downloadImage = async () => {
    try {
      if (!content) return;
      const response = await fetch(content);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ai-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Failed to download image");
    }
  };

  return (
    <div className='h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-6 max-w-[1400px] mx-auto text-app-text transition-colors'>
        {/* col left */}
        <Card isForm onSubmit={onsubmithandler} className='w-full lg:w-[35%] shrink-0 h-full overflow-y-auto custom-scrollbar flex flex-col'>
            <PageHeader icon={Image} title="AI Image Generator" />

            <TextArea
              label="Describe your Image"
              onChange={(e) => setinput(e.target.value)} 
              value={input} 
              rows={4}
              placeholder='A futuristic cyberpunk city at night with neon lights...' 
              required
            />

            <div className="mb-6">
              <label className='text-xs font-bold text-app-text-sec mb-3 uppercase tracking-wider block'>Style</label>
              <div className='flex gap-2 flex-wrap'>
                {imagestyle.map((item) => (
                  <button 
                    type="button"
                    onClick={() => setselectedstyle(item)} 
                    className={`text-xs px-4 py-2.5 rounded-xl transition-all duration-200 border ${selectedstyle === item ? 'bg-primary/20 text-primary border-primary/40 shadow-sm' : 'text-app-text-sec border-app-hover hover:bg-black/5 dark:hover:bg-white/5 hover:border-app-border-hover'}`}  
                    key={item}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            
            <div className='mb-8 flex items-center gap-3 p-4 rounded-xl bg-app-card-sec border border-app-border'> 
              <label className='relative cursor-pointer flex items-center'>
                <input 
                  type="checkbox" 
                  onChange={(e) => setpublish(e.target.checked)}
                  checked={publish} 
                  className='sr-only peer'
                />
                <div className='w-11 h-6 bg-app-hover rounded-full peer-checked:bg-primary transition-colors border border-app-border shadow-inner'></div>
                <span className='absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5 shadow-sm'></span>
              </label>
              <p className='text-xs text-app-text-sec font-medium'>Publish to community</p>
            </div>

            <Button isLoading={loading} icon={Sparkles} type="submit">
              Generate Image
            </Button>
        </Card>

        {/* right col */}
        <ResultPanel 
          imageContent={content} 
          icon={Image} 
          title="Result" 
          emptyText={<>Enter a prompt and click "Generate image" <br/>to see the magic happen</>}
          onDownload={content ? downloadImage : null}
        />
    </div>  
  );
};

export default GenerateImages;