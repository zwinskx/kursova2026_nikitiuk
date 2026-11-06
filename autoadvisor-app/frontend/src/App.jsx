import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Compass, BarChart2, Bookmark, Settings, 
  Sun, Moon, X, ShieldPlus, Trash2, MessageSquare, Star, ChevronLeft, ChevronRight, CheckCircle2, History 
} from 'lucide-react';
import AccountSettingsModal from './components/AccountSettingsModal';
import CarDetailModal from './components/CarDetailModal';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Локалізація, валюта та одиниці виміру
  const [lang, setLang] = useState('ua'); // 'ua' або 'en'
  const [currency, setCurrency] = useState('USD'); // 'USD', 'EUR', 'UAH'
  const [distanceUnit, setDistanceUnit] = useState('mi'); // 'mi', 'km'
  
  // Авторизація
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login', 'register', 'forgot'
  const [emailInput, setEmailInput] = useState('');
  const [passInput, setPassInput] = useState('');
  const [nameInput, setNameInput] = useState('');

  // Скидання пароля через пошту з кодом
  const [resetStep, setResetStep] = useState(1); // 1 - ввести пошту, 2 - ввести код і новий пароль
  const [resetCodeInput, setResetCodeInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');

  // Налаштування профілю
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsName, setSettingsName] = useState('');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [deliveryFreq, setDeliveryFreq] = useState('Daily digest');
  const [minLiquidity, setMinLiquidity] = useState(85);
  
  // Зміна пароля з налаштувань
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmNewPass, setConfirmNewPass] = useState('');

  // Фільтри
  const [budget, setBudget] = useState(80000);
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedBody, setSelectedBody] = useState('Any');
  const [selectedTransmission, setSelectedTransmission] = useState('Any');
  const [minLiquidityFilter, setMinLiquidityFilter] = useState(0);

  const [appliedFilters, setAppliedFilters] = useState({
    budget: 80000,
    brand: 'All',
    body: 'Any',
    transmission: 'Any',
    minLiquidity: 0
  });

  const [cars, setCars] = useState([]);
  const [selectedCarForModal, setSelectedCarForModal] = useState(null);

  // Персональні дані по акаунтах
  const [userPersonalData, setUserPersonalData] = useState({});

  // Модальне вікно бронювання
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [carToBook, setCarToBook] = useState(null);
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingComment, setBookingComment] = useState('');

 // Відгуки (управління індексом слайдера)
  const [reviews, setReviews] = useState([]);
  const [currentReviewIdx, setCurrentReviewIdx] = useState(0);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [reviewFilter, setReviewFilter] = useState('all');
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [isPaused, setIsPaused] = useState(false); // Для зупинки при наведенні курсору

  // Циклічне перегортання по 3 відгуки: 3 -> 2 -> 3 -> 2...
  useEffect(() => {
    if (reviews.length <= 3 || showAllReviews || isPaused) return;

    const interval = setInterval(() => {
      setCurrentReviewIdx(prev => {
        // Якщо зараз показано перші 3 (індекс 0), переходимо до останніх 2 (індекс 3)
        // Якщо зараз індекс 3, повертаємось на початок (індекс 0)
        return prev === 0 ? 3 : 0;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [reviews.length, showAllReviews, isPaused]);
  
  // Форма додавання авто в адмінці
  const [newCar, setNewCar] = useState({
    brand: 'BMW', model: 'M4 Competition', year: 2023, body_type: 'Coupe', transmission: 'Automatic', 
    mileage: 12000, price: 74500, engine_volume: '3.0L', custom_liquidity: 92, badge: 'BEST MATCH', 
    image_url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
    description: 'Спортивне купе з двигуном TwinPower Turbo, ідеальна керованість та висока ліквідність на вторинному ринку.'
  });

  // Повний словник локалізації (ua / en)
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
      marketAnalyticsSub: 'Досліджуйте ціни, попит та ліквідність на автомобільному ринку.',
      medianPrice: 'Середня ціна',
      inventory: 'Автомобілів у базі',
      daysOnMarket: 'Днів на ринку',
      demandIndex: 'Індекс попиту',
      segmentPerformance: 'Ефективність сегментів',
      suvSegment: 'SUV та кросовери',
      sedanSegment: 'Преміум седани',
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
      allCarsMySQL: 'Усі автомобілі в базі MySQL',
      bookingRequests: 'Запити на бронювання від користувачів',
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
      savePrefs: 'Зберегти налаштування'
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
      marketAnalyticsSub: 'Explore pricing, demand and liquidity across the automotive market.',
      medianPrice: 'Median Price',
      inventory: 'Inventory',
      daysOnMarket: 'Days on Market',
      demandIndex: 'Demand Index',
      segmentPerformance: 'Segment performance',
      suvSegment: 'SUV & Crossovers',
      sedanSegment: 'Premium sedans',
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
      allCarsMySQL: 'All Cars in MySQL Database',
      bookingRequests: 'User Booking Requests',
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
      savePrefs: 'Save preferences'
    }
  };

  const currentText = t[lang];

  const fetchCars = () => {
    fetch(`http://127.0.0.1:8000/api/recommendations?budget_max=${appliedFilters.budget}&brand=${appliedFilters.brand}&body_type=${appliedFilters.body}&transmission=${appliedFilters.transmission}&min_liquidity=${appliedFilters.minLiquidity}`)
      .then(res => res.json())
      .then(data => setCars(data));
  };

  const fetchReviews = () => {
    fetch('http://127.0.0.1:8000/api/reviews')
      .then(res => res.json())
      .then(data => setReviews(data));
  };

  useEffect(() => {
    fetchCars();
    fetchReviews();
  }, [appliedFilters]);

  useEffect(() => {
    if (user) {
      setSettingsName(user.display_name);
      setEmailAlerts(user.email_alerts ?? true);
      setDeliveryFreq(user.delivery_frequency ?? 'Daily digest');
      setMinLiquidity(user.min_liquidity ?? 85);
      if (!userPersonalData[user.email]) {
        setUserPersonalData(prev => ({
          ...prev,
          [user.email]: { saved: [], booked: [], recent: [], bookingsDetails: {} }
        }));
      }
    }
  }, [user]);

  const currentUserData = user && userPersonalData[user.email] ? userPersonalData[user.email] : { saved: [], booked: [], recent: [], bookingsDetails: {} };

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

  // Конвертація та форматування ціни
  const formatPrice = (priceInUSD) => {
    if (!priceInUSD) return '$0';
    let rate = 1;
    let symbol = '$';
    if (currency === 'EUR') { rate = 0.92; symbol = '€'; }
    if (currency === 'UAH') { rate = 41.5; symbol = '₴'; }
    const converted = Math.round(priceInUSD * rate);
    return `${converted.toLocaleString()} ${symbol}`;
  };

  // Форматування пробігу
  const formatMileage = (mileageInMiles) => {
    if (typeof mileageInMiles !== 'number') return mileageInMiles;
    if (distanceUnit === 'km') {
      const km = Math.round(mileageInMiles * 1.60934);
      return `${km.toLocaleString()} ${lang === 'ua' ? 'км' : 'km'}`;
    }
    return `${mileageInMiles.toLocaleString()} ${lang === 'ua' ? 'миль' : 'mi'}`;
  };

  useEffect(() => {
    if (reviews.length === 0 || showAllReviews) return;
    const interval = setInterval(() => {
      setIsAnimatingReview(true);
      setTimeout(() => {
        setCurrentReviewIdx(prev => (prev + 1) % reviews.length);
        setIsAnimatingReview(false);
      }, 300);
    }, 5000);
    return () => clearInterval(interval);
  }, [reviews, showAllReviews]);

  const handleApplyFilters = () => {
    setAppliedFilters({
      budget,
      brand: selectedBrand,
      body: selectedBody,
      transmission: selectedTransmission,
      minLiquidity: Number(minLiquidityFilter)
    });
  };

  // Справжній запит на відправку коду для скидання пароля на пошту
  const handleSendResetCode = (e) => {
    e.preventDefault();
    fetch('http://127.0.0.1:8000/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailInput })
    })
    .then(res => res.json().then(data => ({ status: res.status, body: data })))
    .then(res => {
      if (res.status === 200) {
        alert(res.body.message || 'Код підтвердження успішно надіслано на вашу пошту!');
        setResetStep(2);
      } else {
        alert(res.body.detail || 'Користувача з такою поштою не знайдено.');
      }
    })
    .catch(() => {
      alert('Помилка зʼєднання з сервером.');
    });
  };

  // Підтвердження коду та збереження нового пароля на сервері
  const handleVerifyAndResetPassword = (e) => {
    e.preventDefault();
    if (newPasswordInput.length < 8) {
      alert('Пароль має містити мінімум 8 символів!');
      return;
    }
    fetch('http://127.0.0.1:8000/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailInput, code: resetCodeInput, new_password: newPasswordInput })
    })
    .then(res => res.json().then(data => ({ status: res.status, body: data })))
    .then(res => {
      if (res.status === 200) {
        alert(res.body.message || 'Пароль успішно змінено!');
        setAuthMode('login');
        setResetStep(1);
        setPassInput(newPasswordInput);
      } else {
        alert(res.body.detail || 'Невірний або прострочений код підтвердження.');
      }
    });
  };

  const handleAuth = (e) => {
    e.preventDefault();
    if (authMode === 'register' && passInput.length < 8) {
      alert('Помилка валідації: Пароль має містити мінімум 8 символів!');
      return;
    }

    const endpoint = authMode === 'login' ? '/api/login' : '/api/register';
    const body = authMode === 'login' ? { email: emailInput, password: passInput } : { email: emailInput, password: passInput, display_name: nameInput };

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
        alert(res.body.detail || 'Помилка авторизації');
      }
    });
  };

  const handleSavePreferences = (e) => {
    e.preventDefault();
    if (!user) return;
    if (newPass && newPass !== confirmNewPass) {
      alert('Нові паролі не збігаються!');
      return;
    }
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
        alert(res.body.message || 'Налаштування успішно збережено!');
        setCurrentPass('');
        setNewPass('');
        setConfirmNewPass('');
      } else {
        alert(res.body.detail || 'Помилка збереження налаштувань');
      }
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
      alert(data.message || 'Авто успішно додано в базу та запущено справжню email-розсилку підписникам!'); 
      fetchCars(); 
    });
  };

  const handleDeleteCar = (id) => {
    fetch(`http://127.0.0.1:8000/api/admin/cars/${id}`, { method: 'DELETE' }).then(() => fetchCars());
  };

  const handleToggleSave = (carId) => {
    if (!user) {
      alert('Будь ласка, увійдіть в акаунт, щоб зберігати автомобілі.');
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
    alert('Історію переглядів повністю очищено.');
  };

  const handleOpenBookingModal = (car) => {
    if (!user) {
      alert('Будь ласка, увійдіть в акаунт, щоб забронювати автомобіль.');
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

    updateCurrentUserData(data => ({
      ...data,
      booked: [...data.booked, carToBook.id],
      bookingsDetails: {
        ...data.bookingsDetails,
        [carToBook.id]: { phone: bookingPhone, comment: bookingComment, status: 'pending' }
      }
    }));

    setIsBookingModalOpen(false);
    alert('Запит на бронювання надіслано! Адміністратор перевірить його в адмін-панелі.');
  };

  const handleAdminApproveBooking = (userEmail, carId) => {
    setUserPersonalData(prev => {
      const uData = prev[userEmail];
      if (!uData) return prev;
      return {
        ...prev,
        [userEmail]: {
          ...uData,
          bookingsDetails: {
            ...uData.bookingsDetails,
            [carId]: { ...uData.bookingsDetails[carId], status: 'approved' }
          }
        }
      };
    });
    alert('Бронювання підтверджено!');
  };

  const handleAdminRejectBooking = (userEmail, carId) => {
    setUserPersonalData(prev => {
      const uData = prev[userEmail];
      if (!uData) return prev;
      return {
        ...prev,
        [userEmail]: {
          ...uData,
          booked: uData.booked.filter(id => id !== carId),
          bookingsDetails: {
            ...uData.bookingsDetails,
            [carId]: { ...uData.bookingsDetails[carId], status: 'rejected' }
          }
        }
      };
    });
    alert('Бронювання відхилено.');
  };

  const handleConfirmPurchase = (carId) => {
    fetch(`http://127.0.0.1:8000/api/admin/cars/${carId}`, { method: 'DELETE' }).then(() => {
      setUserPersonalData(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(email => {
          next[email] = {
            ...next[email],
            booked: next[email].booked.filter(id => id !== carId),
            saved: next[email].saved.filter(id => id !== carId)
          };
        });
        return next;
      });
      fetchCars();
      alert('Покупку підтверджено! Автомобіль остаточно видалено з асортименту.');
    });
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
      alert('Будь ласка, увійдіть в акаунт, щоб залишити відгук.');
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
      alert('Відгук успішно опубліковано!');
    });
  };

  const totalReviewsCount = reviews.length;
  const averageRating = totalReviewsCount > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviewsCount).toFixed(1) 
    : '4.3';

  const filteredReviews = reviewFilter === 'all' 
    ? reviews 
    : reviews.filter(r => r.rating === Number(reviewFilter));

  return (
    <div className={theme === 'dark' ? 'dark bg-[#0b0f19] text-slate-100 min-h-screen flex font-sans' : 'bg-slate-100 text-slate-900 min-h-screen flex font-sans'}>
      
      {/* ФІКСОВАНА БІЧНА ПАНЕЛЬ */}
      <aside className={`w-64 h-screen sticky top-0 flex flex-col justify-between p-6 border-r transition-colors z-30 shadow-2xl ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-600'}`}>
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-gradient-to-tr from-emerald-600 to-emerald-400 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/30">
              📈
            </div>
            <span className={`text-xl font-extrabold tracking-wide ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>AutoAdvisor</span>
          </div>

          <nav className="space-y-1.5">
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
            else { setIsSettingsOpen(true); }
          }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'}`}>
            <Settings size={18} /> {currentText.settings}
          </button>

          <div className="flex items-center justify-between pt-2">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                  {user.display_name[0]}
                </div>
                <div>
                  <p className={`text-sm font-semibold truncate w-28 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{user.display_name}</p>
                  <p className="text-xs text-emerald-400">{user.is_admin ? 'Адмін' : 'Аналітик'}</p>
                </div>
              </div>
            ) : (
              <button onClick={() => { setAuthMode('login'); setResetStep(1); setIsAuthModalOpen(true); }} className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-lg transition-all">
                {currentText.signIn}
              </button>
            )}

            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className={`p-2.5 rounded-xl border ml-2 transition-transform hover:scale-110 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-800'}`}>
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
      </aside>

      {/* ОСНОВНИЙ КОНТЕНТ */}
      <main className="flex-1 p-10 overflow-y-auto flex flex-col justify-between min-h-screen">
        <div>
          <div className="flex justify-between items-center mb-8">
            <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Workspace / <span className="text-emerald-400">{activeTab}</span></span>
            {user && <button onClick={() => setUser(null)} className="text-xs px-3.5 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl font-semibold transition-all">{currentText.logout}</button>}
          </div>

          {/* 1. OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fadeIn transition-all duration-500">
              <div className={`p-8 rounded-3xl border shadow-xl relative overflow-hidden transition-all duration-500 ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Smart Market Intelligence</span>
                    <h1 className="text-3xl font-black mt-1">{currentText.hello}, {user?.display_name || currentText.guest}!</h1>
                    <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Here is what is happening in the automotive market today.</p>
                  </div>
                  <button onClick={() => setActiveTab('analytics')} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow">View market report &gt;</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                  <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/50 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}>
                    <p className="text-[10px] uppercase font-semibold text-slate-400">Cars Analyzed</p>
                    <p className="text-2xl font-black mt-1">24,892</p>
                    <span className="text-[10px] text-emerald-500 font-bold">+142 added this month</span>
                  </div>
                  <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/50 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}>
                    <p className="text-[10px] uppercase font-semibold text-slate-400">Average Price</p>
                    <p className="text-2xl font-black mt-1">{formatPrice(31420)}</p>
                    <span className="text-[10px] text-emerald-500 font-bold">Across all active listings</span>
                  </div>
                  <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/50 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}>
                    <p className="text-[10px] uppercase font-semibold text-slate-400">Market Liquidity</p>
                    <p className="text-2xl font-black mt-1">74.8</p>
                    <span className="text-[10px] text-emerald-500 font-bold">Healthy buyer demand</span>
                  </div>
                  <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/50 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}>
                    <p className="text-[10px] uppercase font-semibold text-slate-400">Saved Value</p>
                    <p className="text-2xl font-black mt-1">{formatPrice(486000)}</p>
                    <span className="text-[10px] text-emerald-500 font-bold">Across {currentUserData.saved.length} saved vehicles</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`md:col-span-2 p-6 rounded-3xl border ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-base">{currentText.marketTrend}</h3>
                    <div className="flex gap-1 text-[10px] font-bold">
                      <span className={`px-2 py-1 rounded ${theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-800'}`}>1M</span>
                      <span className={`px-2 py-1 rounded ${theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>3M</span>
                      <span className={`px-2 py-1 rounded ${theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>6M</span>
                      <span className={`px-2 py-1 rounded ${theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>1Y</span>
                    </div>
                  </div>
                  <p className="text-sm font-black text-emerald-500 mb-4">{formatPrice(31420)} <span className="text-xs text-emerald-600 font-normal">+{formatPrice(1080)} vs previous period</span></p>
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
                    <h3 className="font-extrabold text-lg mt-3">The best time to buy premium sedans is now.</h3>
                    <p className={`text-xs mt-2 leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Prices are 6.2% below the seasonal average while liquidity has increased for the third week in a row.</p>
                  </div>
                  <div className={`pt-4 border-t flex justify-between items-center text-xs ${theme === 'dark' ? 'border-slate-700/50 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                    <span>Confidence</span>
                    <span className="font-bold text-emerald-500">High - 92%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. DISCOVER */}
          {activeTab === 'discover' && (
            <div className="animate-fadeIn space-y-6">
              <div className={`p-8 rounded-3xl border mb-8 shadow-xl ${theme === 'dark' ? 'bg-gradient-to-r from-emerald-500/15 via-[#0f172a] to-[#0f172a] border-emerald-500/20 text-white' : 'bg-emerald-50 border-emerald-200 text-slate-900'}`}>
                <h1 className="text-4xl font-extrabold mb-3" dangerouslySetInnerHTML={{ __html: currentText.findCar }}></h1>
                <p className={`text-sm max-w-xl ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{currentText.subtitleDiscover}</p>
              </div>

              {/* Фільтри пошуку */}
              <div className={`p-6 rounded-3xl border shadow-xl mb-8 ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-2">{currentText.maxBudget} ({formatPrice(budget)})</label>
                    <input type="range" min="10000" max="150000" step="5000" value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full accent-emerald-500 cursor-pointer" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-2">{currentText.brand}</label>
                    <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} className={`w-full p-2.5 border rounded-xl text-sm cursor-pointer ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}>
                      <option value="All">All brands</option>
                      <option value="BMW">BMW</option>
                      <option value="Mercedes-Benz">Mercedes-Benz</option>
                      <option value="Audi">Audi</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-2">{currentText.bodyType}</label>
                    <select value={selectedBody} onChange={(e) => setSelectedBody(e.target.value)} className={`w-full p-2.5 border rounded-xl text-sm cursor-pointer ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}>
                      <option value="Any">Any body</option>
                      <option value="Sedan">Sedan</option>
                      <option value="SUV">SUV</option>
                      <option value="Coupe">Coupe</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-2">{currentText.minLiquidity} ({minLiquidityFilter}+)</label>
                    <input type="range" min="0" max="95" step="5" value={minLiquidityFilter} onChange={(e) => setMinLiquidityFilter(e.target.value)} className="w-full accent-emerald-500 cursor-pointer mt-1" />
                  </div>
                  <div className="flex items-end">
                    <button onClick={handleApplyFilters} className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs shadow-lg transition-transform active:scale-95">{currentText.apply}</button>
                  </div>
                </div>
              </div>

              {/* Картки машин */}
              <h2 className="text-xl font-bold mb-4">{currentText.topRecommendations} ({cars.length})</h2>
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
                          <h3 className="font-bold text-lg">{car.title}</h3>
                          <span className="text-lg font-black text-emerald-500">{formatPrice(car.price)}</span>
                        </div>
                        
                        <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                          {car.body_type} • {car.year} • ⚙️ {car.engine_volume || '2.0L'} • {formatMileage(car.mileage_raw || 15000)}
                        </p>
                        
                        <div className={`p-3 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-semibold text-slate-400">LIQUIDITY SCORE</span>
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

          {/* 3. MARKET ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 animate-fadeIn">
              <div className={`p-8 rounded-3xl border shadow-xl ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">LIVE MARKET DATA</span>
                <h2 className="text-3xl font-black mt-1">{currentText.marketAnalyticsTitle}</h2>
                <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{currentText.marketAnalyticsSub}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                  <p className="text-xs uppercase font-semibold text-slate-400">{currentText.medianPrice}</p>
                  <p className="text-2xl font-black mt-2">{formatPrice(29840)}</p>
                  <span className="text-[10px] text-emerald-500 font-bold">+2.8% vs previous period</span>
                </div>
                <div className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                  <p className="text-xs uppercase font-semibold text-slate-400">{currentText.inventory}</p>
                  <p className="text-2xl font-black mt-2">24,892</p>
                  <span className="text-[10px] text-emerald-500 font-bold">1,421 new listings</span>
                </div>
                <div className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                  <p className="text-xs uppercase font-semibold text-slate-400">{currentText.daysOnMarket}</p>
                  <p className="text-2xl font-black mt-2">36 {lang === 'ua' ? 'днів' : 'days'}</p>
                  <span className="text-[10px] text-emerald-500 font-bold">2 {lang === 'ua' ? 'дні швидше' : 'days faster'}</span>
                </div>
                <div className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                  <p className="text-xs uppercase font-semibold text-slate-400">{currentText.demandIndex}</p>
                  <p className="text-2xl font-black mt-2">78.4</p>
                  <span className="text-[10px] text-emerald-500 font-bold">Strong buyer activity</span>
                </div>
              </div>

              <div className={`p-8 rounded-3xl border shadow-xl ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                <h3 className="text-xl font-bold mb-4">{currentText.segmentPerformance}</h3>
                <div className="space-y-4 text-xs">
                  <div className={`flex justify-between items-center p-3 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/60 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}>
                    <span className="font-bold">{currentText.suvSegment}</span>
                    <span>{formatPrice(34240)}</span>
                    <span className="text-emerald-500">+3.4%</span>
                    <span className="font-bold text-emerald-500">84 / 100</span>
                  </div>
                  <div className={`flex justify-between items-center p-3 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/60 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}>
                    <span className="font-bold">{currentText.sedanSegment}</span>
                    <span>{formatPrice(41620)}</span>
                    <span className="text-emerald-500">+2.1%</span>
                    <span className="font-bold text-emerald-500">81 / 100</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. SAVED VEHICLES */}
          {activeTab === 'saved' && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold mb-6">{currentText.savedVehicles} ({currentUserData.saved.length})</h2>
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
                    return (
                      <div key={car.id} className={`rounded-3xl p-6 border shadow-xl flex flex-col justify-between ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                        <div>
                          <img src={car.image_url} alt="" className="w-full h-36 object-cover rounded-2xl mb-4" />
                          <h3 className="font-bold text-lg mb-1">{car.title}</h3>
                          <p className="text-emerald-500 font-black text-lg mb-2">{formatPrice(car.price)}</p>
                          {isBooked && <span className="inline-block px-2.5 py-1 bg-amber-500 text-slate-950 font-black text-[10px] rounded uppercase mb-2">Статус: Заброньовано</span>}
                        </div>
                        <div className="space-y-2 mt-4">
                          {!isBooked ? (
                            <button onClick={() => handleOpenBookingModal(car)} className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold">Забронювати автомобіль</button>
                          ) : (
                            <button disabled className="w-full py-2 bg-slate-700 text-slate-400 rounded-xl text-xs font-bold cursor-not-allowed">Бронювання на розгляді</button>
                          )}
                          <button onClick={() => handleToggleSave(car.id)} className="w-full py-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl text-xs font-bold">Видалити зі збережених</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 5. RECENT VIEWED */}
          {activeTab === 'recent' && (
            <div className="animate-fadeIn">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{currentText.recent} ({currentUserData.recent.length})</h2>
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
                          <h3 className="font-bold text-lg mb-1">{car.title}</h3>
                          <p className="text-emerald-500 font-black text-lg mb-3">{formatPrice(car.price)}</p>
                          {isBooked && <span className="inline-block px-2.5 py-1 bg-amber-500 text-slate-950 font-black text-[10px] rounded uppercase mb-2">Статус: Заброньовано</span>}
                        </div>
                        <div className="space-y-2 mt-4">
                          <button onClick={() => handleOpenCarDetail(car)} className="w-full py-2 bg-slate-800 text-white hover:bg-emerald-500 hover:text-slate-950 rounded-xl text-xs font-bold transition-all">{currentText.viewAgain}</button>
                          {!isBooked ? (
                            <button onClick={() => handleOpenBookingModal(car)} className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold">{currentText.book}</button>
                          ) : (
                            <button disabled className="w-full py-2 bg-slate-700 text-slate-400 rounded-xl text-xs font-bold cursor-not-allowed">Заброньовано</button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 6. ВІДГУКИ */}
          {activeTab === 'reviews' && (
            <div className="max-w-4xl mx-auto py-6 animate-fadeIn">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <span className="text-xs font-extrabold text-emerald-500 uppercase tracking-widest">{currentText.customerReviews}</span>
                  <h2 className="text-3xl font-black mt-1">{currentText.whatTheySay}</h2>
                </div>
                <div className={`p-4 rounded-3xl border flex items-center gap-4 shadow-xl ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                  <div className="text-3xl font-black text-emerald-500">{averageRating}</div>
                  <div>
                    <div className="flex text-amber-400"><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} stroke="currentColor"/></div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{totalReviewsCount} відгуків</p>
                  </div>
                </div>
              </div>

              {/* Блок слайдера з зупинкою при наведенні миші (onMouseEnter / onMouseLeave) */}
              <div 
                className="relative mb-12 overflow-hidden"
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
                        <p className="text-sm italic mb-6 leading-relaxed opacity-90">"{rev.comment}"</p>
                      </div>
                      <div className={`pt-4 border-t ${theme === 'dark' ? 'border-slate-700/40' : 'border-slate-200'} flex justify-between items-center text-xs`}>
                        <span className="font-bold">{rev.author}</span>
                        <span className="text-emerald-500 flex items-center gap-1"><CheckCircle2 size={12}/> Перевірено</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Індикатори слайдера (крапочки для зручності) */}
                {reviews.length > 3 && !showAllReviews && (
                  <div className="flex justify-center gap-2 mt-6">
                    <button 
                      onClick={() => setCurrentReviewIdx(0)} 
                      className={`h-2 rounded-full transition-all ${currentReviewIdx === '0' || currentReviewIdx === 0 ? 'w-8 bg-emerald-500' : 'w-2 bg-slate-600'}`}
                    />
                    <button 
                      onClick={() => setCurrentReviewIdx(3)} 
                      className={`h-2 rounded-full transition-all ${currentReviewIdx === 3 ? 'w-8 bg-emerald-500' : 'w-2 bg-slate-600'}`}
                    />
                  </div>
                )}
              </div>

              <div className="text-center mb-10">
                <button onClick={() => setShowAllReviews(!showAllReviews)} className={`px-8 py-3.5 rounded-2xl border text-xs font-bold transition-all shadow-lg ${theme === 'dark' ? 'border-slate-700 hover:bg-slate-800 text-white' : 'border-slate-300 hover:bg-slate-100 text-slate-800'}`}>
                  {showAllReviews ? currentText.hideReviews : `${currentText.viewAllReviews} (${totalReviewsCount})`}
                </button>

                {showAllReviews && (
                  <div className="mt-8 space-y-6 text-left animate-fadeIn">
                    <div className="flex gap-2 justify-center flex-wrap">
                      <button onClick={() => setReviewFilter('all')} className={`px-4 py-1.5 rounded-xl text-xs font-bold ${reviewFilter === 'all' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-300'}`}>Усі оцінки</button>
                      {[5, 4, 3, 2, 1].map(stars => (
                        <button key={stars} onClick={() => setReviewFilter(String(stars))} className={`px-4 py-1.5 rounded-xl text-xs font-bold ${reviewFilter === String(stars) ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-300'}`}>{stars} ★</button>
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
                          <p className="text-xs opacity-80">"{r.comment}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className={`border rounded-3xl p-8 mb-12 shadow-2xl relative overflow-hidden ${theme === 'dark' ? 'bg-[#121824] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
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
                  <input type="text" placeholder="Ваше ім'я" value={newReviewAuthor} onChange={e=>setNewReviewAuthor(e.target.value)} className={`w-full p-3.5 border rounded-2xl text-xs outline-none ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} required />
                  <textarea placeholder="Ваш відгук..." value={newReviewComment} onChange={e=>setReviewComment(e.target.value)} className={`w-full p-3.5 border rounded-2xl text-xs h-24 outline-none ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-905'}`} required />
                  <button type="submit" className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-2xl shadow-lg">{currentText.publishReview}</button>
                </form>
              </div>
            </div>
          )}

          {/* 7. ADMIN PANEL */}
          {activeTab === 'admin' && user?.is_admin && (
            <div className="max-w-3xl mx-auto py-8 animate-fadeIn space-y-8">
              <h2 className="text-2xl font-bold flex items-center gap-2"><ShieldPlus className="text-amber-500"/> {currentText.adminTitle}</h2>
              
              <form onSubmit={handleAddCar} className={`p-8 rounded-3xl border shadow-xl space-y-5 ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                <h3 className="font-bold text-sm text-emerald-500">{currentText.addCarTitle}</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Марка авто (Brand) *</label>
                    <input type="text" placeholder="Наприклад: BMW" value={newCar.brand} onChange={e=>setNewCar({...newCar, brand: e.target.value})} className={`w-full p-3 border rounded-xl text-xs ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} required />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Модель (Model) *</label>
                    <input type="text" placeholder="Наприклад: M4 Competition" value={newCar.model} onChange={e=>setNewCar({...newCar, model: e.target.value})} className={`w-full p-3 border rounded-xl text-xs ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Тип кузова (Body Type)</label>
                    <select value={newCar.body_type} onChange={e=>setNewCar({...newCar, body_type: e.target.value})} className={`w-full p-3 border rounded-xl text-xs ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}>
                      <option value="Sedan">Sedan</option>
                      <option value="SUV">SUV</option>
                      <option value="Coupe">Coupe</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Коробка передач (Transmission)</label>
                    <select value={newCar.transmission} onChange={e=>setNewCar({...newCar, transmission: e.target.value})} className={`w-full p-3 border rounded-xl text-xs ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}>
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Рік випуску *</label>
                    <input type="number" placeholder="2023" value={newCar.year} onChange={e=>setNewCar({...newCar, year: Number(e.target.value)})} className={`w-full p-3 border rounded-xl text-xs ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} required />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Ціна ($) *</label>
                    <input type="number" placeholder="74500" value={newCar.price} onChange={e=>setNewCar({...newCar, price: Number(e.target.value)})} className={`w-full p-3 border rounded-xl text-xs ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} required />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Пробіг (у милях) *</label>
                    <input type="number" placeholder="12000" value={newCar.mileage} onChange={e=>setNewCar({...newCar, mileage: Number(e.target.value)})} className={`w-full p-3 border rounded-xl text-xs ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} required />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Ліквідність (0-100)</label>
                    <input type="number" placeholder="92" value={newCar.custom_liquidity} onChange={e=>setNewCar({...newCar, custom_liquidity: Number(e.target.value)})} className={`w-full p-3 border rounded-xl text-xs ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Об'єм двигуна</label>
                    <input type="text" placeholder="3.0L" value={newCar.engine_volume} onChange={e=>setNewCar({...newCar, engine_volume: e.target.value})} className={`w-full p-3 border rounded-xl text-xs ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} required />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Короткий тег / Бейдж (Badge)</label>
                    <input type="text" placeholder="BEST MATCH" value={newCar.badge} onChange={e=>setNewCar({...newCar, badge: e.target.value})} className={`w-full p-3 border rounded-xl text-xs ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} required />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">URL фотографії (Unsplash / посилання) *</label>
                  <input type="text" placeholder="https://images.unsplash.com/..." value={newCar.image_url} onChange={e=>setNewCar({...newCar, image_url: e.target.value})} className={`w-full p-3 border rounded-xl text-xs ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} required />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Детальний опис автомобіля</label>
                  <textarea placeholder="Опишіть переваги та стан авто..." value={newCar.description} onChange={e=>setNewCar({...newCar, description: e.target.value})} className={`w-full p-3 border rounded-xl text-xs h-20 ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} />
                </div>

                <button type="submit" className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs shadow-lg">Додати авто у базу та розіслати email підписникам</button>
              </form>

              <div className="space-y-4">
                <h3 className="font-bold text-lg">{currentText.bookingRequests}</h3>
                {Object.keys(userPersonalData).map(email => {
                  const uData = userPersonalData[email];
                  return uData.booked.map(carId => {
                    const car = cars.find(c => c.id === carId);
                    const bDetails = uData.bookingsDetails?.[carId] || { status: 'pending', phone: 'Не вказано' };
                    if (!car) return null;

                    return (
                      <div key={`${email}-${carId}`} className={`p-4 rounded-2xl border flex items-center justify-between ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                        <div className="flex items-center gap-4">
                          <img src={car.image_url} alt="" className="w-20 h-14 object-cover rounded-xl" />
                          <div>
                            <p className="font-bold text-sm">{car.title} ({formatPrice(car.price)})</p>
                            <p className="text-xs text-slate-400">Клієнт: {email} | Тел: {bDetails.phone}</p>
                            <p className="text-xs text-amber-400 font-bold">Статус: {bDetails.status.toUpperCase()}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {bDetails.status === 'pending' && (
                            <>
                              <button onClick={() => handleAdminApproveBooking(email, carId)} className="px-3 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold">Підтвердити бронювання</button>
                              <button onClick={() => handleAdminRejectBooking(email, carId)} className="px-3 py-2 bg-red-500/20 text-red-400 rounded-xl text-xs font-bold">Відхилити</button>
                            </>
                          )}
                          {bDetails.status === 'approved' && (
                            <button onClick={() => handleConfirmPurchase(carId)} className="px-3 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">Підтвердити покупку</button>
                          )}
                        </div>
                      </div>
                    );
                  });
                })}
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-700/50">
                <h3 className="font-bold text-lg">{currentText.allCarsMySQL}</h3>
                {cars.map(car => (
                  <div key={car.id} className={`p-4 rounded-2xl border flex items-center justify-between ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                    <div className="flex items-center gap-4">
                      <img src={car.image_url} alt="" className="w-16 h-12 object-cover rounded-xl" />
                      <div>
                        <p className="font-bold text-sm">{car.title}</p>
                        <p className="text-xs text-emerald-400">{formatPrice(car.price)} • {formatMileage(car.mileage_raw || 15000)}</p>
                      </div>
                    </div>
                    <button onClick={() => handleDeleteCar(car.id)} className="p-2.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl" title="Видалити з бази"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* ФУТЕР */}
        <footer className={`mt-16 pt-6 border-t ${theme === 'dark' ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-600'} text-xs flex justify-between items-center`}>
          <p>{currentText.footerRights}</p>
          <div className="flex gap-6">
            <span>📞 +38 (068) 331-78-25</span>
            <span>✉️ support@autoadvisor.ua</span>
            <span>📍 м. Київ, вул. Технічна, 12</span>
          </div>
        </footer>
      </main>

      {/* МОДАЛЬНЕ ВІКНО БРОНЮВАННЯ */}
      {isBookingModalOpen && carToBook && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm animate-fadeIn">
          <div className={`p-8 rounded-3xl w-full max-w-md shadow-2xl border ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Бронювання: {carToBook.title}</h3>
              <button onClick={() => setIsBookingModalOpen(false)} className="text-slate-400 hover:text-white"><X size={20}/></button>
            </div>
            <p className="text-xs text-slate-400 mb-6">Введіть ваш номер телефону для підтвердження менеджером через адмін-панель.</p>
            <form onSubmit={handleSubmitBooking} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Номер телефону *</label>
                <input type="tel" value={bookingPhone} onChange={e => setBookingPhone(e.target.value)} placeholder="+38 (0XX) XXX-XX-XX" className={`w-full p-3 border rounded-xl text-sm ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} required />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Коментар (необов'язково)</label>
                <textarea value={bookingComment} onChange={e => setBookingComment(e.target.value)} placeholder="Бажаний час дзвінка..." className={`w-full p-3 border rounded-xl text-sm h-20 ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} />
              </div>
              <button type="submit" className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm shadow-lg">Надіслати запит на бронювання</button>
            </form>
          </div>
        </div>
      )}

      {/* РОЗШИРЕНЕ ВІКНО НАЛАШТУВАНЬ */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm animate-fadeIn overflow-y-auto py-10">
          <div className={`p-8 rounded-3xl w-full max-w-3xl shadow-2xl border relative ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full uppercase">PERSONAL WORKSPACE</span>
                <h2 className="text-2xl font-extrabold mt-1">{currentText.settingsTitle}</h2>
                <p className="text-xs text-slate-400">{currentText.settingsSub}</p>
              </div>
              <button onClick={() => setIsSettingsOpen(false)} className="text-slate-400 hover:text-white"><X size={20}/></button>
            </div>

            <form onSubmit={handleSavePreferences} className="space-y-6">
              {/* Профіль */}
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

              {/* Ринкові налаштування: мова, валюта, милі/км */}
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <h3 className="text-sm font-bold mb-3">{currentText.marketPreferences}</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">{currentText.language}</label>
                    <select value={lang} onChange={e => setLang(e.target.value)} className={`w-full p-2.5 border rounded-xl text-sm ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}>
                      <option value="ua">Українська</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">{currentText.currency}</label>
                    <select value={currency} onChange={e => setCurrency(e.target.value)} className={`w-full p-2.5 border rounded-xl text-sm ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}>
                      <option value="USD">USD — US Dollar ($)</option>
                      <option value="EUR">EUR — Euro (€)</option>
                      <option value="UAH">UAH — Гривня (₴)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1">{currentText.distanceUnits}</label>
                    <select value={distanceUnit} onChange={e => setDistanceUnit(e.target.value)} className={`w-full p-2.5 border rounded-xl text-sm ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`}>
                      <option value="mi">Miles (милі)</option>
                      <option value="km">Kilometers (км)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Сповіщення (справжня розсилка) */}
              <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <h3 className="text-sm font-bold mb-3">{currentText.emailNotif}</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between text-xs cursor-pointer">
                    <span>{currentText.notifDesc}</span>
                    <input type="checkbox" checked={emailAlerts} onChange={e => setEmailAlerts(e.target.checked)} className="accent-emerald-500 w-4 h-4" />
                  </label>
                </div>
              </div>

              {/* Зміна пароля */}
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

      {/* МОДАЛЬНЕ ВІКНО АВТОРИЗАЦІЇ ТА ВІДНОВЛЕННЯ ПАРОЛЯ ЧЕРЕЗ КОД НА ПОШТУ */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm animate-fadeIn">
          <div className={`p-8 rounded-3xl w-full max-w-md shadow-2xl border ${theme === 'dark' ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-4">
                <button onClick={() => { setAuthMode('login'); setResetStep(1); }} className={`text-xl font-bold pb-1 border-b-2 transition-all ${authMode === 'login' ? 'border-emerald-500 text-emerald-500' : 'border-transparent text-slate-400'}`}>
                  Увійти
                </button>
                <button onClick={() => { setAuthMode('register'); setResetStep(1); }} className={`text-xl font-bold pb-1 border-b-2 transition-all ${authMode === 'register' ? 'border-emerald-500 text-emerald-500' : 'border-transparent text-slate-400'}`}>
                  Реєстрація
                </button>
              </div>
              <button onClick={() => setIsAuthModalOpen(false)} className="text-slate-400 hover:text-white"><X size={20}/></button>
            </div>

            {authMode === 'forgot' ? (
              <div>
                <h3 className="text-sm font-bold mb-2">Відновлення пароля</h3>
                {resetStep === 1 ? (
                  <form onSubmit={handleSendResetCode} className="space-y-4">
                    <p className="text-xs text-slate-400">Введіть ваш email, і на нього буде надіслано реальний код підтвердження.</p>
                    <input type="email" value={emailInput} onChange={e => setEmailInput(e.target.value)} placeholder="you@example.com" className={`w-full p-3 border rounded-xl text-sm ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} required />
                    <button type="submit" className="w-full py-3 bg-emerald-500 text-white font-bold rounded-xl text-sm">Надіслати код на пошту</button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyAndResetPassword} className="space-y-4">
                    <p className="text-xs text-emerald-400">Код надіслано на вашу пошту! Введіть його та новий пароль.</p>
                    <input type="text" value={resetCodeInput} onChange={e => setResetCodeInput(e.target.value)} placeholder="Введіть код із пошти" className={`w-full p-3 border rounded-xl text-sm ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} required />
                    <input type="password" value={newPasswordInput} onChange={e => setNewPasswordInput(e.target.value)} placeholder="Новий пароль (мін. 8 символів)" className={`w-full p-3 border rounded-xl text-sm ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} required />
                    <button type="submit" className="w-full py-3 bg-emerald-500 text-white font-bold rounded-xl text-sm">Підтвердити та змінити пароль</button>
                  </form>
                )}
                <button onClick={() => setAuthMode('login')} className="mt-4 text-xs text-emerald-400 hover:underline block text-center">Повернутися до входу</button>
              </div>
            ) : (
              <form onSubmit={handleAuth} className="space-y-4">
                {authMode === 'register' && (
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Display Name (Ім'я)</label>
                    <input type="text" value={nameInput} onChange={e => setNameInput(e.target.value)} className={`w-full p-3 border rounded-xl text-sm ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} placeholder="Саша" required />
                  </div>
                )}
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Email address</label>
                  <input type="email" value={emailInput} onChange={e => setEmailInput(e.target.value)} className={`w-full p-3 border rounded-xl text-sm ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} placeholder="you@example.com" required />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Password (мін. 8 символів)</label>
                  <input type="password" value={passInput} onChange={e => setPassInput(e.target.value)} className={`w-full p-3 border rounded-xl text-sm ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} placeholder="••••••••" required />
                </div>
                {authMode === 'login' && (
                  <div className="text-right">
                    <button type="button" onClick={() => setAuthMode('forgot')} className="text-xs text-emerald-400 hover:underline">Забули пароль?</button>
                  </div>
                )}
                <button type="submit" className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm shadow-lg transition-transform active:scale-95">
                  {authMode === 'login' ? 'Увійти в акаунт' : 'Створити акаунт'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* МОДАЛЬНЕ ВІКНО ДЕТАЛЬНОГО ОПИСУ (з передачею мови, валюти та одиниць виміру) */}
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