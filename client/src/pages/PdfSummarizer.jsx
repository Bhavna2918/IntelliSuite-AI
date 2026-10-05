import { FileText, Sparkles, FileSearch } from 'lucide-react';
import { useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import { Card, PageHeader, Button, ResultPanel, FileInput } from '../components/ui';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const PdfSummarizer = () => {
  const [input, setInput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const reportRef = useRef(null);

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!input) {
      toast.error("Please upload a PDF document first");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('pdf', input);

      const { data } = await axios.post('/api/ai/summarize-pdf', formData, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });

      if (data.success) {
        setContent(data.content);
        toast.success("Document Summarized successfully!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className='min-h-[calc(100vh-140px)] lg:h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-6 max-w-[1400px] mx-auto text-app-text transition-colors'>
      {/* Left Column - Input */}
      <Card isForm onSubmit={onSubmitHandler} className='w-full lg:w-[35%] shrink-0 h-full overflow-y-auto custom-scrollbar flex flex-col print:hidden'>
        <PageHeader icon={FileSearch} title="PDF Summarizer" description="Extract key points instantly" />

        <div className='space-y-6 flex-1 flex flex-col justify-center'>
            <div className="mb-8">
              <FileInput 
                label={<span className="flex items-center gap-2"><FileText className="w-4 h-4" /> Upload Document (PDF)</span>}
                onChange={(e) => setInput(e.target.files[0])} 
                accept='application/pdf' 
                required
              />
              <p className='text-[10px] text-app-text-sec -mt-3'>Supports PDF format only. Max 5MB.</p>
            </div>

          <Button isLoading={loading} icon={Sparkles} type="submit" className="mt-8">
            {loading ? 'Summarizing...' : 'Summarize Document'}
          </Button>
        </div>
      </Card>

      {/* Right Column - Output */}
      <div ref={reportRef} className='flex-1 h-full overflow-hidden print:w-full print:block'>
        <ResultPanel 
          content={content} 
          icon={FileText} 
          title="Summary" 
          emptyText={<>Your document summary and key points <br/>will appear here.</>}
          onDownload={content ? handlePrint : null}
        />
      </div>
    </div>
  );
};

export default PdfSummarizer;
