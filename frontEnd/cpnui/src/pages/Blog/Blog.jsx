import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faUser, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { motion } from "framer-motion";
import ServerDown from '../Error/ServerDown';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FaRegNewspaper } from 'react-icons/fa';
import { useGetBlogsQuery } from '../../features/blog/blogApi';

function Blog() {
    const { data, isLoading, isError, error } = useGetBlogsQuery();
    console.log("data: ", data)
    const blogPosts = useMemo(() => {
        const posts = data?.blogs ?? [];
        console.log("blog posts: ", posts)
        posts.forEach(post => console.log("status:", post.status));
        return posts;
    }, [data]);
    
    const serverDown = isError && (error?.message === 'Failed to fetch' || error?.message === 'NetworkError when attempting to fetch resource.');

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const publishedPosts = useMemo(() => blogPosts.filter(post => post.status === 'published'), [blogPosts]);

    if (serverDown) {
        return <ServerDown />;
    }

    if (isLoading) {
        return <LoadingSpinner message="Loading blog posts..." />;
    }

    if (isError) {
        return <LoadingSpinner message={`Error: ${error?.data?.message || error?.message}`} />;
    }

    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="relative w-full min-h-[400px] sm:min-h-[500px] flex items-center justify-center text-center overflow-hidden">
                <div
                    className="absolute inset-0 w-full h-full"
                    style={{
                        background: `linear-gradient(rgba(17, 24, 38, 0.9), rgba(17, 24, 38, 0.9)), url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2028&q=80')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                    }}
                />
                <div className="relative z-20 flex flex-col justify-center items-center w-full px-6 py-20 mx-auto">
                    <motion.h1
                        initial={{ x: "-100vw", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-amber-400 mb-6"
                    >
                        Blog
                    </motion.h1>
                    <motion.p
                        initial={{ x: "100vw", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                        className="text-xl sm:text-2xl md:text-3xl text-white max-w-4xl mx-auto leading-relaxed"
                    >
                        Discover insights, leadership tips, and professional guidance 
                        from our community of Christian professionals.
                    </motion.p>
                </div>
            </section>

            {/* Main Content */}
            <div className="w-full px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-br from-gray-50 to-amber-50">
                <div className="max-w-7xl mx-auto">
                    {publishedPosts.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaRegNewspaper className="text-4xl text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-semibold mb-4 text-gray-700">No published blog posts available</h3>
                            <p className="text-gray-500">Check back soon for new content!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {publishedPosts.map((post, index) => (
                                <motion.article 
                                    key={post.id} 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200 overflow-hidden"
                                >
                                    {post.featured_image ? (
                                        <div className="aspect-video bg-gray-200">
                                            <img 
                                                src={post.featured_image} 
                                                alt={post.title}
                                                className="w-full h-full object-cover"
                                                onError={e => { e.target.onerror = null; e.target.src = '/vite.svg'; }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="aspect-video bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                                            <FaRegNewspaper className="w-16 h-16 text-white" />
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <div className="flex items-center text-sm text-gray-500 mb-3">
                                            <FontAwesomeIcon icon={faCalendar} className="mr-2 text-amber-500" />
                                            <span>{formatDate(post.created_at)}</span>
                                            <FontAwesomeIcon icon={faUser} className="ml-4 mr-2 text-amber-500" />
                                            <span>CPN Team</span>
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                                            {post.title}
                                        </h2>
                                        <p className="text-gray-600 mb-4 line-clamp-3">
                                            {post.excerpt}
                                        </p>
                                        <Link 
                                            to={`/blog/${post.slug}`}
                                            className="inline-flex items-center text-amber-600 hover:text-amber-700 font-semibold transition-colors duration-200"
                                        >
                                            Read More
                                            <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                                        </Link>
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Blog;