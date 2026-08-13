const TextArea = ({ label, register, error, rows = 4, placeholder }) => {
  return (
    <div>
      <label className="block mb-2 font-medium text-gray-700">{label}</label>

      <textarea
        rows={rows}
        placeholder={placeholder}
        {...register}
        className={`w-full rounded-xl border p-3
        ${error ? "border-red-500" : "border-gray-300"}`}
      />

      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
};

export default TextArea;
