import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/client";

export default function Login() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSendOTP = async () => {
    if (phone.length !== 10) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await api.post("/auth/send-otp", {
        phone,
      });

      setOtpSent(true);

      setMessage(
        response.data?.testMode
          ? "Test mode: use the configured test OTP to continue."
          : "OTP sent to your mobile number."
      );
    } catch (sendError) {
      console.error("Send OTP error:", sendError);

      setError(
        sendError.response?.data?.message ||
          "Could not send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError("Enter the 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/auth/verify-otp", {
        phone,
        otp,
      });

      const token = response.data.token;
      const customer = response.data.customer;
      const isProfileComplete = customer?.isProfileComplete || false;

      localStorage.setItem("customerToken", token);
      localStorage.setItem("customer", JSON.stringify(customer));

      if (isProfileComplete) {
        navigate("/");
      } else {
        navigate("/complete-profile");
      }
    } catch (verifyError) {
      console.error("Verify OTP error:", verifyError);

      setError(
        verifyError.response?.data?.message ||
          "Incorrect OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChangeNumber = () => {
    setOtpSent(false);
    setOtp("");
    setMessage("");
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ffedd5] px-5">
      <div className="bg-white w-[850px] rounded-xl overflow-hidden shadow-lg flex">
        <div className="w-1/2 hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-full md:w-1/2 p-10">
          <h1 className="text-3xl font-bold">
            LOGIN OR SIGNUP
          </h1>

          <p className="text-gray-500 mt-2">
            Unlock coupons, profile and more
          </p>

          {error && (
            <p className="mt-5 text-sm font-semibold text-red-600">
              {error}
            </p>
          )}

          {message && !error && (
            <p className="mt-5 text-sm font-semibold text-green-600">
              {message}
            </p>
          )}

          <div className="border mt-5 flex rounded overflow-hidden">
            <div className="px-4 py-4 border-r">
              +91
            </div>

            <input
              type="text"
              maxLength="10"
              placeholder="Mobile Number"
              value={phone}
              disabled={otpSent}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, ""))
              }
              className="w-full px-4 outline-none disabled:bg-gray-100"
            />
          </div>

          {!otpSent ? (
            <button
              onClick={handleSendOTP}
              disabled={loading}
              className="w-full bg-[#7c3aed] text-white py-4 mt-6 disabled:bg-orange-200"
            >
              {loading ? "Sending..." : "SEND OTP"}
            </button>
          ) : (
            <div>
              <input
                type="text"
                placeholder="Enter OTP"
                maxLength="6"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, ""))
                }
                className="w-full border p-4 mt-6 rounded"
              />

              <button
                onClick={handleVerifyOTP}
                disabled={loading}
                className="w-full bg-[#7c3aed] text-white py-4 mt-5 disabled:bg-orange-200"
              >
                {loading ? "Verifying..." : "VERIFY OTP"}
              </button>

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={handleChangeNumber}
                  disabled={loading}
                  className="text-sm font-semibold text-gray-500 hover:text-black"
                >
                  Change number
                </button>

                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={loading}
                  className="text-sm font-semibold text-[#7c3aed] hover:underline"
                >
                  Resend OTP
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
