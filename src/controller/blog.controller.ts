import { rm } from "fs/promises";
import { BlogPostschema, BlogUpdateschema } from "../schemas/blog.schema";
import { NextFunction, Request, Response } from "express";
import upload from "../config/multer";
import { Blog } from "../config/db";
import path from "path";
import { catchAsync } from "../util/error";

const uploads = upload.single("img");
export const postBlog = [
  uploads,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const value = await BlogPostschema.validateAsync({
        ...req.body,
        img: req.file?.filename,
      });
      const blog = await Blog.create({
        data: {
          ...value,
          img: req.file?.filename,
          authorId: 1, //FIXME: get the author id from the token
        },
      });
      return res.send(blog);
    } catch (err) {
      if (req.file?.filename) {
        //if the validation fails, delete the uploaded file
        await rm(path.join(__dirname, "./uploads/", req.file?.filename));
      }
      next(err);
    }
  },
];
export const getBlogs = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const page = Number(req.query?.page) || 1;
    const PAGE_SIZE = 5;
    const limit = Number(req.query?.limit) || PAGE_SIZE;
    const results = await Blog.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });
    res.send(results);
  }
);
export const getBlog = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const blogId = Number(req.params.id);
    const blog = await Blog.findUnique({
      where: {
        id: blogId,
      },
    });
    if (!blog) {
      return res.status(404).send("Blog not found");
    }
    res.send(blog);
  }
);

export const deleteBlog = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const blogId = Number(req.params.id);
    const blog = await Blog.findUnique({
      where: {
        id: blogId,
      },
    });
    if (!blog) {
      return res.status(404).send("Blog not found");
    }
    await Blog.delete({
      where: {
        id: blogId,
      },
    });
    res.send("Blog deleted");
  }
);

export const updateBlog = [
  uploads,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const blogId = Number(req.params.id);
      const blog = await Blog.findUnique({
        where: {
          id: blogId,
        },
      });
      if (!blog) {
        return res.status(404).send("Blog not found");
      }
      const body = req.body;
      if (req.file) {
        body["img"] = req.file?.filename;
      }
      const value = await BlogUpdateschema.validateAsync(body);
      const updatedBlog = await Blog.update({
        where: {
          id: blogId,
        },
        data: value,
      });
      res.send(updatedBlog);
    } catch (err) {
      if (req.file?.filename) {
        //if the validation fails, delete the uploaded file
        await rm(path.join(__dirname, "./uploads/", req.file?.filename));
      }
      next(err);
    }
  },
];
