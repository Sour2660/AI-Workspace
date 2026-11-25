import { Schema, model, Types } from "mongoose";

export interface ITask {
  title: string;
  description?: string;

  project: Types.ObjectId;

  assignee: Types.ObjectId;

  reporter: Types.ObjectId;

  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

  status: "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";

  dueDate?: Date;

  labels: string[];
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    assignee: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reporter: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "MEDIUM",
    },

    status: {
      type: String,
      enum: ["TODO", "IN_PROGRESS", "REVIEW", "DONE"],
      default: "TODO",
    },

    dueDate: Date,

    labels: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default model<ITask>("Task", taskSchema);