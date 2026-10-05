import Markdown from 'react-markdown';
import { Sparkles, Check, XCircle, BarChart2, Target, CheckCircle, ChevronRight, AlertTriangle, FileText } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Card, PageHeader, Button, TextArea, ResultPanel, FileInput } from '../components/ui';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

// Circular Progress Component
const CircularProgress = ({ value, label, size = 120, strokeWidth = 10, color = "text-primary" }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          className="text-app-border"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <motion.circle
          className={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-bold text-app-text">{value}</span>
        {label && <span className="text-[10px] text-app-text-sec font-semibold uppercase tracking-wider">{label}</span>}
      </div>
    </div>
  );
};

const ReviewResume = () => {

  const [input, setinput] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setloading] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [rawContent, setRawContent] = useState('');
  const [scoringMode, setScoringMode] = useState(''); // 'General' or 'ATS'

  const { getToken } = useAuth();

  const onsubmithandler = async(e) => {
    e.preventDefault();

    if (!input) {
        toast.error("Please upload a resume (PDF).");
        return;
    }

    try {
      setloading(true);
      setParsedData(null);
      setRawContent('');

      const formdata = new FormData();
      formdata.append('resume', input);
      if (jobDescription.trim()) {
        formdata.append('jobDescription', jobDescription);
        setScoringMode('ATS');
      } else {
        setScoringMode('General');
      }

      const { data } = await axios.post('/api/ai/resume-review', 
        formdata, { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        setRawContent(data.content);
        try {
            let jsonString = data.content;
            if (jsonString.includes('```json')) {
                jsonString = jsonString.split('```json')[1].split('```')[0].trim();
            } else if (jsonString.includes('```')) {
                 jsonString = jsonString.split('```')[1].split('```')[0].trim();
            }
            const parsed = JSON.parse(jsonString);
            setParsedData(parsed);
        } catch (err) {
            console.error("Failed to parse JSON:", err);
            toast.error("Failed to parse structured data. Displaying raw output.");
        }
      } else {
        toast.error(data.message);
      }
    } catch(error) {
      toast.error(error.message);
    }
    setloading(false);
  };

  const getScoreColor = (score) => {
      if (score >= 80) return "text-emerald-500";
      if (score >= 60) return "text-yellow-500";
      return "text-red-500";
  };

  const getScoreBg = (score) => {
    if (score >= 80) return "bg-emerald-500/10 border-emerald-500/20 text-emerald-500";
    if (score >= 60) return "bg-yellow-500/10 border-yellow-500/20 text-yellow-500";
    return "bg-red-500/10 border-red-500/20 text-red-500";
  };

  return (
     <div className='min-h-[calc(100vh-140px)] lg:h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-6 max-w-[1400px] mx-auto text-app-text transition-colors'>
          {/* col left - Input Form */}
          <Card isForm onSubmit={onsubmithandler} className='w-full lg:w-[35%] shrink-0 h-full overflow-y-auto custom-scrollbar flex flex-col'>
              <PageHeader icon={FileText} title="Resume Review" />

              <div className="mb-8">
                  <FileInput 
                    label="1. Upload Resume (PDF)"
                    onChange={(e) => setinput(e.target.files[0])} 
                    accept='application/pdf' 
                    required
                  />
              </div>

             <div className="mb-8">
                 <label className='text-xs font-bold text-app-text-sec mb-3 uppercase tracking-wider flex items-center justify-between'>
                    <span>2. Job Description (Optional)</span>
                    <span className="text-[9px] bg-app-input px-2 py-0.5 rounded-full text-app-text-sec">For ATS Score</span>
                 </label>
                 <TextArea 
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the target job description here..."
                    className='h-32'
                 />
             </div>

            <Button isLoading={loading} icon={BarChart2} type="submit" className="mt-auto">
              Analyze Resume
            </Button>
          </Card>

        {/* right col - Results Dashboard */}
        <div className='flex-1 h-full overflow-hidden'>
          <ResultPanel 
            icon={Target} 
            title="Analysis Dashboard" 
            emptyText={<>Upload your resume and click "Analyze Resume" <br/>to get a detailed breakdown.</>}
          >
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center py-20">
                  <span className='w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin mb-4'></span>
                  <p className="text-app-text-sec animate-pulse text-sm">Running AI deep analysis...</p>
              </div>
            ) : parsedData ? (
              <div className='flex-1 overflow-y-auto custom-scrollbar pr-4 space-y-8 pb-8'>
                  <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
                    <p className="text-xs text-app-text-sec font-medium mt-1">
                        {scoringMode === 'ATS' ? 'Targeted ATS Job Description Analysis' : 'General Resume Health Analysis'}
                    </p>
                    <div className={`px-4 py-1.5 rounded-full border text-sm font-bold flex items-center gap-2 ${getScoreBg(parsedData.overallScore)}`}>
                        <Sparkles className="w-4 h-4"/>
                        {parsedData.strengthLevel}
                    </div>
                  </div>

                  {/* Top Metrics Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="bg-app-card-sec border border-app-border rounded-2xl p-6 flex flex-col items-center justify-center shadow-sm">
                         <CircularProgress value={parsedData.overallScore} label={scoringMode === 'ATS' ? "ATS Score" : "Overall Score"} color={getScoreColor(parsedData.overallScore)}/>
                      </div>
                      <div className="bg-app-card-sec border border-app-border rounded-2xl p-6 flex flex-col items-center justify-center shadow-sm">
                         <CircularProgress value={parsedData.keywordMatchScore} label="Keyword Match" color={getScoreColor(parsedData.keywordMatchScore)}/>
                      </div>
                       <div className="bg-app-card-sec border border-app-border rounded-2xl p-6 flex flex-col items-center justify-center shadow-sm">
                         <CircularProgress value={parsedData.formattingCheck?.score || parsedData.grammarReadabilityScore} label="Readability" color={getScoreColor(parsedData.formattingCheck?.score || parsedData.grammarReadabilityScore)}/>
                      </div>
                  </div>

                  {/* Section Analysis Grid */}
                  <div>
                      <h3 className="text-lg font-bold text-app-text mb-4">Section Breakdown</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(parsedData.sectionAnalysis).map(([key, data]) => (
                              <div key={key} className="bg-app-card-sec border border-app-border rounded-xl p-5 hover:border-app-border-hover transition-colors shadow-sm">
                                  <div className="flex justify-between items-center mb-3">
                                      <h4 className="text-sm font-bold text-app-text capitalize">{key}</h4>
                                      <span className={`text-xs font-bold px-2 py-1 rounded-full border ${getScoreBg(data.score)}`}>{data.score}/100</span>
                                  </div>
                                  <p className="text-xs text-app-text-sec leading-relaxed">{data.feedback}</p>
                              </div>
                          ))}
                      </div>
                  </div>

                  {/* Keywords Analysis */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-app-card-sec border border-app-border rounded-xl p-6 shadow-sm">
                           <h3 className="text-sm font-bold text-app-text mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-500"/> Matching Keywords</h3>
                           <div className="flex flex-wrap gap-2">
                               {parsedData.matchingKeywords?.length > 0 ? parsedData.matchingKeywords.map((kw, i) => (
                                   <span key={i} className="text-xs font-medium px-2.5 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-md border border-emerald-500/20">{kw}</span>
                               )) : <span className="text-xs text-app-text-sec">No matching keywords found.</span>}
                           </div>
                      </div>
                      <div className="bg-app-card-sec border border-app-border rounded-xl p-6 shadow-sm">
                           <h3 className="text-sm font-bold text-app-text mb-4 flex items-center gap-2"><XCircle className="w-5 h-5 text-red-500"/> Missing Keywords</h3>
                           <div className="flex flex-wrap gap-2">
                               {parsedData.missingKeywords?.length > 0 ? parsedData.missingKeywords.map((kw, i) => (
                                   <span key={i} className="text-xs font-medium px-2.5 py-1.5 bg-red-500/10 text-red-500 rounded-md border border-red-500/20">{kw}</span>
                               )) : <span className="text-xs text-app-text-sec">No missing keywords!</span>}
                           </div>
                      </div>
                  </div>

                  {/* Strengths & Weaknesses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                          <h3 className="text-sm font-bold text-app-text mb-4">Key Strengths</h3>
                          <ul className="space-y-3 bg-app-card-sec p-6 rounded-xl border border-app-border h-full shadow-sm">
                              {parsedData.strengths?.map((str, i) => (
                                  <li key={i} className="text-sm text-app-text-sec flex items-start gap-3">
                                      <ChevronRight className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5"/>
                                      <span className="leading-relaxed">{str}</span>
                                  </li>
                              ))}
                          </ul>
                      </div>
                      <div>
                          <h3 className="text-sm font-bold text-app-text mb-4">Areas for Improvement</h3>
                          <ul className="space-y-3 bg-app-card-sec p-6 rounded-xl border border-app-border h-full shadow-sm">
                              {parsedData.weaknesses?.map((weak, i) => (
                                  <li key={i} className="text-sm text-app-text-sec flex items-start gap-3">
                                      <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5"/>
                                      <span className="leading-relaxed">{weak}</span>
                                  </li>
                              ))}
                          </ul>
                      </div>
                  </div>

                  {/* AI Recommendations */}
                  <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
                      <h3 className="text-base font-bold text-app-text mb-5 flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary"/> AI Recommendations</h3>
                      <ul className="space-y-3">
                          {parsedData.recommendations?.map((rec, i) => (
                              <li key={i} className="text-sm text-app-text-sec flex items-start gap-4 bg-app-card-sec p-4 rounded-xl border border-app-border shadow-sm">
                                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">{i + 1}</span>
                                  <span className="mt-0.5 leading-relaxed">{rec}</span>
                              </li>
                          ))}
                      </ul>
                  </div>
              </div>
            ) : rawContent ? (
              <div className='flex-1 overflow-y-auto text-sm text-app-text-sec pr-4 custom-scrollbar'>
                <div className='prose prose-invert max-w-none bg-app-card-sec p-6 rounded-xl border border-app-border shadow-sm'>
                   <Markdown>{rawContent}</Markdown>
                </div>
              </div>
            ) : null}
          </ResultPanel>
        </div>
    </div>
  );
};

export default ReviewResume;
