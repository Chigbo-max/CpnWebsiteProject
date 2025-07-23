import { useGetEventsQuery } from '../../features/event/eventApi';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faUsers, faBookOpen, faMapMarkerAlt, faVideo } from '@fortawesome/free-solid-svg-icons';

function UpcomingEvents() {
    const { data: events = [], isLoading, isError} = useGetEventsQuery();
    let upcomingEvents = [];
    if (events.length > 0) {
        const now = new Date();
        upcomingEvents = events
            .filter(event => new Date(event.start_time) > now)
            .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
            .slice(0, 3);
    }

    const formatEventDate = (startTime) => {
        const start = new Date(startTime);
        return start.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getEventIcon = (eventType) => {
        switch (eventType) {
            case 'physical':
                return faMapMarkerAlt;
            case 'virtual':
                return faVideo;
            default:
                return faCalendarAlt;
        }
    };

    const getEventGradient = (index) => {
        const gradients = [
            'from-amber-400 to-amber-600',
            'from-gray-800 to-gray-900',
            'from-amber-400 to-amber-600'
        ];
        return gradients[index % gradients.length];
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 animate-pulse">
                        <div className="h-48 bg-gray-200"></div>
                        <div className="p-6">
                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded mb-4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">Unable to load upcoming events.</p>
            </div>
        );
    }

    if (upcomingEvents.length === 0) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300">
                    <div className="h-48 bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                        <FontAwesomeIcon icon={faCalendarAlt} className="text-6xl text-white" />
                    </div>
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Leadership Summit 2024</h3>
                        <p className="text-gray-600 mb-4">A comprehensive leadership development event featuring industry experts and biblical insights.</p>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">March 15-16, 2024</span>
                            <Link to="/events" className="text-amber-600 font-semibold hover:text-amber-700">Learn More</Link>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300">
                    <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                        <FontAwesomeIcon icon={faUsers} className="text-6xl text-white" />
                    </div>
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Professional Networking</h3>
                        <p className="text-gray-600 mb-4">Connect with fellow professionals and expand your network in a faith-based environment.</p>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Monthly</span>
                            <Link to="/events" className="text-amber-600 font-semibold hover:text-amber-700">Learn More</Link>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300">
                    <div className="h-48 bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                        <FontAwesomeIcon icon={faBookOpen} className="text-6xl text-white" />
                    </div>
                    <div className="p-6" style={{backgroundColor: '#111826ff'}}>
                        <h3 className="text-xl font-bold text-white mb-2">Bible Study Series</h3>
                        <p className="text-gray-300 mb-4">Deep dive into biblical principles for professional excellence and workplace ministry.</p>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">Weekly</span>
                            <Link to="/events" className="text-amber-400 font-semibold hover:text-amber-300">Learn More</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
                <div key={event.event_id} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300">
                    <div className={`h-48 bg-gradient-to-br ${getEventGradient(index)} flex items-center justify-center`}>
                        <FontAwesomeIcon icon={getEventIcon(event.event_type)} className="text-6xl text-white" />
                    </div>
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">{formatEventDate(event.start_time)}</span>
                            <Link to={`/events/${event.event_id}`} className="text-amber-600 font-semibold hover:text-amber-700">
                                Learn More
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default UpcomingEvents; 