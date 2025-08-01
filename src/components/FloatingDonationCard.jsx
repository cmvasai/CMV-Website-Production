import { Link } from 'react-router-dom';

const FloatingDonationCard = () => {
  return (
    <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-50">
      <Link
        to="/donate"
        className="block bg-[#BC3612] hover:bg-[#F47930] text-white w-8 py-12 shadow-lg hover:shadow-xl transition-all duration-300 font-medium text-xs rounded-l-md flex items-center justify-center"
      >
        <div className="transform -rotate-90 whitespace-nowrap">
          Donate
        </div>
      </Link>
    </div>
  );
};

export default FloatingDonationCard;
