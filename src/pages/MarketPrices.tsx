import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Search, Filter, Globe, MapPin, ArrowRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '../lib/utils';

export const MarketPrices: React.FC = () => {
  const [search, setSearch] = useState('');
  
  const prices = [
    { crop: 'Maize', local: 1200, regional: 1500, international: 2200, trend: 'up', change: 5 },
    { crop: 'Beans', local: 3500, regional: 3800, international: 4500, trend: 'down', change: 2 },
    { crop: 'Coffee (Robusta)', local: 7800, regional: 8200, international: 12500, trend: 'up', change: 12 },
    { crop: 'Rice', local: 4200, regional: 4500, international: 5500, trend: 'stable', change: 0 },
    { crop: 'Cassava', local: 800, regional: 1000, international: 1500, trend: 'up', change: 3 },
    { crop: 'Matooke', local: 25000, regional: 28000, international: 35000, trend: 'down', change: 8 },
  ];

  const chartData = [
    { month: 'Jan', price: 1000 },
    { month: 'Feb', price: 1100 },
    { month: 'Mar', price: 1050 },
    { month: 'Apr', price: 1200 },
    { month: 'May', price: 1300 },
    { month: 'Jun', price: 1250 },
  ];

  const filteredPrices = prices.filter(p => p.crop.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Market Prices</h1>
          <p className="text-black/40 font-medium">Real-time agricultural commodity rates</p>
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={20} />
            <input 
              placeholder="Search crops..."
              className="pl-12 pr-6 py-3 bg-white rounded-full shadow-sm border border-black/5 outline-none focus:ring-2 ring-[#5A5A40]/20 w-full md:w-64"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="p-3 bg-white rounded-full shadow-sm border border-black/5 hover:bg-black/5 transition-all">
            <Filter size={20} />
          </button>
        </div>
      </header>

      {/* Price Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrices.map((item, i) => (
          <motion.div 
            key={item.crop}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-black/5 hover:scale-[1.02] transition-all"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-black">{item.crop}</h3>
                <p className="text-[10px] uppercase tracking-widest font-bold opacity-40">Per Kilogram (UGX)</p>
              </div>
              <div className={cn(
                "px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1",
                item.trend === 'up' ? 'bg-green-100 text-green-700' : 
                item.trend === 'down' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
              )}>
                {item.trend === 'up' ? <TrendingUp size={12} /> : 
                 item.trend === 'down' ? <TrendingDown size={12} /> : null}
                {item.change}%
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-black/5 rounded-2xl">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="opacity-40" />
                  <span className="text-sm font-bold">Local Market</span>
                </div>
                <span className="text-lg font-black">{item.local.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-black/5 rounded-2xl">
                <div className="flex items-center gap-2">
                  <Globe size={16} className="opacity-40" />
                  <span className="text-sm font-bold">East Africa</span>
                </div>
                <span className="text-lg font-black">{item.regional.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-[#5A5A40] text-white rounded-2xl">
                <div className="flex items-center gap-2">
                  <Globe size={16} className="opacity-60" />
                  <span className="text-sm font-bold">International</span>
                </div>
                <span className="text-lg font-black">{item.international.toLocaleString()}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Price Trends Chart */}
      <section className="bg-white p-8 rounded-[3rem] shadow-2xl border border-black/5">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Maize Price Trends</h2>
          <select className="bg-black/5 p-2 rounded-xl text-xs font-bold outline-none">
            <option>Last 6 Months</option>
            <option>Last Year</option>
          </select>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#00000010" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fontWeight: 600, fill: '#00000040' }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fontWeight: 600, fill: '#00000040' }}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#5A5A40" 
                strokeWidth={4} 
                dot={{ r: 6, fill: '#5A5A40', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};
