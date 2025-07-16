-- Create database tables

-- Admin table
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(20) DEFAULT 'admin',
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100),
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    tags TEXT,
    author_id INTEGER REFERENCES admins(id),
    featured_image VARCHAR(255),
    slug VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'published',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact inquiries table
CREATE TABLE IF NOT EXISTS contact_inquiries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    admin_response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    event_id VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    event_type VARCHAR(20) NOT NULL, 
    location_address VARCHAR(255),
    location_map_url VARCHAR(255),
    virtual_link VARCHAR(255),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    created_by INTEGER REFERENCES admins(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_events_event_id ON events(event_id);

-- Event Registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
    id SERIAL PRIMARY KEY,
    event_id VARCHAR(100) NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(30),
    registration_code VARCHAR(20) NOT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON event_registrations(event_id);

-- Insert default admin
INSERT INTO admins (username, email, password_hash) 
VALUES ('Uju', 'chizzyaac@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON CONFLICT (username) DO NOTHING;

-- Insert dummy blog posts
INSERT INTO blog_posts (title, content, excerpt, slug, author_id) VALUES
(
    'How to be a Good Leader',
    'Leadership is a skill that can be learned and developed over time. Here are some essential tips for becoming an effective leader:

1. **Lead by Example**
   - Demonstrate the values and behaviors you expect from your team
   - Show integrity, honesty, and commitment in all your actions
   - Be consistent in your words and deeds

2. **Communicate Effectively**
   - Practice active listening and encourage open dialogue
   - Provide clear, concise instructions and feedback
   - Be transparent about goals, challenges, and decisions

3. **Empower Your Team**
   - Delegate responsibilities and trust your team members
   - Provide opportunities for growth and development
   - Recognize and celebrate achievements

4. **Build Relationships**
   - Get to know your team members personally
   - Show genuine care and concern for their well-being
   - Create a supportive and inclusive environment

5. **Make Decisions Confidently**
   - Gather relevant information before making decisions
   - Consider different perspectives and viewpoints
   - Take responsibility for outcomes, both good and bad

6. **Adapt and Learn**
   - Be open to feedback and continuous improvement
   - Learn from mistakes and failures
   - Stay current with industry trends and best practices

7. **Maintain Balance**
   - Prioritize work-life balance for yourself and your team
   - Manage stress and pressure effectively
   - Take care of your physical and mental health

Remember, great leaders are not born - they are made through practice, reflection, and continuous learning.',
    'Leadership is a skill that can be learned and developed over time. Discover essential tips for becoming an effective leader in any organization.',
    'how-to-be-a-good-leader',
    1
),
(
    'Biblical Principles for Professional Excellence',
    'Integrating biblical principles into your professional life can lead to greater success and fulfillment. Here are key principles to apply:

1. **Stewardship**
   - View your work as a gift from God to be managed responsibly
   - Use your talents and resources wisely for the benefit of others
   - Be accountable for the results of your efforts

2. **Integrity**
   - Maintain honesty and transparency in all business dealings
   - Keep your word and follow through on commitments
   - Build trust through consistent ethical behavior

3. **Servant Leadership**
   - Put the needs of your team and organization first
   - Lead with humility and a desire to serve others
   - Focus on developing and empowering those around you

4. **Excellence**
   - Strive for the highest quality in everything you do
   - Work as if you are working for the Lord
   - Pursue continuous improvement and learning

5. **Compassion**
   - Show kindness and understanding to colleagues and clients
   - Consider the impact of your decisions on others
   - Create an environment of care and support

6. **Faithfulness**
   - Be reliable and consistent in your work
   - Honor your commitments and responsibilities
   - Build long-term relationships based on trust

7. **Gratitude**
   - Appreciate the opportunities and resources you have
   - Acknowledge the contributions of others
   - Maintain a positive and thankful attitude

By applying these biblical principles, you can create a more meaningful and impactful professional life while honoring your faith.',
    'Discover how to integrate biblical principles into your professional life for greater success and fulfillment.',
    'biblical-principles-for-professional-excellence',
    1
);
