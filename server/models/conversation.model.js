import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      ],
      validate: {
        validator: function (value) {
          return value.length === 2;
        },
        message: "Direct conversation must have exactly 2 participants",
      },
      required: true,
    },
  },
  { timestamps: true },
);

conversationSchema.index({ participants: 1 }, { unique: true });

export default mongoose.model("Conversation", conversationSchema);
