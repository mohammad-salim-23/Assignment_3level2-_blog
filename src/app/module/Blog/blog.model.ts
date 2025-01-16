import { model, Schema } from "mongoose";
import { TBlog } from "./blog.interface";

const blogSchema = new Schema<TBlog>(
    {
        title:{
            type:String,
            required:true
        },
        content:{
            type:String,
            required:true
        },
        author:{
            type:Schema.Types.ObjectId,
           
            ref:"User"
        },
        isPublished:{
            type:Boolean,
            default:true
        }
    },
    {
        timestamps:true,
        toJSON: {
            transform: function (doc, ret) {
                delete ret.isPublished; 
                return ret;
            },
        },
    }
);
export const Blog = model<TBlog>("Blog",blogSchema);