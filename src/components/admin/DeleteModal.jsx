import { HiOutlineExclamationTriangle, HiOutlineTrash } from "react-icons/hi2";

import Button from "../ui/Button";

export default function DeleteModal({
  isOpen,
  title = "Delete Item",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  onCancel,
  onConfirm,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}

        <div className="flex flex-col items-center border-b border-slate-100 px-8 py-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <HiOutlineTrash className="text-red-600" size={38} />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-slate-900">{title}</h2>

          <p className="mt-3 text-center text-slate-500 leading-6">{message}</p>
        </div>

        {/* Warning */}

        <div className="mx-8 mt-6 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4">
          <HiOutlineExclamationTriangle
            className="mt-0.5 text-red-500"
            size={22}
          />

          <div>
            <p className="text-sm font-semibold text-red-700">Warning</p>

            <p className="mt-1 text-sm text-red-600">
              This action is permanent and cannot be undone.
            </p>
          </div>
        </div>

        {/* Buttons */}

        <div className="flex justify-end gap-3 px-8 py-8">
          <Button variant="secondary" onClick={onCancel} className="px-6">
            Cancel
          </Button>

          <Button
            variant="danger"
            onClick={onConfirm}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6"
          >
            <HiOutlineTrash size={18} />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
