import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faUser, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import ServerDown from '../Error/ServerDown';
import SimpleSpinner from '../../components/SimpleSpinner';
import { FaRegNewspaper } from 'react-icons/fa';

function Blog() {
    const [blogPosts, setBlogPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [serverDown, setServerDown] = useState(false);

    useEffect(() => {
        fetchBlogPosts();
    }, []);

    const fetchBlogPosts = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/blog');
            if (!response.ok) {
                throw new Error('Failed to fetch blog posts');
            }
            const data = await response.json();
            console.log("blogs: ", data);
            setBlogPosts(data);
        } catch (err) {
            if (err.message === 'Failed to fetch' || err.message === 'NetworkError when attempting to fetch resource.') {
                setServerDown(true);
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (serverDown) {
        return <ServerDown />;
    }

    if (loading) {
        return <SimpleSpinner message="Loading blog posts..." />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <div className="relative w-full rounded-2xl text-center mb-12 flex items-center justify-center min-h-[300px] sm:min-h-[400px] overflow-hidden bg-gray-900 text-white px-8 py-16">
                    <div className="text-red-400">Error: {error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Hero Section */}
            <div className="relative w-full rounded-2xl text-center mb-12 flex items-center justify-center min-h-[300px] sm:min-h-[400px] overflow-hidden bg-gray-900 text-white px-8 py-16">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-gray-800/20"></div>
                <div className="relative z-10">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4">Blog</h1>
                    <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
                        Discover insights, leadership tips, and professional guidance from our community
                    </p>
                </div>
            </div>

            {/* Blog Posts Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                {blogPosts.filter(post => post.status === 'published').length === 0 ? (
                    <div className="text-center text-gray-400 py-16">
                        <h3 className="text-2xl font-semibold mb-4">No published blog posts available</h3>
                        <p>Check back soon for new content!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogPosts.filter(post => post.status === 'published').map((post) => (
                            <article key={post.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
                                {post.featured_image ? (
                                    <div className="aspect-video bg-gray-700 flex items-center justify-center">
                                        <img 
                                            src={post.featured_image} 
                                            alt={post.title}
                                            className="w-full h-full object-cover"
                                            onError={e => { e.target.onerror = null; e.target.src = '/vite.svg'; }}
                                        />
                                    </div>
                                ) : (
                                    <div className="aspect-video bg-gray-700 flex items-center justify-center">
                                        <FaRegNewspaper className="w-16 h-16 text-gray-400 opacity-60" />
                                    </div>
                                )}
                                <div className="p-6">
                                    <div className="flex items-center text-sm text-gray-400 mb-3">
                                        <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                                        <span>{formatDate(post.created_at)}</span>
                                        <FontAwesomeIcon icon={faUser} className="ml-4 mr-2" />
                                        <span>Admin</span>
                                    </div>
                                    <h2 className="text-xl font-bold text-white mb-3 line-clamp-2">
                                        {post.title}
                                    </h2>
                                    <p className="text-gray-300 mb-4 line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                    <Link 
                                        to={`/blog/${post.slug}`}
                                        className="inline-flex items-center text-amber-500 hover:text-amber-400 font-semibold transition-colors duration-200"
                                    >
                                        Read More
                                        <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Blog;
