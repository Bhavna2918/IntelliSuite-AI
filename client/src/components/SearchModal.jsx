import React, { useEffect, useState, useRef } from 'react';
import { Search, X, MessageSquare, FileText, ImageIcon, Scissors, Eraser, FileJson, Code, Zap, Hash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const searchData = [
  { title: 'AI Chat', desc: 'Brainstorm and solve complex problems', link: '/ai/ai-chat', icon: MessageSquare, category: 'Tools' },
  { title: 'Write Article', desc: 'Draft high-quality SEO-optimized posts', link: '/ai/write-article', icon: FileText, category: 'Tools' },
  { title: 'Blog Titles', desc: 'Generate catchy titles for your blogs', link: '/ai/blog-titles', icon: Hash, category: 'Tools' },
  { title: 'Generate Image', desc: 'Create stunning AI visuals in seconds', link: '/ai/generate-images', icon: ImageIcon, category: 'Tools' },
  { title: 'Resume Analyzer', desc: 'ATS scoring & smart formatting tips', link: '/ai/resume-analyzer', icon: FileText, category: 'Tools' },
  { title: 'Background Remover', desc: 'Extract subjects instantly with precision', link: '/ai/remove-background', icon: Eraser, category: 'Tools' },
  { title: 'Object Remover', desc: 'Clean up unwanted elements effortlessly', link: '/ai/remove-object', icon: Scissors, category: 'Tools' },
  { title: 'PDF Summarizer', desc: 'Extract key points from documents quickly', link: '/ai/pdf-summarizer', icon: FileJson, category: 'Tools' },
  { title: 'Code Generator', desc: 'Write, debug, and refactor code', link: '/ai/code-generator', icon: Code, category: 'Tools' },
  { title: 'Dashboard', desc: 'View your analytics and recent creations', link: '/ai', icon: Zap, category: 'Pages' },
];

const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const filteredResults = searchData.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) || 
    item.desc.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (link) => {
    navigate(link);
    onClose();
    setQuery('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[15vh] left-1/2 -translate-x-1/2 w-full max-w-2xl bg-app-card border border-app-border shadow-2xl rounded-2xl z-[60] overflow-hidden flex flex-col max-h-[70vh]"
          >
            <div className="flex items-center gap-3 p-4 border-b border-app-border bg-app-bg/50">
              <Search className="w-5 h-5 text-app-text-sec shrink-0" />
              <input 
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tools, pages, or commands..." 
                className="w-full bg-transparent border-none outline-none text-app-text placeholder-app-placeholder text-lg"
              />
              <button onClick={onClose} className="p-1 rounded-md hover:bg-app-hover text-app-text-sec hover:text-app-text transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-2 custom-scrollbar">
              {filteredResults.length > 0 ? (
                <div className="py-2">
                  <div className="px-3 pb-2 text-xs font-semibold text-app-text-sec uppercase tracking-wider">Results</div>
                  {filteredResults.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <button 
                        key={idx}
                        onClick={() => handleSelect(item.link)}
                        className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-app-hover text-left transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                          <Icon className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-app-text">{item.title}</div>
                          <div className="text-xs text-app-text-sec">{item.desc}</div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="p-8 text-center text-app-text-sec">
                  <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>No results found for "{query}"</p>
                </div>
              )}
            </div>
            
            <div className="p-3 border-t border-app-border bg-app-bg flex items-center justify-between text-xs text-app-text-sec">
              <div className="flex items-center gap-2">
                <span>Navigate with</span>
                <span className="px-1.5 py-0.5 rounded bg-app-card border border-app-border font-medium text-app-text">↑</span>
                <span className="px-1.5 py-0.5 rounded bg-app-card border border-app-border font-medium text-app-text">↓</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Close</span>
                <span className="px-1.5 py-0.5 rounded bg-app-card border border-app-border font-medium text-app-text">ESC</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
