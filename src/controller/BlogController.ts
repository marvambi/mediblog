import { Request, Response } from "express";
import { middlewares } from "../middlewares";

import Service from "../data/services/BlogService";

const { responses, messages, codes } = middlewares;

const { BlogService } = Service;
/**
 * @author Ntavigwa Bashombe
 */
class BlogController {
  /**
   * Find all blogs
   * @author Ntavigwa Bashombe
   * @param req
   * @param res
   * @returns response
   */
  findBlogs = async (req: Request, res: Response) => {
    const response = await BlogService.findBlogs();

    if (!response) {
      return responses.error(codes.error(), messages.error(), res);
    }

    return responses.success(
      codes.ok(),
      messages.ok(),
      {
        count: response[1],
        data: response[0],
      },
      res
    );
  };

  /**
   * Find one blog
   * @author Ntavigwa Bashombe
   * @param req
   * @param res
   * @returns response
   */
  findOneBlog = async (req: Request, res: Response) => {
    const { blog_id } = req.params;

    const response = await BlogService.findOneBlog(parseInt(blog_id));

    if (!response) {
      return responses.error(codes.error(), messages.notFound(), res);
    }

    return responses.success(codes.ok(), messages.ok(), response, res);
  };

  /**
   * Create a new blog
   * @author Ntavigwa Bashombe
   * @param req
   * @param res
   * @returns response
   */
  createBlog = async (req: Request, res: Response) => {
    const {
      title,
      description,
    }: {
      title: string;
      description: string;
    } = req.body;

    const response = await BlogService.createBlog({
      title,
      description,
    });

    if (!response) {
      return responses.error(codes.error(), messages.notFound(), res);
    }

    const blog_id = response.raw.insertId;

    return responses.success(
      codes.created(),
      messages.created(),
      { blog_id, title, description },
      res
    );
  };

  /**
   * Update one blog
   * @author Ntavigwa Bashombe
   * @param req
   * @param res
   * @returns response
   */
  updateBlog = async (req: Request, res: Response) => {
    const {
      title,
      description,
    }: {
      title: string;
      description: string;
    } = req.body;

    const { blog_id } = req.params;

    const response = await BlogService.updateBlog(parseInt(blog_id), {
      title,
      description,
    });

    if (!response) {
      return responses.error(codes.error(), messages.error(), res);
    }

    return responses.success(
      codes.ok(),
      messages.ok(),
      { blog_id, title, description },
      res
    );
  };

  /**
   * Update one blog
   * @author Ntavigwa Bashombe
   * @param req
   * @param res
   * @returns response
   */
  deleteBlog = async (req: Request, res: Response) => {
    const { blog_id } = req.params;

    const response = await BlogService.deleteBlog(parseInt(blog_id));

    if (!response) {
      return responses.error(codes.error(), messages.error(), res);
    }

    return responses.ok(codes.ok(), messages.ok(), res);
  };
}

export default BlogController;