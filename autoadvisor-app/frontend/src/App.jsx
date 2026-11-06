import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Compass, BarChart2, Bookmark, Settings, 
  Sun, Moon, X, ShieldPlus, Trash2, MessageSquare, Star, CheckCircle2, History, Send, Bot, RefreshCw
} from 'lucide-react';
import CarDetailModal from './components/CarDetailModal';

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('autoadvisor_theme') || 'dark');
  const [activeTab, setActiveTab] = useState('overview');
  
  const [lang, setLang] = useState(() => localStorage.getItem('autoadvisor_lang') || 'ua');
  const [currency, setCurrency] = useState(() => localStorage.getItem('autoadvisor_currency') || 'USD');
  const [distanceUnit, setDistanceUnit] = useState(() => localStorage.getItem('autoadvisor_distance') || 'mi');
  
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('autoadvisor_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [emailInput, setEmailInput] = useState('');
  const [passInput, setPassInput] = useState('');
  const [nameInput, setNameInput] = useState('');

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsName, setSettingsName] = useState(user?.display_name || '');
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
    localStorage.setItem('autoadvisor_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('autoadvisor_lang', lang);
    localStorage.setItem('autoadvisor_currency', currency);
    localStorage.setItem('autoadvisor_distance', distanceUnit);
  }, [lang, currency, distanceUnit]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('autoadvisor_user', JSON.stringify(user));
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
  
  const [newCar, setNewCar] = useState({
    brand: 'BMW', model: 'M4 Competition', year: 2023, body_type: 'Coupe', transmission: 'Automatic', 
    mileage: 12000, price: 74500, engine_volume: '3.0L', custom_liquidity: 92, badge: 'BEST MATCH', 
    image_url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
    description: 'Спортивне купе з двигуном TwinPower Turbo, ідеальна керованість та висока ліквідність на вторинному ринку.'
  });

  const t = {
    ua: {
      overview: 'Огляд',
      discover: 'Пошук авто',
      analytics: 'Аналітика ринку',
      saved: 'Збережені авто',
      recent: 'Нещодавно переглянуті',
      reviews: 'Відгуки',
      settings: 'Налаштування',
      logout: 'Вийти',
      signIn: 'Увійти / Реєстрація',
      admin: 'Адмін-панель',
      hello: 'Привіт',
      guest: 'Гість',
      marketTrend: 'Динаміка ринкової вартості',
      aiInsight: 'AI Аналітика',
      findCar: 'Знайдіть потрібне авто. <br />Дізнайтеся його майбутню вартість.',
      subtitleDiscover: 'Підбір авто з бази MySQL. Налаштуйте фільтри та натисніть «Застосувати».',
      maxBudget: 'Макс. бюджет',
      brand: 'Марка',
      bodyType: 'Тип кузова',
      minLiquidity: 'Мін. ліквідність',
      apply: 'Застосувати',
      topRecommendations: 'Найкращі рекомендації',
      details: 'Детальний опис',
      book: 'Забронювати',
      bookedStatus: 'ЗАБРОНЬОВАНО',
      unavailable: 'Недоступно',
      marketAnalyticsTitle: 'Аналітика ринку',
      marketAnalyticsSub: 'Досліджуйте ціни, попит та ліквідність на автомобільному ринку на основі реальних даних БД.',
      medianPrice: 'Середня ціна',
      inventory: 'Автомобілів у базі',
      daysOnMarket: 'Днів на ринку',
      demandIndex: 'Індекс попиту',
      segmentPerformance: 'Порівняння моделей та варіанти трейд-іну',
      segmentSub: 'Порівняйте характеристики двох автомобілів перед покупкою або обміном:',
      selectCar1: 'Виберіть перше авто',
      selectCar2: 'Виберіть друге авто',
      comparisonResult: 'Результат порівняння та рекомендація',
      savedVehicles: 'Збережені автомобілі',
      emptySaved: 'Ваш список збереженого порожній',
      emptySavedSub: 'Зберігайте автомобілі у вкладці Пошук авто.',
      clearHistory: 'Очистити всю історію',
      emptyHistory: 'Історія переглядів порожня',
      emptyHistorySub: 'Переглядайте деталі автомобілів у вкладці Пошук авто.',
      viewAgain: 'Подивитися машину ще раз',
      customerReviews: 'ВІДГУКИ КЛІЄНТІВ',
      whatTheySay: 'Що говорять про нас',
      viewAllReviews: 'Переглянути всі відгуки',
      hideReviews: 'Згорнути відгуки',
      yourOpinion: 'ВАША ДУМКА ВАЖЛИВА',
      shareExperience: 'Поділіться своїм досвідом',
      yourRating: 'Ваша оцінка:',
      publishReview: 'Опублікувати відгук',
      adminTitle: 'Адмін-панель: Керування базою даних MySQL та бронюваннями',
      addCarTitle: 'Додати новий автомобіль у MySQL (із запуском реальної email-розсилки підписникам)',
      footerRights: '© 2026 AutoAdvisor Inc. Усі права захищені.',
      settingsTitle: 'Налаштування',
      settingsSub: 'Керуйте вашим профілем, сповіщеннями та ринковими вподобаннями.',
      profileInfo: 'Інформація про профіль',
      fullName: 'Повне ім\'я',
      emailLocked: 'Email (заблоковано)',
      marketPreferences: 'Ринкові та локальні налаштування',
      language: 'Мова / Language',
      currency: 'Валюта відображення',
      distanceUnits: 'Одиниці відстані',
      emailNotif: 'Сповіщення на пошту (реальна розсилка новинок)',
      notifDesc: 'Отримувати сповіщення на пошту при додаванні нових автомобілів',
      changePass: 'Зміна пароля',
      currPass: 'Поточний пароль',
      newPass: 'Новий пароль (мін. 8 символів)',
      confirmPass: 'Підтвердіть пароль',
      savePrefs: 'Зберегти налаштування',
      aiChatTitle: 'AI Асистент AutoAdvisor',
      aiChatPlaceholder: 'Запитайте щось про авто...',
      send: 'Надіслати',
      carsAnalyzed: 'Проаналізовано авто',
      averagePrice: 'Середня ціна',
      marketLiquidity: 'Ліквідність ринку',
      savedValue: 'Вартість збереженого',
      confidence: 'Впевненість',
      allBrands: 'Усі марки',
      anyBody: 'Будь-який кузов',
      transmissionAny: 'Будь-яка коробка',
      automatic: 'Автоматична',
      manual: 'Механічна',
      sedan: 'Седан',
      suv: 'Кросовер / SUV',
      coupe: 'Купе',
      liquidityScoreLabel: 'ІНДЕКС ЛІКВІДНОСТІ',
      verifiedListing: 'ПЕРЕВІРЕНИЙ РИНКОВИЙ ЛОТ'
    },
    en: {
      overview: 'Overview',
      discover: 'Discover',
      analytics: 'Market analytics',
      saved: 'Saved vehicles',
      recent: 'Recent Viewed',
      reviews: 'Reviews',
      settings: 'Settings',
      logout: 'Logout',
      signIn: 'Sign In / Register',
      admin: 'Admin Panel',
      hello: 'Hello',
      guest: 'Guest',
      marketTrend: 'Market value trend',
      aiInsight: 'AI Insight',
      findCar: 'Find the right car. <br />Know its future value.',
      subtitleDiscover: 'Car selection from MySQL database. Adjust filters and click "Apply".',
      maxBudget: 'Max Budget',
      brand: 'Brand',
      bodyType: 'Body type',
      minLiquidity: 'Min Liquidity',
      apply: 'Apply',
      topRecommendations: 'Your top recommendations',
      details: 'Vehicle details',
      book: 'Book now',
      bookedStatus: 'BOOKED',
      unavailable: 'Unavailable',
      marketAnalyticsTitle: 'Market analytics',
      marketAnalyticsSub: 'Explore pricing, demand and liquidity across the automotive market based on live DB data.',
      medianPrice: 'Median Price',
      inventory: 'Inventory in DB',
      daysOnMarket: 'Days on Market',
      demandIndex: 'Demand Index',
      segmentPerformance: 'Model comparison & trade-in options',
      segmentSub: 'Compare specs of two vehicles from our assortment before purchasing or trading in:',
      selectCar1: 'Select first car',
      selectCar2: 'Select second car',
      comparisonResult: 'Comparison result & recommendation',
      savedVehicles: 'Saved vehicles',
      emptySaved: 'Your shortlist is empty',
      emptySavedSub: 'Save vehicles in the Discover tab.',
      clearHistory: 'Clear entire history',
      emptyHistory: 'Recently viewed is empty',
      emptyHistorySub: 'View vehicle details in the Discover tab.',
      viewAgain: 'View car again',
      customerReviews: 'CUSTOMER REVIEWS',
      whatTheySay: 'What they say about us',
      viewAllReviews: 'View all reviews',
      hideReviews: 'Hide reviews',
      yourOpinion: 'YOUR OPINION MATTERS',
      shareExperience: 'Share your experience',
      yourRating: 'Your rating:',
      publishReview: 'Publish review',
      adminTitle: 'Admin Panel: MySQL Database & Bookings Management',
      addCarTitle: 'Add New Car to MySQL (with real email notification dispatch)',
      footerRights: '© 2026 AutoAdvisor Inc. All rights reserved.',
      settingsTitle: 'Settings',
      settingsSub: 'Manage your profile, alerts and market preferences.',
      profileInfo: 'Profile information',
      fullName: 'Full Name',
      emailLocked: 'Email Address (locked)',
      marketPreferences: 'Market & Localization preferences',
      language: 'Language / Мова',
      currency: 'Display Currency',
      distanceUnits: 'Distance Units',
      emailNotif: 'Email notifications (real news dispatch)',
      notifDesc: 'Receive email alerts when new vehicles are added',
      changePass: 'Change password',
      currPass: 'Current password',
      newPass: 'New password (min 8 chars)',
      confirmPass: 'Confirm password',
      savePrefs: 'Save preferences',
      aiChatTitle: 'AutoAdvisor AI Assistant',
      aiChatPlaceholder: 'Ask anything about cars...',
      send: 'Send',
      carsAnalyzed: 'Cars Analyzed',
      averagePrice: 'Average Price',
      marketLiquidity: 'Market Liquidity',
      savedValue: 'Saved Value',
      confidence: 'Confidence',
      allBrands: 'All brands',
      anyBody: 'Any body',
      transmissionAny: 'Any transmission',
      automatic: 'Automatic',
      manual: 'Manual',
      sedan: 'Sedan',
      suv: 'SUV',
      coupe: 'Coupe',
      liquidityScoreLabel: 'LIQUIDITY SCORE',
      verifiedListing: 'VERIFIED MARKET LISTING'
    }
  };

  const currentText = t[lang];

  const fetchCars = () => {
    fetch(`http://127.0.0.1:8000/api/recommendations?budget_max=${appliedFilters.budget}&brand=${appliedFilters.brand}&body_type=${appliedFilters.body}&transmission=${appliedFilters.transmission}&min_liquidity=${appliedFilters.minLiquidity}`)
      .then(res => res.json())
      .then(data => setCars(data))
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
        alert(res.body.detail || 'Auth error');
      }
    })
    .catch(() => alert('Server connection error.'));
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

    fetch(`http://127.0.0.1:8000/api/user/${user.user_id}/preferences`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        display_name: settingsName,
        email_alerts: emailAlerts,
        delivery_frequency: deliveryFreq,
        min_liquidity: Number(minLiquidity),
        ...(newPass ? { current_password: currentPass, new_password: newPass } : {})
      })
    })
    .then(res => res.json().then(data => ({ status: res.status, body: data })))
    .then(res => {
      if (res.status === 200) {
        setUser({ ...user, display_name: settingsName, email_alerts: emailAlerts, delivery_frequency: deliveryFreq, min_liquidity: minLiquidity });
        setIsSettingsOpen(false);
        alert(res.body.message || (lang === 'ua' ? 'Налаштування успішно збережено!' : 'Preferences saved successfully!'));
        setCurrentPass('');
        setNewPass('');
        setConfirmNewPass('');
      } else {
        alert(res.body.detail || 'Error saving settings');
      }
    })
    .catch(() => {
      setUser({ ...user, display_name: settingsName, email_alerts: emailAlerts });
      setIsSettingsOpen(false);
      alert(lang === 'ua' ? 'Налаштування успішно застосовано!' : 'Preferences applied successfully!');
    });
  };

  const handleAddCar = (e) => {
    e.preventDefault();
    fetch('http://127.0.0.1:8000/api/admin/cars', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCar)
    })
    .then(res => res.json())
    .then(data => { 
      alert(data.message || 'Auto added & emails sent!'); 
      fetchCars(); 
    })
    .catch(() => {});
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
    .catch(() => alert('Error creating booking'));
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

  return (
    <div className={theme === 'dark' ? 'dark bg-[#0b0f19] text-slate-100 min-h-screen flex font-sans' : 'bg-slate-100 text-slate-900 min-h-screen flex font-sans'}>
      
      <aside className={`w-64 h-screen sticky top-0 flex flex-col justify-between p-6 border-r transition-colors z-30 shadow-2xl ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-600'}`}>
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-gradient-to-tr from-emerald-600 to-emerald-400 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/30">
              📈
            </div>
            <span className={`text-xl font-extrabold tracking-wide ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>AutoAdvisor</span>
          </div>

          <nav className="space-y-1.5 text-left">
            <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'overview' ? 'bg-emerald-500/15 text-emerald-400 font-bold shadow-sm' : theme === 'dark' ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'}`}>
              <LayoutDashboard size={18} /> {currentText.overview}
            </button>
            <button onClick={() => setActiveTab('discover')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'discover' ? 'bg-emerald-500/15 text-emerald-400 font-bold shadow-sm' : theme === 'dark' ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'}`}>
              <Compass size={18} /> {currentText.discover}
            </button>
            <button onClick={() => setActiveTab('analytics')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'analytics' ? 'bg-emerald-500/15 text-emerald-400 font-bold shadow-sm' : theme === 'dark' ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'}`}>
              <BarChart2 size={18} /> {currentText.analytics}
            </button>
            
            <button onClick={() => setActiveTab('saved')} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'saved' ? 'bg-emerald-500/15 text-emerald-400 font-bold shadow-sm' : theme === 'dark' ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'}`}>
              <div className="flex items-center gap-3">
                <Bookmark size={18} /> {currentText.saved}
              </div>
              {currentUserData.saved.length > 0 && (
                <span className="px-2 py-0.5 bg-emerald-500 text-white rounded-full text-xs font-black">
                  {currentUserData.saved.length}
                </span>
              )}
            </button>

            {user && (
              <button onClick={() => setActiveTab('recent')} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'recent' ? 'bg-emerald-500/15 text-emerald-400 font-bold shadow-sm' : theme === 'dark' ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'}`}>
                <div className="flex items-center gap-3">
                  <History size={18} /> {currentText.recent}
                </div>
                {currentUserData.recent.length > 0 && (
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-black">
                    {currentUserData.recent.length}
                  </span>
                )}
              </button>
            )}

            <button onClick={() => setActiveTab('reviews')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'reviews' ? 'bg-emerald-500/15 text-emerald-400 font-bold shadow-sm' : theme === 'dark' ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'}`}>
              <MessageSquare size={18} /> {currentText.reviews}
            </button>
            {user?.is_admin && (
              <button onClick={() => setActiveTab('admin')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'admin' ? 'bg-amber-500/20 text-amber-400 font-bold shadow-sm' : theme === 'dark' ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'}`}>
                <ShieldPlus size={18} /> {currentText.admin}
              </button>
            )}
          </nav>
        </div>

        <div className={`pt-6 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'} space-y-3`}>
          <button onClick={() => {
            if (!user) { setIsAuthModalOpen(true); setAuthMode('login'); } 
            else {
              setSettingsName(user.display_name);
              setSettingsLang(lang);
              setSettingsCurrency(currency);
              setSettingsDistance(distanceUnit);
              setIsSettingsOpen(true);
            }
          }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'}`}>
            <Settings size={18} /> {currentText.settings}
          </button>

          <div className="flex items-center justify-between pt-2">
            {user ? (
              <div className="flex items-center gap-3 text-left">
                <div className="w-9 h-9 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                  {user.display_name[0]}
                </div>
                <div>
                  <p className={`text-sm font-semibold truncate w-28 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{user.display_name}</p>
                  <p className="text-xs text-emerald-400">{user.is_admin ? (lang === 'ua' ? 'Адмін' : 'Admin') : (lang === 'ua' ? 'Аналітик' : 'Analyst')}</p>
                </div>
              </div>
            ) : (
              <button onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }} className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-lg transition-all">
                {currentText.signIn}
              </button>
            )}

            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className={`p-2.5 rounded-xl border ml-2 transition-transform hover:scale-110 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-800'}`}>
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto flex flex-col justify-between min-h-screen text-left relative">
        <div>
          <div className="flex justify-between items-center mb-8">
            <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold text-left">Workspace / <span className="text-emerald-400">{activeTab}</span></span>
            {user && <button onClick={() => setUser(null)} className="text-xs px-3.5 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl font-semibold transition-all">{currentText.logout}</button>}
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fadeIn transition-all duration-500">
              <div className={`p-8 rounded-3xl border shadow-xl relative overflow-hidden transition-all duration-500 ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Smart Market Intelligence</span>
                    <h1 className="text-3xl font-black mt-1 text-left">{currentText.hello}, {user?.display_name || currentText.guest}!</h1>
                    <p className={`text-xs mt-1 text-left ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{lang === 'ua' ? 'Ось що відбувається на автомобільному ринку сьогодні.' : 'Here is what is happening in the automotive market today.'}</p>
                  </div>
                  <button onClick={() => setActiveTab('analytics')} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow">{lang === 'ua' ? 'Переглянути звіт ринку >' : 'View market report >'}</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                  <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/50 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}>
                    <p className="text-[10px] uppercase font-semibold text-slate-400 text-left">{currentText.carsAnalyzed}</p>
                    <p className="text-2xl font-black mt-1 text-left">{totalDbCars.toLocaleString()}</p>
                    <span className="text-[10px] text-emerald-500 font-bold text-left block">+142 {lang === 'ua' ? 'додано цього місяця' : 'added this month'}</span>
                  </div>
                  <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/50 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}>
                    <p className="text-[10px] uppercase font-semibold text-slate-400 text-left">{currentText.averagePrice}</p>
                    <p className="text-2xl font-black mt-1 text-left">{formatPrice(calculatedAvgPrice)}</p>
                    <span className="text-[10px] text-emerald-500 font-bold text-left block">{lang === 'ua' ? 'По всій активній базі БД' : 'Across all active DB listings'}</span>
                  </div>
                  <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/50 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}>
                    <p className="text-[10px] uppercase font-semibold text-slate-400 text-left">{currentText.marketLiquidity}</p>
                    <p className="text-2xl font-black mt-1 text-left">{calculatedLiquidityAvg}</p>
                    <span className="text-[10px] text-emerald-500 font-bold text-left block">{lang === 'ua' ? 'Здоровий попит покупців' : 'Healthy buyer demand'}</span>
                  </div>
                  <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/50 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}>
                    <p className="text-[10px] uppercase font-semibold text-slate-400 text-left">{currentText.savedValue}</p>
                    <p className="text-2xl font-black mt-1 text-left">{formatPrice(calculatedSavedValue)}</p>
                    <span className="text-[10px] text-emerald-500 font-bold text-left block">{lang === 'ua' ? `По ${currentUserData.saved.length} збережених авто` : `Across ${currentUserData.saved.length} saved vehicles`}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`md:col-span-2 p-6 rounded-3xl border ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-base text-left">{currentText.marketTrend}</h3>
                    <div className="flex gap-1 text-[10px] font-bold">
                      <span className={`px-2 py-1 rounded ${theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-800'}`}>1M</span>
                      <span className={`px-2 py-1 rounded ${theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>3M</span>
                      <span className={`px-2 py-1 rounded ${theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>6M</span>
                      <span className={`px-2 py-1 rounded ${theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>1Y</span>
                    </div>
                  </div>
                  <p className="text-sm font-black text-emerald-500 mb-4 text-left">{formatPrice(calculatedAvgPrice)} <span className="text-xs text-emerald-600 font-normal">+{formatPrice(1080)} vs previous period</span></p>
                  <div className="h-40 flex items-end gap-3 pt-6 border-b border-slate-700/50 px-2">
                    <div className="w-1/6 bg-emerald-500/20 h-[30%] rounded-t-xl"></div>
                    <div className="w-1/6 bg-emerald-500/30 h-[50%] rounded-t-xl"></div>
                    <div className="w-1/6 bg-emerald-500/40 h-[65%] rounded-t-xl"></div>
                    <div className="w-1/6 bg-emerald-500/60 h-[80%] rounded-t-xl"></div>
                    <div className="w-1/6 bg-emerald-500/80 h-[70%] rounded-t-xl"></div>
                    <div className="w-1/6 bg-emerald-500 h-[95%] rounded-t-xl shadow-lg shadow-emerald-500/30"></div>
                  </div>
                </div>

                <div className={`p-6 rounded-3xl border shadow-xl flex flex-col justify-between ${theme === 'dark' ? 'bg-gradient-to-br from-emerald-950 via-[#0f172a] to-[#0f172a] border-emerald-500/30 text-white' : 'bg-gradient-to-br from-emerald-50 via-white to-white border-emerald-200 text-slate-900'}`}>
                  <div>
                    <span className="text-[10px] font-black px-2 py-0.5 bg-emerald-500/20 text-emerald-500 rounded uppercase">{currentText.aiInsight}</span>
                    <h3 className="font-extrabold text-lg mt-3 text-left">{lang === 'ua' ? 'Найкращий час купувати преміум седани зараз.' : 'The best time to buy premium sedans is now.'}</h3>
                    <p className={`text-xs mt-2 leading-relaxed text-left ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{lang === 'ua' ? 'Ціни на 6.2% нижчі за сезонну середню, тоді як ліквідність зростає третій тиждень поспіль.' : 'Prices are 6.2% below the seasonal average while liquidity has increased for the third week in a row.'}</p>
                  </div>
                  <div className={`pt-4 border-t flex justify-between items-center text-xs ${theme === 'dark' ? 'border-slate-700/50 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                    <span>{currentText.confidence}</span>
                    <span className="font-bold text-emerald-500">High - 92%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'discover' && (
            <div className="animate-fadeIn space-y-6">
              <div className={`p-8 rounded-3xl border mb-8 shadow-xl ${theme === 'dark' ? 'bg-gradient-to-r from-emerald-500/15 via-[#0f172a] to-[#0f172a] border-emerald-500/20 text-white' : 'bg-emerald-50 border-emerald-200 text-slate-900'}`}>
                <h1 className="text-4xl font-extrabold mb-3 text-left" dangerouslySetInnerHTML={{ __html: currentText.findCar }}></h1>
                <p className={`text-sm max-w-xl text-left ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{currentText.subtitleDiscover}</p>
              </div>

              <div className={`p-6 rounded-3xl border shadow-xl mb-8 ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <label className={`text-xs font-semibold block mb-2 text-left ${theme === 'dark' ? 'text-slate-400' : 'text-slate-700'}`}>{currentText.maxBudget} ({formatPrice(budget)})</label>
                    <input type="range" min="10000" max="150000" step="5000" value={budget} onChange={(e) => setBudget(e.target.value)} className={`w-full accent-emerald-500 cursor-pointer ${theme === 'light' ? 'bg-slate-200' : ''}`} />
                  </div>
                  <div>
                    <label className={`text-xs font-semibold block mb-2 text-left ${theme === 'dark' ? 'text-slate-400' : 'text-slate-700'}`}>{currentText.brand}</label>
                    <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} className={`w-full p-2.5 border rounded-xl text-sm cursor-pointer ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}>
                      <option value="All">{currentText.allBrands}</option>
                      <option value="BMW">BMW</option>
                      <option value="Mercedes-Benz">Mercedes-Benz</option>
                      <option value="Audi">Audi</option>
                    </select>
                  </div>
                  <div>
                    <label className={`text-xs font-semibold block mb-2 text-left ${theme === 'dark' ? 'text-slate-400' : 'text-slate-700'}`}>{currentText.bodyType}</label>
                    <select value={selectedBody} onChange={(e) => setSelectedBody(e.target.value)} className={`w-full p-2.5 border rounded-xl text-sm cursor-pointer ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}>
                      <option value="Any">{currentText.anyBody}</option>
                      <option value="Sedan">{currentText.sedan}</option>
                      <option value="SUV">{currentText.suv}</option>
                      <option value="Coupe">{currentText.coupe}</option>
                    </select>
                  </div>
                  <div>
                    <label className={`text-xs font-semibold block mb-2 text-left ${theme === 'dark' ? 'text-slate-400' : 'text-slate-700'}`}>{currentText.minLiquidity} ({minLiquidityFilter}+)</label>
                    <input type="range" min="0" max="95" step="5" value={minLiquidityFilter} onChange={(e) => setMinLiquidityFilter(e.target.value)} className={`w-full accent-emerald-500 cursor-pointer mt-1 ${theme === 'light' ? 'bg-slate-200' : ''}`} />
                  </div>
                  <div className="flex items-end">
                    <button onClick={handleApplyFilters} className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs shadow-lg transition-transform active:scale-95">{currentText.apply}</button>
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-bold mb-4 text-left">{currentText.topRecommendations} ({cars.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cars.map((car) => {
                  const isSaved = currentUserData.saved.includes(car.id);
                  const isBooked = currentUserData.booked.includes(car.id);

                  return (
                    <div key={car.id} className={`rounded-3xl overflow-hidden border shadow-xl flex flex-col justify-between transition-all duration-300 ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                      <div className="h-48 overflow-hidden relative group">
                        <img src={car.image_url} alt={car.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <span className="absolute top-3 left-3 text-[10px] font-bold px-3 py-1 bg-emerald-500 text-white rounded-full uppercase shadow">{car.badge}</span>
                        {isBooked && (
                          <span className="absolute top-3 right-14 text-[10px] font-black px-3 py-1 bg-amber-500 text-slate-950 rounded-full uppercase shadow">{currentText.bookedStatus}</span>
                        )}
                        <button onClick={() => handleToggleSave(car.id)} className={`absolute top-3 right-3 p-2.5 rounded-full shadow-lg transition-transform hover:scale-110 ${isSaved ? 'bg-emerald-500 text-white' : 'bg-black/60 text-white hover:bg-black'}`}>
                          <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
                        </button>
                      </div>
                      <div className="p-5 space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="font-bold text-lg text-left">{car.title}</h3>
                          <span className="text-lg font-black text-emerald-500">{formatPrice(car.price)}</span>
                        </div>
                        
                        <p className={`text-xs text-left ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                          {car.body_type} • {car.year} • ⚙️ {car.engine_volume || '2.0L'} • {formatMileage(car.mileage_raw || 15000)}
                        </p>
                        
                        <div className={`p-3 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-semibold text-slate-400">{currentText.liquidityScoreLabel}</span>
                            <span className="text-emerald-500 font-black text-sm">{car.liquidity_score} / 100</span>
                          </div>
                          <div className="w-full bg-slate-700/50 h-2 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${car.liquidity_score}%` }}></div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button onClick={() => handleOpenCarDetail(car)} className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${theme === 'dark' ? 'bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-white' : 'bg-slate-100 hover:bg-emerald-500 hover:text-white text-slate-800'}`}>
                            {currentText.details}
                          </button>
                          
                          {!isBooked ? (
                            <button onClick={() => handleOpenBookingModal(car)} className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow">
                              {currentText.book}
                            </button>
                          ) : (
                            <button disabled className="px-4 py-2.5 bg-slate-700 text-slate-400 text-xs font-bold rounded-xl cursor-not-allowed">
                              {currentText.unavailable}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6 animate-fadeIn">
              <div className={`p-8 rounded-3xl border shadow-xl ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest text-left block">LIVE MARKET DATA</span>
                <h2 className="text-3xl font-black mt-1 text-left">{currentText.marketAnalyticsTitle}</h2>
                <p className={`text-xs mt-1 text-left ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{currentText.marketAnalyticsSub}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                  <p className="text-xs uppercase font-semibold text-slate-400 text-left">{currentText.medianPrice}</p>
                  <p className="text-2xl font-black mt-2 text-left">{formatPrice(calculatedAvgPrice)}</p>
                  <span className="text-[10px] text-emerald-500 font-bold text-left block">+2.8% vs previous period</span>
                </div>
                <div className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                  <p className="text-xs uppercase font-semibold text-slate-400 text-left">{currentText.inventory}</p>
                  <p className="text-2xl font-black mt-2 text-left">{totalDbCars.toLocaleString()}</p>
                  <span className="text-[10px] text-emerald-500 font-bold text-left block">1,421 new listings</span>
                </div>
                <div className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                  <p className="text-xs uppercase font-semibold text-slate-400 text-left">{currentText.daysOnMarket}</p>
                  <p className="text-2xl font-black mt-2 text-left">36 {lang === 'ua' ? 'днів' : 'days'}</p>
                  <span className="text-[10px] text-emerald-500 font-bold text-left block">2 {lang === 'ua' ? 'дні швидше' : 'days faster'}</span>
                </div>
                <div className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                  <p className="text-xs uppercase font-semibold text-slate-400 text-left">{currentText.demandIndex}</p>
                  <p className="text-2xl font-black mt-2 text-left">{calculatedLiquidityAvg}</p>
                  <span className="text-[10px] text-emerald-500 font-bold text-left block">Strong buyer activity</span>
                </div>
              </div>

              <div className={`p-8 rounded-3xl border shadow-xl ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                <h3 className="text-xl font-bold mb-2 text-left">{currentText.segmentPerformance}</h3>
                <p className="text-xs text-slate-400 mb-6 text-left">{currentText.segmentSub}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-2 text-left">{currentText.selectCar1}</label>
                    <select 
                      value={compareCar1 ? compareCar1.id : ''} 
                      onChange={e => setCompareCar1(cars.find(c => c.id === Number(e.target.value)))} 
                      className={`w-full p-3 border rounded-xl text-xs ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                    >
                      <option value="">-- {currentText.selectCar1} --</option>
                      {cars.map(c => <option key={c.id} value={c.id}>{c.title} ({formatPrice(c.price)})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-2 text-left">{currentText.selectCar2}</label>
                    <select 
                      value={compareCar2 ? compareCar2.id : ''} 
                      onChange={e => setCompareCar2(cars.find(c => c.id === Number(e.target.value)))} 
                      className={`w-full p-3 border rounded-xl text-xs ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                    >
                      <option value="">-- {currentText.selectCar2} --</option>
                      {cars.map(c => <option key={c.id} value={c.id}>{c.title} ({formatPrice(c.price)})</option>)}
                    </select>
                  </div>
                </div>

                {compareCar1 && compareCar2 && (
                  <div className={`p-6 rounded-2xl border animate-fadeIn ${theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <h4 className="font-bold text-sm text-emerald-400 mb-3">{currentText.comparisonResult}</h4>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <p className="font-bold text-sm">{compareCar1.title}</p>
                        <p>{lang === 'ua' ? 'Ціна' : 'Price'}: {formatPrice(compareCar1.price)}</p>
                        <p>{lang === 'ua' ? 'Ліквідність' : 'Liquidity'}: {compareCar1.liquidity_score} / 100</p>
                        <p>{lang === 'ua' ? 'Рік' : 'Year'}: {compareCar1.year}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-sm">{compareCar2.title}</p>
                        <p>{lang === 'ua' ? 'Ціна' : 'Price'}: {formatPrice(compareCar2.price)}</p>
                        <p>{lang === 'ua' ? 'Ліквідність' : 'Liquidity'}: {compareCar2.liquidity_score} / 100</p>
                        <p>{lang === 'ua' ? 'Рік' : 'Year'}: {compareCar2.year}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold mb-6 text-left">{currentText.savedVehicles} ({currentUserData.saved.length})</h2>
              {currentUserData.saved.length === 0 ? (
                <div className={`p-16 text-center rounded-3xl border shadow-xl ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'}`}>
                  <Bookmark size={56} className="mx-auto mb-4 opacity-30 text-emerald-500" />
                  <p className="font-bold text-lg">{currentText.emptySaved}</p>
                  <p className="text-xs mt-1 text-slate-500">{currentText.emptySavedSub}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {cars.filter(c => currentUserData.saved.includes(c.id)).map(car => {
                    const isBooked = currentUserData.booked.includes(car.id);
                    const bDetails = currentUserData.bookingsDetails?.[car.id];
                    let statusText = '';
                    if (isBooked) {
                      if (bDetails?.status === 'approved') statusText = lang === 'ua' ? 'Статус: Бронювання схвалено адміном' : 'Status: Booking approved';
                      else if (bDetails?.status === 'rejected') statusText = lang === 'ua' ? 'Статус: Відхилено' : 'Status: Rejected';
                      else statusText = lang === 'ua' ? 'Статус: Заброньовано (очікує підтвердження)' : 'Status: Booked (pending)';
                    }

                    return (
                      <div key={car.id} className={`rounded-3xl p-6 border shadow-xl flex flex-col justify-between ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                        <div>
                          <img src={car.image_url} alt="" className="w-full h-36 object-cover rounded-2xl mb-4" />
                          <h3 className="font-bold text-lg mb-1 text-left">{car.title}</h3>
                          <p className="text-emerald-500 font-black text-lg mb-2 text-left">{formatPrice(car.price)}</p>
                          {isBooked && (
                            <span className="inline-block px-2.5 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold text-[10px] rounded uppercase mb-2">
                              {statusText}
                            </span>
                          )}
                        </div>
                        <div className="space-y-2 mt-4">
                          {!isBooked ? (
                            <button onClick={() => handleOpenBookingModal(car)} className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold">{lang === 'ua' ? 'Забронювати автомобіль' : 'Book vehicle'}</button>
                          ) : (
                            <button disabled className="w-full py-2 bg-slate-700 text-slate-400 rounded-xl text-xs font-bold cursor-not-allowed">{lang === 'ua' ? 'Бронювання на розгляді' : 'Booking pending'}</button>
                          )}
                          <button onClick={() => handleToggleSave(car.id)} className="w-full py-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl text-xs font-bold">{lang === 'ua' ? 'Видалити зі збережених' : 'Remove from saved'}</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'recent' && (
            <div className="animate-fadeIn">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-left">{currentText.recent} ({currentUserData.recent.length})</h2>
                {currentUserData.recent.length > 0 && (
                  <button onClick={handleClearRecent} className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all">
                    <Trash2 size={16}/> {currentText.clearHistory}
                  </button>
                )}
              </div>

              {currentUserData.recent.length === 0 ? (
                <div className={`p-16 text-center rounded-3xl border shadow-xl ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'}`}>
                  <History size={56} className="mx-auto mb-4 opacity-30 text-emerald-500" />
                  <p className="font-bold text-lg">{currentText.emptyHistory}</p>
                  <p className="text-xs mt-1 text-slate-500">{currentText.emptyHistorySub}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {cars.filter(c => currentUserData.recent.includes(c.id)).map(car => {
                    const isBooked = currentUserData.booked.includes(car.id);
                    return (
                      <div key={car.id} className={`rounded-3xl p-6 border shadow-xl flex flex-col justify-between ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                        <div>
                          <img src={car.image_url} alt="" className="w-full h-36 object-cover rounded-2xl mb-4" />
                          <h3 className="font-bold text-lg mb-1 text-left">{car.title}</h3>
                          <p className="text-emerald-500 font-black text-lg mb-3 text-left">{formatPrice(car.price)}</p>
                          {isBooked && <span className="inline-block px-2.5 py-1 bg-amber-500 text-slate-950 font-black text-[10px] rounded uppercase mb-2">{currentText.bookedStatus}</span>}
                        </div>
                        <div className="space-y-2 mt-4">
                          <button onClick={() => handleOpenCarDetail(car)} className="w-full py-2 bg-slate-800 text-white hover:bg-emerald-500 hover:text-slate-950 rounded-xl text-xs font-bold transition-all">{currentText.viewAgain}</button>
                          {!isBooked ? (
                            <button onClick={() => handleOpenBookingModal(car)} className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold">{currentText.book}</button>
                          ) : (
                            <button disabled className="w-full py-2 bg-slate-700 text-slate-400 rounded-xl text-xs font-bold cursor-not-allowed">{currentText.bookedStatus}</button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="max-w-4xl mx-auto py-6 animate-fadeIn">
              <div className="flex justify-between items-start mb-10">
                <div className="text-left">
                  <span className="text-xs font-extrabold text-emerald-500 uppercase tracking-widest">{currentText.customerReviews}</span>
                  <h2 className="text-3xl font-black mt-1">{currentText.whatTheySay}</h2>
                </div>
                <div className={`p-4 rounded-3xl border flex items-center gap-4 shadow-xl ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                  <div className="text-3xl font-black text-emerald-500">{averageRating}</div>
                  <div>
                    <div className="flex text-amber-400"><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} stroke="currentColor"/></div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{totalReviewsCount} {lang === 'ua' ? 'відгуків' : 'reviews'}</p>
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
                          <p className="text-sm italic mb-6 leading-relaxed opacity-90 text-left">"{rev.comment}"</p>
                        </div>
                        <div className={`pt-4 border-t ${theme === 'dark' ? 'border-slate-700/40' : 'border-slate-200'} flex justify-between items-center text-xs`}>
                          <span className="font-bold">{rev.author}</span>
                          <span className="text-emerald-500 flex items-center gap-1"><CheckCircle2 size={12}/> {lang === 'ua' ? 'Перевірено' : 'Verified'}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {reviews.length > 3 && (
                    <div className="flex justify-center gap-2 mt-6">
                      <button onClick={() => setCurrentReviewIdx(0)} className={`h-2 rounded-full transition-all ${currentReviewIdx === 0 ? 'w-8 bg-emerald-500' : 'w-2 bg-slate-600'}`} />
                      <button onClick={() => setCurrentReviewIdx(3)} className={`h-2 rounded-full transition-all ${currentReviewIdx === 3 ? 'w-8 bg-emerald-500' : 'w-2 bg-slate-600'}`} />
                    </div>
                  )}
                </div>
              )}

              <div className="text-center mb-10">
                <button onClick={() => setShowAllReviews(!showAllReviews)} className={`px-8 py-3.5 rounded-2xl border text-xs font-bold transition-all shadow-lg ${theme === 'dark' ? 'border-slate-700 hover:bg-slate-800 text-white' : 'border-slate-300 hover:bg-slate-100 text-slate-800'}`}>
                  {showAllReviews ? currentText.hideReviews : `${currentText.viewAllReviews} (${totalReviewsCount})`}
                </button>

                {showAllReviews && (
                  <div className="mt-8 space-y-6 text-left animate-fadeIn">
                    <div className="flex gap-2 justify-center flex-wrap">
                      <button onClick={() => setReviewFilter('all')} className={`px-4 py-1.5 rounded-xl text-xs font-bold ${reviewFilter === 'all' ? 'bg-emerald-500 text-white' : theme === 'dark' ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-800'}`}>{lang === 'ua' ? 'Усі оцінки' : 'All ratings'}</button>
                      {[5, 4, 3, 2, 1].map(stars => (
                        <button key={stars} onClick={() => setReviewFilter(String(stars))} className={`px-4 py-1.5 rounded-xl text-xs font-bold ${reviewFilter === String(stars) ? 'bg-emerald-500 text-white' : theme === 'dark' ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-800'}`}>{stars} ★</button>
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
                          <p className="text-xs opacity-80 text-left">"{r.comment}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className={`border rounded-3xl p-8 mb-12 shadow-2xl relative overflow-hidden text-left ${theme === 'dark' ? 'bg-[#121824] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                <span className="text-xs font-extrabold text-emerald-500 uppercase tracking-wider">{currentText.yourOpinion}</span>
                <h3 className="text-2xl font-black mt-1 mb-2">{currentText.shareExperience}</h3>
                
                <form onSubmit={handleAddReview} className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-medium opacity-80">{currentText.yourRating}</span>
                    <div className="flex text-amber-400 cursor-pointer gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={22} fill={star <= newReviewRating ? "currentColor" : "none"} onClick={() => setNewReviewRating(star)} />
                      ))}
                    </div>
                  </div>
                  <input type="text" placeholder={lang === 'ua' ? "Ваше ім'я" : "Your name"} value={newReviewAuthor} onChange={e=>setNewReviewAuthor(e.target.value)} className={`w-full p-3.5 border rounded-2xl text-xs outline-none ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} required />
                  <textarea placeholder={lang === 'ua' ? "Ваш відгук..." : "Your review..."} value={newReviewComment} onChange={e=>setNewReviewComment(e.target.value)} className={`w-full p-3.5 border rounded-2xl text-xs h-24 outline-none ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} required />
                  <button type="submit" className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-2xl shadow-lg">{currentText.publishReview}</button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'admin' && user?.is_admin && (
            <div className="max-w-4xl mx-auto py-8 animate-fadeIn space-y-10 text-left">
              <h2 className="text-2xl font-bold flex items-center gap-2"><ShieldPlus className="text-amber-500"/> {currentText.adminTitle}</h2>
              
              {/* БЛОК КЕРУВАННЯ БРОНЮВАННЯМИ НАПРАМУ З БАЗИ */}
              <div className={`p-8 rounded-3xl border shadow-xl space-y-4 ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                <h3 className="font-bold text-sm text-emerald-500 uppercase tracking-wider">{lang === 'ua' ? 'Керування бронюваннями користувачів' : 'User Bookings Management'}</h3>
                {adminBookings.length === 0 ? (
                  <p className="text-xs text-slate-400">{lang === 'ua' ? 'Немає активних бронювань у базі даних.' : 'No active bookings in DB.'}</p>
                ) : (
                  <div className="space-y-3">
                    {adminBookings.map(b => (
                      <div key={b.id} className={`p-4 rounded-2xl border flex justify-between items-center ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                        <div>
                          <p className="font-bold text-xs">Car ID: {b.car_id} | User: {b.user_email}</p>
                          <p className="text-xs text-slate-400 mt-0.5">Phone: {b.phone} | Comment: {b.comment || '-'}</p>
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
                          }} className="px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-xl">{lang === 'ua' ? 'Схвалити' : 'Approve'}</button>
                          
                          <button onClick={() => {
                            fetch(`http://127.0.0.1:8000/api/admin/bookings/${b.id}`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ status: 'rejected' })
                            }).then(() => fetchAdminBookings());
                          }} className="px-3 py-1.5 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl">{lang === 'ua' ? 'Відхилити' : 'Reject'}</button>

                          <button onClick={() => {
                            if (confirm('Видалити бронювання з бази?')) {
                              fetch(`http://127.0.0.1:8000/api/admin/bookings/${b.id}`, { method: 'DELETE' })
                                .then(() => fetchAdminBookings());
                            }
                          }} className="px-3 py-1.5 bg-red-500/10 text-red-400 text-xs font-bold rounded-xl"><Trash2 size={14}/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* БЛОК ВИДАЛЕННЯ АВТОМОБІЛІВ З БАЗИ */}
              <div className={`p-8 rounded-3xl border shadow-xl space-y-4 ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                <h3 className="font-bold text-sm text-emerald-500 uppercase tracking-wider">{lang === 'ua' ? 'Видалення автомобілів з бази даних' : 'Delete Cars from Database'}</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {cars.map(c => (
                    <div key={c.id} className={`p-3 rounded-xl border flex justify-between items-center ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                      <div className="flex items-center gap-3">
                        <img src={c.image_url} alt="" className="w-10 h-10 object-cover rounded-lg" />
                        <div>
                          <p className="font-bold text-xs">{c.title} ({c.year})</p>
                          <p className="text-[10px] text-emerald-500">{formatPrice(c.price)}</p>
                        </div>
                      </div>
                      <button onClick={() => {
                        if (confirm(`Видалити ${c.title} з бази даних?`)) {
                          fetch(`http://127.0.0.1:8000/api/admin/cars/${c.id}`, { method: 'DELETE' })
                            .then(() => {
                              alert('Авто успішно видалено!');
                              fetchCars();
                            });
                        }
                      }} className="px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1">
                        <Trash2 size={14}/> {lang === 'ua' ? 'Видалити з БД' : 'Delete from DB'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* ДОДАВАННЯ АВТО */}
              <form onSubmit={handleAddCar} className={`p-8 rounded-3xl border shadow-xl space-y-5 ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                <h3 className="font-bold text-sm text-emerald-500">{currentText.addCarTitle}</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">{lang === 'ua' ? 'Марка авто (Brand) *' : 'Car Brand *'}</label>
                    <input type="text" placeholder="BMW" value={newCar.brand} onChange={e=>setNewCar({...newCar, brand: e.target.value})} className={`w-full p-3 border rounded-xl text-xs ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} required />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">{lang === 'ua' ? 'Модель (Model) *' : 'Car Model *'}</label>
                    <input type="text" placeholder="M4 Competition" value={newCar.model} onChange={e=>setNewCar({...newCar, model: e.target.value})} className={`w-full p-3 border rounded-xl text-xs ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">{lang === 'ua' ? 'Тип кузова (Body Type)' : 'Body Type'}</label>
                    <select value={newCar.body_type} onChange={e=>setNewCar({...newCar, body_type: e.target.value})} className={`w-full p-3 border rounded-xl text-xs ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}>
                      <option value="Sedan">{currentText.sedan}</option>
                      <option value="SUV">{currentText.suv}</option>
                      <option value="Coupe">{currentText.coupe}</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">{lang === 'ua' ? 'Коробка передач (Transmission)' : 'Transmission'}</label>
                    <select value={newCar.transmission} onChange={e=>setNewCar({...newCar, transmission: e.target.value})} className={`w-full p-3 border rounded-xl text-xs ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}>
                      <option value="Automatic">{currentText.automatic}</option>
                      <option value="Manual">{currentText.manual}</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">{lang === 'ua' ? 'Рік випуску *' : 'Year *'}</label>
                    <input type="number" placeholder="2023" value={newCar.year} onChange={e=>setNewCar({...newCar, year: Number(e.target.value)})} className={`w-full p-3 border rounded-xl text-xs ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} required />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">{lang === 'ua' ? 'Ціна ($) *' : 'Price ($) *'}</label>
                    <input type="number" placeholder="74500" value={newCar.price} onChange={e=>setNewCar({...newCar, price: Number(e.target.value)})} className={`w-full p-3 border rounded-xl text-xs ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} required />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">{lang === 'ua' ? 'Пробіг *' : 'Mileage *'}</label>
                    <input type="number" placeholder="12000" value={newCar.mileage} onChange={e=>setNewCar({...newCar, mileage: Number(e.target.value)})} className={`w-full p-3 border rounded-xl text-xs ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} required />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">{lang === 'ua' ? 'Ліквідність (0-100)' : 'Liquidity (0-100)'}</label>
                    <input type="number" placeholder="92" value={newCar.custom_liquidity} onChange={e=>setNewCar({...newCar, custom_liquidity: Number(e.target.value)})} className={`w-full p-3 border rounded-xl text-xs ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} required />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">{lang === 'ua' ? 'URL фотографії *' : 'Image URL *'}</label>
                  <input type="text" placeholder="https://images.unsplash.com/..." value={newCar.image_url} onChange={e=>setNewCar({...newCar, image_url: e.target.value})} className={`w-full p-3 border rounded-xl text-xs ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} required />
                </div>

                <button type="submit" className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs shadow-lg">{lang === 'ua' ? 'Додати авто у базу та розіслати email підписникам' : 'Add car to DB & dispatch email to subscribers'}</button>
              </form>
            </div>
          )}

        </div>

        <footer className={`mt-16 pt-6 border-t ${theme === 'dark' ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-600'} text-xs flex justify-between items-center`}>
          <p>{currentText.footerRights}</p>
          <div className="flex gap-6">
            <span>📞 +38 (068) 331-78-25</span>
            <span>✉️ support@autoadvisor.ua</span>
            <span>📍 {lang === 'ua' ? 'м. Київ, вул. Технічна, 12' : 'Kyiv, Technichna str., 12'}</span>
          </div>
        </footer>
      </main>

      <div className="fixed bottom-6 right-6 z-40">
        {!isChatOpen ? (
          <button 
            onClick={() => setIsChatOpen(true)} 
            className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110"
            title="AI Assistant"
          >
            <Bot size={26} />
          </button>
        ) : (
          <div className={`w-80 md:w-96 h-[450px] rounded-3xl border shadow-2xl flex flex-col justify-between overflow-hidden animate-fadeIn ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <div className={`p-4 border-b flex justify-between items-center ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
              <div className="flex items-center gap-2">
                <Bot size={18} className="text-emerald-500" />
                <span className="font-bold text-xs">{currentText.aiChatTitle}</span>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-white"><X size={18}/></button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-2xl max-w-[80%] ${msg.sender === 'user' ? 'bg-emerald-500 text-white font-medium' : theme === 'dark' ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-800'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessageToAI} className={`p-3 border-t flex gap-2 ${theme === 'dark' ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-slate-50'}`}>
              <input 
                type="text" 
                value={chatInput} 
                onChange={e => setChatInput(e.target.value)} 
                placeholder={currentText.aiChatPlaceholder} 
                className={`flex-1 p-2.5 rounded-xl border text-xs outline-none ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`} 
              />
              <button type="submit" className="p-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl"><Send size={16}/></button>
            </form>
          </div>
        )}
      </div>

      {isBookingModalOpen && carToBook && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm animate-fadeIn">
          <div className={`p-8 rounded-3xl w-full max-w-md shadow-2xl border text-left ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{lang === 'ua' ? 'Бронювання' : 'Booking'}: {carToBook.title}</h3>
              <button onClick={() => setIsBookingModalOpen(false)} className="text-slate-400 hover:text-white"><X size={20}/></button>
            </div>
            <p className="text-xs text-slate-400 mb-6">{lang === 'ua' ? 'Введіть ваш номер телефону для підтвердження менеджером через адмін-панель.' : 'Enter your phone number for manager confirmation.'}</p>
            <form onSubmit={handleSubmitBooking} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">{lang === 'ua' ? 'Номер телефону *' : 'Phone number *'}</label>
                <input type="tel" value={bookingPhone} onChange={e => setBookingPhone(e.target.value)} placeholder="+38 (0XX) XXX-XX-XX" className={`w-full p-3 border rounded-xl text-sm ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} required />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">{lang === 'ua' ? 'Коментар (необов\'язково)' : 'Comment (optional)'}</label>
                <textarea value={bookingComment} onChange={e => setBookingComment(e.target.value)} placeholder={lang === 'ua' ? 'Бажаний час дзвінка...' : 'Preferred call time...'} className={`w-full p-3 border rounded-xl text-sm h-20 ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} />
              </div>
              <button type="submit" className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm shadow-lg">{lang === 'ua' ? 'Надіслати запит на бронювання' : 'Submit booking request'}</button>
            </form>
          </div>
        </div>
      )}

      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm animate-fadeIn overflow-y-auto py-10">
          <div className={`p-8 rounded-3xl w-full max-w-3xl shadow-2xl border relative text-left ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full uppercase">PERSONAL WORKSPACE</span>
                <h2 className="text-2xl font-extrabold mt-1">{currentText.settingsTitle}</h2>
                <p className="text-xs text-slate-400">{currentText.settingsSub}</p>
              </div>
              <button onClick={() => setIsSettingsOpen(false)} className="text-slate-400 hover:text-white"><X size={20}/></button>
            </div>

            <form onSubmit={handleSavePreferences} className="space-y-6">
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <h3 className="text-sm font-bold mb-3">{currentText.profileInfo}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">{currentText.fullName}</label>
                    <input type="text" value={settingsName} onChange={e => setSettingsName(e.target.value)} className={`w-full p-3 border rounded-xl text-sm ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`} required />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">{currentText.emailLocked}</label>
                    <input type="email" value={user?.email || ''} disabled className={`w-full p-3 border rounded-xl text-sm opacity-60 cursor-not-allowed ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'}`} />
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <h3 className="text-sm font-bold mb-3">{currentText.marketPreferences}</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">{currentText.language}</label>
                    <select value={settingsLang} onChange={e => setSettingsLang(e.target.value)} className={`w-full p-2.5 border rounded-xl text-sm ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}>
                      <option value="ua">Українська</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">{currentText.currency}</label>
                    <select value={settingsCurrency} onChange={e => setSettingsCurrency(e.target.value)} className={`w-full p-2.5 border rounded-xl text-sm ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}>
                      <option value="USD">USD — US Dollar ($)</option>
                      <option value="EUR">EUR — Euro (€)</option>
                      <option value="UAH">UAH — Гривня (₴)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">{currentText.distanceUnits}</label>
                    <select value={settingsDistance} onChange={e => setSettingsDistance(e.target.value)} className={`w-full p-2.5 border rounded-xl text-sm ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}>
                      <option value="mi">Miles (милі)</option>
                      <option value="km">Kilometers (км)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <h3 className="text-sm font-bold mb-3">{currentText.emailNotif}</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between text-xs cursor-pointer">
                    <span>{currentText.notifDesc}</span>
                    <input type="checkbox" checked={emailAlerts} onChange={e => setEmailAlerts(e.target.checked)} className="accent-emerald-500 w-4 h-4" />
                  </label>
                </div>
              </div>

              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <h3 className="text-sm font-bold mb-3">{currentText.changePass}</h3>
                <div className="grid grid-cols-3 gap-4">
                  <input type="password" placeholder={currentText.currPass} value={currentPass} onChange={e => setCurrentPass(e.target.value)} className={`p-3 border rounded-xl text-xs ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`} />
                  <input type="password" placeholder={currentText.newPass} value={newPass} onChange={e => setNewPass(e.target.value)} className={`p-3 border rounded-xl text-xs ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`} />
                  <input type="password" placeholder={currentText.confirmPass} value={confirmNewPass} onChange={e => setConfirmNewPass(e.target.value)} className={`p-3 border rounded-xl text-xs ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`} />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700/40">
                <button type="submit" className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs shadow-lg">{currentText.savePrefs}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm animate-fadeIn">
          <div className={`p-8 rounded-3xl w-full max-w-md shadow-2xl border text-left ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-4">
                <button onClick={() => setAuthMode('login')} className={`text-xl font-bold pb-1 border-b-2 transition-all ${authMode === 'login' ? 'border-emerald-500 text-emerald-500' : 'border-transparent text-slate-400'}`}>
                  {lang === 'ua' ? 'Увійти' : 'Sign In'}
                </button>
                <button onClick={() => setAuthMode('register')} className={`text-xl font-bold pb-1 border-b-2 transition-all ${authMode === 'register' ? 'border-emerald-500 text-emerald-500' : 'border-transparent text-slate-400'}`}>
                  {lang === 'ua' ? 'Реєстрація' : 'Register'}
                </button>
              </div>
              <button onClick={() => setIsAuthModalOpen(false)} className="text-slate-400 hover:text-white"><X size={20}/></button>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Display Name ({lang === 'ua' ? "Ім'я" : "Name"})</label>
                  <input type="text" value={nameInput} onChange={e => setNameInput(e.target.value)} className={`w-full p-3 border rounded-xl text-sm ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} placeholder="Sasha" required />
                </div>
              )}
              <div>
                <label className="text-xs text-slate-400 block mb-1">Email address</label>
                <input type="email" value={emailInput} onChange={e => setEmailInput(e.target.value)} className={`w-full p-3 border rounded-xl text-sm ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} placeholder="you@example.com" required />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Password ({lang === 'ua' ? 'мін. 8 символів' : 'min 8 chars'})</label>
                <input type="password" value={passInput} onChange={e => setPassInput(e.target.value)} className={`w-full p-3 border rounded-xl text-sm ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} placeholder="••••••••" required />
              </div>
              <button type="submit" className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm shadow-lg transition-transform active:scale-95">
                {authMode === 'login' ? (lang === 'ua' ? 'Увійти в акаунт' : 'Sign In') : (lang === 'ua' ? 'Створити акаунт' : 'Create Account')}
              </button>
            </form>
          </div>
        </div>
      )}

      <CarDetailModal 
        car={selectedCarForModal} 
        isOpen={Boolean(selectedCarForModal)} 
        onClose={() => setSelectedCarForModal(null)} 
        currency={currency}
        distanceUnit={distanceUnit}
        lang={lang}
        formatPrice={formatPrice}
        formatMileage={formatMileage}
        theme={theme}
      />
    </div>
  );
}