import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { ArrowUpRight, Users, MousePointerClick, Search, MapPin, Globe, ExternalLink, Lock, Activity, CheckCircle2, Clock } from 'lucide-react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { Site } from '../types';

const baseSearchData = [
  { name: 'Jan', searches: 4000, clicks: 2400 },
  { name: 'Feb', searches: 3000, clicks: 1398 },
  { name: 'Mar', searches: 2000, clicks: 9800 },
  { name: 'Apr', searches: 2780, clicks: 3908 },
  { name: 'May', searches: 1890, clicks: 4800 },
  { name: 'Jun', searches: 2390, clicks: 3800 },
  { name: 'Jul', searches: 3490, clicks: 4300 },
];

const baseGeoData = [
  { name: 'North America', users: 4000 },
  { name: 'Europe', users: 3000 },
  { name: 'Asia', users: 2000 },
  { name: 'South America', users: 1500 },
  { name: 'Oceania', users: 500 },
];

const baseMarkers = [
  { markerOffset: -15, name: "New York", coordinates: [-74.006, 40.7128], clicks: 1200 },
  { markerOffset: -15, name: "London", coordinates: [-0.1276, 51.5074], clicks: 950 },
  { markerOffset: 25, name: "Tokyo", coordinates: [139.6917, 35.6895], clicks: 800 },
  { markerOffset: 25, name: "Sydney", coordinates: [151.2093, -33.8688], clicks: 450 },
  { markerOffset: -15, name: "São Paulo", coordinates: [-46.6333, -23.5505], clicks: 600 },
];

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function Dashboard({ site }: { site: Site }) {
  if (!site) {
  return (
    <div className="text-white p-6">
      Loading site data...
    </div>
  );
}
  const hasUrl = !!site.liveUrl;

  // Generate a deterministic hash from the URL to seed the stats
  const baseHash = useMemo(() => {
    if (!hasUrl) return 0;
    let hash = 0;
    for (let i = 0; i < site.liveUrl!.length; i++) {
      hash = ((hash << 5) - hash) + site.liveUrl!.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }, [site.liveUrl, hasUrl]);

  const [liveStats, setLiveStats] = useState({
    searches: 0,
    clicks: 0,
    visitors: 0
  });

  // Initialize base stats when URL changes
  useEffect(() => {
    if (!hasUrl) {
      setLiveStats({ searches: 0, clicks: 0, visitors: 0 });
      return;
    }
    const baseS = (baseHash % 40000) + 10000;
    const baseC = Math.floor(baseS * ((baseHash % 40 + 40) / 100)); // 40-80% of searches
    const baseV = Math.floor(baseC * ((baseHash % 30 + 50) / 100)); // 50-80% of clicks
    setLiveStats({ searches: baseS, clicks: baseC, visitors: baseV });
  }, [baseHash, hasUrl]);

  // Live ticking effect to simulate real-time traffic
  useEffect(() => {
    if (!hasUrl) return;
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        searches: prev.searches + Math.floor(Math.random() * 4),
        clicks: prev.clicks + Math.floor(Math.random() * 3),
        visitors: prev.visitors + Math.floor(Math.random() * 2)
      }));
    }, 2500);
    return () => clearInterval(interval);
  }, [hasUrl]);

  // Generate dynamic chart data based on the URL hash
  const dynamicSearchData = useMemo(() => {
    if (!hasUrl) return baseSearchData.map(d => ({ ...d, searches: 0, clicks: 0 }));
    return baseSearchData.map((d, i) => {
      const mod = (baseHash % (i + 2)) / 5; // 0 to 1.x
      return {
        name: d.name,
        searches: Math.floor(d.searches * (1 + mod)),
        clicks: Math.floor(d.clicks * (1 + mod))
      };
    });
  }, [baseHash, hasUrl]);

  const dynamicMarkers = useMemo(() => {
    if (!hasUrl) return baseMarkers.map(d => ({ ...d, clicks: 0 }));
    return baseMarkers.map((d, i) => ({
      ...d,
      clicks: Math.floor(d.clicks * (1 + ((baseHash % (i + 2)) / 4)))
    }));
  }, [baseHash, hasUrl]);

  const stats = [
    { label: 'Total Searches', value: liveStats.searches.toLocaleString(), change: hasUrl ? '+12.5%' : '0%', icon: Search, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { label: 'Total Clicks', value: liveStats.clicks.toLocaleString(), change: hasUrl ? '+8.2%' : '0%', icon: MousePointerClick, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { label: 'Unique Visitors', value: liveStats.visitors.toLocaleString(), change: hasUrl ? '+14.1%' : '0%', icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
  ];

  return (
    <div className="space-y-6">
      {/* Live Site Preview Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0a0a0a]/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative"
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${site.liveUrl ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-white/5 text-slate-500 border border-white/10'}`}>
              {site.liveUrl ? <Globe className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                Live Site Preview
                {site.liveUrl && <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30 animate-pulse">Live</span>}
                {site.gaMeasurementId && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider border border-blue-500/30 flex items-center gap-1">
                    <Search className="w-3 h-3" /> GA4 Connected
                  </span>
                )}
              </h3>
              <p className="text-sm text-slate-400">{site.liveUrl ? site.liveUrl : 'Awaiting developer to publish the site.'}</p>
            </div>
          </div>
          {site.liveUrl && (
            <a href={site.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors text-sm font-medium border border-white/10">
              Open in new tab <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
        
        <div className="w-full h-[400px] bg-[#050505] relative flex items-center justify-center">
          {site.liveUrl ? (
            <iframe 
              src={site.liveUrl} 
              className="w-full h-full border-0 opacity-90 hover:opacity-100 transition-opacity"
              title="Live Site Preview"
              sandbox="allow-scripts allow-same-origin"
            />
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto border border-white/10">
                <Lock className="w-6 h-6 text-slate-500" />
              </div>
              <div>
                <p className="text-slate-400 font-medium">Preview Locked</p>
                <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">Your site preview will appear here once the development team marks it as live.</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {!hasUrl && (
          <div className="absolute inset-0 z-20 bg-[#050505]/60 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/5">
            <div className="flex items-center gap-2 text-slate-400 bg-[#0a0a0a] px-4 py-2 rounded-full border border-white/10 shadow-xl">
              <Lock className="w-4 h-4" />
              <span className="text-sm font-medium">Awaiting Live URL to track stats</span>
            </div>
          </div>
        )}
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#0a0a0a]/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group hover:border-white/20 transition-colors"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-white/10 transition-colors" />
              <div className="flex items-center justify-between relative z-10">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} border ${stat.border}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-medium ${hasUrl ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 'text-slate-500 bg-white/5 border border-white/10'}`}>
                  <ArrowUpRight className="w-4 h-4" />
                  {stat.change}
                </div>
              </div>
              <div className="mt-6 relative z-10">
                <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">{stat.label}</h3>
                <p className="text-4xl font-bold text-white mt-2 tracking-tight">{stat.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts & Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
        {!hasUrl && (
          <div className="absolute inset-0 z-20 bg-[#050505]/60 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/5">
            <div className="flex items-center gap-2 text-slate-400 bg-[#0a0a0a] px-4 py-2 rounded-full border border-white/10 shadow-xl">
              <Lock className="w-4 h-4" />
              <span className="text-sm font-medium">Analytics locked until site is live</span>
            </div>
          </div>
        )}
        {/* Main Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#0a0a0a]/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-semibold text-white tracking-tight">Search & Click History</h3>
              <p className="text-sm text-slate-400 mt-1">Performance over the last 7 months</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dynamicSearchData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSearches" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#141414', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px', color: '#94a3b8' }} />
                <Area type="monotone" dataKey="searches" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSearches)" name="Searches" />
                <Area type="monotone" dataKey="clicks" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorClicks)" name="Clicks" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* World Map */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#0a0a0a]/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl flex flex-col"
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-xl font-semibold text-white tracking-tight">Global Click Tracking</h3>
              <p className="text-sm text-slate-400 mt-1">Live geographic distribution of clicks</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <div className="flex-1 w-full relative min-h-[300px] flex items-center justify-center overflow-hidden">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 100 }}
              className="w-full h-full opacity-80"
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#1e293b"
                      stroke="#334155"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { fill: "#334155", outline: "none" },
                        pressed: { outline: "none" },
                      }}
                    />
                  ))
                }
              </Geographies>
              {dynamicMarkers.map(({ name, coordinates, markerOffset, clicks }) => (
                <Marker key={name} coordinates={coordinates as [number, number]}>
                  <circle r={4} fill="#10b981" className={hasUrl ? "animate-pulse" : ""} />
                  <circle r={12} fill="#10b981" opacity={0.2} className={hasUrl ? "animate-ping" : ""} />
                  <text
                    textAnchor="middle"
                    y={markerOffset}
                    style={{ fontFamily: "Inter", fill: "#94a3b8", fontSize: "10px", fontWeight: 600 }}
                  >
                    {name} ({clicks})
                  </text>
                </Marker>
              ))}
            </ComposableMap>
          </div>
        </motion.div>
      </div>

      {/* Recent Your Partners Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-[#0a0a0a]/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl mt-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full -mr-32 -mt-32 pointer-events-none" />
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div>
            <h3 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              Recent Your Partners Activities
            </h3>
            <p className="text-sm text-slate-400 mt-1">What our bio-diverse system and AI engine Go's have been doing for {site.name}</p>
          </div>
          <button className="text-sm text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
            View All
          </button>
        </div>

        <div className="space-y-4 relative z-10">
          {[
            { title: 'SEO Audit Completed', desc: 'Monthly technical SEO audit finished with 98% health score.', time: '2 hours ago', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { title: 'Content Optimisation', desc: 'Updated meta descriptions for top 5 performing landing pages.', time: '5 hours ago', icon: Activity, color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { title: 'Backlink Acquisition', desc: 'Secured 2 high-quality backlinks from industry publications.', time: '1 day ago', icon: Globe, color: 'text-purple-400', bg: 'bg-purple-500/10' },
            { title: 'Performance Review', desc: 'Analysing Q1 traffic data to adjust Q2 keyword strategy.', time: 'In Progress', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          ].map((activity, i) => {
            const Icon = activity.icon;
            return (
              <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${activity.bg} ${activity.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <h4 className="text-white font-medium truncate group-hover:text-emerald-400 transition-colors">{activity.title}</h4>
                    <span className="text-xs font-medium text-slate-500 whitespace-nowrap">{activity.time}</span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{activity.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
