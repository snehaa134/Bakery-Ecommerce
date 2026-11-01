
const mongoose = require("mongoose");
const festivalThemeSchema = new mongoose.Schema(
  {
    festivalName: {
      type: String,
      required: true,
      trim: true
    },
    primaryColor: {
      type: String,
      default: "#E91E63",
      match: /^#[0-9A-Fa-f]{6}$/
    },
    secondaryColor: {
      type: String,
      default: "#FFF0F5",
      match: /^#[0-9A-Fa-f]{6}$/
    },
    slug:{
      type:String,
      required:true,
      unique:true,
      lowercase:true,
      trim:true
    },
    festivalDate: {
      type: Date,
      required: [true, "Festival Date is required"]
    },
    endDate: {
      type: Date,
      required: [true, "Festival end date is required"]
    },
    activationMode: {
      type: String,
      enum: ["automatic", "manual"],
      default: "automatic"
    },
    isManuallyActive: {
      type: Boolean,
      default: false
    },
    isEnabled: {
      type: Boolean,
      default: true
    },
    priority: {
      type: Number,
      default: 1,
      min: 1
    },
    activateBeforeDays: {
      type: Number,
      default: 10,
      min: 0
    },
    expiryAfterDays: {
      type: Number,
      default: 2,
      min: 0
    },
    animationType:{
      type:String,
      enum:["none","diya-glow","sparkle","fade","snowfall","twinkle","slide","confetti","gold-glow","zoom"],
      default:"none"
    }

  }, {
  timestamps: true
}
);

festivalThemeSchema.pre("validate", function () {
  if (
    this.festivalDate &&
    this.endDate &&
    this.endDate < this.festivalDate
  ) {
    this.invalidate(
      "endDate",
      "End Date cannot be before Festival Date"
    )
  }
});


module.exports = mongoose.model("FestiveTheme", festivalThemeSchema)