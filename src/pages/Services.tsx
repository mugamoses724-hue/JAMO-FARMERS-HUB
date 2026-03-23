import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Briefcase, ShieldCheck, Landmark, HeartPulse, Tractor, ArrowRight, CheckCircle2 } from 'lucide-react';
import { dataService } from '../services/dataService';
import { JamoService, ServiceApplication } from '../types';
import { useAuth } from '../context/AuthContext';

export const Services: React.FC = () => {
  const { user } = useAuth();
  const [services, setServices] = useState<JamoService[]>([]);
  const [applications, setApplications] = useState<ServiceApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const s = await dataService.getServices();
      // If no services in DB, use defaults
      if (s.length === 0) {
        setServices([
          { name: 'Agricultural Training', description: 'Modern farming techniques and pest management workshops.', category: 'Education', icon: 'Briefcase' },
          { name: 'Farm Input Supply', description: 'Access high-quality seeds, fertilizers, and tools at subsidized rates.', category: 'Supply', icon: 'Tractor' },
          { name: 'Financial Support', description: 'Low-interest loans and credit facilities for farm expansion.', category: 'Finance', icon: 'Landmark' },
          { name: 'Crop Insurance', description: 'Protect your harvest against drought, floods, and pests.', category: 'Insurance', icon: 'ShieldCheck' },
          { name: 'Equipment Access', description: 'Rent tractors, harvesters, and irrigation equipment.', category: 'Equipment', icon: 'Tractor' },
        ]);
      } else {
        setServices(s);
      }
      setLoading(false);
    };
    load();

    if (user) {
      const unsub = dataService.subscribeToApplications(user.uid, setApplications);
      return () => unsub();
    }
  }, [user]);

  const handleApply = async (serviceId: string) => {
    if (!user) return;
    await dataService.applyForService({
      farmerUid: user.uid,
      serviceId,
      status: 'pending',
      createdAt: new Date().toISOString()
    });
    alert('Application submitted successfully!');
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'Briefcase': return <Briefcase size={24} />;
      case 'ShieldCheck': return <ShieldCheck size={24} />;
      case 'Landmark': return <Landmark size={24} />;
      case 'Tractor': return <Tractor size={24} />;
      default: return <Briefcase size={24} />;
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-black tracking-tight">JAMO Services</h1>
        <p className="text-black/40 font-medium">Support programs designed for your growth</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, i) => {
          const hasApplied = applications.some(a => a.serviceId === service.name || a.serviceId === service.id);
          return (
            <motion.div 
              key={service.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-black/5 flex flex-col"
            >
              <div className="w-14 h-14 bg-black/5 rounded-2xl flex items-center justify-center mb-6 text-[#5A5A40]">
                {getIcon(service.icon)}
              </div>
              <div className="text-[10px] uppercase tracking-widest font-bold text-[#5A5A40] mb-2">{service.category}</div>
              <h3 className="text-2xl font-black mb-3">{service.name}</h3>
              <p className="text-black/60 text-sm mb-8 flex-1">{service.description}</p>
              
              {hasApplied ? (
                <div className="flex items-center gap-2 text-green-600 font-bold text-sm bg-green-50 p-4 rounded-2xl justify-center">
                  <CheckCircle2 size={18} />
                  Application Submitted
                </div>
              ) : (
                <button 
                  onClick={() => handleApply(service.id || service.name)}
                  className="w-full bg-[#5A5A40] text-white py-4 rounded-2xl font-bold hover:bg-[#4A4A30] transition-all flex items-center justify-center gap-2 group"
                >
                  Apply Now
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      <section className="bg-[#5A5A40] p-10 rounded-[3rem] text-white shadow-2xl">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-black mb-4">Need Custom Support?</h2>
          <p className="text-white/70 mb-8">Our team is ready to help with specialized requests. Whether it's large-scale irrigation or export logistics, we've got you covered.</p>
          <button className="bg-white text-[#5A5A40] px-8 py-4 rounded-2xl font-bold hover:bg-white/90 transition-all">
            Contact Support Agent
          </button>
        </div>
      </section>
    </div>
  );
};
