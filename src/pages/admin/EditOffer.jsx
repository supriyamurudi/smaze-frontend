/* eslint-disable no-undef */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AddOffer from "./AddOffer";
import { getOfferById } from "../../services/adminService";

export default function EditOffer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const response = await getOfferById(id);

        // Extract data from response
        let data = response.data || response.offer || response;
        if (data.data) data = data.data;

        console.log("📦 Edit data loaded:", data);
        setEditData(data);
      } catch (error) {
        console.error("Error fetching offer:", error);
        toast.error("Failed to load offer data");
        navigate("/admin/offers");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOffer();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent"></div>
              <p className="mt-4 text-slate-600">Loading offer data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!editData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
              <HiOutlineXCircle size={32} className="text-rose-600" />
            </div>
            <h2 className="text-xl font-bold text-rose-800">Offer Not Found</h2>
            <p className="mt-2 text-rose-600">
              The offer you're trying to edit doesn't exist.
            </p>
            <button
              onClick={() => navigate("/admin/offers")}
              className="mt-6 rounded-xl bg-rose-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-rose-700"
            >
              Back to Offers
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Pass the data to AddOffer component
  return <AddOffer editData={editData} />;
}
