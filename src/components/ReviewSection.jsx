import { useEffect, useMemo, useState } from "react";
import {
  FaCheckCircle,
  FaRegStar,
  FaStar,
  FaThumbsDown,
  FaThumbsUp,
  FaUserCircle,
} from "react-icons/fa";

import api from "../api/client";

// ======================================================
// CUSTOMER DATA
// ======================================================

function getSavedCustomer() {
  try {
    return JSON.parse(
      localStorage.getItem("customer") || "null"
    );
  } catch (error) {
    console.error("Customer parse error:", error);
    return null;
  }
}

// ======================================================
// STAR DISPLAY AND INPUT
// ======================================================

function Stars({
  value = 0,
  onChange,
  size = 20,
}) {
  const normalizedValue = Math.max(
    0,
    Math.min(5, Number(value) || 0)
  );

  // Interactive stars for writing a review
  if (typeof onChange === "function") {
    return (
      <div
        className="flex items-center gap-2"
        aria-label={`${normalizedValue} out of 5 stars`}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`transition duration-200 hover:scale-125 ${
              star <= normalizedValue
                ? "text-yellow-500"
                : "text-gray-300 hover:text-yellow-400"
            }`}
            aria-label={`Give ${star} star${
              star === 1 ? "" : "s"
            }`}
          >
            {star <= normalizedValue ? (
              <FaStar size={size} />
            ) : (
              <FaRegStar size={size} />
            )}
          </button>
        ))}
      </div>
    );
  }

  // Static stars for rating summary and customer reviews
  return (
    <div
      className="flex items-center gap-1"
      aria-label={`${normalizedValue} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={
            star <= Math.round(normalizedValue)
              ? "text-yellow-500"
              : "text-gray-300"
          }
        >
          {star <= Math.round(normalizedValue) ? (
            <FaStar size={size} />
          ) : (
            <FaRegStar size={size} />
          )}
        </span>
      ))}
    </div>
  );
}

// ======================================================
// REVIEW SECTION
// ======================================================

export default function ReviewSection({
  productId,
}) {
  const customer = useMemo(
    () => getSavedCustomer(),
    []
  );

  const [reviews, setReviews] = useState([]);

  const [summary, setSummary] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    },
  });

  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [helpfulBusyId, setHelpfulBusyId] =
    useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] =
    useState("");

  // ======================================================
  // LOAD REVIEWS
  // ======================================================

  const loadReviews = async () => {
    if (!productId) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/reviews/product/${productId}`
      );

      setReviews(
        Array.isArray(response.data?.reviews)
          ? response.data.reviews
          : []
      );

      setSummary({
        averageRating: Number(
          response.data?.summary?.averageRating ||
            0
        ),

        totalReviews: Number(
          response.data?.summary?.totalReviews ||
            0
        ),

        ratingDistribution:
          response.data?.summary
            ?.ratingDistribution || {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
          },
      });
    } catch (requestError) {
      console.error(
        "Load reviews error:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
          "Unable to load customer reviews."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [productId]);

  // ======================================================
  // SUBMIT REVIEW
  // ======================================================

  const submitReview = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!customer?._id) {
      setError(
        "Please log in before writing a review."
      );
      return;
    }

    if (
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      setError(
        "Please select a rating between 1 and 5 stars."
      );
      return;
    }

    if (!comment.trim()) {
      setError(
        "Please write your experience."
      );
      return;
    }

    if (comment.trim().length < 5) {
      setError(
        "Your review must contain at least 5 characters."
      );
      return;
    }

    try {
      setSubmitting(true);

      const response = await api.post(
        "/reviews",
        {
          productId,
          userId: customer._id,

          userName:
            customer.name?.trim() ||
            "Customer",

          rating,
          title: title.trim(),
          comment: comment.trim(),
        }
      );

      setTitle("");
      setComment("");
      setRating(5);

      setSuccess(
        response.data?.message ||
          "Your review was submitted successfully."
      );

      await loadReviews();
    } catch (requestError) {
      console.error(
        "Submit review error:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
          "Review could not be submitted."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ======================================================
  // HELPFUL / NOT HELPFUL
  // ======================================================

  const markHelpful = async (
    reviewId,
    type
  ) => {
    setError("");
    setSuccess("");

    if (!customer?._id) {
      setError(
        "Please log in before voting on a review."
      );
      return;
    }

    try {
      setHelpfulBusyId(
        `${reviewId}-${type}`
      );

      const response = await api.post(
        `/reviews/${reviewId}/helpful`,
        {
          userId: customer._id,
          type,
        }
      );

      setReviews((currentReviews) =>
        currentReviews.map((review) =>
          review._id === reviewId
            ? {
                ...review,

                likes: Array.from({
                  length:
                    Number(
                      response.data?.likes
                    ) || 0,
                }),

                dislikes: Array.from({
                  length:
                    Number(
                      response.data?.dislikes
                    ) || 0,
                }),
              }
            : review
        )
      );
    } catch (requestError) {
      console.error(
        "Review vote error:",
        requestError
      );

      setError(
        requestError.response?.data?.message ||
          "Your vote could not be saved."
      );
    } finally {
      setHelpfulBusyId("");
    }
  };

  const ratingLabel = {
    1: "Very Poor",
    2: "Poor",
    3: "Good",
    4: "Very Good",
    5: "Excellent",
  };

  return (
    <section className="bg-[#f7f7f7] border-t">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Heading */}

        <div className="mb-10">
          <p className="text-sm uppercase tracking-[4px] font-bold text-yellow-600">
            Ratings and feedback
          </p>

          <h2 className="text-3xl md:text-4xl font-black mt-2">
            Customer Reviews
          </h2>

          <p className="text-gray-500 mt-3 max-w-2xl">
            See what customers think about
            this product and share your own
            experience.
          </p>
        </div>

        {/* Messages */}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-5 py-4 rounded-2xl">
            {success}
          </div>
        )}

        {/* Summary and form */}

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Rating summary */}

          <div className="lg:col-span-2 bg-white rounded-[30px] p-7 md:p-9 border shadow-sm">
            <h3 className="text-xl font-black">
              Overall Rating
            </h3>

            <div className="flex flex-wrap items-end gap-5 mt-6">
              <div className="text-6xl font-black leading-none">
                {Number(
                  summary.averageRating || 0
                ).toFixed(1)}
              </div>

              <div>
                <Stars
                  value={
                    summary.averageRating || 0
                  }
                  size={26}
                />

                <p className="text-gray-500 mt-2">
                  Based on{" "}
                  {summary.totalReviews || 0}{" "}
                  review
                  {summary.totalReviews === 1
                    ? ""
                    : "s"}
                </p>
              </div>
            </div>

            <div className="mt-9 space-y-4">
              {[5, 4, 3, 2, 1].map(
                (star) => {
                  const count = Number(
                    summary
                      .ratingDistribution?.[
                      star
                    ] || 0
                  );

                  const percentage =
                    summary.totalReviews > 0
                      ? Math.round(
                          (count /
                            summary.totalReviews) *
                            100
                        )
                      : 0;

                  return (
                    <div
                      key={star}
                      className="grid grid-cols-[45px_1fr_45px] items-center gap-3"
                    >
                      <span className="font-bold flex items-center gap-1">
                        {star}
                        <FaStar className="text-yellow-500 text-sm" />
                      </span>

                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-500 rounded-full transition-all duration-500"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>

                      <span className="text-right text-gray-600">
                        {count}
                      </span>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {/* Review form */}

          <form
            onSubmit={submitReview}
            className="lg:col-span-3 bg-white rounded-[30px] p-7 md:p-9 border shadow-sm"
          >
            <h3 className="text-2xl font-black">
              Write a Review
            </h3>

            <p className="text-gray-500 mt-2">
              Tell other customers about your
              experience with this product.
            </p>

            <div className="mt-7">
              <label className="block font-bold mb-3">
                Your Rating
              </label>

              <div className="flex flex-wrap items-center gap-4">
                <Stars
                  value={rating}
                  onChange={setRating}
                  size={32}
                />

                <span className="text-sm font-bold text-yellow-700 bg-yellow-50 px-3 py-2 rounded-full">
                  {ratingLabel[rating]}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <label
                htmlFor="review-title"
                className="block font-bold mb-2"
              >
                Review title
                <span className="text-gray-400 font-normal">
                  {" "}
                  (optional)
                </span>
              </label>

              <input
                id="review-title"
                type="text"
                value={title}
                maxLength={120}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="For example: Excellent quality"
                className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-black transition"
              />

              <p className="text-xs text-gray-400 text-right mt-1">
                {title.length}/120
              </p>
            </div>

            <div className="mt-4">
              <label
                htmlFor="review-comment"
                className="block font-bold mb-2"
              >
                Your experience
              </label>

              <textarea
                id="review-comment"
                value={comment}
                maxLength={2000}
                onChange={(event) =>
                  setComment(
                    event.target.value
                  )
                }
                placeholder="What did you like or dislike about this product?"
                required
                rows={6}
                className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-black transition resize-none"
              />

              <p className="text-xs text-gray-400 text-right mt-1">
                {comment.length}/2000
              </p>
            </div>

            {!customer?._id && (
              <p className="mt-4 text-sm text-orange-700 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3">
                You must log in before submitting
                a review.
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 bg-black text-white px-8 py-4 rounded-2xl font-bold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting
                ? "Submitting Review..."
                : "Submit Review"}
            </button>
          </form>
        </div>

        {/* Review list */}

        <div className="mt-14">
          <div className="flex items-center justify-between gap-4 mb-7">
            <div>
              <h3 className="text-2xl font-black">
                Customer Feedback
              </h3>

              <p className="text-gray-500 mt-1">
                {summary.totalReviews || 0}{" "}
                published review
                {summary.totalReviews === 1
                  ? ""
                  : "s"}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="bg-white rounded-3xl border p-14 text-center">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto" />

              <p className="mt-4 text-gray-500 font-semibold">
                Loading reviews...
              </p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="bg-white rounded-3xl border p-12 text-center shadow-sm">
              <FaRegStar className="text-6xl text-gray-300 mx-auto" />

              <h4 className="text-2xl font-black mt-5">
                No Reviews Yet
              </h4>

              <p className="text-gray-500 mt-2">
                Be the first customer to review
                this product.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {reviews.map((review) => (
                <article
                  key={review._id}
                  className="bg-white rounded-[28px] p-7 border shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <FaUserCircle className="text-4xl text-gray-300 shrink-0" />

                      <div>
                        <h4 className="font-black text-lg">
                          {review.userName ||
                            "Customer"}
                        </h4>

                        <div className="mt-1">
                          <Stars
                            value={review.rating}
                            size={18}
                          />
                        </div>

                        {review.verifiedPurchase && (
                          <p className="text-green-600 text-sm font-bold mt-2 flex items-center gap-2">
                            <FaCheckCircle />
                            Verified Purchase
                          </p>
                        )}
                      </div>
                    </div>

                    <span className="text-gray-400 text-sm whitespace-nowrap">
                      {review.createdAt
                        ? new Date(
                            review.createdAt
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : ""}
                    </span>
                  </div>

                  {review.title && (
                    <h5 className="font-black text-lg mt-6">
                      {review.title}
                    </h5>
                  )}

                  <p className="text-gray-700 mt-3 leading-7 whitespace-pre-wrap break-words">
                    {review.comment}
                  </p>

                  <div className="border-t mt-6 pt-5">
                    <p className="text-sm text-gray-500 mb-3">
                      Was this review helpful?
                    </p>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        disabled={
                          helpfulBusyId ===
                          `${review._id}-like`
                        }
                        onClick={() =>
                          markHelpful(
                            review._id,
                            "like"
                          )
                        }
                        className="flex items-center gap-2 border px-4 py-2 rounded-full text-gray-600 hover:bg-green-50 hover:text-green-700 hover:border-green-300 transition disabled:opacity-50"
                      >
                        <FaThumbsUp />
                        Helpful
                        <span>
                          {review.likes?.length ||
                            0}
                        </span>
                      </button>

                      <button
                        type="button"
                        disabled={
                          helpfulBusyId ===
                          `${review._id}-dislike`
                        }
                        onClick={() =>
                          markHelpful(
                            review._id,
                            "dislike"
                          )
                        }
                        className="flex items-center gap-2 border px-4 py-2 rounded-full text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition disabled:opacity-50"
                      >
                        <FaThumbsDown />
                        <span>
                          {review.dislikes
                            ?.length || 0}
                        </span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}