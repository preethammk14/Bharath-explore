import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { STAYS } from '../data/indiaData';
import { AccommodationDetails } from '../components/stays/AccommodationDetails';
import { ArrowLeft, Home } from 'lucide-react';

export const StayDetailPage: React.FC = () => {
  const { stayId } = useParams<{ stayId: string }>();
  const navigate = useNavigate();

  const stay = STAYS.find((s) => s.id === stayId);

  if (!stay) {
    return (
      <div className="min-h-screen bg-[#FAF8F2] py-20 px-4 text-center">
        <h2 className="text-2xl font-bold text-[#174A35]">Accommodation Not Found</h2>
        <p className="text-xs text-gray-500 mt-2">
          The requested accommodation record "{stayId}" does not exist in our directory.
        </p>
        <Link
          to="/stays"
          className="mt-4 inline-block bg-[#F07843] hover:bg-[#DE632E] text-white text-xs font-bold px-6 py-2.5 rounded-md transition-colors"
        >
          Browse All Curated Stays
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F2] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Back Link */}
        <div className="flex items-center gap-2 text-xs font-bold text-[#174A35]">
          <button
            onClick={() => navigate('/stays')}
            className="hover:text-[#F07843] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Stays Directory</span>
          </button>
          <span className="text-gray-300">/</span>
          <span className="text-gray-500 truncate max-w-xs">{stay.name}</span>
        </div>

        {/* Accommodation Details Component */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E0D7C9] shadow-sm">
          <AccommodationDetails stay={stay} />
        </div>
      </div>
    </div>
  );
};
