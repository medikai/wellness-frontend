//src/components/Modal.tsx
"use client";
export default function Modal({ open, onRejoin, onClose }: { open: boolean; onRejoin: () => void; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 w-[320px]">
        <h3 className="text-lg font-semibold mb-2">Rejoin meeting</h3>
        <p className="text-sm text-gray-600 mb-4">Your call ended. You can rejoin the same room.</p>
        <div className="flex justify-end gap-2">
          <button className="px-3 py-1 rounded bg-[var(--neutral-light)] hover:bg-[var(--neutral-medium)]" onClick={onClose}>Close</button>
          <button className="px-3 py-1 rounded bg-[var(--primary)] text-white hover:bg-[var(--secondary)]" onClick={onRejoin}>Rejoin</button>
        </div>
      </div>
    </div>
  );
}
