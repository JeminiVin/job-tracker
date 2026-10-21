'use client';

import React from 'react';
import { Job, JobStatus } from '@/types/job';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { GripVertical, Trash2 } from 'lucide-react';

interface KanbanBoardProps {
  jobs: Job[];
  onStatusChange: (result: DropResult) => void;
  onDeleteJob: (id: string) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ jobs, onStatusChange, onDeleteJob }) => {
  return (
    <DragDropContext onDragEnd={onStatusChange}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {(['Applied', 'Interviewing', 'Offer', 'Rejected'] as JobStatus[]).map((colStatus) => {
          const colJobs = jobs.filter((j) => j.status === colStatus);
          return (
            <Droppable key={colStatus} droppableId={colStatus}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`p-4 rounded-xl space-y-3 transition-colors ${
                    snapshot.isDraggingOver ? 'bg-rose-50/70 border-2 border-dashed border-[#D83B68]' : 'bg-slate-200/60'
                  }`}
                >
                  <div className="flex justify-between items-center pb-2 border-b border-slate-300">
                    <span className="text-xs font-black uppercase text-slate-700">{colStatus}</span>
                    <span className="text-[10px] font-extrabold bg-slate-300 text-slate-800 px-2 py-0.5 rounded">
                      {colJobs.length}
                    </span>
                  </div>

                  <div className="space-y-3 min-h-[150px]">
                    {colJobs.map((job, index) => (
                      <Draggable key={job.id} draggableId={job.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-3 text-left relative group transition-all ${
                              snapshot.isDragging ? 'shadow-2xl scale-105 border-[#D83B68] z-50' : 'hover:shadow-md'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div {...provided.dragHandleProps} className="text-slate-300 hover:text-slate-600 cursor-grab active:cursor-grabbing">
                                <GripVertical className="w-4 h-4" />
                              </div>
                              
                              <button
                                onClick={() => onDeleteJob(job.id)}
                                className="text-slate-300 hover:text-rose-600 transition-colors p-1"
                                title="Delete Application"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div>
                              <h4 className="font-extrabold text-slate-900 text-sm">{job.role}</h4>
                              <div className="text-xs text-slate-500 font-semibold mt-0.5">{job.companyName}</div>
                            </div>

                            <div className="flex justify-between text-[11px] text-slate-600 font-medium">
                              <span>{job.location}</span>
                              <span className="font-bold text-slate-900">{job.salary}</span>
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-[10px]">
                              <span className="text-slate-400">{job.appliedDate}</span>
                              <span className="font-bold text-[#D83B68] bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                                {job.matchScore}% Match
                              </span>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}

                    {colJobs.length === 0 && (
                      <div className="text-center py-8 text-xs text-slate-400 border border-dashed border-slate-300 rounded-lg">
                        Drag jobs here
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Droppable>
          );
        })}
      </div>
    </DragDropContext>
  );
};