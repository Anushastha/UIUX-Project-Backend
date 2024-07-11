const { default: mongoose } = require("mongoose");

const saveSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    savedItems: [
        {
          college: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "colleges",
          },
        },
      ],
  },
  {
    timestamps: true,
  }
);

const Save = mongoose.model("Save", saveSchema);
module.exports = Save;