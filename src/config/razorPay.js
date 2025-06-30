import Razorpay from "razorpay";
import { RAZORPAY_APIKEY, RAZORPAY_SECRETKEY } from "./envConfig.js";

// Replace with your Razorpay credentials
const razorpay = new Razorpay({
  key_id: RAZORPAY_APIKEY,
  key_secret: RAZORPAY_SECRETKEY,
});

export default razorpay;
