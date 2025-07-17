import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ServerDown from '../Error/ServerDown';
import SimpleSpinner from '../../components/SimpleSpinner';

function BlogPost() {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [serverDown, setServerDown] = useState(false);

    const fetchBlogPost = useCallback(async () => {
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
    }, [slug]);

    useEffect(() => {
        fetchBlogPost();
    }, [fetchBlogPost]);

    if (serverDown) {
        return <ServerDown />;
    }

    if (loading) {
        return <SimpleSpinner message="Loading blog post..." />;
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

                {/* Render backend HTML template */}
                <div className="bg-transparent rounded-lg shadow-xl overflow-hidden">
                    {post.html ? (
                        <div dangerouslySetInnerHTML={{ __html: post.html }} />
                    ) : (
                        <div className="text-red-400">No blog template available.</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default BlogPost; 