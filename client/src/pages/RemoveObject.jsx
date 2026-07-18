import { Scissors, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import { Card, PageHeader, Button, TextArea, ResultPanel, FileInput } from '../components/ui';

axios.defaults.baseURL=import.meta.env.VITE_BASE_URL;

const RemoveObject = () => {

  const [input, setinput] = useState('');
  const [object, setobject] = useState('');

  const [loading, setloading] = useState(false);
  const [content, setcontent] = useState('');

  const { getToken } = useAuth();

  const onsubmithandler = async(e) => {
    e.preventDefault();

    try {
      setloading(true);
      if(object.split(' ').length > 1){
        setloading(false);
        return toast.error('Please enter only a single object name to remove');
      }

      const formdata = new FormData();
      formdata.append('image', input);
      formdata.append('object', object); 

      const { data } = await axios.post('/api/ai/remove-image-object', 
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
      link.download = `object-removed-${Date.now()}.png`;
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
            <PageHeader icon={Scissors} title="Object Removal" />

            <FileInput 
              label="Upload Image"
              onChange={(e) => setinput(e.target.files[0])} 
              accept='image/*' 
              required
            />

            <TextArea 
              label="Object to Remove"
              onChange={(e) => setobject(e.target.value)} 
              value={object} 
              rows={3}
              placeholder='e.g., watch or spoon (single object)' 
              required
            />

            <Button isLoading={loading} icon={Scissors} type="submit">
              Remove Object
            </Button>
          </Card>

          {/* right col */}
          <ResultPanel 
            imageContent={content} 
            icon={Sparkles} 
            title="Processed Image" 
            emptyText={<>Upload an image and specify an object<br/> to see it removed</>}
            onDownload={content ? downloadImage : null}
          />
    </div>
  );
};

export default RemoveObject;