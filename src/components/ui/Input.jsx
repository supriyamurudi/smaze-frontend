const Input = ({ label, type = "text", placeholder, register, error }) => {
  return (
    <div>
      <label className="block mb-2 font-medium text-gray-700">{label}</label>

      <input
        type={type}
        placeholder={placeholder}
        {...register}
        className={`w-full rounded-xl border p-3 outline-none transition
          ${
            error
              ? "border-red-500 focus:ring-2 focus:ring-red-500"
              : "border-gray-300 focus:ring-2 focus:ring-blue-500"
          }`}
      />

      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
};

export default Input;
