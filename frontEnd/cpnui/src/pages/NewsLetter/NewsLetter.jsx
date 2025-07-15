import React from 'react'

function NewsLetter() {
    return (
        <div className="relative w-full rounded-2xl text-center mb-12 flex items-center justify-center min-h-[300px] sm:min-h-[400px] overflow-hidden bg-gray-900 text-white px-8 py-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4">NewsLetter</h1>
            {/* the admin should be able to send newsletter to registered email addresses. this feature should be
                in the admin dashboard along with the feature to make a blog post and it automatically reflects on the website.
                MENSTACK is good for this, using nodejs as the backend */}
        </div>
    )
}

export default NewsLetter
