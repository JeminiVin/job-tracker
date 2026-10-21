'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Job, JobStatus } from '@/types/job';
import { HeroSection } from './components/HeroSection';
import { AddJobModal } from './components/AddJobModal';
import { KanbanBoard } from './components/KanbanBoard';
import { 
  Search, 
  Plus, 
  ArrowRight, 
  Trash2, 
  Download, 
  Upload, 
  FileSpreadsheet 
} from 'lucide-react';
import { DropResult } from '@hello-pangea/dnd';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'home' | 'app'>('home');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dashboardView, setDashboardView] = useState<'board' | 'table'>('board');
  const [isLoading, setIsLoading] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Fetch Jobs from Prisma Database API
  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/jobs');
      const data = await res.json();
      if (Array.isArray(data)) {
        setJobs(data);
      }
    } catch (err) {
      console.error('Failed to fetch jobs from database', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // 2. Drag & Drop Status Update API Call
  const handleOnDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId as JobStatus;

    // Optimistic UI Update
    setJobs((prevJobs) =>
      prevJobs.map((job) => (job.id === draggableId ? { ...job, status: newStatus } : job))
    );

    // Call Backend API
    try {
      await fetch('/api/jobs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: draggableId, status: newStatus }),
      });
    } catch (err) {
      console.error('Failed to update status in database', err);
      fetchJobs(); // Revert on failure
    }
  };

  // 3. Add Job API Call
  const handleAddJob = async (newJob: Job) => {
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJob),
      });
      const savedJob = await res.json();
      setJobs((prevJobs) => [savedJob, ...prevJobs]);
    } catch (err) {
      console.error('Failed to save job to database', err);
    }
  };

  // 4. Delete Job API Call
  const handleDeleteJob = async (id: string) => {
    // Optimistic UI Update
    setJobs((prevJobs) => prevJobs.filter((job) => job.id !== id));

    try {
      await fetch(`/api/jobs?id=${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.error('Failed to delete job from database', err);
      fetchJobs(); // Revert on failure
    }
  };

  const handleExportCSV = () => {
    if (jobs.length === 0) return alert('No jobs to export!');
    const headers = ['ID', 'Role', 'Company Name', 'Location', 'Status', 'Date Applied', 'Salary', 'Match Score (%)'];
    const csvRows = [
      headers.join(','),
      ...jobs.map((job) => [
        `"${job.id}"`,
        `"${(job.role || '').replace(/"/g, '""')}"`,
        `"${(job.companyName || '').replace(/"/g, '""')}"`,
        `"${(job.location || '').replace(/"/g, '""')}"`,
        `"${job.status}"`,
        `"${job.appliedDate}"`,
        `"${(job.salary || 'Negotiable').replace(/"/g, '""')}"`,
        `"${job.matchScore}"`,
      ].join(',')),
    ];
    const link = document.createElement('a');
    link.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvRows.join('\n'));
    link.download = `trackflow_applications_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleExportBackup = () => {
    const link = document.createElement('a');
    link.href = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(jobs, null, 2))}`;
    link.download = `trackflow_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target?.result as string);
        if (Array.isArray(importedData)) {
          setJobs(importedData);
          alert('Data imported successfully!');
        }
      } catch (err) {
        alert('Invalid JSON file!');
      }
    };
    reader.readAsText(file);
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.role.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || job.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [jobs, searchQuery, statusFilter]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-amber-400 selection:text-slate-950">
      <HeroSection activeTab={activeTab} setActiveTab={setActiveTab} onOpenModal={() => setIsModalOpen(true)} />

      {activeTab === 'home' ? (
        <div className="bg-white py-16 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-6 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {['Who We Help', 'Brands', 'Retailers'].map((title, i) => (
                <div key={i} className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-xl transition-all text-left space-y-4 hover:-translate-y-1 group">
                  <h3 className="text-2xl font-black uppercase text-slate-900 tracking-wider">{title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Purpose-built software platform to deliver superior digital marketing campaigns for job seekers and tech professionals worldwide.
                  </p>
                  <button onClick={() => setActiveTab('app')} className="text-xs font-black uppercase text-[#D83B68] hover:underline flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Explore Platform <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900">Application Pipeline</h1>
              <p className="text-xs text-slate-500 mt-1">Manage active pitches, client responses, and interview schedules.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button onClick={handleExportCSV} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-md font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 border border-slate-300">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Export CSV
              </button>
              <button onClick={handleExportBackup} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-md font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 border border-slate-300">
                <Download className="w-4 h-4 text-blue-600" /> Backup
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-md font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 border border-slate-300">
                <Upload className="w-4 h-4 text-amber-600" /> Restore
              </button>
              <input type="file" ref={fileInputRef} onChange={handleImportJSON} accept=".json" className="hidden" />

              <div className="bg-slate-100 p-1 rounded-lg flex items-center border border-slate-200">
                <button onClick={() => setDashboardView('board')} className={`px-3.5 py-1.5 rounded-md text-xs font-bold uppercase ${dashboardView === 'board' ? 'bg-[#D83B68] text-white shadow' : 'text-slate-600'}`}>Board</button>
                <button onClick={() => setDashboardView('table')} className={`px-3.5 py-1.5 rounded-md text-xs font-bold uppercase ${dashboardView === 'table' ? 'bg-[#D83B68] text-white shadow' : 'text-slate-600'}`}>Table</button>
              </div>

              <button onClick={() => setIsModalOpen(true)} className="bg-[#F59E0B] hover:bg-amber-400 text-slate-950 px-5 py-2 rounded-md font-black text-xs uppercase tracking-wider shadow flex items-center gap-1">
                <Plus className="w-4 h-4" /> Add Job
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm"><div className="text-xs font-bold uppercase text-slate-500">Total Apps</div><div className="text-3xl font-black text-slate-900 mt-1">{jobs.length}</div></div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm"><div className="text-xs font-bold uppercase text-amber-600">Interviewing</div><div className="text-3xl font-black text-amber-600 mt-1">{jobs.filter((j) => j.status === 'Interviewing').length}</div></div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm"><div className="text-xs font-bold uppercase text-emerald-600">Offers</div><div className="text-3xl font-black text-emerald-600 mt-1">{jobs.filter((j) => j.status === 'Offer').length}</div></div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm"><div className="text-xs font-bold uppercase text-[#D83B68]">Avg AI Match</div><div className="text-3xl font-black text-[#D83B68] mt-1">94%</div></div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search role or company..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#D83B68]" />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
              {['All', 'Applied', 'Interviewing', 'Offer', 'Rejected'].map((status) => (
                <button key={status} onClick={() => setStatusFilter(status)} className={`px-3.5 py-1.5 rounded-md text-xs font-bold uppercase ${statusFilter === status ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {status}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-16 text-xs font-bold uppercase text-slate-400">Loading Database Applications...</div>
          ) : dashboardView === 'board' ? (
            <KanbanBoard jobs={filteredJobs} onStatusChange={handleOnDragEnd} onDeleteJob={handleDeleteJob} />
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase text-slate-500">
                    <th className="p-4">Company & Role</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Date Applied</th>
                    <th className="p-4">Salary</th>
                    <th className="p-4">AI Score</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium">
                  {filteredJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50">
                      <td className="p-4"><div className="font-bold text-slate-900">{job.role}</div><div className="text-slate-500 text-[11px]">{job.companyName}</div></td>
                      <td className="p-4 text-slate-600">{job.location}</td>
                      <td className="p-4 text-slate-500">{job.appliedDate}</td>
                      <td className="p-4 font-bold text-slate-900">{job.salary}</td>
                      <td className="p-4"><span className="font-bold text-[#D83B68] bg-rose-50 px-2 py-1 rounded border border-rose-200">{job.matchScore}%</span></td>
                      <td className="p-4"><span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase bg-slate-100 border border-slate-200">{job.status}</span></td>
                      <td className="p-4 text-right">
                        <button onClick={() => handleDeleteJob(job.id)} className="text-slate-400 hover:text-rose-600 p-1"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <AddJobModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddJob={handleAddJob} />
    </div>
  );
}