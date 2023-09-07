import BlogPost from "../entity/Blog";

/**
 * @author Marvin Ambrose
 */
class BlogService {
  /**
   * Find all blog posts
   * @author Marvin Ambrose
   * @param {}
   * @returns Promise
   */
  findBlogs = async (): Promise<any | null> => {
    const result = await BlogPost.findAndCount();

    if (!result) {
      return null;
    }
    return result;
  };

  /**
   * Find one blog post
   * @author Marvin Ambrose
   * @param {}
   * @returns Promise
   */
  findOneBlog = async (blog_id: number): Promise<any | null> => {
    const result = await BlogPost.findOne({blog_id});

    if (!result) {
      return null;
    }
    return result;
  };

  /**
   * Create a new blog post
   * @author Marvin Ambrose
   * @param data
   * @returns Promise
   */
  createBlog = async (data: object): Promise<any | null> => {
    const result = await BlogPost.insert(data);

    if (!result) {
      return null;
    }
    return result;
  };

  /**
   * Update a blog post by Id
   * @author Marvin Ambrose
   * @param data
   * @returns Promise
   */
  updateBlog = async (blog_id: number, data: object): Promise<any | null> => {
    const result = await BlogPost.update(blog_id, data);

    if (!result) {
      return null;
    }
    return result;
  };

  /**
   * Delete a blog post by Id
   * @author Marvin Ambrose
   * @param data
   * @returns Promise
   */
  deleteBlog = async (blog_id: number): Promise<any | null> => {
    const result = await BlogPost.delete({ blog_id });

    if (!result) {
      return null;
    }
    return result;
  };
}

export default {BlogService};