import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetBlogQuery } from '../../features/blog/blogApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorDisplay from '../../components/ErrorDisplay';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CpnLogo from '../../assets/ChristianProfessionalsNetwork.png';

function BlogPost() {
    const { slug } = useParams();
    const { data: post, isLoading, isError, error } = useGetBlogQuery(slug);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (isError) {
        return <ErrorDisplay error={error} />;
    }

    if (!post) {
        return <ErrorDisplay error={{ message: 'Blog post not found' }} />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <article className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {post.image && (
                        <div className="w-full h-64 md:h-96 relative">
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                    
                    <div className="p-6 md:p-8">
                        <header className="mb-6">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                {post.title}
                            </h1>
                            <div className="flex items-center text-gray-600 text-sm">
                                <span>By {post.author || 'CPN Team'}</span>
                                <span className="mx-2">•</span>
                                <span>{new Date(post.created_at).toLocaleDateString()}</span>
                            </div>
                        </header>

                        <div className="prose prose-lg max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {post.content}
                            </ReactMarkdown>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
}

export default BlogPost; 