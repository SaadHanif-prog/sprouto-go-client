import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Zap, Shield, Globe, ArrowRight, Plus, Sparkles } from 'lucide-react';
import { Plan, Addon, mockPlans, mockAddons } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

const iconMap: Record<string, any> = {
  Globe,
  Shield,
  Zap
};

export default function Plans({ siteId }: { siteId: string }) {
  const [plans] = useLocalStorage<Plan[]>('sprouto_plans_v2', mockPlans);
  const [addons] = useLocalStorage<Addon[]>('sprouto_addons', mockAddons);
  const [isProcessing, setIsProcessing] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const handleCheckout = async (item: Plan | Addon) => {
    setIsProcessing(true);
    try {
      const storedEmail = window.localStorage.getItem('sprouto_client_email');
      const customerEmail = storedEmail ? JSON.parse(storedEmail) : 'client@example.com';

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{ name: item.name, price: item.price }],
          successUrl: window.location.origin + '?success=true',
          cancelUrl: window.location.origin,
          customerEmail: customerEmail,
          billingCycle: billingCycle
        })
      });
      
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to initiate checkout');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-white tracking-tight mb-4">Plans & Upgrades</h2>
        <p className="text-slate-400 mb-8">Enhance your current site with powerful add-ons, or purchase a new site package to expand your digital footprint.</p>
        
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-400'}`}>Monthly</span>
          <button 
            onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'annual' : 'monthly')}
            className="relative w-16 h-8 rounded-full bg-white/10 border border-white/20 transition-colors hover:border-emerald-500/50 focus:outline-none"
          >
            <motion.div 
              className="absolute top-1 left-1 w-6 h-6 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
              animate={{ x: billingCycle === 'annual' ? 32 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
          <span className={`text-sm font-medium flex items-center gap-2 ${billingCycle === 'annual' ? 'text-white' : 'text-slate-400'}`}>
            Annually <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Save 20%</span>
          </span>
        </div>
      </div>

      {/* Add-ons Section */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <Plus className="w-5 h-5 text-emerald-400" /> Available Add-ons for this Site
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {addons.map((addon, i) => {
            const Icon = iconMap[addon.icon] || Plus;
            return (
              <motion.div
                key={addon.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => handleCheckout(addon)}
                className="bg-[#0a0a0a]/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl hover:border-emerald-500/30 transition-colors group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 mb-6 group-hover:bg-emerald-500/10 transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">{addon.name}</h4>
                <p className="text-sm text-slate-400 mb-6 h-10">{addon.desc}</p>
                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold text-white">
                        £{billingCycle === 'annual' ? Math.round(addon.price * 12 * 0.8) : addon.price}
                      </span>
                      <span className="text-sm font-bold text-emerald-400">+VAT</span>
                      <span className="text-sm text-slate-400 font-normal">/{billingCycle === 'annual' ? 'yr' : 'mo'}</span>
                    </div>
                    <span className="text-xs text-slate-500 mt-0.5">Total inc. 20% UK VAT: £{Math.round((billingCycle === 'annual' ? addon.price * 12 * 0.8 : addon.price) * 1.2)}</span>
                  </div>
                  <button disabled={isProcessing} className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                    {isProcessing ? 'Processing...' : 'Add'} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* New Site Packages */}
      <div className="pt-8 border-t border-white/5">
        <h3 className="text-xl font-semibold text-white mb-6">Need another website?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className={`relative bg-[#0a0a0a]/80 backdrop-blur-xl p-8 rounded-3xl border ${pkg.popular ? 'border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.15)]' : 'border-white/10 shadow-2xl'} flex flex-col`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-[#050505] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              <h4 className="text-2xl font-bold text-white mb-2">{pkg.name}</h4>
              <div className="mb-8">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-bold text-white">
                    £{billingCycle === 'annual' ? Math.round(pkg.price * 12 * 0.8) : pkg.price}
                  </span>
                  <span className="text-2xl font-bold text-emerald-400">+VAT</span>
                  <span className="text-lg text-slate-400 font-normal ml-1">/{billingCycle === 'annual' ? 'yr' : 'mo'}</span>
                </div>
                <div className="text-sm text-slate-500 mt-2">Total inc. 20% UK VAT: £{Math.round((billingCycle === 'annual' ? pkg.price * 12 * 0.8 : pkg.price) * 1.2)}</div>
              </div>
              
              <ul className="space-y-4 mb-8 flex-1">
                {pkg.features.map(feature => (
                  <li key={feature} className="flex items-center gap-3 text-slate-300">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-emerald-400" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => handleCheckout(pkg)}
                disabled={isProcessing}
                className={`w-full py-4 rounded-xl font-semibold transition-all ${pkg.popular ? 'bg-emerald-500 hover:bg-emerald-400 text-[#050505] shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'}`}
              >
                {isProcessing ? 'Processing...' : 'Select Package'}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
