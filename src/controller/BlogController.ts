import { NextFunction, Request, Response } from "express";
import { middlewares } from "../middlewares";

import {BlogPost} from "../data/entity/Blog";
import { AppDataSource } from "../data-source";

const { responses, messages, codes } = middlewares;

/**
 * @author Marvin Ambrose
 */
export class BlogController {
  /**
   * Find all blogs
   * @author Marvin Ambrose
   * @param req
   * @param res
   * @returns response
   */

  private blogRepository = AppDataSource.getRepository(BlogPost);

  findBlogs = async (req: Request, res: Response) => {

    const blogPosts = await this.blogRepository.query("SELECT * FROM blog_post");
    
    return blogPosts.length > 0 ? { "status": 200, "count": blogPosts.length, blogPosts} : {"status": codes.error(), "message": messages.notFound()}
  };

  /**
   * Find one blog
   * @author Marvin Ambrose
   * @param req
   * @param res
   * @returns response
   */
  findOneBlog = async (req: Request, res: Response, next: NextFunction) => {
    const blog_id = parseInt(req.params.blog_id);

    const response = await this.blogRepository.query(`SELECT blog_id, title, description FROM blog_post WHERE blog_id=${blog_id}`);

    if (!response) {
      res.status(404).send({message: `Blog Post with id: ${blog_id} not found`});
    }

    return response.length > 0 ? { "status": 200, data: response} : {"status": 404, "message": `Blog Post with id: ${blog_id} not found`}
  };

  /**
   * Create a new blog
   * @author Marvin Ambrose
   * @param req
   * @param res
   * @returns response
   */
  createBlog = async (req: Request, res: Response, next: NextFunction) => {
    const {
      title,
      description,
    }: {
      title: string;
      description: string;
    } = req.body;

    const response = await this.blogRepository.query("INSERT INTO blog_post (title, description) VALUES(" + `"${title}"` + ", "  + `"${description}"` + ")");

    if (!response) {
      return res.send({status: codes.error(), message: messages.error()});
    }

    const blog_id = response.blog_id;

    return {
      status: codes.created(),
      message: messages.created(),
      data: { blog_id, title, description }
    };
  };

  /**
   * Update one blog
   * @author Marvin Ambrose
   * @param req
   * @param res
   * @returns response
   */
  updateBlog = async (req: Request, res: Response, next: NextFunction) => {
    const {
      title,
      description,
    }: {
      title: string;
      description: string;
    } = req.body;

    const { blog_id } = req.params;
    // check for blog id 
    const blogpost = await this.blogRepository.query(`SELECT blog_id, title, description FROM blog_post WHERE blog_id=${parseInt(blog_id)}`);
    if (!blogpost.length) {
      return res.status(404).send({message: `Blog Post with id: ${blog_id} not found`});
    }
    
    // parseInt(blog_id)
    const response = await this.blogRepository.query("UPDATE blog_post SET title = " + `"${title}", description = "${description}" WHERE blog_id=${blog_id};`);

    if (!response) {
      return res.send({status: codes.error(), message: messages.error()});
    }

    return {
      status: codes.created(),
      message: messages.updated(),
      data: { blog_id, title, description }
    };
  }
  /**
   * Update one blog
   * @author Marvin Ambrose
   * @param req
   * @param res
   * @returns response
   */
  deleteBlog = async (req: Request, res: Response) => {
    const { blog_id } = req.params;

    // check for blog id 
    const blogpost = await this.blogRepository.query(`SELECT blog_id, title, description FROM blog_post WHERE blog_id=${parseInt(blog_id)}`);
    if (!blogpost.length) {
      res.status(404).send({message: `Blog Post with id: ${blog_id} not found`});
      return;
    }

    const response = await this.blogRepository.query(`DELETE FROM blog_post WHERE blog_id = ${parseInt(blog_id)}`);

    if (!response) {
      return responses.error(codes.error(), messages.error(), res);
    }

    return {
      status: codes.ok(),
      message: messages.deleted(),
    };
  };
}