import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import Markdown from 'react-markdown';
import { Copy, Download, Code, Layers, Sparkles, Terminal, Check } from 'lucide-react';
import { useState } from 'react';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import { Card, PageHeader, Button, TextArea, ResultPanel } from '../components/ui';

const CodeGenerator = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [copiedText, setCopiedText] = useState(null);
  const { getToken } = useAuth();

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    
    setLoading(true);
    
    try {
      const { data } = await axios.post('/api/ai/generate-code', { prompt: input }, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
    toast.success('Copied to clipboard');
  };

  const handleDownload = (text, language) => {
    const extMap = {
      javascript: 'js', typescript: 'ts', python: 'py', html: 'html', css: 'css',
      java: 'java', cpp: 'cpp', c: 'c', csharp: 'cs', ruby: 'rb', go: 'go', rust: 'rs', php: 'php', sql: 'sql', json: 'json', bash: 'sh', shell: 'sh'
    };
    const ext = extMap[language?.toLowerCase()] || 'txt';
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `generated_code.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded generated_code.${ext}`);
  };

  return (
    <div className='h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-6 max-w-[1400px] mx-auto text-app-text transition-colors'>
        {/* col left */}
        <Card isForm onSubmit={handleGenerate} className='w-full lg:w-[35%] shrink-0 h-full flex flex-col overflow-y-auto custom-scrollbar'>
            <PageHeader icon={Code} title="Code Generator" description="Write and refactor code instantly" className="shrink-0" />

            <div className="mb-6 flex-1 flex flex-col min-h-0">
              <TextArea 
                 label="Describe what to build"
                 icon={Layers}
                 onChange={(e) => setInput(e.target.value)} 
                 value={input}
                 className='h-48' 
                 placeholder='e.g. Write a React component for a pricing card with a toggle for monthly/yearly billing...' 
                 required 
              />
              
              <div className='mt-4 flex gap-2 flex-wrap'>
                {['Python Web Scraper', 'React Login Form', 'SQL Join Query'].map(suggestion => (
                  <button type="button" key={suggestion} onClick={() => setInput(suggestion)} className='px-3 py-1.5 bg-app-input border border-transparent rounded-xl text-xs font-medium text-app-text-sec hover:text-app-text hover:bg-app-hover transition-colors'>
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <Button isLoading={loading} disabled={!input.trim()} icon={Sparkles} type="submit" className="shrink-0 mt-auto">
              {loading ? 'Generating...' : 'Generate Code'}
            </Button>
        </Card>

        {/* right col */}
        <div className='flex-1 h-full overflow-hidden'>
          <ResultPanel 
            icon={Terminal} 
            title="Output" 
            emptyText={<>Your generated code and explanations<br/>will appear here.</>}
          >
            {content && (
              <div className='prose prose-sm prose-invert max-w-none text-app-text-sec prose-headings:text-app-text prose-a:text-primary'>
                <Markdown
                  components={{
                    code({node, inline, className, children, ...props}) {
                      const match = /language-(\w+)/.exec(className || '')
                      const language = match ? match[1] : ''
                      const codeString = String(children).replace(/\n$/, '')
                      return !inline && match ? (
                        <div className="my-6 rounded-xl overflow-hidden bg-app-card-sec shadow-xl border border-app-border">
                          {/* Editor Header */}
                          <div className="flex items-center justify-between px-4 py-3 bg-app-bg border-b border-app-border">
                            <div className="flex items-center gap-2">
                              <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]"></div>
                                <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]"></div>
                                <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]"></div>
                              </div>
                              <span className="ml-3 text-xs font-mono text-app-text-sec uppercase tracking-wider">{language}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => handleCopy(codeString)}
                                className="p-1.5 text-app-text-sec hover:text-app-text hover:bg-white/10 rounded transition-colors flex items-center gap-1 text-xs font-medium"
                                title="Copy code"
                              >
                                {copiedText === codeString ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                              <button 
                                onClick={() => handleDownload(codeString, language)}
                                className="p-1.5 text-app-text-sec hover:text-app-text hover:bg-white/10 rounded transition-colors"
                                title="Download file"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          {/* Editor Body */}
                          <div className="p-4 text-sm font-mono overflow-x-auto custom-scrollbar">
                            <SyntaxHighlighter
                              {...props}
                              children={codeString}
                              style={vscDarkPlus}
                              language={language}
                              PreTag="div"
                              customStyle={{ margin: 0, padding: 0, background: 'transparent' }}
                              showLineNumbers={true}
                              lineNumberStyle={{ minWidth: '2.5em', paddingRight: '1em', color: '#64748b', textAlign: 'right' }}
                              wrapLines={true}
                            />
                          </div>
                        </div>
                      ) : (
                        <code {...props} className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-sm font-mono">
                          {children}
                        </code>
                      )
                    }
                  }}
                >
                  {content}
                </Markdown>
              </div>
            )}
          </ResultPanel>
        </div>
    </div>
  );
};

export default CodeGenerator;
