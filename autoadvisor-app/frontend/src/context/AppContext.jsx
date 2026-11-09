import React, { createContext, useContext, useState, useEffect } from 'react';
import { t } from '../constants/translations';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [activeTab, setActiveTab] = useState('overview');

  const [lang, setLang] = useState(() => localStorage.getItem('autoadvisor_lang') || 'ua');
  const [currency, setCurrency] = useState(() => localStorage.getItem('autoadvisor_currency') || 'USD');
  const [distanceUnit, setDistanceUnit] = useState(() => localStorage.getItem('autoadvisor_distance') || 'mi');

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('autoadvisor_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [savedAccounts, setSavedAccounts] = useState(() => {
    const saved = localStorage.getItem('autoadvisor_accounts');
    return saved ? JSON.parse(saved) : (user ? [user] : []);
  });

  const [isAccountSwitcherOpen, setIsAccountSwitcherOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [emailInput, setEmailInput] = useState('');
  const [passInput, setPassInput] = useState('');
  const [nameInput, setNameInput] = useState('');

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsName, setSettingsName] = useState(user?.display_name || '');
  const [settingsAvatar, setSettingsAvatar] = useState(user?.avatar_url || '');
  const [settingsLang, setSettingsLang] = useState(lang);
  const [settingsCurrency, setSettingsCurrency] = useState(currency);
  const [settingsDistance, setSettingsDistance] = useState(distanceUnit);
  const [emailAlerts, setEmailAlerts] = useState(user?.email_alerts ?? true);
  const [deliveryFreq, setDeliveryFreq] = useState('Daily digest');
  const [minLiquidity, setMinLiquidity] = useState(85);

  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmNewPass, setConfirmNewPass] = useState('');

  const [budget, setBudget] = useState(150000);
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedBody, setSelectedBody] = useState('Any');
  const [selectedTransmission, setSelectedTransmission] = useState('Any');
  const [minLiquidityFilter, setMinLiquidityFilter] = useState(0);

  const [appliedFilters, setAppliedFilters] = useState({
    budget: 150000,
    brand: 'All',
    body: 'Any',
    transmission: 'Any',
    minLiquidity: 0
  });

  const [cars, setCars] = useState([]);
  const [adminBookings, setAdminBookings] = useState([]);
  const [selectedCarForModal, setSelectedCarForModal] = useState(null);
  const [isFullComparisonOpen, setIsFullComparisonOpen] = useState(false);

  const [editingCar, setEditingCar] = useState(null);
  const [editingMileageUnit, setEditingMileageUnit] = useState('mi');
  const [newCarMileageUnit, setNewCarMileageUnit] = useState('mi');

  const [userPersonalData, setUserPersonalData] = useState(() => {
    const savedData = localStorage.getItem('autoadvisor_personal_data');
    return savedData ? JSON.parse(savedData) : {};
  });

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [carToBook, setCarToBook] = useState(null);
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingComment, setBookingComment] = useState('');

  const [reviews, setReviews] = useState([]);
  const [currentReviewIdx, setCurrentReviewIdx] = useState(0);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [reviewFilter, setReviewFilter] = useState('all');
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [isPaused, setIsPaused] = useState(false);

  const [compareCar1, setCompareCar1] = useState(null);
  const [compareCar2, setCompareCar2] = useState(null);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: lang === 'ua' ? 'Привіт! Я AI-помічник AutoAdvisor. Чим можу допомогти з вибором авто?' : 'Hello! I am your AutoAdvisor AI assistant. How can I help you choose a car?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    localStorage.setItem('autoadvisor_lang', lang);
    localStorage.setItem('autoadvisor_currency', currency);
    localStorage.setItem('autoadvisor_distance', distanceUnit);
  }, [lang, currency, distanceUnit]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('autoadvisor_user', JSON.stringify(user));
      setSavedAccounts(prev => {
        const exists = prev.some(acc => acc.email === user.email);
        const updated = exists ? prev.map(acc => acc.email === user.email ? user : acc) : [...prev, user];
        localStorage.setItem('autoadvisor_accounts', JSON.stringify(updated));
        return updated;
      });
    } else {
      localStorage.removeItem('autoadvisor_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('autoadvisor_personal_data', JSON.stringify(userPersonalData));
  }, [userPersonalData]);

  useEffect(() => {
    if (reviews.length <= 3 || showAllReviews || isPaused) return;
    const interval = setInterval(() => {
      setCurrentReviewIdx(prev => (prev === 0 ? 3 : 0));
    }, 5000);
    return () => clearInterval(interval);
  }, [reviews.length, showAllReviews, isPaused]);

  const initialNewCarState = {
    brand: '', model: '', year: '', body_type: 'Sedan', transmission: 'Automatic',
    mileage: '', price: '', engine_volume: '2.0L', custom_liquidity: 85, badge: '',
    image_url: '',
    description: ''
  };

  const [newCar, setNewCar] = useState(initialNewCarState);

  const currentText = t[lang];

  const fetchCars = () => {
    fetch(`http://127.0.0.1:8000/api/recommendations?budget_max=${appliedFilters.budget}&brand=${appliedFilters.brand}&body_type=${appliedFilters.body}&transmission=${appliedFilters.transmission}&min_liquidity=${appliedFilters.minLiquidity}`)
      .then(res => res.json())
      .then(data => {
        setCars(data);
        if (data.length >= 2) {
          if (!compareCar1) setCompareCar1(data[0]);
          if (!compareCar2) setCompareCar2(data[1]);
        }
      })
      .catch(() => {});
  };

  const fetchReviews = () => {
    fetch('http://127.0.0.1:8000/api/reviews')
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(() => {});
  };

  const fetchAdminBookings = () => {
    fetch('http://127.0.0.1:8000/api/bookings')
      .then(res => res.json())
      .then(data => setAdminBookings(data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchCars();
    fetchReviews();
    if (user?.is_admin) {
      fetchAdminBookings();
    }
  }, [appliedFilters, user]);

  useEffect(() => {
    if (user) {
      setSettingsName(user.display_name);
      setSettingsAvatar(user.avatar_url || '');
      setEmailAlerts(user.email_alerts ?? true);
      setDeliveryFreq(user.delivery_frequency ?? 'Daily digest');
      setMinLiquidity(user.min_liquidity ?? 85);

      setUserPersonalData(prev => {
        if (!prev[user.email]) {
          return {
            ...prev,
            [user.email]: { saved: [], booked: [], recent: [], bookingsDetails: {} }
          };
        }
        return prev;
      });
    }
  }, [user]);

  const currentUserData = user && userPersonalData[user.email]
    ? userPersonalData[user.email]
    : { saved: [], booked: [], recent: [], bookingsDetails: {} };

  const updateCurrentUserData = (updater) => {
    if (!user) return;
    setUserPersonalData(prev => {
      const current = prev[user.email] || { saved: [], booked: [], recent: [], bookingsDetails: {} };
      return {
        ...prev,
        [user.email]: updater(current)
      };
    });
  };

  const formatPrice = (priceInUSD) => {
    if (!priceInUSD) return '$0';
    let rate = 1;
    let symbol = '$';
    if (currency === 'EUR') { rate = 0.92; symbol = '€'; }
    if (currency === 'UAH') { rate = 41.5; symbol = '₴'; }
    const converted = Math.round(priceInUSD * rate);
    return `${converted.toLocaleString()} ${symbol}`;
  };

  // Ціна зі знижкою (discount — відсоток від 0 до 90)
  const getFinalPrice = (car) => {
    const d = Number(car?.discount) || 0;
    if (!car?.price || d <= 0) return car?.price;
    return Math.round(car.price * (1 - d / 100));
  };

  const formatMileage = (mileageInMiles) => {
    if (typeof mileageInMiles !== 'number') return mileageInMiles;
    if (distanceUnit === 'km') {
      const km = Math.round(mileageInMiles * 1.60934);
      return `${km.toLocaleString()} ${lang === 'ua' ? 'км' : 'km'}`;
    }
    return `${mileageInMiles.toLocaleString()} ${lang === 'ua' ? 'миль' : 'mi'}`;
  };

  const handleApplyFilters = () => {
    setAppliedFilters({
      budget,
      brand: selectedBrand,
      body: selectedBody,
      transmission: selectedTransmission,
      minLiquidity: Number(minLiquidityFilter)
    });
  };

  const totalDbCars = cars.length > 0 ? cars.length * 42 + 84 : 24892;
  const calculatedAvgPrice = cars.length > 0
    ? Math.round(cars.reduce((acc, c) => acc + c.price, 0) / cars.length)
    : 31420;
  const calculatedLiquidityAvg = cars.length > 0
    ? (cars.reduce((acc, c) => acc + c.liquidity_score, 0) / cars.length).toFixed(1)
    : '74.8';
  const savedVehiclesObjects = cars.filter(c => currentUserData.saved.includes(c.id));
  const calculatedSavedValue = savedVehiclesObjects.reduce((acc, c) => acc + c.price, 0) || (currentUserData.saved.length * 45000);

  const handleAuth = (e) => {
    e.preventDefault();
    if (authMode === 'register' && passInput.length < 8) {
      alert(lang === 'ua' ? 'Пароль має містити мінімум 8 символів!' : 'Password must be at least 8 characters!');
      return;
    }

    const endpoint = authMode === 'login' ? '/api/login' : '/api/register';
    const body = authMode === 'login'
      ? { email: emailInput, password: passInput }
      : { email: emailInput, password: passInput, display_name: nameInput };

    fetch(`http://127.0.0.1:8000${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    .then(res => res.json().then(data => ({ status: res.status, body: data })))
    .then(res => {
      if (res.status === 200) {
        setUser(res.body);
        setIsAuthModalOpen(false);
        alert(res.body.message);
      } else {
        alert(res.body.detail || (lang === 'ua' ? 'Помилка автентифікації' : 'Auth error'));
      }
    })
    .catch(() => alert(lang === 'ua' ? 'Помилка підключення до сервера.' : 'Server connection error.'));
  };

  const handleSavePreferences = (e) => {
    e.preventDefault();
    if (!user) return;
    if (newPass && newPass !== confirmNewPass) {
      alert(lang === 'ua' ? 'Нові паролі не збігаються!' : 'New passwords do not match!');
      return;
    }

    setLang(settingsLang);
    setCurrency(settingsCurrency);
    setDistanceUnit(settingsDistance);

    fetch(`http://127.0.0.1:8000/api/user/${user.user_id || user.id}/preferences`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        display_name: settingsName,
        avatar_url: settingsAvatar, // Зберігаємо посилання або base64 рядок у БД
        email_alerts: emailAlerts,
        delivery_frequency: deliveryFreq,
        min_liquidity: Number(minLiquidity),
        ...(newPass ? { current_password: currentPass, new_password: newPass } : {})
      })
    })
    .then(res => res.json().then(data => ({ status: res.status, body: data })))
    .then(res => {
      if (res.status === 200) {
        const updatedUser = {
          ...user,
          display_name: settingsName,
          avatar_url: settingsAvatar,
          email_alerts: emailAlerts,
          delivery_frequency: deliveryFreq,
          min_liquidity: minLiquidity
        };
        setUser(updatedUser);
        setIsSettingsOpen(false);
        alert(res.body.message || (lang === 'ua' ? 'Налаштування успішно збережено!' : 'Preferences saved successfully!'));
        setCurrentPass('');
        setNewPass('');
        setConfirmNewPass('');
      } else {
        alert(res.body.detail || (lang === 'ua' ? 'Помилка збереження налаштувань' : 'Error saving settings'));
      }
    })
    .catch(() => {
      const updatedUser = { ...user, display_name: settingsName, avatar_url: settingsAvatar, email_alerts: emailAlerts };
      setUser(updatedUser);
      setIsSettingsOpen(false);
      alert(lang === 'ua' ? 'Налаштування успішно застосовано!' : 'Preferences applied successfully!');
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCar(prev => ({ ...prev, image_url: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettingsAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCar = (e) => {
    e.preventDefault();

    let rawMileage = newCar.mileage !== '' ? Number(newCar.mileage) : 0;
    if (newCarMileageUnit === 'km') {
      rawMileage = Math.round(rawMileage / 1.60934);
    }

    const payload = {
      ...newCar,
      mileage: rawMileage
    };

    fetch('http://127.0.0.1:8000/api/admin/cars', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
      alert(lang === 'ua' ? 'Автомобіль успішно додано в базу та надіслано email-розсилку підписникам!' : (data.message || 'Auto added & emails sent!'));
      setNewCar(initialNewCarState);
      fetchCars();
    })
    .catch(() => alert(lang === 'ua' ? 'Помилка при додаванні автомобіля.' : 'Error adding car.'));
  };

  const handleUpdateCar = (e) => {
    e.preventDefault();
    if (!editingCar) return;

    let rawMileage = editingCar.mileage !== '' ? Number(editingCar.mileage) : 0;

    if (editingMileageUnit === 'km') {
      rawMileage = Math.round(rawMileage / 1.60934);
    }

    const finalPrice = editingCar.price !== '' ? Number(editingCar.price) : 0;
    const finalYear = editingCar.year !== '' ? Number(editingCar.year) : 2024;
    const finalLiquidity = editingCar.liquidity_score !== '' ? Number(editingCar.liquidity_score) : 85;

    const payload = {
      ...editingCar,
      mileage: rawMileage,
      price: finalPrice,
      year: finalYear,
      liquidity_score: finalLiquidity,
      custom_liquidity: finalLiquidity,
      discount: editingCar.discount !== '' && editingCar.discount != null ? Number(editingCar.discount) : 0
    };

    fetch(`http://127.0.0.1:8000/api/admin/cars/${editingCar.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(() => {
        alert(lang === 'ua' ? 'Характеристики та пробіг авто успішно оновлено в БД!' : 'Car updated successfully!');
        setEditingCar(null);
        fetchCars();
      })
      .catch(() => alert(lang === 'ua' ? 'Помилка оновлення автомобіля' : 'Error updating car'));
  };

  const handleToggleSave = (carId) => {
    if (!user) {
      alert(lang === 'ua' ? 'Будь ласка, увійдіть в акаунт, щоб зберігати автомобілі.' : 'Please sign in to save vehicles.');
      setIsAuthModalOpen(true);
      return;
    }
    updateCurrentUserData(data => {
      const saved = data.saved.includes(carId)
        ? data.saved.filter(id => id !== carId)
        : [...data.saved, carId];
      return { ...data, saved };
    });
  };

  const handleClearRecent = () => {
    updateCurrentUserData(data => ({ ...data, recent: [] }));
    alert(lang === 'ua' ? 'Історію переглядів повністю очищено.' : 'History cleared.');
  };

  const handleOpenBookingModal = (car) => {
    if (!user) {
      alert(lang === 'ua' ? 'Будь ласка, увійдіть в акаунт, щоб забронювати автомобіль.' : 'Please sign in to book a vehicle.');
      setIsAuthModalOpen(true);
      return;
    }
    setCarToBook(car);
    setBookingPhone('');
    setBookingComment('');
    setIsBookingModalOpen(true);
  };

  const handleSubmitBooking = (e) => {
    e.preventDefault();
    if (!carToBook || !user) return;

    fetch('http://127.0.0.1:8000/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_email: user.email,
        car_id: carToBook.id,
        phone: bookingPhone,
        comment: bookingComment
      })
    })
    .then(res => res.json())
    .then(() => {
      updateCurrentUserData(data => ({
        ...data,
        booked: [...data.booked, carToBook.id],
        bookingsDetails: {
          ...data.bookingsDetails,
          [carToBook.id]: { phone: bookingPhone, comment: bookingComment, status: 'pending' }
        }
      }));
      setIsBookingModalOpen(false);
      alert(lang === 'ua' ? 'Запит на бронювання успішно надіслано в базу даних!' : 'Booking request saved to DB!');
    })
    .catch(() => alert(lang === 'ua' ? 'Помилка створення бронювання' : 'Error creating booking'));
  };

  const handleOpenCarDetail = (car) => {
    if (user) {
      updateCurrentUserData(data => {
        const recent = [car.id, ...data.recent.filter(id => id !== car.id)].slice(0, 10);
        return { ...data, recent };
      });
    }
    setSelectedCarForModal(car);
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!user) {
      alert(lang === 'ua' ? 'Будь ласка, увійдіть в акаунт, щоб залишити відгук.' : 'Please sign in to leave a review.');
      setIsAuthModalOpen(true);
      return;
    }
    fetch('http://127.0.0.1:8000/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author: newReviewAuthor || user.display_name, comment: newReviewComment, rating: newReviewRating })
    }).then(() => {
      setNewReviewAuthor('');
      setNewReviewComment('');
      fetchReviews();
      alert(lang === 'ua' ? 'Відгук успішно опубліковано!' : 'Review published successfully!');
    }).catch(() => {});
  };

  const totalReviewsCount = reviews.length;
  const averageRating = totalReviewsCount > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviewsCount).toFixed(1)
    : '4.3';

  const filteredReviews = reviewFilter === 'all'
    ? reviews
    : reviews.filter(r => r.rating === Number(reviewFilter));

  const handleSendMessageToAI = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');
    setTimeout(() => {
      let reply = lang === 'ua'
        ? `Я проаналізував ваш запит щодо "${userMsg}". Рекомендую звернути увагу на моделі з ліквідністю вище 85 та перевірити їх наявність в каталозі.`
        : `I analyzed your query about "${userMsg}". I recommend focusing on models with liquidity above 85 and checking our catalog.`;
      setChatMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    }, 800);
  };

 const [forumMessages, setForumMessages] = useState([]);
const [forumAvatars, setForumAvatars] = useState({});
const [forumInput, setForumInput] = useState('');

  // Функція завантаження повідомлень форуму з БД
  // Функція завантаження повідомлень форуму з БД
const fetchForumMessages = () => {
  fetch('http://127.0.0.1:8000/api/forum')
    .then(res => {
      if (!res.ok) {
        throw new Error('Не вдалося завантажити повідомлення форуму');
      }
      return res.json();
    })
    .then(data => {
      setForumMessages(Array.isArray(data.messages) ? data.messages : []);
      setForumAvatars(data.avatars || {});
    })
    .catch(error => {
      console.error('Помилка завантаження форуму:', error);
      setForumMessages([]);
      setForumAvatars({});
    });
};

  useEffect(() => {
    fetchForumMessages();
  }, []);

  const handleSendForumMessage = (e) => {
    e.preventDefault();
    if (!user) {
      alert(lang === 'ua' ? 'Тільки зареєстровані користувачі з реальних пошт можуть писати у форум!' : 'Only registered users can write in the forum!');
      setIsAuthModalOpen(true);
      return;
    }
    if (!forumInput.trim()) return;

    fetch('http://127.0.0.1:8000/api/forum', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user.email,
        author: user.display_name,
        avatar_url: user.avatar_url || '',
        message: forumInput
      })
    })
    .then(res => res.json())
    .then(() => {
      setForumInput('');
      fetchForumMessages();
    })
    .catch(() => alert(lang === 'ua' ? 'Помилка надсилання повідомлення' : 'Error sending message'));
  };

  const value = {
    activeTab, setActiveTab,
    lang, setLang, currency, setCurrency, distanceUnit, setDistanceUnit,
    user, setUser, savedAccounts, setSavedAccounts,
    isAccountSwitcherOpen, setIsAccountSwitcherOpen,
    isAuthModalOpen, setIsAuthModalOpen, authMode, setAuthMode,
    emailInput, setEmailInput, passInput, setPassInput, nameInput, setNameInput,
    isSettingsOpen, setIsSettingsOpen,
    settingsName, setSettingsName, settingsAvatar, setSettingsAvatar,
    settingsLang, setSettingsLang, settingsCurrency, setSettingsCurrency,
    settingsDistance, setSettingsDistance,
    emailAlerts, setEmailAlerts, deliveryFreq, setDeliveryFreq,
    minLiquidity, setMinLiquidity,
    currentPass, setCurrentPass, newPass, setNewPass, confirmNewPass, setConfirmNewPass,
    budget, setBudget, selectedBrand, setSelectedBrand, selectedBody, setSelectedBody,
    selectedTransmission, setSelectedTransmission, minLiquidityFilter, setMinLiquidityFilter,
    appliedFilters, setAppliedFilters,
    cars, setCars, adminBookings, setAdminBookings,
    selectedCarForModal, setSelectedCarForModal,
    isFullComparisonOpen, setIsFullComparisonOpen,
    editingCar, setEditingCar, editingMileageUnit, setEditingMileageUnit,
    newCarMileageUnit, setNewCarMileageUnit,
    userPersonalData, setUserPersonalData,
    isBookingModalOpen, setIsBookingModalOpen, carToBook, setCarToBook,
    bookingPhone, setBookingPhone, bookingComment, setBookingComment,
    reviews, setReviews, currentReviewIdx, setCurrentReviewIdx,
    showAllReviews, setShowAllReviews, reviewFilter, setReviewFilter,
    newReviewAuthor, setNewReviewAuthor, newReviewComment, setNewReviewComment,
    newReviewRating, setNewReviewRating, isPaused, setIsPaused,
    compareCar1, setCompareCar1, compareCar2, setCompareCar2,
    isChatOpen, setIsChatOpen, chatMessages, setChatMessages, chatInput, setChatInput,
    newCar, setNewCar, initialNewCarState,
    currentText,
    fetchCars, fetchReviews, fetchAdminBookings,
    currentUserData, updateCurrentUserData,
    formatPrice, getFinalPrice, formatMileage, handleApplyFilters,
    totalDbCars, calculatedAvgPrice, calculatedLiquidityAvg,
    savedVehiclesObjects, calculatedSavedValue,
    handleAuth, handleSavePreferences, handleImageUpload, handleAvatarUpload,
    handleAddCar, handleUpdateCar, handleToggleSave, handleClearRecent,
    handleOpenBookingModal, handleSubmitBooking, handleOpenCarDetail, handleAddReview,
    totalReviewsCount, averageRating, filteredReviews,
    handleSendMessageToAI,
   forumMessages, setForumMessages,
forumAvatars, setForumAvatars,
forumInput, setForumInput,
fetchForumMessages, handleSendForumMessage
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);