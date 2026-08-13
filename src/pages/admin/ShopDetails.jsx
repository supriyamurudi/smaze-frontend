import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import {
  HiOutlineBuildingStorefront,
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineMapPin,
  HiOutlineTag,
  HiOutlineDocumentText,
  HiOutlineArrowLeft,
  HiOutlinePencilSquare,
  HiOutlineCalendar,
  HiOutlineSparkles,
  HiOutlineTrash,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
} from "react-icons/hi2";

import {
  getShopById,
  deleteShop,
  approveShop,
  rejectShop,
} from "../../services/adminService";

// ========== SKELETON LOADER ==========
const SkeletonLoader = () => (
  <div className="space-y-6">
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse"></div>
        <div className="mt-2 h-5 w-64 bg-slate-200 rounded animate-pulse"></div>
      </div>
      <div className="flex gap-3">
        <div className="h-12 w-24 bg-slate-200 rounded-xl animate-pulse"></div>
        <div className="h-12 w-28 bg-slate-200 rounded-xl animate-pulse"></div>
      </div>
    </div>
    <div className="rounded-3xl border bg-white p-8 shadow-sm">
      <div className="flex flex-col items-center gap-6 md:flex-row">
        <div className="h-28 w-28 rounded-3xl bg-slate-200 animate-pulse"></div>
        <div className="flex-1 space-y-3">
          <div className="h-8 w-48 bg-slate-200 rounded animate-pulse"></div>
          <div className="h-5 w-32 bg-slate-200 rounded animate-pulse"></div>
          <div className="h-8 w-24 bg-slate-200 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
    <div className="grid gap-5 md:grid-cols-2">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-slate-200 animate-pulse"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 w-20 bg-slate-200 rounded animate-pulse"></div>
              <div className="h-5 w-32 bg-slate-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
    <div className="rounded-3xl border bg-white p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="h-12 w-12 rounded-xl bg-slate-200 animate-pulse"></div>
        <div className="h-6 w-40 bg-slate-200 rounded animate-pulse"></div>
      </div>
      <div className="space-y-3">
        <div className="h-4 w-full bg-slate-200 rounded animate-pulse"></div>
        <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse"></div>
        <div className="h-4 w-1/2 bg-slate-200 rounded animate-pulse"></div>
      </div>
    </div>
    <div className="rounded-3xl border bg-white p-8 shadow-sm">
      <div className="h-6 w-48 bg-slate-200 rounded animate-pulse mb-6"></div>
      <div className="grid gap-6 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-16 bg-slate-200 rounded animate-pulse"></div>
            <div className="h-6 w-24 bg-slate-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ========== DETAIL CARD ==========
const DetailCard = ({ title, value, icon: Icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -4, scale: 1.02 }}
    className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl"
  >
    <div className="flex items-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 text-violet-700 transition-transform group-hover:scale-110">
        {Icon}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="mt-1 font-semibold text-slate-900">
          {value || "Not Available"}
        </p>
      </div>
    </div>
  </motion.div>
);

