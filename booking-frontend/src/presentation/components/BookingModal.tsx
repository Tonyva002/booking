interface BookingModalProps {
  isOpen: boolean;
  title: string;
  description?: string;

  children: React.ReactNode;

  error?: string;
  isSubmitting?: boolean;

  confirmText?: string;

  onClose: () => void;
  onConfirm: () => void;
}

export const BookingModal = ({
  isOpen,
  title,
  description,
  children,
  error,
  isSubmitting,
  confirmText = "Confirm",
  onClose,
  onConfirm,
}: BookingModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border overflow-hidden">

        {/* HEADER */}
        <div className="px-6 py-5 border-b">
          <h2 className="text-lg font-semibold">{title}</h2>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>

        {/* CONTENT */}
        <div className="px-6 py-5 space-y-4">
          {children}

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded">
              {error}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose}>Cancel</button>

          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {isSubmitting ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};