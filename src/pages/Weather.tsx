import React from 'react';
import { motion } from 'motion/react';
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets, MapPin } from 'lucide-react';

export const Weather: React.FC = () => {
  const forecast = [
    { day: 'Mon', temp: 28, condition: 'Sunny', icon: Sun, rain: 5 },
    { day: 'Tue', temp: 26, condition: 'Partly Cloudy', icon: Cloud, rain: 15 },
    { day: 'Wed', temp: 24, condition: 'Light Rain', icon: CloudRain, rain: 65 },
    { day: 'Thu', temp: 27, condition: 'Sunny', icon: Sun, rain: 10 },
    { day: 'Fri', temp: 25, condition: 'Cloudy', icon: Cloud, rain: 20 },
    { day: 'Sat', temp: 23, condition: 'Storms', icon: CloudRain, rain: 80 },
    { day: 'Sun', temp: 26, condition: 'Sunny', icon: Sun, rain: 5 },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-black tracking-tight">Weather Monitoring</h1>
        <p className="text-black/40 font-medium flex items-center gap-2">
          <MapPin size={16} /> Central Region, Uganda
        </p>
      </header>

      {/* Current Weather */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#5A5A40] to-[#3A3A20] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden"
      >
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <div className="text-8xl font-black mb-2">28°</div>
            <div className="text-2xl font-bold opacity-80">Sunny Day</div>
            <div className="text-sm opacity-60 mt-1">Feels like 30°C • High 31° • Low 19°</div>
          </div>
          
          <div className="flex gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Droplets size={24} />
              </div>
              <div className="text-xl font-bold">12%</div>
              <div className="text-[10px] uppercase tracking-widest font-bold opacity-60">Humidity</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Wind size={24} />
              </div>
              <div className="text-xl font-bold">8 km/h</div>
              <div className="text-[10px] uppercase tracking-widest font-bold opacity-60">Wind</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Droplets size={24} />
              </div>
              <div className="text-xl font-bold">5%</div>
              <div className="text-[10px] uppercase tracking-widest font-bold opacity-60">Rain</div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
      </motion.div>

      {/* Forecast */}
      <section className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-black/5">
        <h2 className="text-2xl font-bold mb-8">7-Day Forecast</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          {forecast.map((day, i) => (
            <motion.div 
              key={day.day}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="p-6 rounded-3xl bg-black/5 flex flex-col items-center gap-3 hover:bg-[#5A5A40] hover:text-white transition-all cursor-default group"
            >
              <span className="text-xs font-bold uppercase tracking-widest opacity-40 group-hover:opacity-70">{day.day}</span>
              <day.icon size={32} className="text-[#5A5A40] group-hover:text-white" />
              <span className="text-2xl font-black">{day.temp}°</span>
              <div className="flex items-center gap-1 text-[10px] font-bold">
                <Droplets size={10} />
                {day.rain}%
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Agricultural Alerts */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-orange-50 p-8 rounded-[2rem] border border-orange-100">
          <h3 className="text-orange-800 font-bold text-lg mb-2 flex items-center gap-2">
            <Sun size={20} /> Drought Warning
          </h3>
          <p className="text-orange-700/80 text-sm">
            Extended dry spell expected in the next 2 weeks. Ensure irrigation systems are ready and mulch your crops to retain moisture.
          </p>
        </div>
        <div className="bg-blue-50 p-8 rounded-[2rem] border border-blue-100">
          <h3 className="text-blue-800 font-bold text-lg mb-2 flex items-center gap-2">
            <CloudRain size={20} /> Planting Window
          </h3>
          <p className="text-blue-700/80 text-sm">
            Optimal rainfall predicted for Wednesday. Good time for planting maize and beans in the Central region.
          </p>
        </div>
      </section>
    </div>
  );
};