// ========== MAIN COMPONENT ==========
export default function ShopDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    let ignore = false;

    const fetchShop = async () => {
      try {
        console.log("Fetching shop with ID:", id);
        const response = await getShopById(id);
        console.log("Shop response:", response);

        if (!ignore) {
          setShop(response.shop);
        }
      } catch (error) {
        console.error("Error fetching shop:", error);
        if (!ignore) {
          toast.error(
            error.response?.data?.message || "Failed to load shop details",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchShop();
    } else {
      toast.error("Invalid shop ID");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
    }

    return () => {
      ignore = true;
    };
  }, [id]);

  // Approve handler
  const handleApprove = async () => {
    if (!shop) return;
    if (!window.confirm(`Are you sure you want to approve "${shop.name}"?`))
      return;

    try {
      setIsProcessing(true);
      await approveShop(shop.id);
      toast.success("Shop approved successfully!");
      // Refresh shop data
      const response = await getShopById(id);
      setShop(response.shop);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve shop");
    } finally {
      setIsProcessing(false);
    }
  };

  // Reject handler
  const handleReject = async () => {
    if (!shop) return;
    const reason = prompt("Please provide a reason for rejection:");
    if (reason === null) return;

    try {
      setIsProcessing(true);
      await rejectShop(shop.id, { reason });
      toast.success("Shop rejected");
      // Refresh shop data
      const response = await getShopById(id);
      setShop(response.shop);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject shop");
    } finally {
      setIsProcessing(false);
    }
  };

  // Delete handler
  const handleDelete = async () => {
    if (!shop) return;

    if (
      !window.confirm(
        `Are you sure you want to delete shop "${shop.name}"? This action cannot be undone.`,
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteShop(id);
      toast.success("Shop deleted successfully");
      navigate("/admin/shops");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete shop");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          <SkeletonLoader />
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-2xl border border-red-200 bg-red-50 px-8 py-6 text-center"
        >
          <div className="text-6xl mb-4">🏪</div>
          <h2 className="text-2xl font-bold text-red-600">Shop not found</h2>
          <p className="mt-2 text-slate-600">
            The shop you're looking for doesn't exist.
          </p>
          <Link to="/admin/shops" className="mt-4 inline-block">
            <button className="rounded-xl bg-violet-600 px-6 py-2.5 text-white hover:bg-violet-700">
              Back to Shops
            </button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const details = [
    {
      title: "Owner",
      value: shop.owner?.name || "Not Available",
      icon: <HiOutlineUser size={22} />,
    },
    {
      title: "Email",
      value: shop.owner?.email || "Not Available",
      icon: <HiOutlineEnvelope size={22} />,
    },
    {
      title: "Phone",
      value: shop.phone || "Not Available",
      icon: <HiOutlinePhone size={22} />,
    },
    {
      title: "Category",
      value: shop.category?.name || "Not Available",
      icon: <HiOutlineTag size={22} />,
    },
    {
      title: "City",
      value: shop.city || "Not Available",
      icon: <HiOutlineMapPin size={22} />,
    },
    {
      title: "Address",
      value: shop.address || "Not Available",
      icon: <HiOutlineMapPin size={22} />,
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      active: "bg-emerald-100 text-emerald-700",
      pending: "bg-amber-100 text-amber-700",
      inactive: "bg-red-100 text-red-700",
      rejected: "bg-rose-100 text-rose-700",
    };
    return colors[status?.toLowerCase()] || colors.pending;
  };

  const getStatusDot = (status) => {
    const colors = {
      active: "bg-emerald-500",
      pending: "bg-amber-500",
      inactive: "bg-red-500",
      rejected: "bg-rose-500",
    };
    return colors[status?.toLowerCase()] || colors.pending;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 p-4 sm:p-6 lg:p-8"
    >
      <div className="mx-auto max-w-6xl">
        {/* ========== HEADER ========== */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <div className="flex items-center gap-2">
              <HiOutlineBuildingStorefront
                className="text-violet-600"
                size={28}
              />
              <h1 className="text-3xl font-extrabold text-slate-900">
                Shop Details
              </h1>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              View complete information about the selected shop
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/admin/shops">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-5 py-2.5 font-medium text-slate-600 transition hover:bg-slate-50"
              >
                <HiOutlineArrowLeft size={18} />
                Back
              </motion.button>
            </Link>

            <Link to={`/admin/shops/edit/${shop.id}`}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-2.5 font-semibold text-white shadow-lg shadow-violet-200 transition hover:shadow-xl"
              >
                <HiOutlinePencilSquare size={18} />
                Edit Shop
              </motion.button>
            </Link>

            {/* Approval Actions - Only show for pending shops */}
            {shop.status === "pending" && (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleApprove}
                  disabled={isProcessing}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700 hover:shadow-xl disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <HiOutlineCheckCircle size={18} />
                      Approve Shop
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleReject}
                  disabled={isProcessing}
                  className="flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 font-semibold text-white shadow-lg shadow-rose-200 transition hover:bg-rose-700 hover:shadow-xl disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <HiOutlineXCircle size={18} />
                      Reject Shop
                    </>
                  )}
                </motion.button>
              </>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 font-semibold text-white shadow-lg shadow-red-200 transition hover:bg-red-700 hover:shadow-xl disabled:opacity-50"
            >
              {isDeleting ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <HiOutlineTrash size={18} />
                  Delete Shop
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* ========== PROFILE CARD ========== */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-700 via-purple-700 to-fuchsia-700 p-1"
        >
          <div className="rounded-3xl bg-white/95 backdrop-blur-sm p-8 transition hover:bg-white">
            <div className="flex flex-col items-center gap-6 md:flex-row">
              <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-100 to-purple-100 text-violet-700 shadow-lg">
                {shop.image ? (
                  <img
                    src={shop.image}
                    alt={shop.name}
                    className="h-24 w-24 rounded-2xl object-cover"
                  />
                ) : (
                  <HiOutlineBuildingStorefront size={56} />
                )}
              </div>

              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold text-slate-900">
                  {shop.name}
                </h2>
                <p className="mt-1 text-slate-500">
                  {shop.category?.name || "Uncategorized"}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3 justify-center md:justify-start">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold ${getStatusColor(shop.status)}`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${getStatusDot(shop.status)}`}
                    ></span>
                    {shop.status || "Pending"}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-4 py-2 text-sm font-medium text-violet-700">
                    <HiOutlineSparkles size={16} />
                    {shop._count?.offers || 0} Offers
                  </span>
                  {shop.rejectionReason && shop.status === "rejected" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-4 py-2 text-sm font-medium text-rose-700">
                      <HiOutlineXCircle size={16} />
                      Reason: {shop.rejectionReason}
                    </span>
                  )}
                  {shop.approvedAt && shop.status === "active" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700">
                      <HiOutlineCheckCircle size={16} />
                      Approved: {new Date(shop.approvedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ========== DETAILS GRID ========== */}
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {details.map((item, index) => (
            <DetailCard key={item.title} {...item} delay={0.2 + index * 0.05} />
          ))}
        </div>

        {/* ========== DESCRIPTION ========== */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
        >
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 text-violet-700">
              <HiOutlineDocumentText size={22} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Shop Description
            </h2>
          </div>
          <p className="leading-8 text-slate-600">
            {shop.description ||
              "No description has been added for this shop yet."}
          </p>
        </motion.div>

        {/* ========== ADDITIONAL INFORMATION ========== */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
        >
          <div className="mb-6 flex items-center gap-3">
            <HiOutlineCalendar className="text-violet-600" size={22} />
            <h2 className="text-xl font-bold text-slate-900">
              Additional Information
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <p className="text-sm font-medium text-slate-500">Shop ID</p>
              <p className="mt-2 text-lg font-bold text-slate-900">{shop.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Created On</p>
              <p className="mt-2 text-lg font-bold text-slate-900">
                {new Date(shop.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">
                Offers Available
              </p>
              <p className="mt-2 text-lg font-bold text-violet-600">
                {shop._count?.offers || 0}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
