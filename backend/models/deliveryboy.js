import mongoose from "mongoose";

const deliveryBoySchema = new mongoose.Schema({
    deliveryBoyName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    vehicleNo: { type: String, required: true },
    drivingLicenseNo: { type: String, required: true },

    currentlocation: {
        type: { type: String, default: 'Point' },
        coordinates: { type: [Number], required: true } // [longitude, latitude]
    },
    worksUnder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
});

export const DeliveryBoy = mongoose.model("DeliveryBoy", deliveryBoySchema);
