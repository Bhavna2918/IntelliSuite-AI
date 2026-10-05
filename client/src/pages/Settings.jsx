import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Settings as SettingsIcon, User, CreditCard, Bell, Shield, Moon, Monitor, Sun, Zap, LogOut } from 'lucide-react';
import { Card, PageHeader, Button } from '../components/ui';
import { useTheme } from '../context/ThemeContext';
import { useClerk } from '@clerk/clerk-react';

const Settings = () => {
  const { user } = useUser();
  const { theme, toggleTheme } = useTheme();
  const { signOut } = useClerk();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
    { id: 'appearance', label: 'Appearance', icon: Monitor },
  ];

  return (
    <div className='max-w-[1000px] mx-auto text-app-text transition-colors pb-10'>
      <PageHeader 
        icon={SettingsIcon} 
        title="Settings" 
        description="Manage your account preferences and configurations." 
      />

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <Card className="w-full md:w-64 shrink-0 p-4 h-fit">
          <nav className="flex flex-col gap-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium ${
                  activeTab === tab.id 
                    ? 'bg-primary/10 text-primary border border-primary/20' 
                    : 'text-app-text-sec hover:text-app-text hover:bg-white/5 border border-transparent'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </Card>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <Card className="p-6 sm:p-8">
              <h2 className="text-xl font-bold text-app-text mb-6">Profile Information</h2>
              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-app-border">
                <img 
                  src={user?.imageUrl} 
                  alt="Profile" 
                  className="w-20 h-20 rounded-full object-cover border-2 border-primary/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                />
                <div>
                  <h3 className="text-lg font-bold text-app-text">{user?.fullName}</h3>
                  <p className="text-app-text-sec text-sm mt-1">{user?.primaryEmailAddress?.emailAddress}</p>
                  <Button variant="outline" className="mt-3 py-1.5 px-4 text-xs h-auto">Change Avatar</Button>
                </div>
              </div>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-app-text-sec uppercase tracking-wider block mb-2">First Name</label>
                    <input 
                      type="text" 
                      defaultValue={user?.firstName}
                      className="w-full p-3 bg-app-input text-app-text outline-none text-sm rounded-xl border border-transparent focus:border-primary/50 transition-all placeholder-app-placeholder" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-app-text-sec uppercase tracking-wider block mb-2">Last Name</label>
                    <input 
                      type="text" 
                      defaultValue={user?.lastName}
                      className="w-full p-3 bg-app-input text-app-text outline-none text-sm rounded-xl border border-transparent focus:border-primary/50 transition-all placeholder-app-placeholder" 
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-app-text-sec uppercase tracking-wider block mb-2">Email Address</label>
                  <input 
                    type="email" 
                    defaultValue={user?.primaryEmailAddress?.emailAddress}
                    disabled
                    className="w-full p-3 bg-app-input/50 text-app-text-sec outline-none text-sm rounded-xl border border-transparent cursor-not-allowed" 
                  />
                  <p className="text-xs text-app-text-sec mt-2">Email changes must be verified for security purposes.</p>
                </div>
                <div className="pt-4 flex justify-end">
                  <Button type="button">Save Changes</Button>
                </div>
              </form>
            </Card>
          )}

          {activeTab === 'billing' && (
            <Card className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-bold text-app-text">Current Plan</h2>
                  <p className="text-app-text-sec text-sm mt-1">Manage your billing and subscription</p>
                </div>
                <div className="bg-primary/10 border border-primary/20 px-3 py-1 rounded-full flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold text-primary">Pro Plan</span>
                </div>
              </div>
              
              <div className="bg-app-card-sec border border-app-border rounded-xl p-6 mb-8 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-app-text font-medium">Credits Usage</span>
                  <span className="text-sm text-app-text-sec">7,450 / 10,000</span>
                </div>
                <div className="w-full h-2 bg-app-input rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[74.5%] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                </div>
                <p className="text-xs text-app-text-sec mt-3">Renews on Oct 15, 2026</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="flex-1">Upgrade Plan</Button>
                <Button variant="outline" className="flex-1">View Invoices</Button>
              </div>
            </Card>
          )}

          {activeTab === 'appearance' && (
            <Card className="p-6 sm:p-8">
              <h2 className="text-xl font-bold text-app-text mb-6">Appearance</h2>
              <p className="text-app-text-sec text-sm mb-6">Customize the look and feel of IntelliSuite AI.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={() => theme !== 'dark' && toggleTheme()}
                  className={`flex flex-col items-center gap-3 p-6 rounded-xl border transition-all ${theme === 'dark' ? 'bg-primary/5 border-primary shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'bg-app-card-sec border-app-border hover:border-app-border-hover'}`}
                >
                  <div className="w-12 h-12 rounded-full bg-[#0B1120] border border-white/10 flex items-center justify-center">
                    <Moon className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="font-semibold text-app-text">Dark Mode</span>
                </button>

                <button 
                  onClick={() => theme === 'dark' && toggleTheme()}
                  className={`flex flex-col items-center gap-3 p-6 rounded-xl border transition-all ${theme !== 'dark' ? 'bg-primary/5 border-primary shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'bg-app-card-sec border-app-border hover:border-app-border-hover'}`}
                >
                  <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                    <Sun className="w-5 h-5 text-orange-400" />
                  </div>
                  <span className="font-semibold text-app-text">Light Mode</span>
                </button>
              </div>
            </Card>
          )}


          {/* Global Actions */}
          <div className="mt-8 pt-8 border-t border-app-border">
             <button onClick={signOut} className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors font-medium px-4 py-2 hover:bg-red-500/10 rounded-lg">
                <LogOut className="w-4 h-4" />
                Sign Out of IntelliSuite AI
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
