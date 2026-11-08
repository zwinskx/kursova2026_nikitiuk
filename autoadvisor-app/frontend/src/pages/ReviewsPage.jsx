import React from 'react';
import { Star, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import ForumSection from '../components/ForumSection';

export default function ReviewsPage() {
  const { theme } = useTheme();
  const {
    currentText, lang, averageRating, totalReviewsCount, showAllReviews, setShowAllReviews,
    setIsPaused, reviews, currentReviewIdx, setCurrentReviewIdx, reviewFilter, setReviewFilter,
    filteredReviews, handleAddReview, newReviewRating, setNewReviewRating,
    newReviewAuthor, setNewReviewAuthor, newReviewComment, setNewReviewComment
  } = useApp();

  return (
    <div className="max-w-4xl mx-auto py-6 animate-fadeIn">
      <div className="flex justify-between items-start mb-10">
        <div className="text-left">
          <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">{currentText.customerReviews}</span>
          <h2 className="text-3xl font-black mt-1">{currentText.whatTheySay}</h2>
        </div>
        <div className={`p-4 rounded-3xl border flex items-center gap-4 shadow-xl ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
          <div className="text-3xl font-black text-emerald-400">{averageRating}</div>
          <div>
            <div className="flex text-amber-400"><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} stroke="currentColor"/></div>
            <p className="text-xs font-semibold text-slate-300 dark:text-slate-400 mt-0.5">{totalReviewsCount} {lang === 'ua' ? 'відгуків' : 'reviews'}</p>
          </div>
        </div>
      </div>

      {!showAllReviews && (
        <div
          className="relative mb-8 overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-700 ease-in-out">
            {reviews.slice(currentReviewIdx, currentReviewIdx + 3).map((rev, idx) => (
              <div key={idx} className={`p-7 rounded-3xl border shadow-xl flex flex-col justify-between transition-transform duration-500 hover:-translate-y-1 ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}>
                <div>
                  <div className="flex text-amber-400 mb-3">
                    {[...Array(rev.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                  </div>
                  <p className="text-sm font-medium italic mb-6 leading-relaxed opacity-95 text-left">"{rev.comment}"</p>
                </div>
                <div className={`pt-4 border-t ${theme === 'dark' ? 'border-slate-700/40' : 'border-slate-200'} flex justify-between items-center text-xs`}>
                  <span className="font-bold">{rev.author}</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 size={12}/> {lang === 'ua' ? 'Перевірено' : 'Verified'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {reviews.length > 3 && !showAllReviews && (
        <div className="flex justify-center gap-2 mt-6">
          <button onClick={() => setCurrentReviewIdx(0)} className={`h-2 rounded-full transition-all cursor-pointer ${currentReviewIdx === 0 ? 'w-8 bg-emerald-500' : 'w-2 bg-slate-600'}`} />
          <button onClick={() => setCurrentReviewIdx(3)} className={`h-2 rounded-full transition-all cursor-pointer ${currentReviewIdx === 3 ? 'w-8 bg-emerald-500' : 'w-2 bg-slate-600'}`} />
        </div>
      )}

      <div className="text-center my-10">
        <button onClick={() => setShowAllReviews(!showAllReviews)} className={`px-8 py-3.5 rounded-2xl border text-xs font-bold transition-all shadow-lg cursor-pointer ${theme === 'dark' ? 'border-slate-700 hover:bg-slate-800 text-white' : 'border-slate-300 hover:bg-slate-100 text-slate-800'}`}>
          {showAllReviews ? currentText.hideReviews : `${currentText.viewAllReviews} (${totalReviewsCount})`}
        </button>

        {showAllReviews && (
          <div className="mt-8 space-y-6 text-left animate-fadeIn">
            <div className="flex gap-2 justify-center flex-wrap">
              <button onClick={() => setReviewFilter('all')} className={`px-4 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${reviewFilter === 'all' ? 'bg-emerald-500 text-white' : theme === 'dark' ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-800'}`}>{lang === 'ua' ? 'Усі оцінки' : 'All ratings'}</button>
              {[5, 4, 3, 2, 1].map(stars => (
                <button key={stars} onClick={() => setReviewFilter(String(stars))} className={`px-4 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${reviewFilter === String(stars) ? 'bg-emerald-500 text-white' : theme === 'dark' ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-800'}`}>{stars} ★</button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredReviews.map((r, i) => (
                <div key={i} className={`p-5 rounded-2xl border shadow-md ${theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-bold text-xs">{r.author}</p>
                    <div className="flex text-amber-400">
                      {[...Array(r.rating)].map((_, s) => <Star key={s} size={12} fill="currentColor" />)}
                    </div>
                  </div>
                  <p className="text-xs font-medium opacity-90 text-left">"{r.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={`border rounded-3xl p-8 mb-12 shadow-2xl relative overflow-hidden text-left ${theme === 'dark' ? 'bg-[#121824] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
        <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">{currentText.yourOpinion}</span>
        <h3 className="text-2xl font-black mt-1 mb-2">{currentText.shareExperience}</h3>

        <form onSubmit={handleAddReview} className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-semibold opacity-90">{currentText.yourRating}</span>
            <div className="flex text-amber-400 cursor-pointer gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={22} fill={star <= newReviewRating ? "currentColor" : "none"} onClick={() => setNewReviewRating(star)} />
              ))}
            </div>
          </div>
          <input type="text" placeholder={lang === 'ua' ? "Ваше ім'я" : "Your name"} value={newReviewAuthor} onChange={e=>setNewReviewAuthor(e.target.value)} className={`w-full p-3.5 border rounded-2xl text-xs font-medium outline-none ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} required />
          <textarea placeholder={lang === 'ua' ? "Ваш відгук..." : "Your review..."} value={newReviewComment} onChange={e=>setNewReviewComment(e.target.value)} className={`w-full p-3.5 border rounded-2xl text-xs font-medium h-24 outline-none ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} required />
          <button type="submit" className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-2xl shadow-lg cursor-pointer">{currentText.publishReview}</button>
        </form>
      </div>

      {/* Форум: писати й відповідати можуть лише зареєстровані користувачі */}
      <ForumSection />
    </div>
  );
}