import { BlogController } from "./controller/BlogController"
import { UserController } from "./controller/UserController"

export const Routes = [
    {
        method: "get",
        route: "/users",
        controller: UserController,
        action: "all"
    }, 
    
    {
        method: "get",
        route: "/users/:id",
        controller: UserController,
        action: "one"
    }, 
    
    {
        method: "post",
        route: "/users",
        controller: UserController,
        action: "save"
    }, 
    
    {
        method: "delete",
        route: "/users/:id",
        controller: UserController,
        action: "remove"
    },

    {
        method: "get",
        route: "/blog",
        controller: BlogController,
        action: "findBlogs"
    },

    {
        method: "get",
        route: "/blog/:blog_id",
        controller: BlogController,
        action: "findOneBlog"
    },

    {
        method: "post",
        route: "/blog",
        controller: BlogController,
        action: "createBlog"
    },

    {
        method: "put",
        route:"/blog/:blog_id",
        controller: BlogController,
        action: "updateBlog"
    },

    {
        method: "delete",
        route:"/blog/:blog_id",
        controller: BlogController,
        action: "deleteBlog"
    }
]