const CategoryFilter = ({ categories, selected, onSelect }) => {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      <button
        onClick={() => onSelect("All")}
        className={`px-5 py-2 rounded-full whitespace-nowrap ${
          selected === "All" ? "bg-blue-600 text-white" : "bg-gray-200"
        }`}
      >
        All
      </button>

      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={`px-5 py-2 rounded-full whitespace-nowrap ${
            selected === category ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
