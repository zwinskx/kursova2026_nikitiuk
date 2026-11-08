import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldPlus, Trash2, Upload, X } from 'lucide-react';

export default function AdminPage() {
  const {
    activeTab,
    adminBookings,
    appliedFilters,
    authMode,
    averageRating,
    bookingComment,
    bookingPhone,
    budget,
    calculatedAvgPrice,
    calculatedLiquidityAvg,
    calculatedSavedValue,
    carToBook,
    cars,
    chatInput,
    chatMessages,
    compareCar1,
    compareCar2,
    confirmNewPass,
    currency,
    currentPass,
    currentReviewIdx,
    currentText,
    currentUserData,
    deliveryFreq,
    distanceUnit,
    editingCar,
    editingMileageUnit,
    emailAlerts,
    emailInput,
    fetchAdminBookings,
    fetchCars,
    fetchReviews,
    filteredReviews,
    formatMileage,
    formatPrice,
    forumInput,
    forumMessages,
    handleAddCar,
    handleAddReview,
    handleApplyFilters,
    handleAuth,
    handleAvatarUpload,
    handleClearRecent,
    handleImageUpload,
    handleOpenBookingModal,
    handleOpenCarDetail,
    handleSavePreferences,
    handleSendMessageToAI,
    handleSubmitBooking,
    handleToggleSave,
    handleUpdateCar,
    initialNewCarState,
    isAccountSwitcherOpen,
    isAuthModalOpen,
    isBookingModalOpen,
    isChatOpen,
    isFullComparisonOpen,
    isPaused,
    isSettingsOpen,
    lang,
    minLiquidity,
    minLiquidityFilter,
    nameInput,
    newCar,
    newCarMileageUnit,
    newPass,
    newReviewAuthor,
    newReviewComment,
    newReviewRating,
    passInput,
    reviewFilter,
    reviews,
    savedAccounts,
    savedVehiclesObjects,
    selectedBody,
    selectedBrand,
    selectedCarForModal,
    selectedTransmission,
    setActiveTab,
    setAdminBookings,
    setAppliedFilters,
    setAuthMode,
    setBookingComment,
    setBookingPhone,
    setBudget,
    setCarToBook,
    setCars,
    setChatInput,
    setChatMessages,
    setCompareCar1,
    setCompareCar2,
    setConfirmNewPass,
    setCurrency,
    setCurrentPass,
    setCurrentReviewIdx,
    setDeliveryFreq,
    setDistanceUnit,
    setEditingCar,
    setEditingMileageUnit,
    setEmailAlerts,
    setEmailInput,
    setForumInput,
    setForumMessages,
    setIsAccountSwitcherOpen,
    setIsAuthModalOpen,
    setIsBookingModalOpen,
    setIsChatOpen,
    setIsFullComparisonOpen,
    setIsPaused,
    setIsSettingsOpen,
    setLang,
    setMinLiquidity,
    setMinLiquidityFilter,
    setNameInput,
    setNewCar,
    setNewCarMileageUnit,
    setNewPass,
    setNewReviewAuthor,
    setNewReviewComment,
    setNewReviewRating,
    setPassInput,
    setReviewFilter,
    setReviews,
    setSavedAccounts,
    setSelectedBody,
    setSelectedBrand,
    setSelectedCarForModal,
    setSelectedTransmission,
    setSettingsAvatar,
    setSettingsCurrency,
    setSettingsDistance,
    setSettingsLang,
    setSettingsName,
    setShowAllReviews,
    setTheme,
    setUser,
    setUserPersonalData,
    settingsAvatar,
    settingsCurrency,
    settingsDistance,
    settingsLang,
    settingsName,
    showAllReviews,
    t,
    theme,
    totalDbCars,
    totalReviewsCount,
    updateCurrentUserData,
    user,
    userPersonalData
  } = useApp();

  return (
    <>
            {activeTab === 'admin' && user?.is_admin && (
        <div className="max-w-4xl mx-auto py-8 animate-fadeIn space-y-10 text-left">
          <h2 className="text-2xl font-bold flex items-center gap-2"><ShieldPlus className="text-amber-500"/> {currentText.adminTitle}</h2>
           
          <div className={`p-8 rounded-3xl border shadow-xl space-y-4 ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <h3 className="font-bold text-sm text-emerald-400 uppercase tracking-wider">{currentText.adminBookingsTitle}</h3>
            {adminBookings.length === 0 ? (
              <p className="text-xs font-medium text-slate-400">{currentText.noBookings}</p>
            ) : (
              <div className="space-y-3">
                {adminBookings.map(b => (
                  <div key={b.id} className={`p-4 rounded-2xl border flex justify-between items-center ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <div>
                      <p className="font-bold text-xs">Car ID: {b.car_id} | User: {b.user_email}</p>
                      <p className="text-xs font-medium text-slate-300 dark:text-slate-400 mt-0.5">Phone: {b.phone} | Comment: {b.comment || '-'}</p>
                      <span className={`inline-block mt-2 px-2.5 py-0.5 text-[10px] rounded font-bold uppercase ${b.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' : b.status === 'rejected' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        Status: {b.status}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => {
                        fetch(`http://127.0.0.1:8000/api/admin/bookings/${b.id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ status: 'approved' })
                        }).then(() => fetchAdminBookings());
                      }} className="px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-xl cursor-pointer">{currentText.approve}</button>
                       
                      <button onClick={() => {
                        fetch(`http://127.0.0.1:8000/api/admin/bookings/${b.id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ status: 'rejected' })
                        }).then(() => fetchAdminBookings());
                      }} className="px-3 py-1.5 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl cursor-pointer">{currentText.reject}</button>

                      <button onClick={() => {
                        if (confirm(lang === 'ua' ? 'Видалити бронювання з бази?' : 'Delete booking from DB?')) {
                          fetch(`http://127.0.0.1:8000/api/admin/bookings/${b.id}`, { method: 'DELETE' })
                            .then(() => fetchAdminBookings());
                        }
                      }} className="px-3 py-1.5 bg-red-500/10 text-red-400 text-xs font-bold rounded-xl cursor-pointer"><Trash2 size={14}/></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={`p-8 rounded-3xl border shadow-xl space-y-4 ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <h3 className="font-bold text-sm text-emerald-400 uppercase tracking-wider">{currentText.adminCarsTitle}</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {cars.map(c => (
                <div key={c.id} className={`p-3 rounded-xl border flex justify-between items-center ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center gap-3">
                    <img src={c.image_url} alt="" className="w-10 h-10 object-cover rounded-lg" />
                    <div>
                      <p className="font-bold text-xs">{c.title} ({c.year})</p>
                      <p className="text-[10px] font-semibold text-emerald-400">{formatPrice(c.price)} • {c.body_type}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => {
                      setEditingCar({ 
                        ...c, 
                        mileage: c.mileage_raw !== undefined ? c.mileage_raw : (typeof c.mileage === 'number' ? c.mileage : parseInt(String(c.mileage).replace(/\D/g, '')) || '')
                      });
                      setEditingMileageUnit(distanceUnit);
                    }} className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer">
                      {currentText.edit}
                    </button>
                    <button onClick={() => {
                      if (confirm(lang === 'ua' ? `Видалити ${c.title} з бази даних?` : `Delete ${c.title} from DB?`)) {
                        fetch(`http://127.0.0.1:8000/api/admin/cars/${c.id}`, { method: 'DELETE' })
                          .then(() => {
                            alert(lang === 'ua' ? 'Авто успішно видалено!' : 'Car deleted successfully!');
                            fetchCars();
                          });
                      }
                    }} className="px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer">
                      <Trash2 size={14}/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {editingCar && (
            <form onSubmit={handleUpdateCar} className={`p-8 rounded-3xl border shadow-xl space-y-5 animate-fadeIn border-emerald-500/40 ${theme === 'dark' ? 'bg-[#0f172a] text-white' : 'bg-white text-slate-900'}`}>
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm text-emerald-400">{currentText.editTitleHeader}: {editingCar.title}</h3>
                <button type="button" onClick={() => setEditingCar(null)} className="text-slate-400 hover:text-white"><X size={18}/></button>
              </div>
               
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 dark:text-slate-400 block mb-1">{currentText.carBrandLabel}</label>
                  <input type="text" value={editingCar.brand || ''} onChange={e=>setEditingCar({...editingCar, brand: e.target.value, title: `${e.target.value} ${editingCar.model || ''}`})} className={`w-full p-3 border rounded-xl text-xs ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} required />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 dark:text-slate-400 block mb-1">{currentText.carModelLabel}</label>
                  <input type="text" value={editingCar.model || ''} onChange={e=>setEditingCar({...editingCar, model: e.target.value, title: `${editingCar.brand || ''} ${e.target.value}`})} className={`w-full p-3 border rounded-xl text-xs ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} required />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 dark:text-slate-400 block mb-1">{lang === 'ua' ? 'Об\'єм двигуна' : 'Engine Volume'}</label>
                  <input type="text" value={editingCar.engine_volume || ''} onChange={e=>setEditingCar({...editingCar, engine_volume: e.target.value})} className={`w-full p-3 border rounded-xl text-xs ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 dark:text-slate-400 block mb-1">{currentText.bodyTypeLabel}</label>
                  <select value={editingCar.body_type || 'Sedan'} onChange={e=>setEditingCar({...editingCar, body_type: e.target.value})} className={`w-full p-3 border rounded-xl text-xs ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}>
                    <option value="Sedan">{currentText.sedan}</option>
                    <option value="SUV">{currentText.suv}</option>
                    <option value="Coupe">{currentText.coupe}</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 dark:text-slate-400 block mb-1">{currentText.transmissionLabel}</label>
                  <select value={editingCar.transmission || 'Automatic'} onChange={e=>setEditingCar({...editingCar, transmission: e.target.value})} className={`w-full p-3 border rounded-xl text-xs ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}>
                    <option value="Automatic">{currentText.automatic}</option>
                    <option value="Manual">{currentText.manual}</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 dark:text-slate-400 block mb-1">{lang === 'ua' ? 'Бейдж на фото (Badge)' : 'Photo Badge'}</label>
                  <input type="text" value={editingCar.badge || ''} onChange={e=>setEditingCar({...editingCar, badge: e.target.value})} className={`w-full p-3 border rounded-xl text-xs ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 dark:text-slate-400 block mb-1">{currentText.yearLabel}</label>
                  <input type="number" value={editingCar.year || ''} onChange={e=>setEditingCar({...editingCar, year: Number(e.target.value)})} className={`w-full p-3 border rounded-xl text-xs ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} required />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 dark:text-slate-400 block mb-1">{currentText.priceLabel}</label>
                  <input type="number" value={editingCar.price || 0} onChange={e=>setEditingCar({...editingCar, price: Number(e.target.value)})} className={`w-full p-3 border rounded-xl text-xs ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} required />
                </div>
                 
                <div>
                  <label className="text-xs font-semibold text-slate-300 dark:text-slate-400 block mb-1 flex justify-between items-center">
                    <span>{currentText.mileageLabel}</span>
                    <select 
                      value={editingMileageUnit} 
                      onChange={(e) => setEditingMileageUnit(e.target.value)}
                      className="bg-transparent text-emerald-400 font-bold text-[10px] outline-none cursor-pointer"
                    >
                      <option value="mi" className={theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>mi (милі)</option>
                      <option value="km" className={theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>km (км)</option>
                    </select>
                  </label>
                  <input 
                    type="number" 
                    value={editingCar.mileage ?? ''} 
                    onChange={e => {
                      const val = e.target.value === '' ? '' : Number(e.target.value);
                      setEditingCar({...editingCar, mileage: val});
                    }} 
                    className={`w-full p-3 border rounded-xl text-xs ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} 
                    required 
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 dark:text-slate-400 block mb-1">{currentText.liquidityLabel}</label>
                  <input type="number" value={editingCar.liquidity_score || 85} onChange={e=>setEditingCar({...editingCar, liquidity_score: Number(e.target.value), custom_liquidity: Number(e.target.value)})} className={`w-full p-3 border rounded-xl text-xs ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} required />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 dark:text-slate-400 block mb-1">{lang === 'ua' ? 'Фото автомобіля (незмінне)' : 'Car Image (locked)'}</label>
                {editingCar.image_url && (
                  <div className="w-32 h-20 rounded-xl overflow-hidden border border-emerald-500/50 shadow opacity-90">
                    <img src={editingCar.image_url} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 dark:text-slate-400 block mb-1">{currentText.descriptionLabel}</label>
                <textarea value={editingCar.description || ''} onChange={e=>setEditingCar({...editingCar, description: e.target.value})} className={`w-full p-3 border rounded-xl text-xs h-24 ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} placeholder={lang === 'ua' ? 'Введіть опис авто...' : 'Enter car description...'} />
              </div>

              <div className="flex gap-3">
                <button type="submit" className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs shadow-lg cursor-pointer">
                  {currentText.saveChanges}
                </button>
                <button type="button" onClick={() => setEditingCar(null)} className={`px-5 py-3 rounded-xl text-xs font-bold border cursor-pointer ${theme === 'dark' ? 'border-slate-700 text-slate-300' : 'border-slate-300 text-slate-700'}`}>
                  {currentText.cancel}
                </button>
              </div>
            </form>
          )}

          <form onSubmit={handleAddCar} className={`p-8 rounded-3xl border shadow-xl space-y-5 ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <h3 className="font-bold text-sm text-emerald-400">{currentText.addCarTitle}</h3>
             
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 dark:text-slate-400 block mb-1">{currentText.carBrandLabel}</label>
                <input type="text" placeholder={lang === 'ua' ? "Наприклад: Audi" : "e.g. Audi"} value={newCar.brand} onChange={e=>setNewCar({...newCar, brand: e.target.value})} className={`w-full p-3 border rounded-xl text-xs ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} required />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 dark:text-slate-400 block mb-1">{currentText.carModelLabel}</label>
                <input type="text" placeholder={lang === 'ua' ? "Наприклад: A6" : "e.g. A6"} value={newCar.model} onChange={e=>setNewCar({...newCar, model: e.target.value})} className={`w-full p-3 border rounded-xl text-xs ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} required />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 dark:text-slate-400 block mb-1">{currentText.bodyTypeLabel}</label>
                <select value={newCar.body_type} onChange={e=>setNewCar({...newCar, body_type: e.target.value})} className={`w-full p-3 border rounded-xl text-xs ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}>
                  <option value="Sedan">{currentText.sedan}</option>
                  <option value="SUV">{currentText.suv}</option>
                  <option value="Coupe">{currentText.coupe}</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 dark:text-slate-400 block mb-1">{currentText.transmissionLabel}</label>
                <select value={newCar.transmission} onChange={e=>setNewCar({...newCar, transmission: e.target.value})} className={`w-full p-3 border rounded-xl text-xs ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}>
                  <option value="Automatic">{currentText.automatic}</option>
                  <option value="Manual">{currentText.manual}</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 dark:text-slate-400 block mb-1">{lang === 'ua' ? 'Бейдж на фото (Badge)' : 'Photo Badge'}</label>
                <input type="text" placeholder="" value={newCar.badge} onChange={e=>setNewCar({...newCar, badge: e.target.value})} className={`w-full p-3 border rounded-xl text-xs ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 dark:text-slate-400 block mb-1">{currentText.yearLabel}</label>
                <input type="number" placeholder="2024" value={newCar.year} onChange={e=>setNewCar({...newCar, year: e.target.value === '' ? '' : Number(e.target.value)})} className={`w-full p-3 border rounded-xl text-xs ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} required />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 dark:text-slate-400 block mb-1">{currentText.priceLabel}</label>
                <input type="number" placeholder="45000" value={newCar.price} onChange={e=>setNewCar({...newCar, price: e.target.value === '' ? '' : Number(e.target.value)})} className={`w-full p-3 border rounded-xl text-xs ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} required />
              </div>
               
              <div>
                <label className="text-xs font-semibold text-slate-300 dark:text-slate-400 block mb-1 flex justify-between items-center">
                  <span>{currentText.mileageLabel}</span>
                  <select 
                    value={newCarMileageUnit} 
                    onChange={(e) => setNewCarMileageUnit(e.target.value)}
                    className="bg-transparent text-emerald-400 font-bold text-[10px] outline-none cursor-pointer"
                  >
                    <option value="mi" className={theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>mi (милі)</option>
                    <option value="km" className={theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>km (км)</option>
                  </select>
                </label>
                <input 
                  type="number" 
                  placeholder="10000" 
                  value={newCar.mileage} 
                  onChange={e=>setNewCar({...newCar, mileage: e.target.value === '' ? '' : Number(e.target.value)})} 
                  className={`w-full p-3 border rounded-xl text-xs ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} 
                  required 
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 dark:text-slate-400 block mb-1">{currentText.liquidityLabel}</label>
                <input type="number" placeholder="90" value={newCar.custom_liquidity} onChange={e=>setNewCar({...newCar, custom_liquidity: e.target.value === '' ? '' : Number(e.target.value)})} className={`w-full p-3 border rounded-xl text-xs ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} required />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 dark:text-slate-400 block mb-1">{currentText.imageFileLabel}</label>
              <div className={`flex items-center gap-4 p-3 border rounded-xl ${theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-300'}`}>
                <label className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold cursor-pointer transition-all">
                  <Upload size={16} />
                  {currentText.browseFile}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" required={!newCar.image_url} />
                </label>
                <span className="text-xs font-medium text-slate-400 truncate max-w-xs">
                  {newCar.image_url ? currentText.fileLoaded : currentText.noFileChosen}
                </span>
              </div>
              {newCar.image_url && (
                <div className="mt-3 w-32 h-20 rounded-xl overflow-hidden border border-emerald-500/50 shadow">
                  <img src={newCar.image_url} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 dark:text-slate-400 block mb-1">{currentText.descriptionLabel}</label>
              <textarea placeholder={lang === 'ua' ? "Введіть детальний опис авто..." : "Enter car description..."} value={newCar.description} onChange={e=>setNewCar({...newCar, description: e.target.value})} className={`w-full p-3 border rounded-xl text-xs h-24 ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} />
            </div>

            <button type="submit" className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs shadow-lg cursor-pointer">{currentText.addCarSubmit}</button>
          </form>
        </div>
      )}

    </>
  );
}
