import mongoose from "mongoose";

const deliveryBoySchema = new mongoose.Schema({
    deliveryBoyName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    vehicleNo: { type: String, required: true },
    drivingLicenseNo: { type: String, required: true },
    address: {
        doorNo: { type: String, required: true },
        street: { type: String, required: true },
        landmarks: { type: String },
        townCity: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        coordinates: {
            type: { type: String, default: 'Point' },
            coordinates: { type: [Number], required: true }
        }
    },
    worksUnder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

export const DeliveryBoy = mongoose.model("DeliveryBoy", deliveryBoySchema);