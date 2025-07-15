import React from 'react'

function Blog() {
    return (
        <div className="relative w-full rounded-2xl text-center mb-12 flex items-center justify-center min-h-[300px] sm:min-h-[400px] overflow-hidden bg-gray-900 text-white px-8 py-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4">Blog</h1>
            {/* a blog on How to be a good leader, highlighting tips on being a good leader */}
            {/* there should be an admin access that allows the admin to make post such as blog contents, as soon as
        the admin makes the blog post, it reflects instantly.
        No need for the read page since there is a blog page where the users could easily see all the posted contents
        and it redirects them to the exact blog post 
        the blog page contains list of the blog posts made. 
        each blog post directs the reader to the exact blog post to read
        */}
        </div>
    )
}

export default Blog
