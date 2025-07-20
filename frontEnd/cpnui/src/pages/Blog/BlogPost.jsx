import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCalendarAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import ServerDown from '../Error/ServerDown';
import SimpleSpinner from '../../components/SimpleSpinner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CpnLogo from '../../assets/ChristianProfessionalsNetwork.png';

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

                {/* Blog Post Content */}
                <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                    {/* Header with CPN Logo */}
                    <div className="bg-amber-600 p-8 text-center">
                        <img 
                            src={CpnLogo} 
                            alt="CPN Logo" 
                            className="h-32 mx-auto mb-4"
                        />
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            {post.title}
                        </h1>
                        <div className="flex items-center justify-center gap-6 text-white/90">
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faUser} className="text-sm" />
                                <span>CPN Team</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faCalendarAlt} className="text-sm" />
                                <span>{new Date(post.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}</span>
                            </div>
                        </div>
                    </div>

                    {/* Featured Image */}
                    {post.featured_image && (
                        <div className="w-full h-64 md:h-80 overflow-hidden">
                            <img 
                                src={post.featured_image} 
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div className="p-8">
                        {/* Excerpt */}
                        {post.excerpt && (
                            <div className="mb-8 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
                                <p className="text-lg text-gray-700 italic">{post.excerpt}</p>
                            </div>
                        )}

                        {/* Tags */}
                        {post.tags && (
                            <div className="mb-6 flex flex-wrap gap-2">
                                {post.tags.split(',').map((tag, index) => (
                                    <span 
                                        key={index}
                                        className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium"
                                    >
                                        #{tag.trim()}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Markdown Content */}
                        <div className="prose prose-lg max-w-none">
                            <ReactMarkdown 
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-gray-900 mb-4" {...props} />,
                                    h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-6" {...props} />,
                                    h3: ({node, ...props}) => <h3 className="text-xl font-bold text-gray-900 mb-2 mt-5" {...props} />,
                                    p: ({node, ...props}) => <p className="text-gray-700 leading-relaxed mb-4" {...props} />,
                                    ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 space-y-1" {...props} />,
                                    ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 space-y-1" {...props} />,
                                    li: ({node, ...props}) => <li className="text-gray-700" {...props} />,
                                    strong: ({node, ...props}) => <strong className="font-bold text-gray-900" {...props} />,
                                    em: ({node, ...props}) => <em className="italic text-gray-800" {...props} />,
                                    blockquote: ({node, ...props}) => (
                                        <blockquote className="border-l-4 border-amber-500 pl-4 italic text-gray-600 mb-4" {...props} />
                                    ),
                                    code: ({node, ...props}) => (
                                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono" {...props} />
                                    ),
                                    pre: ({node, ...props}) => (
                                        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4" {...props} />
                                    )
                                }}
                            >
                                {post.content}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BlogPost; 