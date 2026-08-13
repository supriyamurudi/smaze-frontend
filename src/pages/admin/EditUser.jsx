import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";

import { getUserById, updateUser } from "../../services/adminService";

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);

        const res = await getUserById(id);

        reset({
          name: res.user.name || "",
          email: res.user.email || "",
          phone: res.user.phone || "",
          role: res.user.role || "",
        });
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, reset]);

  const onSubmit = async (data) => {
    try {
      await updateUser(id, data);

      toast.success("User updated successfully");

      navigate("/admin/users");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-violet-800">Edit User</h1>

          <p className="mt-2 text-slate-500">
            Update user account information.
          </p>
        </div>

        {/* Form */}

        <div className="overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 p-8">
            <section>
              <h2 className="mb-6 text-lg font-semibold text-violet-600">
                User Information
              </h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Input
                  label="Full Name"
                  placeholder="Enter full name"
                  register={register("name", {
                    required: "Name is required",
                  })}
                  error={errors.name}
                />

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="Enter email"
                  register={register("email", {
                    required: "Email is required",
                  })}
                  error={errors.email}
                />

                <Input
                  label="Phone Number"
                  placeholder="Enter phone number"
                  register={register("phone")}
                  error={errors.phone}
                />

                <Select
                  label="Role"
                  register={register("role", {
                    required: "Role is required",
                  })}
                  error={errors.role}
                >
                  <option value="">Select Role</option>
                  <option value="CUSTOMER">Customer</option>
                  <option value="SHOP_OWNER">Shop Owner</option>
                  <option value="ADMIN">Admin</option>
                </Select>
              </div>
            </section>

            {/* Buttons */}

            <div className="flex justify-end gap-4 border-t border-violet-100 pt-8">
              <Link to="/admin/users">
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </Link>

              <Button
                type="submit"
                className="bg-violet-600 hover:bg-violet-700"
              >
                Update User
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
