const Select = ({ label, register, error, children }) => {
  return (
    <div>
      <label className="block mb-2 font-medium text-gray-700">{label}</label>

      <select
        {...register}
        className={`w-full rounded-xl border p-3
        ${error ? "border-red-500" : "border-gray-300"}`}
      >
        {children}
      </select>

      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
};

export default Select;
