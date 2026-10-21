'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { JobStatus, Job } from '@/types/job';

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddJob: (job: Job) => void;
}

export const AddJobModal: React.FC<AddJobModalProps> = ({ isOpen, onClose, onAddJob }) => {
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newSalary, setNewSalary] = useState('');
  const [newStatus, setNewStatus] = useState<JobStatus>('Applied');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany || !newRole) return;

    const newJobItem: Job = {
      id: Date.now().toString(),
      companyName: newCompany,
      role: newRole,
      location: newLocation || 'Remote',
      status: newStatus,
      appliedDate: new Date().toISOString().split('T')[0],
      salary: newSalary || 'Negotiable',
      matchScore: Math.floor(Math.random() * 15) + 85,
    };

    onAddJob(newJobItem);
    setNewCompany('');
    setNewRole('');
    setNewLocation('');
    setNewSalary('');
    setNewStatus('Applied');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl space-y-4 text-left border border-slate-200">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h2 className="text-base font-black uppercase text-slate-900">Add New Job Application</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
          <div>
            <label className="text-slate-600 block mb-1">Company Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Linear Technologies"
              value={newCompany}
              onChange={(e) => setNewCompany(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#D83B68]"
            />
          </div>

          <div>
            <label className="text-slate-600 block mb-1">Role Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Next.js Engineer"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#D83B68]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-600 block mb-1">Location</label>
              <input
                type="text"
                placeholder="Remote"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#D83B68]"
              />
            </div>
            <div>
              <label className="text-slate-600 block mb-1">Salary</label>
              <input
                type="text"
                placeholder="$120,000"
                value={newSalary}
                onChange={(e) => setNewSalary(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#D83B68]"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-600 block mb-1">Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as JobStatus)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-[#D83B68]"
            >
              <option value="Applied">Applied</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-500 font-bold uppercase"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#F59E0B] hover:bg-amber-400 text-slate-950 px-5 py-2 rounded-lg font-black uppercase shadow"
            >
              Save Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};