const BlogPost = require('../models/BlogPost');

// IBlogService interface
class IBlogService {
  generateUniqueSlug(title, existingSlug) { throw new Error('Not implemented'); }
  getAll() { throw new Error('Not implemented'); }
  getPublished() { throw new Error('Not implemented'); }
  getById(id) { throw new Error('Not implemented'); }
  getBySlug(slug) { throw new Error('Not implemented'); }
  create(data) { throw new Error('Not implemented'); }
  update(id, data) { throw new Error('Not implemented'); }
  delete(id) { throw new Error('Not implemented'); }
}

// BlogServiceImpl implements IBlogService
class BlogServiceImpl extends IBlogService {
  constructor() {
    super();
  }

  // Generate a unique slug from title
  async generateUniqueSlug(title, existingSlug = null) {
    let baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
    let slug = baseSlug;
    let counter = 1;
    
    const checkSlug = async (testSlug) => {
      const query = existingSlug 
        ? { slug: testSlug, _id: { $ne: existingSlug } }
        : { slug: testSlug };
      const existingPost = await BlogPost.findOne(query);
      return !!existingPost;
    };
    
    while (await checkSlug(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    return slug;
  }

  static renderBlogTemplate({ title, author, date, excerpt, content, featuredImage, tags }) {
    return `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background: linear-gradient(135deg, #f8fafc 0%, #e3e9f6 100%); padding: 0; margin: 0; min-height: 100vh;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background: transparent; padding: 0; margin: 0;">
          <tr>
            <td align="center">
              <table width="650" cellpadding="0" cellspacing="0" style="background: #fff; border-radius: 18px; box-shadow: 0 4px 24px rgba(80,120,200,0.10); margin: 40px 0; border: 1.5px solid #e0e7ef;">
                <tr>
                  <td style="background: #f59e42;  border-radius: 18px 18px 0 0; padding: 2px 0; text-align: center;">
                    <img src='http://localhost/src/assets/ChristianProfessionalsNetwork.png' alt='CPN Logo' style='height:250px; margin-bottom:0px;' />
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 48px;">
                    <h2 style="font-size: 2.1rem; color: #1a2233; margin: 36px 0 10px 0; font-family: 'Montserrat', 'Segoe UI', Arial, sans-serif;">${title}</h2>
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                      <span style="color: #888; font-size: 1rem;">By <b>${author || 'CPN Team'}</b></span>
                      <span style="color: #b0b6c3; font-size: 1.1rem;">&bull;</span>
                      <span style="color: #888; font-size: 1rem;">${date ? new Date(date).toLocaleDateString() : ''}</span>
                    </div>
                    ${tags ? `<div style="margin-bottom: 18px;">${tags.split(',').map(tag => `<span style='background:#f3f4f6;color:#f59e42;font-size:0.95rem;padding:3px 10px;border-radius:8px;margin-right:6px;'>#${tag.trim()}</span>`).join('')}</div>` : ''}
                    ${featuredImage ? `<img src="${featuredImage}" alt="Blog Image" style="width:100%; max-height:320px; object-fit:cover; border-radius:10px; margin-bottom:28px; border:1px solid #f3f4f6;" />` : ''}
                    <p style="font-size: 1.15rem; color: #555; font-style: italic; margin-bottom: 28px; background: #f8fafc; border-left: 4px solid #f59e42; padding: 12px 18px; border-radius: 6px;">${excerpt || ''}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 0 48px 36px 48px;">
                    <div style="font-size: 1.13rem; color: #222; line-height: 1.8; margin-bottom: 36px; font-family: 'Segoe UI', Arial, sans-serif;">
                      ${content}
                    </div>
                    <hr style="border: none; border-top: 1.5px solid #f3f4f6; margin: 36px 0 18px 0;" />
                    <p style="font-size: 0.98rem; color: #b0b6c3; text-align: center; margin: 0;">&copy; ${new Date().getFullYear()} Christian Professionals Network</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    `;
  }

  async getAll() {
    return await BlogPost.find({}).sort({ createdAt: -1 });
  }

  async getPublished() {
    return await BlogPost.find({ status: 'published' })
      .select('title excerpt slug content featured_image createdAt status')
      .sort({ createdAt: -1 });
  }

  async getById(id) {
    return await BlogPost.findById(id);
  }

  async getBySlug(slug) {
    return await BlogPost.findOne({ slug, status: 'published' });
  }

  async create({ title, content, excerpt, tags, status, slug, authorId, featured_image }) {
    try {
      // Generate unique slug if not provided or if it might conflict
      const uniqueSlug = slug ? await this.generateUniqueSlug(title, slug) : await this.generateUniqueSlug(title);
      
      const blogPost = new BlogPost({
        title,
        content,
        excerpt,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        status,
        slug: uniqueSlug,
        author_id: authorId,
        featured_image: featured_image || null
      });
      
      return await blogPost.save();
    } catch (error) {
      if (error.code === 11000 && error.keyPattern?.slug) {
        // Handle duplicate slug error
        const uniqueSlug = await this.generateUniqueSlug(title);
        const blogPost = new BlogPost({
          title,
          content,
          excerpt,
          tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
          status,
          slug: uniqueSlug,
          author_id: authorId,
          featured_image: featured_image || null
        });
        return await blogPost.save();
      }
      throw error;
    }
  }

  async update(id, { title, content, excerpt, tags, slug, status }) {
    try {
      // Get current post to check existing slug
      const currentPost = await this.getById(id);
      if (!currentPost) {
        throw new Error('Blog post not found');
      }
      
      // Generate unique slug if slug is being changed
      const uniqueSlug = slug && slug !== currentPost.slug 
        ? await this.generateUniqueSlug(title, currentPost.slug)
        : slug || currentPost.slug;
      
      const updateData = {
        title,
        content,
        excerpt,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : currentPost.tags,
        slug: uniqueSlug,
        status
      };
      
      return await BlogPost.findByIdAndUpdate(id, updateData, { new: true });
    } catch (error) {
      if (error.code === 11000 && error.keyPattern?.slug) {
        // Handle duplicate slug error
        const uniqueSlug = await this.generateUniqueSlug(title);
        const updateData = {
          title,
          content,
          excerpt,
          tags: tags ? tags.split(',').map(tag => tag.trim()) : currentPost.tags,
          slug: uniqueSlug,
          status
        };
        return await BlogPost.findByIdAndUpdate(id, updateData, { new: true });
      }
      throw error;
    }
  }

  async delete(id) {
    return await BlogPost.findByIdAndDelete(id);
  }
}

module.exports = { IBlogService, BlogServiceImpl }; 