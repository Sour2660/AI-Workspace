import { Schema, model, Types } from "mongoose";

export interface IProject {
  name: string;
  description?: string;
  workspace: Types.ObjectId;
  owner: Types.ObjectId;
  members: Types.ObjectId[];
  status: "ACTIVE" | "ARCHIVED";
}

const projectSchema = new Schema<IProject>(
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
    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
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
    status: {
      type: String,
      enum: ["ACTIVE", "ARCHIVED"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  }
);

export default model<IProject>("Project", projectSchema);