import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/dataService';
import { LandRecord, ServiceApplication, UserProfile } from '../types';
import { motion } from 'motion/react';
import { 
  CloudSun, 
  TrendingUp, 
  Briefcase, 
  ShieldCheck, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  MapPin,
  Maximize2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

export const Dashboard: React.FC = () => {
  const { user, profile, isAdmin, isFarmer } = useAuth();
  const [landRecords, setLandRecords] = useState<LandRecord[]>([]);
  const [applications, setApplications] = useState<ServiceApplication[]>([]);
  const [allFarmers, setAllFarmers] = useState<UserProfile[]>([]);

  useEffect(() => {
    if (user && isFarmer) {
      const unsubLand = dataService.subscribeToLandRecords(user.uid, setLandRecords);
      const unsubApps = dataService.subscribeToApplications(user.uid, setApplications);
      return () => {
        unsubLand();
        unsubApps();
      };
    }
    if (user && isAdmin) {
      const unsubFarmers = dataService.subscribeToAllFarmers(setAllFarmers);
      return () => unsubFarmers();
    }
  }, [user, isFarmer, isAdmin]);

  if (isAdmin) {
    return (
      <div className="space-y-8">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tight">Admin Dashboard</h1>
            <p className="text-black/40 font-medium">System Overview & Management</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-black/5 text-center min-w-[120px]">
              <div className="text-2xl font-black">{allFarmers.length}</div>
              <div className="text-[10px] uppercase tracking-wider font-bold opacity-40">Total Farmers</div>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-black/5 text-center min-w-[120px]">
              <div className="text-2xl font-black text-green-600">{allFarmers.filter(f => f.status === 'verified').length}</div>
              <div className="text-[10px] uppercase tracking-wider font-bold opacity-40">Verified</div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/admin/farmers" className="bg-white p-8 rounded-[2rem] shadow-xl border border-black/5 hover:scale-[1.02] transition-all group">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold mb-1">Farmer Verification</h3>
            <p className="text-sm text-black/40">Approve or reject new farmer registrations.</p>
          </Link>

          <Link to="/market" className="bg-white p-8 rounded-[2rem] shadow-xl border border-black/5 hover:scale-[1.02] transition-all group">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-xl font-bold mb-1">Market Management</h3>
            <p className="text-sm text-black/40">Update crop prices and market trends.</p>
          </Link>

          <Link to="/services" className="bg-white p-8 rounded-[2rem] shadow-xl border border-black/5 hover:scale-[1.02] transition-all group">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Briefcase size={24} />
            </div>
            <h3 className="text-xl font-bold mb-1">Service Requests</h3>
            <p className="text-sm text-black/40">Manage applications for JAMO services.</p>
          </Link>
        </div>

        <section className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-black/5">
          <h2 className="text-2xl font-bold mb-6">Recent Farmer Registrations</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-black/5">
                  <th className="pb-4 text-[10px] uppercase tracking-widest font-bold opacity-40">Farmer Name</th>
                  <th className="pb-4 text-[10px] uppercase tracking-widest font-bold opacity-40">Region</th>
                  <th className="pb-4 text-[10px] uppercase tracking-widest font-bold opacity-40">Status</th>
                  <th className="pb-4 text-[10px] uppercase tracking-widest font-bold opacity-40">Date</th>
                </tr>
              </thead>
              <tbody>
                {allFarmers.slice(0, 5).map((farmer) => (
                  <tr key={farmer.uid} className="border-b border-black/5 last:border-0">
                    <td className="py-4 font-bold">{farmer.fullName}</td>
                    <td className="py-4 text-black/60">{farmer.region}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        farmer.status === 'verified' ? 'bg-green-100 text-green-700' :
                        farmer.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {farmer.status}
                      </span>
                    </td>
                    <td className="py-4 text-black/40 text-sm">
                      {new Date(farmer.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Hello, {profile?.fullName?.split(' ')[0]}!</h1>
          <p className="text-black/40 font-medium">Welcome to your JAMO Farmer Dashboard</p>
        </div>
        <div className="flex gap-2">
          <Link to="/weather" className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-black/5 hover:bg-black/5 transition-all">
            <CloudSun size={18} className="text-orange-500" />
            <span className="font-bold text-sm">28°C Sunny</span>
          </Link>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-black/5 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
            <Maximize2 size={24} />
          </div>
          <div>
            <div className="text-2xl font-black">{landRecords.reduce((acc, curr) => acc + curr.size, 0)}</div>
            <div className="text-[10px] uppercase tracking-wider font-bold opacity-40">Total Acres</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-black/5 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
            <Briefcase size={24} />
          </div>
          <div>
            <div className="text-2xl font-black">{applications.length}</div>
            <div className="text-[10px] uppercase tracking-wider font-bold opacity-40">Active Services</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-black/5 flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="text-2xl font-black">UGX 0</div>
            <div className="text-[10px] uppercase tracking-wider font-bold opacity-40">Market Value</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-black/5 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center">
            <ShieldCheck size={24} />
          </div>
          <div>
            <div className="text-2xl font-black capitalize">{profile?.status}</div>
            <div className="text-[10px] uppercase tracking-wider font-bold opacity-40">KYC Status</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Land Records */}
        <section className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">My Land Records</h2>
            <button className="p-2 bg-[#5A5A40] text-white rounded-full hover:scale-110 transition-all">
              <Plus size={20} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {landRecords.map((record) => (
              <motion.div 
                key={record.id}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-[2rem] shadow-xl border border-black/5"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 bg-black/5 rounded-xl flex items-center justify-center">
                    <MapPin size={20} />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    record.status === 'verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {record.status}
                  </span>
                </div>
                <h3 className="text-xl font-bold">{record.location}</h3>
                <p className="text-black/40 text-sm mb-4">{record.size} Acres • {record.farmingType} farming</p>
                <div className="flex flex-wrap gap-2">
                  {record.crops.map(crop => (
                    <span key={crop} className="bg-black/5 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">{crop}</span>
                  ))}
                </div>
              </motion.div>
            ))}
            {landRecords.length === 0 && (
              <div className="col-span-2 py-12 text-center bg-white rounded-[2rem] border-2 border-dashed border-black/10">
                <p className="text-black/40 font-medium">No land records found. Add your first plot!</p>
              </div>
            )}
          </div>
        </section>

        {/* Service Applications */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Service Status</h2>
          <div className="space-y-3">
            {applications.map((app) => (
              <div key={app.id} className="bg-white p-4 rounded-2xl shadow-md border border-black/5 flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  app.status === 'approved' ? 'bg-green-100 text-green-600' :
                  app.status === 'rejected' ? 'bg-red-100 text-red-600' :
                  'bg-yellow-100 text-yellow-600'
                )}>
                  {app.status === 'approved' ? <CheckCircle2 size={20} /> :
                   app.status === 'rejected' ? <AlertCircle size={20} /> :
                   <Clock size={20} />}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm">Application #{app.id?.slice(-4)}</h4>
                  <p className="text-xs text-black/40 capitalize">{app.status}</p>
                </div>
              </div>
            ))}
            {applications.length === 0 && (
              <div className="p-8 text-center bg-white rounded-2xl border border-black/5">
                <p className="text-xs text-black/40">No active applications.</p>
                <Link to="/services" className="text-xs font-bold text-[#5A5A40] mt-2 block hover:underline">Browse Services</Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
