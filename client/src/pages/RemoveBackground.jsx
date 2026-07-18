import { Eraser, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import { Card, PageHeader, Button, ResultPanel, FileInput } from '../components/ui';

axios.defaults.baseURL=import.meta.env.VITE_BASE_URL;

const RemoveBackground = () => {

  const [input, setinput] = useState('');
  const [loading, setloading] = useState(false);
  const [content, setcontent] = useState('');

  const { getToken } = useAuth();

  const onsubmithandler = async(e) => {
    e.preventDefault();
    try {
      setloading(true);
      const formdata = new FormData();
      formdata.append('image', input);

      const { data } = await axios.post('/api/ai/remove-image-background', 
        formdata, { headers: { Authorization: `Bearer ${await getToken()}` } }
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
      link.download = `bg-removed-${Date.now()}.png`;
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
            <PageHeader icon={Eraser} title="Background Removal" />

            <FileInput 
              label="Upload Image"
              onChange={(e) => setinput(e.target.files[0])} 
              accept='image/*' 
              required
            />
            <p className='text-xs text-app-text-sec mb-8 -mt-2'>Supports JPG, PNG, and other image formats.</p>

          <Button isLoading={loading} icon={Eraser} type="submit">
            Remove Background
          </Button>
        </Card>
        
        {/* right col */}
        <ResultPanel 
          imageContent={content} 
          icon={Sparkles} 
          title="Processed Image" 
          emptyText={<>Upload an image and click "Remove Background" <br/>to get started</>}
          onDownload={content ? downloadImage : null}
        />
    </div>  
  );
};

export default RemoveBackground;