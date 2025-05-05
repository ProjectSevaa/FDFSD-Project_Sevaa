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

export const DeliveryImage = mongoose.model("DeliveryImage", deliveryImageSchema);
