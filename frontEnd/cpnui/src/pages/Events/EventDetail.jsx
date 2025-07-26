import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetEventQuery, useRegisterForEventMutation } from '../../features/event/eventApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorDisplay from '../../components/ErrorDisplay';

function EventDetail() {
    const { eventId } = useParams();
    const { data: event, isLoading, isError } = useGetEventQuery(eventId);
    const [registerForEvent, { isLoading: isRegistering }] = useRegisterForEventMutation();

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (isError) {
        return <ErrorDisplay error={{ message: 'Event not found' }} />;
    }

    if (!event) {
        return <ErrorDisplay error={{ message: 'Event not found' }} />;
    }

    const handleRegister = async () => {
        try {
            await registerForEvent({
                event_id: event.id,
                name: 'User Name', // You might want to get this from user context
                email: 'user@example.com', // You might want to get this from user context
                phone: '1234567890' // You might want to get this from user context
            }).unwrap();
            alert('Successfully registered for event!');
        } catch (error) {
            alert('Failed to register for event: ' + error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {event.image && (
                        <div className="w-full h-64 md:h-96 relative">
                            <img
                                src={event.image}
                                alt={event.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                    
                    <div className="p-6 md:p-8">
                        <header className="mb-6">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                {event.title}
                            </h1>
                            <div className="flex flex-wrap gap-4 text-gray-600">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>{new Date(event.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{event.time}</span>
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>{event.location}</span>
                                </div>
                            </div>
                        </header>

                        <div className="prose prose-lg max-w-none mb-8">
                            <div dangerouslySetInnerHTML={{ __html: event.description }} />
                        </div>

                        <div className="border-t pt-6">
                            <button
                                onClick={handleRegister}
                                disabled={isRegistering}
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                            >
                                {isRegistering ? 'Registering...' : 'Register for Event'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EventDetail; 