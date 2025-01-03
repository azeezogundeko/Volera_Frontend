'use client';

import React, { useState } from 'react';
import { Star, ThumbsUp, MessageCircle, Flag } from 'lucide-react';
import Image from 'next/image';

interface Review {
  id: number;
  user: {
    name: string;
    avatar: string;
  };
  rating: number;
  date: string;
  content: string;
  helpful: number;
  replies?: Review[];
  verified?: boolean;
  source: {
    name: string;
    logo: string;
    url: string;
  };
}

interface ReviewSectionProps {
  reviews: Review[];
}

const ReviewStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-300 dark:text-gray-600'
          }`}
        />
      ))}
    </div>
  );
};

const ReviewCard = ({ review }: { review: Review }) => {
  const [isHelpful, setIsHelpful] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  return (
    <div className="space-y-4">
      <div className="space-y-4 p-4 rounded-xl bg-white dark:bg-[#141414] border border-gray-100 dark:border-[#222]">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 dark:bg-[#1a1a1a]">
              <Image
                src={review.user.avatar}
                alt={review.user.name}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>

            {/* User Info */}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900 dark:text-white">
                  {review.user.name}
                </span>
                {review.verified && (
                  <span className="px-1.5 py-0.5 text-xs font-medium text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 rounded">
                    Verified Purchase
                  </span>
                )}
                <a
                  href={review.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-gray-500 dark:text-white/50 bg-gray-50 dark:bg-white/5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                >
                  <Image
                    src={review.source.logo}
                    alt={review.source.name}
                    width={12}
                    height={12}
                    className="w-3 h-3 object-contain"
                  />
                  {review.source.name}
                </a>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <ReviewStars rating={review.rating} />
                <span className="text-sm text-gray-500 dark:text-white/50">
                  {review.date}
                </span>
              </div>
            </div>
          </div>

          {/* Report Button */}
          <button className="p-2 text-gray-400 hover:text-gray-600 dark:text-white/40 dark:hover:text-white/60">
            <Flag className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <p className="text-gray-600 dark:text-white/70 leading-relaxed">
          {review.content}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsHelpful(!isHelpful)}
            className={`flex items-center gap-2 text-sm ${
              isHelpful
                ? 'text-emerald-500'
                : 'text-gray-500 dark:text-white/50 hover:text-gray-700 dark:hover:text-white/70'
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            Helpful ({review.helpful + (isHelpful ? 1 : 0)})
          </button>
          {review.replies && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-2 text-sm text-gray-500 dark:text-white/50 hover:text-gray-700 dark:hover:text-white/70"
            >
              <MessageCircle className="w-4 h-4" />
              {showReplies ? 'Hide Replies' : `${review.replies.length} Replies`}
            </button>
          )}
        </div>
      </div>

      {/* Replies */}
      {showReplies && review.replies && (
        <div className="pl-8 space-y-4">
          {review.replies.map((reply) => (
            <ReviewCard key={reply.id} review={reply} />
          ))}
        </div>
      )}
    </div>
  );
};

const ReviewSection = ({ reviews }: ReviewSectionProps) => {
  const [sortBy, setSortBy] = useState('recent');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [filterSource, setFilterSource] = useState<string | null>(null);

  const averageRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  const ratingCounts = reviews.reduce(
    (acc, review) => {
      acc[review.rating - 1]++;
      return acc;
    },
    [0, 0, 0, 0, 0]
  );

  // Get unique sources
  const sources = Array.from(
    new Set(reviews.map((review) => review.source.name))
  );

  const filteredReviews = reviews
    .filter((review) => !filterRating || review.rating === filterRating)
    .filter((review) => !filterSource || review.source.name === filterSource)
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (sortBy === 'helpful') {
        return b.helpful - a.helpful;
      }
      return 0;
    });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Customer Reviews
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <ReviewStars rating={Math.round(averageRating)} />
            <span className="text-sm text-gray-500 dark:text-white/50">
              Based on {reviews.length} reviews
            </span>
          </div>
        </div>

        {/* Write Review Button */}
        <button className="px-4 py-2 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg">
          Write a Review
        </button>
      </div>

      {/* Rating Distribution and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          {ratingCounts
            .map((count, index) => ({
              rating: 5 - index,
              count,
              percentage: (count / reviews.length) * 100,
            }))
            .map(({ rating, count, percentage }) => (
              <button
                key={rating}
                onClick={() =>
                  setFilterRating(filterRating === rating ? null : rating)
                }
                className={`flex items-center gap-3 w-full p-2 rounded-lg transition-colors ${
                  filterRating === rating
                    ? 'bg-emerald-50 dark:bg-emerald-500/10'
                    : 'hover:bg-gray-50 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-1 w-20">
                  <Star
                    className={`w-4 h-4 ${
                      filterRating === rating
                        ? 'text-emerald-500'
                        : 'text-gray-400'
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      filterRating === rating
                        ? 'text-emerald-500'
                        : 'text-gray-600 dark:text-white/60'
                    }`}
                  >
                    {rating}
                  </span>
                </div>
                <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-white/5">
                  <div
                    className={`h-full rounded-full ${
                      filterRating === rating
                        ? 'bg-emerald-500'
                        : 'bg-yellow-400'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-12 text-sm text-gray-500 dark:text-white/50">
                  {count}
                </span>
              </button>
            ))}
        </div>

        {/* Sort and Filter Options */}
        <div className="space-y-4">
          {/* Source Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-white/70">
              Filter by Source
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterSource(null)}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  !filterSource
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/10'
                }`}
              >
                All Sources
              </button>
              {sources.map((source) => {
                const logoSrc = reviews.find((r) => r.source.name === source)?.source.logo || '/path/to/default/logo.png';
                return (
                  <button
                    key={source}
                    onClick={() => setFilterSource(source)}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg ${
                      filterSource === source
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/10'
                    }`}
                  >
                    <Image
                      src={logoSrc}
                      alt={source}
                      width={16}
                      height={16}
                      className="w-4 h-4 object-contain"
                    />
                    {source}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sort Options */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-white/70">
              Sort by
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSortBy('recent')}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  sortBy === 'recent'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/10'
                }`}
              >
                Most Recent
              </button>
              <button
                onClick={() => setSortBy('helpful')}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  sortBy === 'helpful'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/10'
                }`}
              >
                Most Helpful
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
};

export default ReviewSection;
