import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCalendarAlt, faUser, faShare, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faLinkedin, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import ServerDown from '../Error/ServerDown';
import SimpleSpinner from '../../components/SimpleSpinner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CpnLogo from '../../assets/ChristianProfessionalsNetwork.png';
import { useGetBlogBySlugQuery } from '../../features/blog/blogApi';

function BlogPost() {
    const { slug } = useParams();
    const [showShareOptions, setShowShareOptions] = useState(false);
    const { data: post, isLoading, isError, error } = useGetBlogBySlugQuery(slug);
    const serverDown = isError && (error?.message === 'Failed to fetch' || error?.message === 'NetworkError when attempting to fetch resource.');

    const shareUrl = window.location.href;
    const shareTitle = post?.title || 'Check out this blog post';

    const shareOptions = [
        {
            name: 'Email',
            icon: faEnvelope,
            action: () => {
                const subject = encodeURIComponent(shareTitle);
                const body = encodeURIComponent(`I thought you might be interested in this article: ${shareTitle}\n\nRead it here: ${shareUrl}`);
                window.open(`mailto:?subject=${subject}&body=${body}`);
            }
        },
        {
            name: 'Facebook',
            icon: faFacebook,
            action: () => {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
            }
        },
        {
            name: 'Twitter',
            icon: faTwitter,
            action: () => {
                const text = encodeURIComponent(`${shareTitle} - ${shareUrl}`);
                window.open(`https://twitter.com/intent/tweet?text=${text}`);
            }
        },
        {
            name: 'LinkedIn',
            icon: faLinkedin,
            action: () => {
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`);
            }
        },
        {
            name: 'WhatsApp',
            icon: faWhatsapp,
            action: () => {
                const text = encodeURIComponent(`${shareTitle} - ${shareUrl}`);
                window.open(`https://wa.me/?text=${text}`);
            }
        }
    ];

    if (serverDown) {
        return <ServerDown />;
    }

    if (isLoading) {
        return <SimpleSpinner message="Loading blog post..." />;
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center text-red-400">
                        <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
                        <p className="mb-8">{error?.data?.message || error?.message}</p>
                        <Link 
                            to="/blog"
                            className="inline-flex items-center text-accent-500 hover:text-accent-400 font-semibold"
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
                        className="inline-flex items-center text-accent-500 hover:text-accent-400 font-semibold transition-colors duration-200"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                        Back to Blog
                    </Link>
                </div>

                {/* Blog Post Content */}
                <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                    {/* Header with CPN Logo */}
                    <div className="bg-accent-600 p-8 text-center">
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
                            <div className="mb-8 p-4 bg-amber-50 border-l-4 border-accent-500 rounded-r-lg">
                                <p className="text-lg text-gray-700 italic">{post.excerpt}</p>
                            </div>
                        )}

                        {/* Tags */}
                        {post.tags && (
                            <div className="mb-6 flex flex-wrap gap-2">
                                {post.tags.split(',').map((tag, index) => (
                                    <span 
                                        key={index}
                                        className="px-3 py-1 bg-amber-100 text-accent-800 rounded-full text-sm font-medium"
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
                                    h1: ({ ...props}) => <h1 className="text-3xl font-bold text-primary-900 mb-4" {...props} />,
                                    h2: ({ ...props}) => <h2 className="text-2xl font-bold text-primary-900 mb-3 mt-6" {...props} />,
                                    h3: ({ ...props}) => <h3 className="text-xl font-bold text-primary-900 mb-2 mt-5" {...props} />,
                                    p: ({ ...props}) => <p className="text-gray-700 leading-relaxed mb-4" {...props} />,
                                    ul: ({ ...props}) => <ul className="list-disc list-inside mb-4 space-y-1" {...props} />,
                                    ol: ({ ...props}) => <ol className="list-decimal list-inside mb-4 space-y-1" {...props} />,
                                    li: ({ ...props}) => <li className="text-gray-700" {...props} />,
                                    strong: ({ ...props}) => <strong className="font-bold text-primary-900" {...props} />,
                                    em: ({ ...props}) => <em className="italic text-gray-800" {...props} />,
                                    blockquote: ({ ...props}) => (
                                        <blockquote className="border-l-4 border-accent-500 pl-4 italic text-gray-600 mb-4" {...props} />
                                    ),
                                    code: ({ ...props}) => (
                                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono" {...props} />
                                    ),
                                    pre: ({ ...props}) => (
                                        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4" {...props} />
                                    )
                                }}
                            >
                                {post.content}
                            </ReactMarkdown>
                        </div>

                        {/* Share Section */}
                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">Share this article</h3>
                                <div className="relative">
                                    <button
                                        onClick={() => setShowShareOptions(!showShareOptions)}
                                        className="flex items-center gap-2 px-4 py-2 bg-accent-100 text-accent-700 rounded-lg hover:bg-accent-300 transition-colors"
                                    >
                                        <FontAwesomeIcon icon={faShare} className="text-sm" />
                                        Share
                                    </button>
                                    
                                    {showShareOptions && (
                                        <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 min-w-[200px]">
                                            {shareOptions.map((option, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => {
                                                        option.action();
                                                        setShowShareOptions(false);
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                                                >
                                                    <FontAwesomeIcon icon={option.icon} className="text-gray-600" />
                                                    <span className="text-gray-700">{option.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Faded CPN Name at Bottom */}
                        <div className="mt-8 pt-8 border-t border-gray-200 text-center pb-32">
                            <p className="text-gray-400 text-sm font-medium">
                                Christian Professionals Network
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BlogPost; 