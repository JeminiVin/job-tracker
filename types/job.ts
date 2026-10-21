export type JobStatus = 'Applied' | 'Interviewing' | 'Offer' | 'Rejected';

export interface Job {
  id: string;
  companyName: string;
  role: string;
  location: string;
  status: JobStatus;
  appliedDate: string;
  salary: string; // <-- Remove optional '?' if it was salary?: string
  matchScore: number;
}