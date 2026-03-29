import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Save, Building2, User, Mail, MapPin, CreditCard, Shield, CheckCircle2 } from 'lucide-react';
import { User as UserT } from '../global-states/slices/authSlice';

interface ProfileProps {
  currentClient?: UserT;
  // onUpdateClient: (client: Client) => void;
}

export default function Profile({ currentClient }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
 const [formData, setFormData] = useState({
  name: currentClient
    ? `${currentClient.firstname} ${currentClient.surname}`
    : '',

  email: currentClient?.email || '',

  companyName: currentClient?.companyName || '',
  companyNumber: currentClient?.companyNumber || '',

  addressLine1: currentClient?.addressLine1 || '',
  addressLine2: '', 

  city: currentClient?.city || '',
  county: currentClient?.county || '',
  postcode: currentClient?.postcode || '',
});
  const [showSuccess, setShowSuccess] = useState(false);

  if (!currentClient) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center">
        <h2 className="text-2xl font-bold text-white mb-3">Profile Not Found</h2>
        <p className="text-slate-400">Please log in again to view your profile.</p>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  const parts = formData.name.trim().split(" ");
  const firstname = parts[0] || "";
  const surname = parts.slice(1).join(" ");

  const updatedClient: UserT = {
    ...currentClient,

    firstname,
    surname,

    email: formData.email,

    companyName: formData.companyName,
    companyNumber: formData.companyNumber,

    addressLine1: formData.addressLine1,

    city: formData.city,
    county: formData.county,
    postcode: formData.postcode,
  };

  // onUpdateClient(updatedClient);

  setIsEditing(false);
  setShowSuccess(true);
  setTimeout(() => setShowSuccess(false), 3000);
};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-white tracking-tight">Your Profile</h2>
          <p className="text-slate-400 text-sm mt-1">Manage your personal and company information.</p>
        </div>
        {/* {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-medium transition-colors border border-white/10"
          >
            Edit Profile
          </button>
        )} */}
      </div>

      {showSuccess && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl flex items-center gap-2 text-sm"
        >
          <CheckCircle2 className="w-4 h-4" />
          Profile updated successfully
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 space-y-8">
            {/* Personal Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-400" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 disabled:opacity-50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 disabled:opacity-50 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="h-px bg-white/5" />

            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                Company Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 disabled:opacity-50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Company Number</label>
                  <input
                    type="text"
                    name="companyNumber"
                    value={formData.companyNumber}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 disabled:opacity-50 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="h-px bg-white/5" />

            {/* Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-400" />
                Billing Address
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Address Line 1</label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 disabled:opacity-50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Address Line 2 (Optional)</label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 disabled:opacity-50 transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 disabled:opacity-50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">County</label>
                    <input
                      type="text"
                      name="county"
                      value={formData.county}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 disabled:opacity-50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Postcode</label>
                    <input
                      type="text"
                      name="postcode"
                      value={formData.postcode}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 disabled:opacity-50 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    // Reset form data
                  setFormData({
  name: currentClient
    ? `${currentClient.firstname} ${currentClient.surname}`
    : '',

  email: currentClient?.email || '',

  companyName: currentClient?.companyName || '',
  companyNumber: currentClient?.companyNumber || '',

  addressLine1: currentClient?.addressLine1 || '',
  addressLine2: '', // not موجود in backend

  city: currentClient?.city || '',
  county: currentClient?.county || '',
  postcode: currentClient?.postcode || '',
});
                  }}
                  className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-sm font-medium transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Sidebar Cards */}
        {/* <div className="space-y-6">
          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
            <h3 className="text-lg font-medium text-white flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-emerald-400" />
              Payment Methods
            </h3>
            <div className="space-y-4">
              <div className="bg-[#141414] border border-white/10 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-6 bg-slate-800 rounded flex items-center justify-center text-xs font-bold text-white">
                    VISA
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">•••• 4242</p>
                    <p className="text-xs text-slate-500">Expires 12/28</p>
                  </div>
                </div>
                <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-md font-medium">Default</span>
              </div>
              <button className="w-full py-2.5 border border-dashed border-white/20 hover:border-emerald-500/50 hover:bg-emerald-500/5 rounded-xl text-sm text-slate-400 hover:text-emerald-400 transition-all flex items-center justify-center gap-2">
                <CreditCard className="w-4 h-4" />
                Add Payment Method
              </button>
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6">
            <h3 className="text-lg font-medium text-white flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-emerald-400" />
              Security
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Password</p>
                  <p className="text-xs text-slate-500">Last changed 3 months ago</p>
                </div>
                <button className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
                  Update
                </button>
              </div>
              <div className="h-px bg-white/5" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Two-Factor Auth</p>
                  <p className="text-xs text-slate-500">Not enabled</p>
                </div>
                <button className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
                  Enable
                </button>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
