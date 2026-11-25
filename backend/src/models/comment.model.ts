import { Schema, model, Types } from "mongoose";

export interface IComment {
  message: string;
  task: Types.ObjectId;
  user: Types.ObjectId;
}

const commentSchema = new Schema<IComment>(
  {
    message: {
      type: String,
      required: true,
      trim: true,
    },

    task: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IComment>("Comment", commentSchema);