import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  HiOutlineEye,
  HiOutlineTrash,
  HiOutlineUser,
  HiOutlineNoSymbol,
  HiOutlineCheckCircle,
  HiOutlineEnvelope,
  HiOutlineCalendarDays,
} from "react-icons/hi2";

import DeleteModal from "./DeleteModal";

import { deleteUser, toggleUserStatus } from "../../services/adminService";

export default function UserTable({ users, onRefresh }) {
  const [selectedUser, setSelectedUser] = useState(null);

  const removeUser = async () => {
    if (!selectedUser) return;

    try {
      await deleteUser(selectedUser.id);

      toast.success("User deleted successfully");

      setSelectedUser(null);

      await onRefresh();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const changeUserStatus = async (user) => {
    try {
      await toggleUserStatus(user.id);

      toast.success(
        user.status === "BLOCKED"
          ? "User unblocked successfully"
          : "User blocked successfully",
      );

      await onRefresh();
    } catch (error) {
      toast.error(error.response?.data?.message || "Status update failed");
    }
  };

  const roleStyle = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 text-purple-700";

      case "SHOP_OWNER":
        return "bg-blue-100 text-blue-700";

      case "CUSTOMER":
        return "bg-emerald-100 text-emerald-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const statusStyle = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700";

      case "BLOCKED":
        return "bg-red-100 text-red-700";

      case "DELETED":
        return "bg-gray-200 text-gray-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <>
      {/* Desktop Table */}

      <div className="hidden lg:block overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
              <tr>
                <th className="px-6 py-5 text-left">User</th>

                <th className="px-6 py-5 text-left">Email</th>

                <th className="px-6 py-5 text-left">Role</th>

                <th className="px-6 py-5 text-left">Status</th>

                <th className="px-6 py-5 text-left">Joined</th>

                <th className="px-6 py-5 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b hover:bg-violet-50 transition duration-200"
                  >
                    {/* User */}

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-xl font-bold text-white shadow-lg">
                          {user.name ? (
                            user.name.charAt(0).toUpperCase()
                          ) : (
                            <HiOutlineUser />
                          )}
                        </div>

                        <div>
                          <h3 className="font-semibold text-slate-900">
                            {user.name}
                          </h3>

                          <p className="text-sm text-slate-500">
                            ID #{user.userNumber}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-slate-600">
                        <HiOutlineEnvelope />

                        {user.email}
                      </div>
                    </td>

                    {/* Role */}

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-4 py-2 text-xs font-semibold ${roleStyle(
                          user.role,
                        )}`}
                      >
                        {user.role.replace("_", " ")}
                      </span>
                    </td>

                    {/* Status */}

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-4 py-2 text-xs font-semibold ${statusStyle(
                          user.status,
                        )}`}
                      >
                        {user.status}
                      </span>
                    </td>

                    {/* Joined */}

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-slate-500">
                        <HiOutlineCalendarDays />

                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Actions */}

                    <td className="px-6 py-5">
                      <div className="flex justify-center gap-3">
                        <Link
                          to={`/admin/users/${user.id}`}
                          className="rounded-xl bg-blue-100 p-3 text-blue-600 hover:bg-blue-200 transition"
                        >
                          <HiOutlineEye size={20} />
                        </Link>

                        <button
                          onClick={() => changeUserStatus(user)}
                          className={`rounded-xl p-3 transition ${
                            user.status === "BLOCKED"
                              ? "bg-green-100 text-green-600 hover:bg-green-200"
                              : "bg-orange-100 text-orange-600 hover:bg-orange-200"
                          }`}
                        >
                          {user.status === "BLOCKED" ? (
                            <HiOutlineCheckCircle size={20} />
                          ) : (
                            <HiOutlineNoSymbol size={20} />
                          )}
                        </button>

                        <button
                          onClick={() => setSelectedUser(user)}
                          className="rounded-xl bg-red-100 p-3 text-red-600 hover:bg-red-200 transition"
                        >
                          <HiOutlineTrash size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Mobile Cards */}

      <div className="grid gap-5 lg:hidden">
        {users.length > 0 ? (
          users.map((user) => (
            <div
              key={user.id}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg"
            >
              {/* Top */}

              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-xl font-bold text-white shadow-lg">
                  {user.name ? (
                    user.name.charAt(0).toUpperCase()
                  ) : (
                    <HiOutlineUser />
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900">
                    {user.name}
                  </h3>

                  <p className="text-sm text-slate-500">
                    ID #{user.userNumber}
                  </p>
                </div>
              </div>

              {/* Email */}

              <div className="mt-5 flex items-center gap-2 text-slate-600">
                <HiOutlineEnvelope />
                <span>{user.email}</span>
              </div>

              {/* Joined */}

              <div className="mt-3 flex items-center gap-2 text-slate-600">
                <HiOutlineCalendarDays />
                <span>
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>

              {/* Role + Status */}

              <div className="mt-5 flex flex-wrap gap-3">
                <span
                  className={`rounded-full px-4 py-2 text-xs font-semibold ${roleStyle(
                    user.role,
                  )}`}
                >
                  {user.role.replace("_", " ")}
                </span>

                <span
                  className={`rounded-full px-4 py-2 text-xs font-semibold ${statusStyle(
                    user.status,
                  )}`}
                >
                  {user.status}
                </span>
              </div>

              {/* Actions */}

              <div className="mt-6 flex justify-between">
                <Link
                  to={`/admin/users/${user.id}`}
                  className="flex flex-1 items-center justify-center rounded-xl bg-blue-100 py-3 text-blue-600 transition hover:bg-blue-200"
                >
                  <HiOutlineEye size={22} />
                </Link>

                <button
                  onClick={() => changeUserStatus(user)}
                  className={`mx-2 flex flex-1 items-center justify-center rounded-xl py-3 transition ${
                    user.status === "BLOCKED"
                      ? "bg-green-100 text-green-600 hover:bg-green-200"
                      : "bg-orange-100 text-orange-600 hover:bg-orange-200"
                  }`}
                >
                  {user.status === "BLOCKED" ? (
                    <HiOutlineCheckCircle size={22} />
                  ) : (
                    <HiOutlineNoSymbol size={22} />
                  )}
                </button>

                <button
                  onClick={() => setSelectedUser(user)}
                  className="flex flex-1 items-center justify-center rounded-xl bg-red-100 py-3 text-red-600 transition hover:bg-red-200"
                >
                  <HiOutlineTrash size={22} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-3xl bg-white p-10 text-center shadow-lg">
            <HiOutlineUser size={48} className="mx-auto mb-4 text-slate-400" />

            <h3 className="text-lg font-semibold text-slate-700">
              No users found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              There are no users available.
            </p>
          </div>
        )}
      </div>

      {/* Delete Modal */}

      <DeleteModal
        isOpen={!!selectedUser}
        title="Delete User"
        message={
          selectedUser
            ? `Are you sure you want to delete "${selectedUser.name}"?`
            : ""
        }
        onCancel={() => setSelectedUser(null)}
        onConfirm={removeUser}
      />
    </>
  );
}
