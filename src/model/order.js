import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    madh: {
      type: Number,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: false,
    },
    phone: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: false,
      default: "",
    },

    customerType: {
      type: String,
      enum: ["retail", "wholesale"],
      default: "retail",
    },

    orderSource: {
      type: String,
      enum: ["customer_self_service", "manual_entry"],
      default: "customer_self_service",
    },

    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
        quantity: { type: Number, default: 1 },
        priceBeforeDis: { type: Number, required: true },
        priceAfterDis: { type: Number, required: true },
        name: { type: String, required: true },
        color: { type: String, required: true },
      },
    ],

    orderDate: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["Xác nhận", "Đang giao hàng", "Thành Công", "Hủy"],
      default: "Xác nhận",
    },

    payment: {
      type: String,
      enum: ["COD", "VNPAY", "MOMO", "GG PAY", "ZALO PAY"],
      default: "COD",
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: false,
      default: null,
    },

    voucherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vouchers",
      required: false,
      default: null,
      set: (v) => (v === "" ? null : v),
    },

    note: {
      type: String,
    },

    isPaymentSucces: {
      type: Boolean,
      default: false,
    },
    cancelReason: {
      type: String,
    },
    handledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      default: null,
      required: false,
    },

    invoiceRequested: {
      type: Boolean,
      default: false,
    },

    invoiceInfo: {
      companyName: {
        type: String,
        default: "",
      },
      taxCode: {
        type: String,
        default: "",
      },
      invoiceEmail: {
        type: String,
        default: "",
      },
      invoiceAddress: {
        type: String,
        default: "",
      },
      note: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
