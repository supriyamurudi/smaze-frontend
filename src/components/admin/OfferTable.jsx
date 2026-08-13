import { useState } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineEye,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineTag,
} from "react-icons/hi2";

import offers from "../../data/customer/offers";
import DeleteModal from "./DeleteModal";

export default function OfferTable() {
  const [selectedOffer, setSelectedOffer] = useState(null);

  const getStatusBadge = (status) => {
    const styles = {
      Active: "bg-green-100 text-green-700",
      Pending: "bg-yellow-100 text-yellow-700",
      Inactive: "bg-red-100 text-red-700",
    };

    return (
      <span
        className={`rounded-full px-3 py-1 text-xs font-semibold ${
          styles[status] || "bg-slate-100 text-slate-600"
        }`}
      >
        {status}
      </span>
    );
  };

  const handleDelete = () => {
    alert(`Deleted "${selectedOffer.title}"`);
    setSelectedOffer(null);
  };

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Offer
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Shop
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Category
                </th>

                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                  Original
                </th>

                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                  Offer Price
                </th>

                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                  Discount
                </th>

                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                  Valid Till
                </th>

                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                  Status
                </th>

                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {offers.map((offer) => (
                <tr
                  key={offer.id}
                  className="border-t border-slate-100 transition hover:bg-violet-50/40"
                >
                  {/* Offer */}

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100">
                        <HiOutlineTag size={24} className="text-violet-700" />
                      </div>

                      <div>
                        <h3 className="font-semibold text-slate-800">
                          {offer.title}
                        </h3>

                        <p className="text-sm text-slate-500">
                          ID : #{offer.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Shop */}

                  <td className="px-6 py-5 text-sm text-slate-700">
                    {offer.shop}
                  </td>

                  {/* Category */}

                  <td className="px-6 py-5">
                    <span className="rounded-lg bg-violet-100 px-3 py-2 text-sm font-medium text-violet-700">
                      {offer.category}
                    </span>
                  </td>

                  {/* Original Price */}

                  <td className="px-6 py-5 text-center text-slate-500 line-through">
                    ₹{offer.originalPrice}
                  </td>

                  {/* Offer Price */}

                  <td className="px-6 py-5 text-center">
                    <span className="font-bold text-emerald-600">
                      ₹{offer.offerPrice}
                    </span>
                  </td>

                  {/* Discount */}

                  <td className="px-6 py-5 text-center">
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                      {offer.discount}
                    </span>
                  </td>

                  {/* End Date */}

                  <td className="px-6 py-5 text-center text-sm text-slate-600">
                    {offer.endDate}
                  </td>

                  {/* Status */}

                  <td className="px-6 py-5 text-center">
                    {getStatusBadge(offer.status)}
                  </td>

                  {/* Actions */}

                  <td className="px-6 py-5">
                    <div className="flex justify-center gap-2">
                      <Link to={`/admin/offers/${offer.id}`}>
                        <button
                          title="View"
                          className="rounded-xl bg-blue-50 p-2.5 text-blue-600 transition hover:bg-blue-100"
                        >
                          <HiOutlineEye size={18} />
                        </button>
                      </Link>

                      <Link to={`/admin/offers/edit/${offer.id}`}>
                        <button
                          title="Edit"
                          className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 transition hover:bg-emerald-100"
                        >
                          <HiOutlinePencilSquare size={18} />
                        </button>
                      </Link>

                      <button
                        title="Delete"
                        onClick={() => setSelectedOffer(offer)}
                        className="rounded-xl bg-red-50 p-2.5 text-red-600 transition hover:bg-red-100"
                      >
                        <HiOutlineTrash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {offers.length === 0 && (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-500">
                    No offers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteModal
        isOpen={!!selectedOffer}
        title="Delete Offer"
        message={
          selectedOffer
            ? `Are you sure you want to delete "${selectedOffer.title}"?`
            : ""
        }
        onCancel={() => setSelectedOffer(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}
