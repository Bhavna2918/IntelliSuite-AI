import React from 'react';
import Markdown from 'react-markdown';
import { EmptyState } from './EmptyState';
import { PageHeader } from './PageHeader';
import { Sparkles, Copy, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card } from './Card';

export const ResultPanel = ({ 
  content, 
  emptyText, 
  title = "Generated Output", 
  icon = Sparkles,
  imageContent = null, // for image generator
  onDownload = null,
  children = null
}) => {
  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content);
      toast.success('Copied to clipboard');
    }
  };

  return (
    <Card className='h-full overflow-hidden flex flex-col p-0 sm:p-0'>
      <div className='p-5 sm:p-8 flex-1 flex flex-col h-full'>
        <div className="flex items-center justify-between mb-6 shrink-0">
          <PageHeader icon={icon} title={title} className="mb-0" />
          
          {(content || imageContent || children) && (
            <div className="flex items-center gap-2">
              {content && !children && (
                <button 
                  onClick={handleCopy}
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg text-app-text-sec hover:text-primary transition-colors border border-transparent hover:border-app-border-hover"
                  title="Copy text"
                >
                  <Copy className="w-5 h-5" />
                </button>
              )}
              {onDownload && (
                <button 
                  onClick={onDownload}
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg text-app-text-sec hover:text-primary transition-colors border border-transparent hover:border-app-border-hover"
                  title="Download"
                >
                  <Download className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
        </div>

        {!(content || imageContent || children) ? (
          <EmptyState text={emptyText} />
        ) : (
          <div className='flex-1 overflow-y-auto custom-scrollbar pr-4'>
            {children ? (
              children
            ) : imageContent ? (
              <div className='flex-1 rounded-xl overflow-hidden shadow-lg border border-app-border relative group transition-colors bg-app-card-sec h-full flex justify-center items-center'>
                <img src={imageContent} alt="Generated result" className="max-w-full max-h-full object-contain" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <a href={imageContent} target="_blank" rel="noreferrer" className="px-6 py-2 bg-white/20 backdrop-blur-md text-white font-medium rounded-full border border-white/30 hover:bg-white/30 transition-colors">
                    View Full Size
                  </a>
                </div>
              </div>
            ) : (
              <div className='prose prose-invert max-w-none text-app-text-sec prose-headings:text-app-text prose-a:text-primary'> 
                <Markdown>{content}</Markdown>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
