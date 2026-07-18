import React, { useEffect, useState } from 'react'
import { MessageSquare, SquarePen, Image as ImageIcon, FileText, Eraser, Scissors, FileJson, Code, Zap, Activity, Image as ImageIconSmall, Video, Sparkles, Hash } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react'
import axios from 'axios';
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom';
import CreationItem from '../components/CreationItem';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const quickActions = [
  { icon: MessageSquare, title: 'AI Chat', desc: 'Brainstorm and solve complex problems', link: '/ai/ai-chat' },
  { icon: SquarePen, title: 'Write Article', desc: 'Draft high-quality SEO-optimized posts', link: '/ai/write-article' },
  { icon: Hash, title: 'Blog Titles', desc: 'Generate catchy titles for your blogs', link: '/ai/blog-titles' },
  { icon: ImageIcon, title: 'Generate Image', desc: 'Create stunning AI visuals in seconds', link: '/ai/generate-images' },
  { icon: FileText, title: 'Resume Analyzer', desc: 'ATS scoring & smart formatting tips', link: '/ai/resume-analyzer' },
  { icon: Eraser, title: 'Background Remover', desc: 'Extract subjects instantly with precision', link: '/ai/remove-background' },
  { icon: Scissors, title: 'Object Remover', desc: 'Clean up unwanted elements effortlessly', link: '/ai/remove-object' },
  { icon: FileJson, title: 'PDF Summarizer', desc: 'Extract key points from documents quickly', link: '/ai/pdf-summarizer' },
  { icon: Code, title: 'Code Generator', desc: 'Write, debug, and refactor code', link: '/ai/code-generator' }
];

const Dashboard = () => {
  const [creations, setCreations] = useState([])
  const [loading, setloading] = useState(true)

  const { getToken } = useAuth();

  const getDashboardData = async () => {
    try {
      const { data } = await axios.get('/api/user/get-user-creations', {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) {
        setCreations(data.creations)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setloading(false);
  }

  useEffect(() => {
    getDashboardData()
  }, [])

  return (
    <div className='flex flex-col gap-10 max-w-7xl mx-auto'>
      {/* Quick Actions Section */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Zap className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-app-text">Quick Actions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <Link key={idx} to={action.link} className="bg-app-card border border-app-border rounded-2xl p-6 hover:bg-app-card-sec hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(79,140,255,0.15)] transition-all duration-300 flex flex-col gap-4 group">
                <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-app-text-sec" />
                </div>
                <div>
                  <h3 className="text-app-text font-semibold mb-1 text-[15px]">{action.title}</h3>
                  <p className="text-sm text-app-text-sec leading-relaxed">{action.desc}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Overview Section */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Activity className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-semibold text-app-text">Overview</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="relative group rounded-2xl p-[1px] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-purple-500/10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative bg-app-card border border-app-border/50 rounded-2xl p-6 flex items-center gap-4 h-full">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-app-text-sec">Total Creations</p>
                <h3 className="text-2xl font-bold text-app-text">{loading ? '...' : creations.length}</h3>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="relative group rounded-2xl p-[1px] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-500/10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative bg-app-card border border-app-border/50 rounded-2xl p-6 flex items-center gap-4 h-full">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                <Activity className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-app-text-sec">Recent Activity</p>
                <h3 className="text-2xl font-bold text-app-text">{loading ? '...' : creations.slice(0, 5).length}</h3>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="relative group rounded-2xl p-[1px] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 to-emerald-500/10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative bg-app-card border border-app-border/50 rounded-2xl p-6 flex items-center gap-4 h-full">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-app-text-sec">Current Plan</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded border border-green-400/20">Pro</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="relative group rounded-2xl p-[1px] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-red-500/10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative bg-app-card border border-app-border/50 rounded-2xl p-6 flex items-center gap-4 h-full">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-app-text-sec">Today's Usage</p>
                <h3 className="text-2xl font-bold text-app-text">12<span className="text-sm font-normal text-app-text-sec ml-1">credits</span></h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Creations Section */}
      <section className="mt-8">
        {loading ? (
          <div className='flex justify-center items-center h-[200px]'>
            <div className='animate-spin rounded-full h-10 w-10 border-4 border-app-border border-t-primary'></div>
          </div>
        ) : (
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-app-text mb-4 flex items-center gap-2'>
              <div className="w-1.5 h-5 rounded-full bg-primary"></div>
              Recent Creations
            </h3>
            
            <div className="w-full overflow-x-auto rounded-2xl border border-app-border bg-app-card/50 backdrop-blur-md">
              <table className="w-full text-left text-sm text-app-text-sec">
                <thead className="bg-app-card-sec/50 border-b border-app-border text-app-text">
                  <tr>
                    <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px] opacity-70">Tool</th>
                    <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px] opacity-70">Title / Prompt</th>
                    <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px] opacity-70">Created Date</th>
                    <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px] opacity-70">Status</th>
                    <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px] opacity-70 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-app-border/50">
                  {creations.map((item) => (
                    <tr key={item.id} className="hover:bg-app-hover/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-md text-xs font-semibold capitalize tracking-wide shadow-[0_0_10px_rgba(79,140,255,0.1)]">
                          {item.type}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-app-text max-w-xs truncate">
                        {item.prompt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                          Success
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-app-text-sec hover:text-primary transition-colors text-xs font-medium px-3 py-1.5 rounded-md hover:bg-primary/10">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                  {creations.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center">
                        No recent creations found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

export default Dashboard