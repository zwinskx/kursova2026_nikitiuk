
import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react';

import { t } from '../constants/translations';

const AppContext = createContext(null);
const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const emptyPersonalData = () => ({
  saved: [],
  booked: [],
  recent: [],
  bookingsDetails: {}
});

export function AppProvider({ children }) {
  const [activeTab, setActiveTab] = useState('overview');

  const [lang, setLang] = useState(
    () => localStorage.getItem('autoadvisor_lang') || 'ua'
  );

  const [currency, setCurrency] = useState(
    () => localStorage.getItem('autoadvisor_currency') || 'USD'
  );

  const [distanceUnit, setDistanceUnit] = useState(
    () => localStorage.getItem('autoadvisor_distance') || 'mi'
  );

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('autoadvisor_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [savedAccounts, setSavedAccounts] = useState(() => {
    try {
      const saved = localStorage.getItem('autoadvisor_accounts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
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
  const [myBookings, setMyBookings] = useState([]);

  const [selectedCarForModal, setSelectedCarForModal] = useState(null);
  const [isFullComparisonOpen, setIsFullComparisonOpen] = useState(false);

  const [editingCar, setEditingCar] = useState(null);
  const [editingMileageUnit, setEditingMileageUnit] = useState('mi');
  const [newCarMileageUnit, setNewCarMileageUnit] = useState('mi');

  const [userPersonalData, setUserPersonalData] = useState(() => {
    try {
      const saved = localStorage.getItem('autoadvisor_personal_data');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [carToBook, setCarToBook] = useState(null);
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingComment, setBookingComment] = useState('');
  const [bookingSubmitting, setBookingSubmitting] = useState(false);

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
    {
      sender: 'bot',
      text: lang === 'ua'
        ? 'Привіт! Я AI-помічник AutoAdvisor. Чим можу допомогти з вибором авто?'
        : 'Hello! I am your AutoAdvisor AI assistant. How can I help you choose a car?'
    }
  ]);

  const [chatInput, setChatInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);

  const [forumMessages, setForumMessages] = useState([]);
  const [forumAvatars, setForumAvatars] = useState({});
  const [forumInput, setForumInput] = useState('');

  const initialNewCarState = {
    brand: '',
    model: '',
    year: '',
    body_type: 'Sedan',
    transmission: 'Automatic',
    mileage: '',
    price: '',
    engine_volume: '2.0L',
    custom_liquidity: 85,
    badge: '',
    image_url: '',
    images: [],
    description: ''
  };

  const [newCar, setNewCar] = useState(initialNewCarState);
  const currentText = t[lang] || t.ua;

  useEffect(() => {
    localStorage.setItem('autoadvisor_lang', lang);
    localStorage.setItem('autoadvisor_currency', currency);
    localStorage.setItem('autoadvisor_distance', distanceUnit);
  }, [lang, currency, distanceUnit]);

  useEffect(() => {
    if (!user) {
      localStorage.removeItem('autoadvisor_user');
      return;
    }

    localStorage.setItem('autoadvisor_user', JSON.stringify(user));

    setSavedAccounts(prev => {
      const updated = prev.some(acc => acc.email === user.email)
        ? prev.map(acc => acc.email === user.email ? user : acc)
        : [...prev, user];

      localStorage.setItem(
        'autoadvisor_accounts',
        JSON.stringify(updated)
      );

      return updated;
    });
  }, [user]);

  useEffect(() => {
    localStorage.setItem(
      'autoadvisor_personal_data',
      JSON.stringify(userPersonalData)
    );
  }, [userPersonalData]);

  useEffect(() => {
    if (reviews.length <= 3 || showAllReviews || isPaused) return;

    const interval = setInterval(() => {
      setCurrentReviewIdx(prev => prev === 0 ? 3 : 0);
    }, 5000);

    return () => clearInterval(interval);
  }, [reviews.length, showAllReviews, isPaused]);

  useEffect(() => {
    if (!user) return;

    setSettingsName(user.display_name || '');
    setSettingsAvatar(user.avatar_url || '');
    setEmailAlerts(user.email_alerts ?? true);
    setDeliveryFreq(user.delivery_frequency || 'Daily digest');
    setMinLiquidity(user.min_liquidity ?? 85);

    setUserPersonalData(prev => {
      if (prev[user.email]) return prev;

      return {
        ...prev,
        [user.email]: emptyPersonalData()
      };
    });
  }, [user]);

  const storedUserData = user
    ? userPersonalData[user.email] || emptyPersonalData()
    : emptyPersonalData();

  const pendingUserBookings = myBookings.filter(
    booking => booking.status === 'pending'
  );

  const pendingCarIds = pendingUserBookings.map(
    booking => Number(booking.car_id)
  );

  const currentUserData = {
    ...storedUserData,
    saved: [
      ...new Set([
        ...(storedUserData.saved || []),
        ...pendingCarIds
      ].map(Number))
    ],
    booked: pendingCarIds
  };

  const updateCurrentUserData = (updater) => {
    if (!user) return;

    setUserPersonalData(prev => {
      const current = prev[user.email] || emptyPersonalData();

      return {
        ...prev,
        [user.email]: updater(current)
      };
    });
  };

  const fetchCars = async () => {
    const params = new URLSearchParams({
      budget_max: String(appliedFilters.budget),
      brand: appliedFilters.brand,
      body_type: appliedFilters.body,
      transmission: appliedFilters.transmission,
      min_liquidity: String(appliedFilters.minLiquidity)
    });

    try {
      const response = await fetch(
        `${API}/api/recommendations?${params}`
      );

      if (!response.ok) {
        throw new Error(`Catalog HTTP ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error('Invalid catalog data');
      }

      const sorted = [...data].sort(
        (a, b) =>
          Number(Boolean(a.is_archived)) -
          Number(Boolean(b.is_archived)) ||
          a.id - b.id
      );

      setCars(sorted);

      setSelectedCarForModal(prev =>
        prev
          ? sorted.find(car => car.id === prev.id) || prev
          : null
      );

      setCompareCar1(prev =>
        prev
          ? sorted.find(car => car.id === prev.id) || prev
          : sorted[0] || null
      );

      setCompareCar2(prev =>
        prev
          ? sorted.find(car => car.id === prev.id) || prev
          : sorted[1] || null
      );

      return sorted;
    } catch (error) {
      console.error('Failed to load cars:', error);
      return [];
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${API}/api/reviews`);

      if (!response.ok) {
        throw new Error('Reviews loading error');
      }

      setReviews(await response.json());
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAdminBookings = async () => {
    try {
      const response = await fetch(`${API}/api/bookings`);

      if (!response.ok) {
        throw new Error(`Bookings HTTP ${response.status}`);
      }

      const data = await response.json();

      setAdminBookings(Array.isArray(data) ? data : []);
      return data;
    } catch (error) {
      console.error('Admin bookings error:', error);
      return [];
    }
  };

  const fetchMyBookings = async () => {
    if (!user?.email) {
      setMyBookings([]);
      return [];
    }

    try {
      const response = await fetch(
        `${API}/api/users/${encodeURIComponent(user.email)}/bookings`
      );

      if (!response.ok) {
        throw new Error(`My bookings HTTP ${response.status}`);
      }

      const data = await response.json();

      setMyBookings(Array.isArray(data) ? data : []);
      return data;
    } catch (error) {
      console.error('My bookings error:', error);
      return [];
    }
  };

  useEffect(() => {
    fetchCars();
    fetchReviews();
    fetchMyBookings();

    if (user?.is_admin) {
      fetchAdminBookings();
    } else {
      setAdminBookings([]);
    }
  }, [appliedFilters, user?.email, user?.is_admin]);

  useEffect(() => {
    const sync = () => {
      fetchCars();
      fetchMyBookings();

      if (user?.is_admin) {
        fetchAdminBookings();
      }
    };

    const interval = setInterval(sync, 5000);

    window.addEventListener('focus', sync);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', sync);
    };
  }, [appliedFilters, user?.email, user?.is_admin]);

  useEffect(() => {
    if (!user || cars.length === 0) return;

    const f = appliedFilters;

    const isUnfiltered =
      Number(f.budget) >= 150000 &&
      f.brand === 'All' &&
      f.body === 'Any' &&
      f.transmission === 'Any' &&
      Number(f.minLiquidity) === 0;

    if (!isUnfiltered) return;

    const ids = new Set(cars.map(car => car.id));

    setUserPersonalData(prev => {
      const data = prev[user.email] || emptyPersonalData();

      const saved = data.saved.filter(id => ids.has(id));
      const recent = data.recent.filter(id => ids.has(id));

      const bookingsDetails = Object.fromEntries(
        Object.entries(data.bookingsDetails || {})
          .filter(([id]) => ids.has(Number(id)))
      );

      if (
        saved.length === data.saved.length &&
        recent.length === data.recent.length
      ) {
        return prev;
      }

      return {
        ...prev,
        [user.email]: {
          ...data,
          saved,
          recent,
          bookingsDetails
        }
      };
    });
  }, [cars, user?.email, appliedFilters]);

  const formatPrice = (priceInUSD) => {
    const price = Number(priceInUSD) || 0;
    let rate = 1;
    let symbol = '$';

    if (currency === 'EUR') {
      rate = 0.92;
      symbol = '€';
    }

    if (currency === 'UAH') {
      rate = 41.5;
      symbol = '₴';
    }

    const converted = Math.round(price * rate);
    return `${converted.toLocaleString()} ${symbol}`;
  };

  const getFinalPrice = (car) => {
    const price = Number(car?.price) || 0;
    const discount = Number(car?.discount) || 0;

    return Math.round(price * (1 - discount / 100));
  };

  const formatMileage = (mileageInMiles) => {
    if (typeof mileageInMiles !== 'number') {
      return mileageInMiles;
    }

    if (distanceUnit === 'km') {
      const km = Math.round(mileageInMiles * 1.60934);

      return `${km.toLocaleString()} ${
        lang === 'ua' ? 'км' : 'km'
      }`;
    }

    return `${mileageInMiles.toLocaleString()} ${
      lang === 'ua' ? 'миль' : 'mi'
    }`;
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

  const totalDbCars =
    cars.length > 0 ? cars.length * 42 + 84 : 24892;

  const calculatedAvgPrice =
    cars.length > 0
      ? Math.round(
          cars.reduce((sum, car) => sum + Number(car.price), 0) /
          cars.length
        )
      : 31420;

  const calculatedLiquidityAvg =
    cars.length > 0
      ? (
          cars.reduce(
            (sum, car) => sum + Number(car.liquidity_score || 0),
            0
          ) / cars.length
        ).toFixed(1)
      : '74.8';

  const savedVehiclesObjects = cars.filter(
    car => currentUserData.saved.includes(car.id)
  );

  const purchasedCars = myBookings.filter(
    booking => booking.status === 'approved'
  );

  const calculatedSavedValue = purchasedCars.reduce(
    (sum, booking) =>
      sum + Number(
        booking.purchase_price ??
        booking.car_price ??
        0
      ),
    0
  );

  const handleAuth = async (e) => {
    e.preventDefault();

    if (authMode === 'register' && passInput.length < 8) {
      alert(
        lang === 'ua'
          ? 'Пароль має містити мінімум 8 символів!'
          : 'Password must be at least 8 characters!'
      );
      return;
    }

    const endpoint =
      authMode === 'login' ? '/api/login' : '/api/register';

    const payload =
      authMode === 'login'
        ? { email: emailInput, password: passInput }
        : {
            email: emailInput,
            password: passInput,
            display_name: nameInput
          };

    try {
      const response = await fetch(`${API}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Authentication error');
      }

      setUser(data);
      setIsAuthModalOpen(false);
      setPassInput('');

      alert(data.message || 'Success');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSavePreferences = async (e) => {
    e.preventDefault();

    if (!user) return;

    if (newPass !== confirmNewPass) {
      alert(
        lang === 'ua'
          ? 'Нові паролі не збігаються!'
          : 'New passwords do not match!'
      );
      return;
    }

    try {
      const response = await fetch(
        `${API}/api/user/${user.user_id || user.id}/preferences`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            display_name: settingsName.trim(),
            avatar_url: settingsAvatar,
            email_alerts: emailAlerts,
            delivery_frequency: deliveryFreq,
            min_liquidity: Number(minLiquidity),
            ...(newPass
              ? {
                  current_password: currentPass,
                  new_password: newPass
                }
              : {})
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Save failed');
      }

      setUser(prev => ({
        ...prev,
        ...data.user,
        user_id: prev.user_id || prev.id
      }));

      setLang(settingsLang);
      setCurrency(settingsCurrency);
      setDistanceUnit(settingsDistance);

      setCurrentPass('');
      setNewPass('');
      setConfirmNewPass('');
      setIsSettingsOpen(false);

      alert(
        data.message ||
        (lang === 'ua'
          ? 'Налаштування збережено!'
          : 'Preferences saved!')
      );
    } catch (error) {
      alert(error.message);
    }
  };

  const readImage = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;

      reader.readAsDataURL(file);
    });

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    if (
      files.some(
        file =>
          !file.type.startsWith('image/') ||
          file.size > 3 * 1024 * 1024
      )
    ) {
      alert('Кожне фото має бути зображенням до 3 MB');
      return;
    }

    try {
      const urls = await Promise.all(files.map(readImage));

      setNewCar(prev => {
        const images = [
          ...(prev.images || []),
          ...urls
        ].slice(0, 8);

        return {
          ...prev,
          images,
          image_url: images[0] || ''
        };
      });
    } catch (error) {
      alert('Помилка завантаження фотографій.');
    } finally {
      e.target.value = '';
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setSettingsAvatar(await readImage(file));
    } catch {
      alert('Помилка завантаження аватара.');
    }
  };

  const handleAddCar = async (e) => {
    e.preventDefault();

    let rawMileage = Number(newCar.mileage) || 0;

    if (newCarMileageUnit === 'km') {
      rawMileage = Math.round(rawMileage / 1.60934);
    }

    const images = newCar.images?.length
      ? newCar.images
      : [newCar.image_url].filter(Boolean);

    const payload = {
      ...newCar,
      images,
      image_url: images[0] || '',
      mileage: rawMileage
    };

    try {
      const response = await fetch(`${API}/api/admin/cars`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to add car');
      }

      alert(
        lang === 'ua'
          ? 'Автомобіль успішно додано в базу!'
          : 'Vehicle added successfully!'
      );

      setNewCar(initialNewCarState);
      await fetchCars();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleUpdateCar = async (e) => {
    e.preventDefault();

    if (!editingCar) return;

    let rawMileage = Number(editingCar.mileage) || 0;

    if (editingMileageUnit === 'km') {
      rawMileage = Math.round(rawMileage / 1.60934);
    }

    const images = editingCar.images?.length
      ? editingCar.images
      : [editingCar.image_url].filter(Boolean);

    const payload = {
      ...editingCar,
      images,
      image_url: images[0] || '',
      mileage: rawMileage,
      price: Number(editingCar.price) || 0,
      year: Number(editingCar.year) || 2024,
      custom_liquidity:
        Number(editingCar.liquidity_score) || 85,
      discount: Number(editingCar.discount) || 0
    };

    try {
      const response = await fetch(
        `${API}/api/admin/cars/${editingCar.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to update car');
      }

      setEditingCar(null);
      await fetchCars();

      alert(
        lang === 'ua'
          ? 'Автомобіль оновлено!'
          : 'Vehicle updated!'
      );
    } catch (error) {
      alert(error.message);
    }
  };

  const handleToggleSave = (carId) => {
    if (!user) {
      alert(
        lang === 'ua'
          ? 'Увійдіть в акаунт, щоб зберігати автомобілі.'
          : 'Sign in to save vehicles.'
      );

      setIsAuthModalOpen(true);
      return;
    }

    const target = cars.find(car => car.id === carId);
    const alreadySaved = currentUserData.saved.includes(carId);

    if (target?.is_archived && !alreadySaved) return;

    updateCurrentUserData(data => ({
      ...data,
      saved: data.saved.includes(carId)
        ? data.saved.filter(id => id !== carId)
        : [...data.saved, carId]
    }));
  };

  const handleClearRecent = () => {
    updateCurrentUserData(data => ({
      ...data,
      recent: []
    }));

    alert(
      lang === 'ua'
        ? 'Історію переглядів очищено.'
        : 'History cleared.'
    );
  };

  const handleOpenBookingModal = (car) => {
    if (
      !car ||
      car.is_archived ||
      car.booking_status === 'pending'
    ) {
      alert(
        lang === 'ua'
          ? 'Цей автомобіль недоступний для бронювання.'
          : 'This vehicle is unavailable.'
      );
      return;
    }

    if (!user) {
      alert(
        lang === 'ua'
          ? 'Увійдіть в акаунт, щоб забронювати автомобіль.'
          : 'Sign in to book a vehicle.'
      );

      setIsAuthModalOpen(true);
      return;
    }

    setCarToBook(car);
    setBookingPhone('');
    setBookingComment('');
    setIsBookingModalOpen(true);
  };

  const handleSubmitBooking = async (bookingData) => {
    if (!carToBook || !user || bookingSubmitting) return;

    const phone = bookingData?.phone || bookingPhone;
    const comment = bookingData?.comment ?? bookingComment;

    if (!/^\+[1-9]\d{7,14}$/.test(phone)) {
      alert(
        lang === 'ua'
          ? 'Введіть правильний міжнародний номер телефону.'
          : 'Enter a valid international phone number.'
      );
      return;
    }

    setBookingSubmitting(true);

    try {
      const apiUrl = (
        import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
      ).replace(/\/$/, '');

      const response = await fetch(`${apiUrl}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_email: user.email,
          car_id: Number(carToBook.id),
          phone,
          comment
        })
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        const detail = result.detail;

        throw new Error(
          typeof detail === 'string'
            ? detail
            : `Помилка бронювання: HTTP ${response.status}`
        );
      }

      await Promise.all([
        fetchCars(),
        fetchMyBookings(),
        ...(user.is_admin ? [fetchAdminBookings()] : [])
      ]);

      setIsBookingModalOpen(false);
      setCarToBook(null);
      setBookingPhone('');
      setBookingComment('');

      alert(
        lang === 'ua'
          ? 'Автомобіль заброньовано. Заявку надіслано адміністратору.'
          : 'Vehicle reserved. Your request has been sent to the administrator.'
      );
    } catch (error) {
      console.error('BOOKING ERROR:', error);

      const networkError =
        error instanceof TypeError ||
        /failed to fetch|networkerror/i.test(error.message);

      alert(
        networkError
          ? (
              lang === 'ua'
                ? 'Не вдалося підключитися до FastAPI. Перевір, чи запущений бекенд на http://127.0.0.1:8000 та чи правильно налаштований CORS.'
                : 'Cannot connect to FastAPI. Check that the backend is running and CORS is configured.'
            )
          : error.message
      );
    } finally {
      setBookingSubmitting(false);
    }
  };

  const handleOpenCarDetail = (car) => {
    if (!car) return;

    if (user) {
      updateCurrentUserData(data => ({
        ...data,
        recent: [
          car.id,
          ...data.recent.filter(id => id !== car.id)
        ].slice(0, 10)
      }));
    }

    setSelectedCarForModal(car);
  };

  const handleAddReview = async (e) => {
    e.preventDefault();

    if (!user) {
      alert(
        lang === 'ua'
          ? 'Увійдіть, щоб залишити відгук.'
          : 'Sign in to leave a review.'
      );

      setIsAuthModalOpen(true);
      return;
    }

    try {
      const response = await fetch(`${API}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: newReviewAuthor || user.display_name,
          comment: newReviewComment,
          rating: newReviewRating
        })
      });

      if (!response.ok) {
        throw new Error('Review failed');
      }

      setNewReviewAuthor('');
      setNewReviewComment('');
      await fetchReviews();

      alert(
        lang === 'ua'
          ? 'Відгук успішно опубліковано!'
          : 'Review published!'
      );
    } catch (error) {
      alert(error.message);
    }
  };

  const totalReviewsCount = reviews.length;

  const averageRating = totalReviewsCount > 0
    ? (
        reviews.reduce(
          (sum, review) => sum + Number(review.rating),
          0
        ) / totalReviewsCount
      ).toFixed(1)
    : '4.3';

  const filteredReviews = reviewFilter === 'all'
    ? reviews
    : reviews.filter(
        review => review.rating === Number(reviewFilter)
      );

  const handleSendMessageToAILegacy = (e) => {
    e.preventDefault();

    if (!chatInput.trim()) return;

    const text = chatInput.trim();

    setChatMessages(prev => [
      ...prev,
      { sender: 'user', text }
    ]);

    setChatInput('');

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: lang === 'ua'
            ? 'Рекомендую звернути увагу на ліквідність, пробіг та історію обслуговування.'
            : 'Consider liquidity, mileage and service history.'
        }
      ]);
    }, 800);
  };

  const handleSendMessageToAI = async (
    e,
    suggestedText = null
  ) => {
    e?.preventDefault();

    const text = String(
      suggestedText ?? chatInput
    ).trim();

    if (!text || isAiTyping) return;

    const next = [
      ...chatMessages,
      { sender: 'user', text }
    ];

    setChatMessages(next);
    setChatInput('');
    setIsAiTyping(true);

    const brief = (car) => ({
      id: car.id,
      name: car.title || `${car.brand} ${car.model}`,
      year: car.year,
      price: getFinalPrice(car),
      mileage: car.mileage_raw,
      body_type: car.body_type,
      transmission: car.transmission,
      liquidity_score: car.liquidity_score,
      booking_status: car.booking_status,
      is_archived: Boolean(car.is_archived),
      url: `/?tab=discover&car=${car.id}`
    });

    const context = {
      lang,
      currency,
      distanceUnit,
      activeTab,
      userName: user?.display_name,
      saved: cars
        .filter(car => currentUserData.saved.includes(car.id))
        .slice(0, 10)
        .map(brief),
      recent: cars
        .filter(car => currentUserData.recent.includes(car.id))
        .slice(0, 10)
        .map(brief),
      catalog: cars
        .filter(car =>
          !car.is_archived &&
          car.booking_status !== 'pending'
        )
        .slice(0, 30)
        .map(brief)
    };

    try {
      const response = await fetch(`${API}/api/ai-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next,
          context
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'AI error');
      }

      setChatMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: data.reply || ''
        }
      ]);
    } catch (error) {
      console.error(error);

      setChatMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: lang === 'ua'
            ? 'Вибачте, сталася помилка. Спробуйте ще раз.'
            : 'Sorry, something went wrong. Please try again.'
        }
      ]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const fetchForumMessages = async () => {
    try {
      const response = await fetch(`${API}/api/forum`);

      if (!response.ok) {
        throw new Error('Forum load failed');
      }

      const data = await response.json();

      setForumMessages(
        Array.isArray(data.messages) ? data.messages : []
      );

      setForumAvatars(data.avatars || {});
    } catch (error) {
      console.error('Forum loading error:', error);
      setForumMessages([]);
      setForumAvatars({});
    }
  };

  useEffect(() => {
    fetchForumMessages();
  }, []);

  const postForumMessage = async (text, parentId = null) => {
    if (!user?.email) {
      setAuthMode('login');
      setIsAuthModalOpen(true);
      return false;
    }

    const message = String(text || '').trim();

    if (!message) return false;

    try {
      const response = await fetch(`${API}/api/forum`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          author: user.display_name,
          avatar_url: user.avatar_url || '',
          message,
          parent_id: parentId
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || 'Не вдалося опублікувати повідомлення.'
        );
      }

      await fetchForumMessages();
      return true;
    } catch (error) {
      console.error('Forum post error:', error);
      alert(error.message);
      return false;
    }
  };

  const handleDeleteForumMessage = async (messageId) => {
    if (!user?.email) {
      setAuthMode('login');
      setIsAuthModalOpen(true);
      return false;
    }

    const target = forumMessages.find(
      message => Number(message.id) === Number(messageId)
    );

    if (!target) {
      alert(
        lang === 'ua'
          ? 'Повідомлення не знайдено.'
          : 'Message not found.'
      );
      return false;
    }

    const isOwner =
      String(target.user_email || '').toLowerCase() ===
      String(user.email).toLowerCase();

    if (!user.is_admin && !isOwner) {
      alert(
        lang === 'ua'
          ? 'Можна видаляти лише власні повідомлення.'
          : 'You can delete only your messages.'
      );
      return false;
    }

    if (!window.confirm(
      lang === 'ua'
        ? 'Видалити повідомлення? Відповіді інших користувачів залишаться.'
        : 'Delete this message? Replies will be preserved.'
    )) {
      return false;
    }

    if (!user.access_token) {
      alert(
        lang === 'ua'
          ? 'Для безпечного видалення потрібно вийти й увійти в акаунт повторно.'
          : 'Please sign out and sign in again to delete messages.'
      );
      return false;
    }

    try {
      const response = await fetch(
        `${API}/api/forum/${encodeURIComponent(messageId)}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${user.access_token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || 'Не вдалося видалити повідомлення.'
        );
      }

      await fetchForumMessages();
      return true;
    } catch (error) {
      console.error('Forum delete error:', error);
      alert(error.message);
      return false;
    }
  };

  const handleSendForumMessage = async (e) => {
    e.preventDefault();

    if (!user) {
      alert(
        lang === 'ua'
          ? 'Тільки зареєстровані користувачі можуть писати у форум!'
          : 'Only registered users can write in the forum!'
      );

      setIsAuthModalOpen(true);
      return;
    }

    if (!forumInput.trim()) return;

    try {
      const response = await fetch(`${API}/api/forum`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          author: user.display_name,
          avatar_url: user.avatar_url || '',
          message: forumInput
        })
      });

      if (!response.ok) {
        throw new Error('Forum message failed');
      }

      setForumInput('');
      await fetchForumMessages();
    } catch (error) {
      alert(error.message);
    }
  };

  const value = {
    activeTab, setActiveTab,
    lang, setLang,
    currency, setCurrency,
    distanceUnit, setDistanceUnit,
    user, setUser,
    savedAccounts, setSavedAccounts,
    isAccountSwitcherOpen, setIsAccountSwitcherOpen,
    isAuthModalOpen, setIsAuthModalOpen,
    authMode, setAuthMode,
    emailInput, setEmailInput,
    passInput, setPassInput,
    nameInput, setNameInput,
    isSettingsOpen, setIsSettingsOpen,
    settingsName, setSettingsName,
    settingsAvatar, setSettingsAvatar,
    settingsLang, setSettingsLang,
    settingsCurrency, setSettingsCurrency,
    settingsDistance, setSettingsDistance,
    emailAlerts, setEmailAlerts,
    deliveryFreq, setDeliveryFreq,
    minLiquidity, setMinLiquidity,
    currentPass, setCurrentPass,
    newPass, setNewPass,
    confirmNewPass, setConfirmNewPass,
    budget, setBudget,
    selectedBrand, setSelectedBrand,
    selectedBody, setSelectedBody,
    selectedTransmission, setSelectedTransmission,
    minLiquidityFilter, setMinLiquidityFilter,
    appliedFilters, setAppliedFilters,
    cars, setCars,
    adminBookings, setAdminBookings,
    myBookings, setMyBookings,
    purchasedCars, fetchMyBookings,
    selectedCarForModal, setSelectedCarForModal,
    isFullComparisonOpen, setIsFullComparisonOpen,
    editingCar, setEditingCar,
    editingMileageUnit, setEditingMileageUnit,
    newCarMileageUnit, setNewCarMileageUnit,
    userPersonalData, setUserPersonalData,
    currentUserData, updateCurrentUserData,
    isBookingModalOpen, setIsBookingModalOpen,
    carToBook, setCarToBook,
    bookingPhone, setBookingPhone,
    bookingComment, setBookingComment,
    bookingSubmitting,
    reviews, setReviews,
    currentReviewIdx, setCurrentReviewIdx,
    showAllReviews, setShowAllReviews,
    reviewFilter, setReviewFilter,
    newReviewAuthor, setNewReviewAuthor,
    newReviewComment, setNewReviewComment,
    newReviewRating, setNewReviewRating,
    isPaused, setIsPaused,
    compareCar1, setCompareCar1,
    compareCar2, setCompareCar2,
    isChatOpen, setIsChatOpen,
    chatMessages, setChatMessages,
    chatInput, setChatInput,
    isAiTyping,
    newCar, setNewCar,
    initialNewCarState,
    currentText,
    fetchCars,
    fetchReviews,
    fetchAdminBookings,
    formatPrice,
    getFinalPrice,
    formatMileage,
    handleApplyFilters,
    totalDbCars,
    calculatedAvgPrice,
    calculatedLiquidityAvg,
    savedVehiclesObjects,
    calculatedSavedValue,
    handleAuth,
    handleSavePreferences,
    handleImageUpload,
    handleAvatarUpload,
    handleAddCar,
    handleUpdateCar,
    handleToggleSave,
    handleClearRecent,
    handleOpenBookingModal,
    handleSubmitBooking,
    handleOpenCarDetail,
    handleAddReview,
    totalReviewsCount,
    averageRating,
    filteredReviews,
    handleSendMessageToAI,
    handleSendMessageToAILegacy,
    forumMessages, setForumMessages,
    forumAvatars, setForumAvatars,
    forumInput, setForumInput,
    fetchForumMessages,
    handleSendForumMessage,
    postForumMessage,
    handleDeleteForumMessage
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
