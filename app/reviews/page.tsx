'use client';

import { useState } from 'react';
import { Star, Sparkles, ShieldCheck } from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ReviewsPage() {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, rating, review }),
      });

      if (response.ok) {
        toast.success('Review submitted successfully!');
        setName('');
        setRating(5);
        setReview('');
      } else {
        toast.error('Failed to submit review. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again later.');
    }
  };

  // Mock reviews data (replace with actual data from your API)
  const reviews = [
    {
      id: 1,
      name: 'John Doe',
      rating: 5,
      review: "Amazing platform! The AI recommendations are spot-on and I&apos;ve saved so much money using the price tracking feature.",
      date: '2024-02-15',
      verified: true
    },
    {
      id: 2,
      name: 'Sarah Smith',
      rating: 4,
      review: 'Very useful for comparing prices across different platforms. The interface is intuitive and easy to use.',
      date: '2024-02-14',
      verified: true
    },
    // Add more reviews as needed
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      <Header />

      {/* Hero Section */}
      <div className="relative py-12 sm:py-16 md:py-24">
        <div className="text-center space-y-4 max-w-3xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm font-medium mb-4 sm:mb-6">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
            Customer Reviews
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
            Share Your Experience
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            Let us know what you think about Volera and help others make informed decisions
          </p>
        </div>
        
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-[96px] sm:blur-[128px] opacity-10 animate-blob" />
          <div className="absolute bottom-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-[96px] sm:blur-[128px] opacity-5 animate-blob animation-delay-2000" />
        </div>
      </div>

      {/* Review Form Section */}
      <div className="relative bg-[#0c0c0c] py-16 sm:py-20 md:py-24 border-t border-white/5">
        <div className="max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto px-4 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full bg-[#111111] border border-white/10 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Rating</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className="text-2xl focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= (hoveredStar || rating)
                          ? 'text-emerald-400 fill-emerald-400'
                          : 'text-gray-400'
                      } transition-colors duration-200`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Review</label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                required
                rows={4}
                className="mt-1 block w-full bg-[#111111] border border-white/10 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 resize-y"
                placeholder="Share your experience with Volera..."
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl text-sm font-medium bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300"
            >
              Submit Review
            </button>
          </form>
        </div>
      </div>

      {/* Reviews Display Section */}
      <div className="relative bg-[#0a0a0a] py-16 sm:py-20 md:py-24 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
            What Our Users Say
          </h2>
          
          <div className="grid gap-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-[#111111] border border-white/10 rounded-xl p-6 space-y-4 hover:border-emerald-500/20 transition-colors duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <span className="text-emerald-400 font-bold">
                        {review.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium">{review.name}</h4>
                      <p className="text-sm text-gray-400">{review.date}</p>
                    </div>
                  </div>
                  {review.verified && (
                    <div className="flex items-center gap-1 text-emerald-400">
                      <ShieldCheck className="w-4 h-4" />
                      <span className="text-xs">Verified User</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? 'text-emerald-400 fill-emerald-400'
                          : 'text-gray-400'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-gray-300">{review.review}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
} 