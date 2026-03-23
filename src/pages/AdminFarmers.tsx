import React, { useEffect, useState } from 'react';
import { dataService } from '../services/dataService';
import { UserProfile } from '../types';
import { motion } from 'motion/react';
import { Check, X, User, Phone, MapPin, ShieldCheck, FileText } from 'lucide-react';
import { cn } from '../lib/utils';

export const AdminFarmers: React.FC = () => {
  const [farmers, setFarmers] = useState<UserProfile[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified'>('all');

  useEffect(() => {
    const unsub = dataService.subscribeToAllFarmers(setFarmers);
    return () => unsub();
  }, []);

  const handleStatusUpdate = async (uid: string, status: 'verified' | 'rejected') => {
    await dataService.updateUserProfile(uid, { status });
  };

  const filteredFarmers = farmers.filter(f => filter === 'all' ? true : f.status === filter);

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Farmer Management</h1>
          <p className="text-black/40 font-medium">Review and verify farmer identities</p>
        </div>
        
        <div className="flex bg-white p-1 rounded-full shadow-sm border border-black/5">
          {(['all', 'pending', 'verified'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all",
                filter === f ? "bg-[#5A5A40] text-white shadow-md" : "text-black/40 hover:text-black"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {filteredFarmers.map((farmer) => (
          <motion.div 
            key={farmer.uid}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white p-6 rounded-[2rem] shadow-xl border border-black/5 flex flex-col md:flex-row items-center gap-6"
          >
            <div className="w-20 h-20 bg-black/5 rounded-3xl flex items-center justify-center text-[#5A5A40]">
              {farmer.profilePhotoUrl ? (
                <img src={farmer.profilePhotoUrl} className="w-full h-full object-cover rounded-3xl" alt="" />
              ) : (
                <User size={40} />
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                <h3 className="text-xl font-bold">{farmer.fullName}</h3>
                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                  farmer.status === 'verified' ? 'bg-green-100 text-green-700' :
                  farmer.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {farmer.status}
                </span>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-black/40">
                <span className="flex items-center gap-1"><Phone size={14} /> {farmer.phoneNumber}</span>
                <span className="flex items-center gap-1"><ShieldCheck size={14} /> {farmer.nationalId}</span>
                <span className="flex items-center gap-1"><MapPin size={14} /> {farmer.region}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="p-4 bg-black/5 rounded-2xl hover:bg-black/10 transition-all text-black/60">
                <FileText size={20} />
              </button>
              {farmer.status === 'pending' && (
                <>
                  <button 
                    onClick={() => handleStatusUpdate(farmer.uid, 'rejected')}
                    className="p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all"
                  >
                    <X size={20} />
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(farmer.uid, 'verified')}
                    className="p-4 bg-green-50 text-green-600 rounded-2xl hover:bg-green-600 hover:text-white transition-all"
                  >
                    <Check size={20} />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        ))}
        {filteredFarmers.length === 0 && (
          <div className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-black/10">
            <p className="text-black/40 font-medium">No farmers found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};
