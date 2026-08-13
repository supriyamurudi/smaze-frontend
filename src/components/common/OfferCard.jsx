import { HiOutlineHeart, HiOutlineMapPin } from "react-icons/hi2";
import { Link } from "react-router-dom";

const OfferCard = ({ offer }) => {
  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-xl transition duration-300 overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative">
        <img
          src={offer.image}
          alt={offer.title}
          className="w-full h-52 object-cover"
        />

        <span className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
          {offer.discount}
        </span>

        <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:bg-gray-100">
          <HiOutlineHeart size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-gray-900">{offer.title}</h3>

        <p className="text-blue-600 font-medium mt-1">{offer.shop}</p>

        <div className="flex items-center gap-2 text-gray-500 text-sm mt-3">
          <HiOutlineMapPin />
          {offer.location}
        </div>

        <p className="text-sm text-gray-400 mt-2">
          Valid Till: {offer.validTill}
        </p>

        <Link
          to={`/offers/${offer.id}`}
          className="mt-auto bg-blue-600 text-white text-center py-3 rounded-xl font-medium hover:bg-blue-700 transition mt-6"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default OfferCard;
