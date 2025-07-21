import { useGetEventsQuery } from '../../features/event/eventApi';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faMapMarkerAlt, faVideo } from '@fortawesome/free-solid-svg-icons';

function NewAndPastEvents() {
    const { data: events = [], isLoading, isError, error } = useGetEventsQuery();
    let upcomingEvents = [];
    if (events.length > 0) {
        const now = new Date();
        upcomingEvents = events
            .filter(event => new Date(event.start_time) > now)
            .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
            .slice(0, 3);
    }

    const formatEventDate = (startTime, endTime) => {
        const start = new Date(startTime);
        const end = new Date(endTime);
        const startDate = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const startTimeStr = start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        const endTimeStr = end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        return `${startDate} • ${startTimeStr} - ${endTimeStr}`;
    };

    const getEventTypeIcon = (eventType) => {
        switch (eventType) {
            case 'physical':
                return <FontAwesomeIcon icon={faMapMarkerAlt} className="text-amber-400" />;
            case 'virtual':
                return <FontAwesomeIcon icon={faVideo} className="text-amber-400" />;
            default:
                return <FontAwesomeIcon icon={faCalendarAlt} className="text-amber-400" />;
        }
    };

    const getEventTypeText = (eventType) => {
        switch (eventType) {
            case 'physical':
                return 'In-Person Event';
            case 'virtual':
                return 'Virtual Event';
            default:
                return 'Event';
        }
    };

    return (
        <div className="w-full">
            <div className="w-full text-center mb-8 px-4 sm:px-6 lg:px-8">
                <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-600 uppercase tracking-wider mb-2">EVENTS</p>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                    Connect at <span className="text-amber-600">Our Events</span>
                </h2>
            </div>
            {isLoading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                    <p className="mt-4 text-gray-600">Loading upcoming events...</p>
                </div>
            ) : isError ? (
                <div className="text-center py-12">
                    <p className="text-red-600">Error loading events: {error?.data?.message || error?.message}</p>
                </div>
            ) : upcomingEvents.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-600">No upcoming events at the moment.</p>
                    <p className="text-gray-500 text-sm mt-2">Check back soon for new events!</p>
                </div>
            ) : (
                <div className="flex flex-wrap gap-4 sm:gap-6 lg:gap-8 justify-center items-start p-4 sm:p-6 lg:p-8">
                    {upcomingEvents.map((event) => (
                        <div 
                            key={event.event_id}
                            className="relative w-full sm:w-80 lg:w-96 xl:w-1/4 min-w-72 p-6 sm:p-8 border border-gray-200 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer group"
                        >
                            {event.image_url && (
                                <div className="mb-4 overflow-hidden rounded-lg">
                                    <img 
                                        src={event.image_url} 
                                        alt={event.title}
                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            )}
                            <div className="flex items-center gap-2 mb-3">
                                {getEventTypeIcon(event.event_type)}
                                <span className="text-sm font-medium text-gray-600">
                                    {getEventTypeText(event.event_type)}
                                </span>
                            </div>
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 text-gray-900 group-hover:text-amber-600 transition-colors">
                                {event.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                                {event.description}
                            </p>
                            <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                                <FontAwesomeIcon icon={faCalendarAlt} className="text-amber-400" />
                                <span>{formatEventDate(event.start_time, event.end_time)}</span>
                            </div>
                            <Link
                                to={`/events/${event.event_id}`}
                                className="inline-flex items-center gap-2 text-amber-600 font-semibold hover:text-amber-700 transition-colors group-hover:underline"
                            >
                                View Details
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
            <div className="text-center mt-8">
                <Link
                    to="/events"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors"
                >
                    View All Events
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>
        </div>
    );
}

export default NewAndPastEvents;
