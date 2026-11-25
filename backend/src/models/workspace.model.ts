import { Schema, model, models, Document, Types } from "mongoose";

export interface IWorkspace extends Document {
  name: string;
  description?: string;
  color: string;
  owner: Types.ObjectId;
  members: Types.ObjectId[];
  isArchived: boolean;
}

const workspaceSchema = new Schema<IWorkspace>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    color: {
      type: String,
      default: "#3B82F6",
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default models.Workspace ||
  model<IWorkspace>("Workspace", workspaceSchema);