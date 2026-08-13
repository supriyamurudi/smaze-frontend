import { HiOutlineMagnifyingGlass } from "react-icons/hi2";

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="relative">
      <HiOutlineMagnifyingGlass
        size={22}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        type="text"
        placeholder="Search offers..."
        value={value}
        onChange={onChange}
        className="w-full border rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default SearchBar;
