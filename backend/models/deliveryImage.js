import mongoose from "mongoose";

const deliveryImageSchema = new mongoose.Schema({
    deliveryBoyName: {
        type: String,
        required: true,
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
});

deliveryImageSchema.index({ deliveryBoyName: 1 });
deliveryImageSchema.index({ orderId: 1 }, { unique: true });
deliveryImageSchema.index({ timestamp: -1 });

export const DeliveryImage = mongoose.model("DeliveryImage", deliveryImageSchema);
