// src/Components/StatusProgressModal.jsx
import React, { useEffect, useState } from 'react';
import {
  X,
  XCircle,
  Send,
  Users,
  CalendarDays,
  Award,
  XOctagon,
  Ghost,
  AlertTriangle,
  LoaderCircle
} from 'lucide-react';

const steps = [
  { status: 'Applied', icon: Send, label: 'Applied' },
  { status: 'Screening', icon: Users, label: 'Screening' },
  { status: 'Interview', icon: CalendarDays, label: 'Interview' },
  { status: 'Offer', icon: Award, label: 'Offer' }
];

const terminalOutcomes = [
  { status: 'Rejected', icon: XOctagon, label: 'Mark as Rejected', color: 'text-red-600', hover: 'hover:bg-red-50' },
  { status: 'Ghosted', icon: Ghost, label: 'Mark as Ghosted', color: 'text-purple-600', hover: 'hover:bg-purple-50' }
];

export default function StatusProgressModal({ job, onClose, onUpdate }) {
  const [pendingStatus, setPendingStatus] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setPendingStatus(job?.status || null);
    setShowConfirm(false);
    setIsSaving(false);
  }, [job]);

  if (!job) return null;

  const currentStepIndex = steps.findIndex(step => step.status === job.status);
  const handleApplyStatus = (newStatus) => {
    if (newStatus !== job.status && !isSaving) {
      setPendingStatus(newStatus);
      setShowConfirm(true);
    }
  };

  const confirmStatusChange = async () => {
    if (!pendingStatus || isSaving) return;
    setIsSaving(true);
    try {
      await onUpdate(pendingStatus);
      setShowConfirm(false);
    } catch (error) {
      // Keep the dialog open so the user can retry if the request fails.
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-slate-800 px-4 py-4 text-white sm:px-6 sm:py-5">
          <div className="min-w-0">
            <h3 className="text-lg font-bold sm:text-xl">Edit Application Status</h3>
            <p className="mt-1 break-words text-sm text-gray-300">{job.company} — {job.role}</p>
          </div>
          <button onClick={onClose} aria-label="Close status editor" className="shrink-0 rounded-lg p-1 text-gray-300 transition-colors hover:bg-white/10 hover:text-white">
            <XCircle size={24} />
          </button>
        </div>

        <div className="space-y-7 p-4 sm:space-y-10 sm:p-8">
          <section className="space-y-4">
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500">
              <AlertTriangle size={14} className="text-indigo-500" /> Hiring pipeline
            </h4>
            <div className="relative px-1 pt-3 sm:px-2 sm:pt-6">
              <div className="absolute left-2 right-2 top-[2.1rem] h-2 -translate-y-1/2 overflow-hidden rounded-full border border-gray-200 bg-gray-100 sm:left-4 sm:right-4 sm:top-[2.5rem]">
                <div
                  className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                  style={{ width: currentStepIndex >= 0 ? `${(currentStepIndex / (steps.length - 1)) * 100}%` : '0%' }}
                />
              </div>
              <div className="relative z-10 flex justify-between gap-1">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = index <= currentStepIndex;
                  const isUpcoming = index > currentStepIndex;
                  return (
                    <div key={step.status} className="flex min-w-0 flex-1 flex-col items-center gap-2 sm:gap-3">
                      <button
                        type="button"
                        onClick={() => handleApplyStatus(step.status)}
                        disabled={!isUpcoming || isSaving}
                        aria-label={`Set status to ${step.label}`}
                        aria-current={job.status === step.status ? 'step' : undefined}
                        className={`group relative flex h-10 w-10 items-center justify-center rounded-full border-4 transition-all sm:h-12 sm:w-12 ${
                          isCompleted ? 'border-indigo-200 bg-indigo-600 text-white' : 'border-gray-200 bg-gray-100 text-gray-500'
                        } ${isUpcoming ? 'cursor-pointer hover:scale-110 hover:border-indigo-400 hover:bg-white hover:text-indigo-600' : 'cursor-default'}`}
                      >
                        <Icon size={17} />
                        {isUpcoming && <span className="pointer-events-none absolute bottom-full mb-2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-[10px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">Move to {step.label}</span>}
                      </button>
                      <span className={`text-center text-[10px] font-bold sm:text-xs ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>{step.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <div className="border-t border-gray-100" />

          <section className="space-y-4">
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500">
              <X size={14} className="text-gray-400" /> Terminal outcomes
            </h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              {terminalOutcomes.map((outcome) => {
                const Icon = outcome.icon;
                const isCurrent = job.status === outcome.status;
                return (
                  <button
                    key={outcome.status}
                    type="button"
                    onClick={() => handleApplyStatus(outcome.status)}
                    disabled={isCurrent || isSaving}
                    className={`flex min-w-0 items-center gap-3 rounded-xl border p-3 text-left transition-all sm:gap-4 sm:p-5 ${
                      isCurrent ? 'cursor-not-allowed border-gray-200 bg-gray-100' : `border-gray-100 bg-gray-50/50 ${outcome.hover} hover:-translate-y-0.5 hover:shadow-lg`
                    }`}
                  >
                    <span className={`shrink-0 rounded-full border border-gray-100 bg-white p-2 shadow-inner sm:p-3 ${outcome.color}`}><Icon size={20} /></span>
                    <span className="min-w-0">
                      <span className={`block text-sm font-bold ${isCurrent ? 'text-gray-400' : 'text-gray-900'}`}>{outcome.label}</span>
                      <span className="mt-0.5 block text-xs text-gray-500">Application is finished</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <div className="flex justify-end border-t border-gray-100 px-4 py-4 sm:px-8 sm:py-5">
          <button onClick={onClose} className="rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-200">Cancel</button>
        </div>

        {showConfirm && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm sm:p-6" onClick={() => !isSaving && setShowConfirm(false)}>
            <div className="w-full max-w-md rounded-xl border border-gray-100 bg-white p-5 shadow-2xl sm:p-6" onClick={(event) => event.stopPropagation()}>
              <h5 className="text-lg font-bold text-gray-900">Confirm Status Change</h5>
              <p className="mt-3 break-words text-sm leading-relaxed text-gray-600">
                Do you really want to update <span className="font-semibold text-indigo-700">{job.company}</span> from <span className="font-semibold">{job.status}</span> to <span className="font-semibold text-pink-600">{pendingStatus}</span>?
              </p>
              <div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-gray-100 pt-5 sm:gap-3">
                <button onClick={() => setShowConfirm(false)} disabled={isSaving} className="rounded-lg px-4 py-2 text-sm font-bold text-gray-600 transition-colors hover:text-gray-900 disabled:opacity-50">No, Go Back</button>
                <button onClick={confirmStatusChange} disabled={isSaving} className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-bold text-white shadow-md transition-colors hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-70">
                  {isSaving && <LoaderCircle size={16} className="animate-spin" />}
                  {isSaving ? 'Saving...' : 'Yes, Apply Change'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
