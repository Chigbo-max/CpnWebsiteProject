import { Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const JoinCommunityBanner = () => {
  return (
    <section className="w-full bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center">
            <Users className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
          Ready to Join Our Community?
        </h2>
        <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
          Connect with other Christian professionals who are transforming their workplaces with Kingdom values and biblical principles.
        </p>
        <Link
          to="/register"
          className="inline-flex items-center gap-3 px-8 py-4 bg-accent-500 text-white font-bold text-lg rounded-xl shadow-xl hover:bg-accent-600 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-accent-500 focus:ring-opacity-50"
        >
          Join Our WhatsApp Community
          <ArrowRight className="w-5 h-5" />
        </Link>
        <div className="mt-6 text-gray-300 text-sm">
          Free to join • Active community • Weekly prayers • Monthly mentorship
        </div>
      </div>
    </section>
  );
};

export default JoinCommunityBanner;