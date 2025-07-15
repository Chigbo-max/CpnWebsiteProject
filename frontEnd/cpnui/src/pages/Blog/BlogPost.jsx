import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faUser, faArrowLeft, faShare } from '@fortawesome/free-solid-svg-icons';
import ServerDown from '../Error/ServerDown';

function BlogPost() {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [serverDown, setServerDown] = useState(false);

    useEffect(() => {
        fetchBlogPost();
    }, [slug]);

    const fetchBlogPost = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/blog/${slug}`);
            if (!response.ok) {
                throw new Error('Blog post not found');
            }
            const data = await response.json();
            setPost(data);
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

    const sharePost = () => {
        if (navigator.share) {
            navigator.share({
                title: post.title,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    if (serverDown) {
        return <ServerDown />;
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center text-red-400">
                        <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
                        <p className="mb-8">{error}</p>
                        <Link 
                            to="/blog"
                            className="inline-flex items-center text-amber-500 hover:text-amber-400 font-semibold"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                            Back to Blog
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!post) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <div className="mb-8">
                    <Link 
                        to="/blog"
                        className="inline-flex items-center text-amber-500 hover:text-amber-400 font-semibold transition-colors duration-200"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                        Back to Blog
                    </Link>
                </div>

                {/* Article */}
                <article className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                    {post.featured_image && (
                        <div className="aspect-video bg-gray-700">
                            <img 
                                src={post.featured_image} 
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                    
                    <div className="p-8">
                        {/* Meta Information */}
                        <div className="flex items-center text-sm text-gray-400 mb-6">
                            <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                            <span>{formatDate(post.created_at)}</span>
                            <FontAwesomeIcon icon={faUser} className="ml-4 mr-2" />
                            <span>Admin</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                            {post.title}
                        </h1>

                        {/* Share Button */}
                        <div className="mb-8">
                            <button
                                onClick={sharePost}
                                className="inline-flex items-center text-amber-500 hover:text-amber-400 font-semibold transition-colors duration-200"
                            >
                                <FontAwesomeIcon icon={faShare} className="mr-2" />
                                Share Post
                            </button>
                        </div>

                        {/* Content */}
                        <div className="prose prose-invert prose-amber max-w-none">
                            <div 
                                className="text-gray-300 leading-relaxed text-lg"
                                dangerouslySetInnerHTML={{ 
                                    __html: post.content.replace(/\n/g, '<br>') 
                                }}
                            />
                        </div>

                        {/* Footer */}
                        <div className="mt-12 pt-8 border-t border-gray-700">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-400">
                                    Published on {formatDate(post.created_at)}
                                </div>
                                <Link 
                                    to="/blog"
                                    className="inline-flex items-center text-amber-500 hover:text-amber-400 font-semibold transition-colors duration-200"
                                >
                                    View All Posts
                                    <FontAwesomeIcon icon={faArrowLeft} className="ml-2 rotate-180" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
}

export default BlogPost; 