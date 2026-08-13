import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// ✅ These icons exist in react-icons/hi2
import {
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlineIdentification,
  HiOutlinePhone,
  HiOutlineShieldCheck,
  HiOutlineArrowLeft,
  HiOutlineCalendar,
  HiOutlineCheckCircle,
  HiOutlineNoSymbol,
  HiOutlineTrash,
} from "react-icons/hi2";

// ✅ These icons exist in react-icons/hi (solid icons)
import { HiBan, HiRefresh } from "react-icons/hi";

import {
  getUserById,
  deleteUser,
  toggleUserStatus,
} from "../../services/adminService";

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    let ignore = false;

    const fetchUser = async () => {
      try {
        const res = await getUserById(id);

        if (!ignore) {
          setUser(res.user || null);
        }
      } catch (error) {
        if (!ignore) {
          toast.error(error.response?.data?.message || "Failed to load user");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchUser();

    return () => {
      ignore = true;
    };
  }, [id]);

  // Delete handler
  const handleDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete user "${user?.name}"? This action cannot be undone.`,
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteUser(id);
      toast.success("User deleted successfully");
      navigate("/admin/users");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

  // Toggle status handler (Block/Unblock)
  const handleToggleStatus = async () => {
    const action = user.status === "ACTIVE" ? "block" : "unblock";
    if (
      !window.confirm(
        `Are you sure you want to ${action} user "${user?.name}"?`,
      )
    ) {
      return;
    }

    setIsToggling(true);
    try {
      const response = await toggleUserStatus(id);
      setUser(response.user);
      toast.success(response.message || `User ${action}ed successfully`);
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${action} user`);
    } finally {
      setIsToggling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-violet-600 border-t-transparent"></div>
          <p className="font-semibold text-slate-600">
            Loading user details...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="rounded-3xl bg-red-50 px-10 py-8 text-center shadow">
          <h2 className="text-2xl font-bold text-red-600">User Not Found</h2>
          <p className="mt-2 text-slate-500">
            The requested user doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const details = [
    {
      label: "User ID",
      value: `#${user.userNumber || user.id}`,
      icon: <HiOutlineIdentification size={22} />,
    },
    {
      label: "Full Name",
      value: user.name || "N/A",
      icon: <HiOutlineUser size={22} />,
    },
    {
      label: "Email Address",
      value: user.email || "N/A",
      icon: <HiOutlineEnvelope size={22} />,
    },
    {
      label: "Phone Number",
      value: user.phone || "Not Available",
      icon: <HiOutlinePhone size={22} />,
    },
    {
      label: "Role",
      value: user.role?.replace("_", " ") || "N/A",
      icon: <HiOutlineShieldCheck size={22} />,
    },
    {
      label: "Joined Date",
      value: user.createdAt
        ? new Date(user.createdAt).toLocaleDateString()
        : "N/A",
      icon: <HiOutlineCalendar size={22} />,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-900">User Details</h1>
          <p className="mt-2 text-slate-500">
            View and manage complete information about this account.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold shadow hover:shadow-lg transition"
          >
            <HiOutlineArrowLeft />
            Back
          </Link>

          {/* Block/Unblock Button */}
          <button
            onClick={handleToggleStatus}
            disabled={isToggling}
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 font-semibold text-white shadow transition disabled:opacity-50 ${
              user.status === "ACTIVE"
                ? "bg-orange-600 hover:bg-orange-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isToggling ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                {user.status === "ACTIVE" ? "Blocking..." : "Unblocking..."}
              </>
            ) : (
              <>
                {user.status === "ACTIVE" ? (
                  <HiBan size={20} />
                ) : (
                  <HiRefresh size={20} />
                )}
                {user.status === "ACTIVE" ? "Block User" : "Unblock User"}
              </>
            )}
          </button>

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white shadow hover:bg-red-700 transition disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Deleting...
              </>
            ) : (
              <>
                <HiOutlineTrash size={20} />
                Delete User
              </>
            )}
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 shadow-2xl">
        <div className="bg-black/10 backdrop-blur-sm p-8 md:p-10">
          <div className="flex flex-col items-center gap-8 md:flex-row">
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white text-5xl font-bold text-violet-700 shadow-xl">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1 text-center md:text-left text-white">
              <h2 className="text-4xl font-bold">{user.name}</h2>
              <p className="mt-2 text-violet-100">{user.email}</p>

              <div className="mt-5 flex flex-wrap justify-center gap-3 md:justify-start">
                <span className="rounded-full bg-white/20 px-5 py-2 text-sm font-semibold backdrop-blur">
                  {user.role?.replace("_", " ")}
                </span>

                <span
                  className={`rounded-full px-5 py-2 text-sm font-semibold ${
                    user.status === "ACTIVE"
                      ? "bg-green-500"
                      : user.status === "BLOCKED"
                        ? "bg-red-500"
                        : "bg-gray-500"
                  }`}
                >
                  {user.status}
                </span>
              </div>
            </div>

            <div className="hidden lg:block">
              {user.status === "ACTIVE" ? (
                <HiOutlineCheckCircle className="text-green-300" size={70} />
              ) : (
                <HiOutlineNoSymbol className="text-red-300" size={70} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Information Cards */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {details.map((item) => (
          <div
            key={item.label}
            className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-violet-100 p-4 text-violet-700 transition group-hover:bg-violet-600 group-hover:text-white">
                {item.icon}
              </div>

              <div className="min-w-0">
                <p className="text-sm text-slate-500">{item.label}</p>
                <h3 className="mt-1 break-all text-lg font-bold text-slate-900">
                  {item.value}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Card */}
      <div className="rounded-3xl bg-white p-8 shadow-lg">
        <h3 className="mb-6 text-2xl font-bold text-slate-800">
          Account Summary
        </h3>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-violet-50 p-6">
            <p className="text-sm text-slate-500">Role</p>
            <h2 className="mt-2 text-2xl font-bold text-violet-700">
              {user.role?.replace("_", " ")}
            </h2>
          </div>

          <div className="rounded-2xl bg-green-50 p-6">
            <p className="text-sm text-slate-500">Status</p>
            <h2
              className={`mt-2 text-2xl font-bold ${
                user.status === "ACTIVE"
                  ? "text-green-600"
                  : user.status === "BLOCKED"
                    ? "text-red-600"
                    : "text-gray-600"
              }`}
            >
              {user.status}
            </h2>
          </div>

          <div className="rounded-2xl bg-blue-50 p-6">
            <p className="text-sm text-slate-500">Member Since</p>
            <h2 className="mt-2 text-2xl font-bold text-blue-700">
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "N/A"}
            </h2>
          </div>
        </div>

        {/* Additional Action Buttons */}
        <div className="mt-8 border-t border-slate-200 pt-8">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center gap-2 rounded-xl bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-200 transition disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete Account"}
            </button>

            <button
              onClick={handleToggleStatus}
              disabled={isToggling}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition disabled:opacity-50 ${
                user.status === "ACTIVE"
                  ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                  : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
            >
              {isToggling
                ? user.status === "ACTIVE"
                  ? "Blocking..."
                  : "Unblocking..."
                : user.status === "ACTIVE"
                  ? "Block Account"
                  : "Unblock Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
