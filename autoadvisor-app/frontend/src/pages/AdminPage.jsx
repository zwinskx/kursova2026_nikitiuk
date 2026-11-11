
import React, { useState } from 'react';
import {
  ShieldPlus,
  Trash2,
  X,
  Upload,
  Search,
  ChevronLeft,
  ChevronRight,
  Plus,
  Pencil,
  CarFront,
  Archive,
  ShoppingBag,
  ClipboardList,
  CircleX,
  RefreshCw
} from 'lucide-react';

import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';

const API = (
  import.meta.env.VITE_API_URL ||
  'http://127.0.0.1:8000'
).replace(/\/$/, '');

const toNumber = value => Number(value) || 0;

const emptyValue = value =>
  value === '' ||
  value === null ||
  value === undefined ||
  String(value).trim() === '';

function FieldError({ message }) {
  if (!message) return null;

  return (
    <p className="text-[10px] font-semibold text-red-400 mt-1">
      {message}
    </p>
  );
}

export default function AdminPage() {
  const { theme } = useTheme();

  const {
    currentText,
    lang,
    adminBookings,
    fetchAdminBookings,
    cars,
    fetchCars,
    formatPrice,
    editingCar,
    setEditingCar,
    editingMileageUnit,
    setEditingMileageUnit,
    distanceUnit,
    handleUpdateCar,
    newCar,
    setNewCar,
    newCarMileageUnit,
    setNewCarMileageUnit,
    handleAddCar,
    handleImageUpload,
    fetchMyBookings
  } = useApp();

  const dark = theme === 'dark';
  const tr = (ua, en) => lang === 'ua' ? ua : en;

  const [activeTab, setActiveTab] = useState('requests');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const [addTried, setAddTried] = useState(false);
  const [editTried, setEditTried] = useState(false);

  const [processingBookingId, setProcessingBookingId] = useState(null);
  const [processingCarId, setProcessingCarId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const panelClass = `p-5 sm:p-7 rounded-3xl border shadow-xl ${
    dark
      ? 'bg-[#0f172a] border-slate-800 text-white'
      : 'bg-white border-slate-200 text-slate-900'
  }`;

  const rowClass = `p-4 rounded-2xl border ${
    dark
      ? 'bg-slate-900 border-slate-800'
      : 'bg-slate-50 border-slate-200'
  }`;

  const labelClass = `block text-xs font-semibold mb-1 ${
    dark ? 'text-slate-300' : 'text-slate-700'
  }`;

  const inputClass = error => `w-full px-3 py-2.5 rounded-xl border text-xs outline-none focus:ring-2 focus:ring-emerald-500/30 ${
    error
      ? 'border-red-500'
      : dark
        ? 'border-slate-700'
        : 'border-slate-300'
  } ${
    dark
      ? 'bg-slate-900 text-white'
      : 'bg-slate-50 text-slate-900'
  }`;

  const greenButton =
    'px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed';

  const amberButton =
    'px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed';

  const redButton =
    'px-3 py-2.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white text-xs font-bold rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed';

  const neutralButton = `px-4 py-2.5 rounded-xl text-xs font-bold border transition disabled:opacity-40 disabled:cursor-not-allowed ${
    dark
      ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
  }`;

  const bookings = Array.isArray(adminBookings)
    ? adminBookings
    : [];

  const allCars = Array.isArray(cars) ? cars : [];

  const pendingBookings = bookings.filter(
    booking => booking.status === 'pending'
  );

  const approvedBookings = bookings.filter(
    booking => booking.status === 'approved'
  );

  const rejectedBookings = bookings.filter(
    booking => booking.status === 'rejected'
  );

  const activeCars = allCars.filter(
    car => !car.is_archived
  );

  const archivedCars = allCars.filter(
    car => Boolean(car.is_archived)
  );

  const getCar = id =>
    allCars.find(car => Number(car.id) === Number(id));

  const isSold = carId =>
    approvedBookings.some(
      booking => Number(booking.car_id) === Number(carId)
    );

  const getCarTitle = booking =>
    getCar(booking.car_id)?.title ||
    `Car ID: ${booking.car_id}`;

  const purchasePrice = booking =>
    Number(
      booking.purchase_price ??
      getCar(booking.car_id)?.price ??
      0
    );

  const displayDate = value => {
    if (!value) return '—';

    const normalized =
      /Z$|[+-]\d{2}:\d{2}$/.test(String(value))
        ? String(value)
        : `${value}Z`;

    const date = new Date(normalized);

    if (Number.isNaN(date.getTime())) return '—';

    return date.toLocaleString(
      lang === 'ua' ? 'uk-UA' : 'en-US'
    );
  };

  const tabs = [
    {
      id: 'requests',
      label: tr('Заявки', 'Requests'),
      icon: ClipboardList,
      count: pendingBookings.length
    },
    {
      id: 'purchases',
      label: tr('Покупки', 'Purchases'),
      icon: ShoppingBag,
      count: approvedBookings.length
    },
    {
      id: 'rejected',
      label: tr('Відхилені', 'Rejected'),
      icon: CircleX,
      count: rejectedBookings.length
    },
    {
      id: 'cars',
      label: tr('Автомобілі', 'Cars'),
      icon: CarFront,
      count: activeCars.length
    },
    {
      id: 'archive',
      label: tr('Архів', 'Archive'),
      icon: Archive,
      count: archivedCars.length
    },
    {
      id: 'add',
      label: tr('Додати авто', 'Add car'),
      icon: Plus
    },
    {
      id: 'edit',
      label: tr('Редагування', 'Editing'),
      icon: Pencil
    }
  ];

  const changeTab = tab => {
    setActiveTab(tab);
    setSearch('');
    setPage(1);
  };

  const searchableTabs = [
    'requests',
    'purchases',
    'rejected',
    'cars',
    'archive'
  ];

  const normalize = value =>
    String(value ?? '').toLowerCase().trim();

  const matchesCar = car => {
    const text = [
      car.id,
      car.title,
      car.brand,
      car.model,
      car.year,
      car.body_type,
      car.transmission,
      car.badge
    ].map(normalize).join(' ');

    return text.includes(normalize(search));
  };

  const matchesBooking = booking => {
    const car = getCar(booking.car_id);

    const text = [
      booking.id,
      booking.car_id,
      booking.user_email,
      booking.phone,
      booking.comment,
      booking.status,
      car?.title,
      car?.brand,
      car?.model
    ].map(normalize).join(' ');

    return text.includes(normalize(search));
  };

  const getTabItems = () => {
    switch (activeTab) {
      case 'requests':
        return pendingBookings.filter(matchesBooking);

      case 'purchases':
        return approvedBookings.filter(matchesBooking);

      case 'rejected':
        return rejectedBookings.filter(matchesBooking);

      case 'cars':
        return activeCars.filter(matchesCar);

      case 'archive':
        return archivedCars.filter(matchesCar);

      default:
        return [];
    }
  };

  const filteredItems = getTabItems();

  const totalPages = Math.max(
    1,
    Math.ceil(filteredItems.length / pageSize)
  );

  const safePage = Math.min(page, totalPages);

  const startIndex = (safePage - 1) * pageSize;

  const visibleItems = filteredItems.slice(
    startIndex,
    startIndex + pageSize
  );

  const refreshData = async () => {
    await Promise.all([
      Promise.resolve(fetchAdminBookings()),
      Promise.resolve(fetchCars()),
      Promise.resolve(fetchMyBookings())
    ]);
  };

  const manualRefresh = async () => {
    if (refreshing) return;

    setRefreshing(true);

    try {
      await refreshData();
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setRefreshing(false);
    }
  };

  const checkResponse = async response => {
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        typeof data.detail === 'string'
          ? data.detail
          : `HTTP ${response.status}`
      );
    }

    return data;
  };

  const decideBooking = async (bookingId, status) => {
    if (processingBookingId !== null) return;

    setProcessingBookingId(bookingId);

    try {
      const response = await fetch(
        `${API}/api/admin/bookings/${bookingId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status })
        }
      );

      await checkResponse(response);
      await refreshData();

      alert(
        status === 'approved'
          ? tr(
              'Покупку підтверджено!',
              'Purchase approved!'
            )
          : tr(
              'Бронювання відхилено!',
              'Booking rejected!'
            )
      );
    } catch (error) {
      alert(error.message);
    } finally {
      setProcessingBookingId(null);
    }
  };

  const deleteBooking = async bookingId => {
    if (processingBookingId !== null) return;

    if (!window.confirm(
      tr(
        'Видалити цю заявку з бази?',
        'Delete this request from database?'
      )
    )) return;

    setProcessingBookingId(bookingId);

    try {
      const response = await fetch(
        `${API}/api/admin/bookings/${bookingId}`,
        { method: 'DELETE' }
      );

      await checkResponse(response);
      await refreshData();
    } catch (error) {
      alert(error.message);
    } finally {
      setProcessingBookingId(null);
    }
  };

  const setArchived = async (carId, isArchived) => {
    if (processingCarId !== null) return;

    setProcessingCarId(carId);

    try {
      const response = await fetch(
        `${API}/api/admin/cars/${carId}/archive`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            is_archived: isArchived
          })
        }
      );

      await checkResponse(response);
      await refreshData();

      if (!isArchived) {
        alert(
          tr(
            'Автомобіль повернуто в каталог!',
            'Vehicle restored to catalog!'
          )
        );
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setProcessingCarId(null);
    }
  };

  const deleteCar = async car => {
  if (!window.confirm(
    tr(
      `Точно видалити ${car.title} з каталогу? Історія покупок залишиться.`,
      `Delete ${car.title} from the catalog? Purchase history will be preserved.`
    )
  )) return;

  setProcessingCarId(car.id);

  try {
    const response = await fetch(
      `${API}/api/admin/cars/${car.id}`,
      { method: 'DELETE' }
    );

    await checkResponse(response);
    await refreshData();

    alert(tr('Автомобіль видалено!', 'Vehicle deleted!'));
  } catch (error) {
    alert(error.message);
  } finally {
    setProcessingCarId(null);
  }
};

  const openEdit = car => {
    setEditingCar({
      ...car,
      images: (
        Array.isArray(car.images) && car.images.length
          ? car.images
          : [car.image_url]
      ).filter(Boolean),
      mileage:
        car.mileage_raw !== undefined
          ? car.mileage_raw
          : parseInt(
              String(car.mileage).replace(/\D/g, ''),
              10
            ) || '',
      discount: car.discount ?? '',
      liquidity_score:
        car.liquidity_score ??
        car.custom_liquidity ??
        ''
    });

    setEditingMileageUnit(distanceUnit);
    setEditTried(false);
    changeTab('edit');
  };

  const validateCar = (car, liquidityKey, needImage) => {
    const errors = {};
    const required = tr(
      "Це поле обов'язкове",
      'Required field'
    );

    if (!car) {
      errors.car = required;
      return errors;
    }

    if (emptyValue(car.brand)) errors.brand = required;
    if (emptyValue(car.model)) errors.model = required;
    if (emptyValue(car.engine_volume)) {
      errors.engine_volume = required;
    }
    if (emptyValue(car.badge)) errors.badge = required;

    if (
      !Number.isInteger(Number(car.year)) ||
      Number(car.year) < 1990 ||
      Number(car.year) > 2027
    ) {
      errors.year = tr(
        'Рік має бути від 1990 до 2027',
        'Year must be between 1990 and 2027'
      );
    }

    if (
      emptyValue(car.price) ||
      !Number.isFinite(Number(car.price)) ||
      Number(car.price) <= 0
    ) {
      errors.price = tr(
        'Введіть правильну ціну',
        'Enter a valid price'
      );
    }

    if (
      emptyValue(car.mileage) ||
      !Number.isFinite(Number(car.mileage)) ||
      Number(car.mileage) < 0
    ) {
      errors.mileage = tr(
        'Введіть правильний пробіг',
        'Enter valid mileage'
      );
    }

    const liquidity = car[liquidityKey];

    if (
      emptyValue(liquidity) ||
      !Number.isFinite(Number(liquidity)) ||
      Number(liquidity) < 0 ||
      Number(liquidity) > 100
    ) {
      errors.liquidity = tr(
        'Ліквідність від 0 до 100',
        'Liquidity from 0 to 100'
      );
    }

    if (!emptyValue(car.discount)) {
      const discount = Number(car.discount);

      if (
        !Number.isFinite(discount) ||
        discount < 0 ||
        discount > 90
      ) {
        errors.discount = tr(
          'Знижка від 0 до 90%',
          'Discount from 0 to 90%'
        );
      }
    }

    if (
      needImage &&
      !car.image_url &&
      !(car.images || []).length
    ) {
      errors.image = tr(
        'Додайте хоча б одне фото',
        'Add at least one photo'
      );
    }

    return errors;
  };

  const addErrors = addTried
    ? validateCar(newCar, 'custom_liquidity', true)
    : {};

  const editErrors = editTried && editingCar
    ? validateCar(editingCar, 'liquidity_score', false)
    : {};

  const submitAdd = event => {
    event.preventDefault();
    setAddTried(true);

    if (
      Object.keys(
        validateCar(newCar, 'custom_liquidity', true)
      ).length > 0
    ) return;

    handleAddCar(event);
    setAddTried(false);
  };

  const submitEdit = event => {
    event.preventDefault();
    setEditTried(true);

    if (
      Object.keys(
        validateCar(editingCar, 'liquidity_score', false)
      ).length > 0
    ) return;

    handleUpdateCar(event);
    setEditTried(false);
  };

  const readFile = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const uploadEditingImages = async event => {
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    if (
      files.some(file =>
        !file.type.startsWith('image/') ||
        file.size > 3 * 1024 * 1024
      )
    ) {
      alert(
        tr(
          'Максимум 3 MB на одне фото.',
          'Maximum 3 MB per photo.'
        )
      );
      event.target.value = '';
      return;
    }

    try {
      const images = await Promise.all(files.map(readFile));

      setEditingCar(prev => {
        const result = [
          ...(prev.images || [prev.image_url]).filter(Boolean),
          ...images
        ].slice(0, 8);

        return {
          ...prev,
          images: result,
          image_url: result[0] || ''
        };
      });
    } catch (error) {
      alert(error.message);
    } finally {
      event.target.value = '';
    }
  };

  const removeEditingImage = index => {
    setEditingCar(prev => {
      const images = (
        prev.images || [prev.image_url]
      ).filter((_, i) => i !== index);

      if (!images.length) {
        alert(
          tr(
            'Залиш хоча б одне фото.',
            'Keep at least one photo.'
          )
        );

        return prev;
      }

      return {
        ...prev,
        images,
        image_url: images[0]
      };
    });
  };

  const removeNewImage = index => {
    setNewCar(prev => {
      const images = (prev.images || []).filter(
        (_, i) => i !== index
      );

      return {
        ...prev,
        images,
        image_url: images[0] || ''
      };
    });
  };

  const updateField = (editing, field, value) => {
    const setter = editing ? setEditingCar : setNewCar;

    setter(prev => {
      const next = {
        ...prev,
        [field]: value
      };

      if (editing && (
        field === 'brand' || field === 'model'
      )) {
        next.title = `${next.brand || ''} ${next.model || ''}`.trim();
      }

      if (editing && field === 'liquidity_score') {
        next.custom_liquidity = value;
      }

      return next;
    });
  };

  const renderField = (
    editing,
    field,
    label,
    type = 'text',
    placeholder = ''
  ) => {
    const car = editing ? editingCar : newCar;
    const errors = editing ? editErrors : addErrors;

    const errorKey =
      field === 'custom_liquidity' ||
      field === 'liquidity_score'
        ? 'liquidity'
        : field;

    return (
      <div key={field}>
        <label className={labelClass}>
          {label}
        </label>

        <input
          type={type}
          placeholder={placeholder}
          value={car?.[field] ?? ''}
          onChange={event => {
            const value =
              type === 'number' &&
              event.target.value !== ''
                ? Number(event.target.value)
                : event.target.value;

            updateField(editing, field, value);
          }}
          className={inputClass(errors[errorKey])}
        />

        <FieldError message={errors[errorKey]} />
      </div>
    );
  };

  const renderSelect = (
    editing,
    field,
    label,
    options
  ) => {
    const car = editing ? editingCar : newCar;

    return (
      <div key={field}>
        <label className={labelClass}>
          {label}
        </label>

        <select
          value={car?.[field] || options[0][0]}
          onChange={event =>
            updateField(editing, field, event.target.value)
          }
          className={inputClass(false)}
        >
          {options.map(([value, title]) => (
            <option key={value} value={value}>
              {title}
            </option>
          ))}
        </select>
      </div>
    );
  };

  const renderCarForm = editing => {
    const car = editing ? editingCar : newCar;

    if (editing && !editingCar) {
      return (
        <div className={`${panelClass} text-center py-16`}>
          <Pencil
            size={40}
            className="mx-auto mb-4 text-emerald-500"
          />

          <h3 className="font-bold text-lg">
            {tr(
              'Вибери автомобіль для редагування',
              'Choose a vehicle to edit'
            )}
          </h3>

          <p className="text-sm text-slate-400 mt-2 mb-5">
            {tr(
              'Перейди у вкладку «Автомобілі» або «Архів» та натисни «Редагувати».',
              'Open Cars or Archive and click Edit.'
            )}
          </p>

          <button
            type="button"
            onClick={() => changeTab('cars')}
            className={greenButton}
          >
            {tr('Перейти до автомобілів', 'Go to cars')}
          </button>
        </div>
      );
    }

    const images = (
      Array.isArray(car.images) && car.images.length
        ? car.images
        : [car.image_url]
    ).filter(Boolean);

    const mileageUnit = editing
      ? editingMileageUnit
      : newCarMileageUnit;

    return (
      <form
        noValidate
        onSubmit={editing ? submitEdit : submitAdd}
        className={`${panelClass} space-y-6`}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg text-emerald-500">
              {editing
                ? `${currentText.editTitleHeader}: ${car.title}`
                : currentText.addCarTitle}
            </h3>

            <p className="text-xs text-slate-400 mt-1">
              {editing
                ? tr(
                    'Зміни характеристики та збережи автомобіль.',
                    'Update vehicle specifications and save.'
                  )
                : tr(
                    'Заповни інформацію для нового автомобіля.',
                    'Fill in the details for the new vehicle.'
                  )}
            </p>
          </div>

          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditingCar(null);
                setEditTried(false);
              }}
              className={neutralButton}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {((editing ? editTried : addTried) &&
          Object.keys(editing ? editErrors : addErrors).length > 0) && (
          <div className="p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-bold">
            {tr(
              "Заповни всі обов'язкові поля та виправ помилки.",
              'Complete all required fields and fix errors.'
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {renderField(
            editing,
            'brand',
            currentText.carBrandLabel,
            'text',
            'BMW'
          )}

          {renderField(
            editing,
            'model',
            currentText.carModelLabel,
            'text',
            '330i'
          )}

          {renderField(
            editing,
            'engine_volume',
            tr("Об'єм двигуна *", 'Engine volume *'),
            'text',
            '2.0L'
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {renderSelect(
            editing,
            'body_type',
            currentText.bodyTypeLabel,
            [
              ['Sedan', currentText.sedan],
              ['SUV', currentText.suv],
              ['Coupe', currentText.coupe]
            ]
          )}

          {renderSelect(
            editing,
            'transmission',
            currentText.transmissionLabel,
            [
              ['Automatic', currentText.automatic],
              ['Manual', currentText.manual]
            ]
          )}

          {renderField(
            editing,
            'badge',
            tr('Бейдж на фото *', 'Photo badge *'),
            'text',
            'BEST MATCH'
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {renderField(
            editing,
            'year',
            currentText.yearLabel,
            'number',
            '2024'
          )}

          {renderField(
            editing,
            'price',
            currentText.priceLabel,
            'number',
            '45000'
          )}

          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <label className={labelClass}>
                {currentText.mileageLabel}
              </label>

              <select
                value={mileageUnit}
                onChange={event =>
                  editing
                    ? setEditingMileageUnit(event.target.value)
                    : setNewCarMileageUnit(event.target.value)
                }
                className={`text-xs font-bold bg-transparent text-emerald-500 outline-none ${
                  dark ? 'bg-slate-900' : 'bg-white'
                }`}
              >
                <option value="mi">mi</option>
                <option value="km">km</option>
              </select>
            </div>

            <input
              type="number"
              value={car.mileage ?? ''}
              placeholder="10000"
              onChange={event =>
                updateField(
                  editing,
                  'mileage',
                  event.target.value === ''
                    ? ''
                    : Number(event.target.value)
                )
              }
              className={inputClass(
                (editing ? editErrors : addErrors).mileage
              )}
            />

            <FieldError
              message={(editing ? editErrors : addErrors).mileage}
            />
          </div>

          {renderField(
            editing,
            editing ? 'liquidity_score' : 'custom_liquidity',
            currentText.liquidityLabel,
            'number',
            '85'
          )}
        </div>

        {editing && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderField(
              true,
              'discount',
              tr(
                'Знижка, % (необов’язково)',
                'Discount, % (optional)'
              ),
              'number',
              '0'
            )}

            <div>
              <label className={labelClass}>
                {tr('Ціна зі знижкою', 'Discounted price')}
              </label>

              <div className={`${inputClass(false)} min-h-10 flex items-center gap-2`}>
                {toNumber(car.discount) > 0 ? (
                  <>
                    <span className="line-through text-slate-400">
                      {formatPrice(toNumber(car.price))}
                    </span>

                    <span className="text-emerald-500 font-bold">
                      {formatPrice(
                        Math.round(
                          toNumber(car.price) *
                          (1 - toNumber(car.discount) / 100)
                        )
                      )}
                    </span>
                  </>
                ) : (
                  <span className="text-slate-400">
                    {tr('Без знижки', 'No discount')}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <label className={labelClass}>
            {tr('Фотографії автомобіля', 'Vehicle photos')}
          </label>

          {editing ? (
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={uploadEditingImages}
              className={inputClass(false)}
            />
          ) : (
            <div className={`p-4 border rounded-xl flex flex-wrap items-center gap-4 ${
              dark
                ? 'bg-slate-900 border-slate-700'
                : 'bg-slate-50 border-slate-300'
            }`}>
              <label className="flex gap-2 items-center px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl cursor-pointer">
                <Upload size={16} />
                {currentText.browseFile}

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              <span className="text-xs text-slate-400">
                {images.length
                  ? tr(
                      `Завантажено фото: ${images.length}`,
                      `Photos uploaded: ${images.length}`
                    )
                  : currentText.noFileChosen}
              </span>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            {images.map((url, index) => (
              <div
                key={index}
                className="relative w-28 h-20"
              >
                <img
                  src={url}
                  alt={`Photo ${index + 1}`}
                  className={`w-full h-full object-contain border rounded-xl ${
                    dark
                      ? 'bg-slate-950 border-slate-700'
                      : 'bg-white border-slate-200'
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    editing
                      ? removeEditingImage(index)
                      : removeNewImage(index)
                  }
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  <X size={12} />
                </button>

                {index === 0 && (
                  <span className="absolute bottom-1 left-1 bg-emerald-500 text-white text-[9px] font-bold rounded px-1.5 py-0.5">
                    {tr('Головне', 'Main')}
                  </span>
                )}
              </div>
            ))}
          </div>

          <FieldError
            message={(editing ? editErrors : addErrors).image}
          />
        </div>

        <div>
          <label className={labelClass}>
            {currentText.descriptionLabel}
          </label>

          <textarea
            rows={4}
            value={car.description || ''}
            onChange={event =>
              updateField(
                editing,
                'description',
                event.target.value
              )
            }
            placeholder={tr(
              'Введіть детальний опис автомобіля...',
              'Enter vehicle description...'
            )}
            className={`${inputClass(false)} resize-y`}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className={`${greenButton} flex-1 py-3`}
          >
            {editing
              ? currentText.saveChanges
              : currentText.addCarSubmit}
          </button>

          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditingCar(null);
                setEditTried(false);
              }}
              className={neutralButton}
            >
              {currentText.cancel}
            </button>
          )}
        </div>
      </form>
    );
  };

  const BookingPhoto = ({ booking }) => {
    const car = getCar(booking.car_id);

    return (
      <div className={`w-24 h-20 rounded-xl overflow-hidden shrink-0 flex items-center justify-center ${
        dark ? 'bg-slate-950' : 'bg-white'
      }`}>
        {car?.image_url ? (
          <img
            src={car.image_url}
            alt={car.title}
            className="w-full h-full object-contain"
          />
        ) : (
          <span className="text-[10px] text-slate-400">
            #{booking.car_id}
          </span>
        )}
      </div>
    );
  };

  const renderBooking = booking => {
    const car = getCar(booking.car_id);
    const pending = booking.status === 'pending';
    const approved = booking.status === 'approved';

    return (
      <div key={booking.id} className={rowClass}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-4 min-w-0">
            <BookingPhoto booking={booking} />

            <div className="min-w-0">
              <h3 className="text-sm font-bold">
                {getCarTitle(booking)}
              </h3>

              <p className="text-xs text-slate-400 mt-1 break-all">
                {booking.user_email}
              </p>

              <p className="text-xs mt-1">
                {tr('Телефон', 'Phone')}: {booking.phone}
              </p>

              {booking.comment && (
                <p className="text-xs text-slate-400 mt-1">
                  {booking.comment}
                </p>
              )}

              <p className="text-[11px] text-slate-400 mt-2">
                {displayDate(
                  approved || booking.status === 'rejected'
                    ? booking.decided_at
                    : booking.created_at
                )}
              </p>

              <span className={`inline-block mt-2 px-2.5 py-1 rounded-lg text-[10px] font-black ${
                pending
                  ? 'bg-amber-500/20 text-amber-500'
                  : approved
                    ? 'bg-emerald-500/20 text-emerald-500'
                    : 'bg-red-500/20 text-red-400'
              }`}>
                {pending
                  ? tr('Очікує підтвердження', 'Pending')
                  : approved
                    ? tr('Покупку підтверджено', 'Approved')
                    : tr('Відхилено', 'Rejected')}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {pending && (
              <>
                <button
                  type="button"
                  disabled={processingBookingId !== null}
                  onClick={() =>
                    decideBooking(booking.id, 'approved')
                  }
                  className={greenButton}
                >
                  {currentText.approve}
                </button>

                <button
                  type="button"
                  disabled={processingBookingId !== null}
                  onClick={() =>
                    decideBooking(booking.id, 'rejected')
                  }
                  className={amberButton}
                >
                  {currentText.reject}
                </button>
              </>
            )}

            {approved && (
              <div className="text-right">
                <p className="text-emerald-500 font-black text-lg">
                  {formatPrice(purchasePrice(booking))}
                </p>

                <p className="text-[10px] text-slate-400">
                  {car?.is_archived
                    ? tr('В архіві', 'Archived')
                    : tr('Знову в каталозі', 'Relisted')}
                </p>
              </div>
            )}

            {!approved && (
              <button
                type="button"
                disabled={processingBookingId !== null}
                onClick={() => deleteBooking(booking.id)}
                className={redButton}
                title={tr('Видалити заявку', 'Delete request')}
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderCarRow = car => {
    const archived = Boolean(car.is_archived);
    const sold = isSold(car.id);
    const booked = car.booking_status === 'pending';

    const discountedPrice = Math.round(
      toNumber(car.price) *
      (1 - toNumber(car.discount) / 100)
    );

    return (
      <div key={car.id} className={rowClass}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-4 min-w-0">
            <div className={`w-24 h-20 rounded-xl overflow-hidden shrink-0 ${
              dark ? 'bg-slate-950' : 'bg-white'
            }`}>
              <img
                src={car.image_url}
                alt={car.title}
                className={`w-full h-full object-contain ${
                  archived ? 'grayscale' : ''
                }`}
              />
            </div>

            <div className="min-w-0">
              <h3 className="font-bold text-sm">
                {car.title} ({car.year})
              </h3>

              <p className="text-[11px] text-slate-400 mt-1">
                ID: {car.id} • {car.body_type} • {car.transmission}
              </p>

              <div className="flex flex-wrap items-center gap-2 mt-2">
                {toNumber(car.discount) > 0 && (
                  <span className="text-[11px] line-through text-slate-400">
                    {formatPrice(car.price)}
                  </span>
                )}

                <span className="font-black text-emerald-500 text-sm">
                  {formatPrice(
                    toNumber(car.discount) > 0
                      ? discountedPrice
                      : car.price
                  )}
                </span>

                {toNumber(car.discount) > 0 && (
                  <span className="text-[10px] bg-red-500 text-white font-bold rounded-full px-2 py-0.5">
                    -{car.discount}%
                  </span>
                )}
              </div>

              {booked && (
                <span className="inline-block text-[10px] text-amber-500 font-bold mt-2 mr-2">
                  {tr('Заброньовано', 'Reserved')}
                </span>
              )}

              {archived && (
                <span className="inline-block text-[10px] text-slate-400 font-bold mt-2 mr-2">
                  {tr('В архіві', 'Archived')}
                </span>
              )}

              {sold && (
                <span className="inline-block text-[10px] text-emerald-500 font-bold mt-2">
                  {tr(
                    'Є історія покупки',
                    'Purchase history exists'
                  )}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            {archived ? (
              <button
                type="button"
                disabled={processingCarId !== null}
                onClick={() => setArchived(car.id, false)}
                className={greenButton}
              >
                {tr('Повернути в каталог', 'Restore')}
              </button>
            ) : (
              <button
                type="button"
                disabled={
                  processingCarId !== null ||
                  booked
                }
                onClick={() => setArchived(car.id, true)}
                className={amberButton}
              >
                {tr('В архів', 'Archive')}
              </button>
            )}

            <button
              type="button"
              onClick={() => openEdit(car)}
              className={neutralButton}
            >
              <span className="flex items-center gap-2">
                <Pencil size={14} />
                {currentText.edit}
              </span>
            </button>

            <button
              type="button"
              disabled={processingCarId !== null}
              onClick={() => deleteCar(car)}
              className={redButton}
              title={tr('Видалити автомобіль', 'Delete vehicle')}
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const currentTab = tabs.find(
    tab => tab.id === activeTab
  );

  const renderListContent = () => {
    if (activeTab === 'purchases') {
      const total = approvedBookings.reduce(
        (sum, booking) =>
          sum + purchasePrice(booking),
        0
      );

      return (
        <div className="space-y-4">
          <div className={`flex flex-wrap justify-between items-center gap-3 p-4 rounded-xl ${
            dark
              ? 'bg-emerald-500/10'
              : 'bg-emerald-50'
          }`}>
            <div>
              <p className="text-xs text-slate-400 font-bold">
                {tr(
                  'Загальна сума підтверджених покупок',
                  'Total confirmed purchases'
                )}
              </p>

              <p className="text-xl font-black text-emerald-500 mt-1">
                {formatPrice(total)}
              </p>
            </div>

            <div className="text-sm font-bold">
              {approvedBookings.length}{' '}
              {tr('покупок', 'purchases')}
            </div>
          </div>

          {visibleItems.map(renderBooking)}
        </div>
      );
    }

    if (
      activeTab === 'requests' ||
      activeTab === 'rejected'
    ) {
      return (
        <div className="space-y-3">
          {visibleItems.map(renderBooking)}
        </div>
      );
    }

    if (
      activeTab === 'cars' ||
      activeTab === 'archive'
    ) {
      return (
        <div className="space-y-3">
          {visibleItems.map(renderCarRow)}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-6 animate-fadeIn text-left">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2">
            <ShieldPlus className="text-amber-500" />
            {currentText.adminTitle}
          </h2>

          <p className="text-xs text-slate-400 mt-2">
            {tr(
              'Керування автомобілями, заявками та покупками',
              'Manage vehicles, bookings and purchases'
            )}
          </p>
        </div>

        <button
          type="button"
          disabled={refreshing}
          onClick={manualRefresh}
          className={neutralButton}
        >
          <span className="flex items-center gap-2">
            <RefreshCw
              size={15}
              className={refreshing ? 'animate-spin' : ''}
            />
            {tr('Оновити дані', 'Refresh data')}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            title: tr('Нові заявки', 'New requests'),
            value: pendingBookings.length,
            color: 'text-amber-500'
          },
          {
            title: tr('Покупки', 'Purchases'),
            value: approvedBookings.length,
            color: 'text-emerald-500'
          },
          {
            title: tr('Активні авто', 'Active cars'),
            value: activeCars.length,
            color: 'text-emerald-500'
          },
          {
            title: tr('В архіві', 'Archived'),
            value: archivedCars.length,
            color: 'text-slate-400'
          }
        ].map(item => (
          <div key={item.title} className={panelClass}>
            <p className="text-[11px] font-bold text-slate-400">
              {item.title}
            </p>

            <p className={`text-2xl font-black mt-1 ${item.color}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className={`p-2 rounded-2xl border flex flex-wrap gap-2 ${
        dark
          ? 'bg-[#0f172a] border-slate-800'
          : 'bg-white border-slate-200'
      }`}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          const selected = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => changeTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold rounded-xl transition-all ${
                selected
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                  : dark
                    ? 'text-slate-300 hover:bg-slate-800'
                    : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Icon size={16} />

              {tab.label}

              {tab.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  selected
                    ? 'bg-white/20 text-white'
                    : dark
                      ? 'bg-slate-800 text-slate-300'
                      : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {searchableTabs.includes(activeTab) && (
        <div className={`${panelClass} space-y-4`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="font-bold text-base">
                {currentTab?.label}
              </h3>

              <p className="text-xs text-slate-400 mt-1">
                {tr('Знайдено записів', 'Records found')}:{' '}
                {filteredItems.length}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="search"
                  value={search}
                  onChange={event => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder={tr(
                    'Пошук за назвою, ID, email...',
                    'Search by name, ID, email...'
                  )}
                  className={`${inputClass(false)} pl-10 sm:w-72`}
                />
              </div>

              <select
                value={pageSize}
                onChange={event => {
                  setPageSize(Number(event.target.value));
                  setPage(1);
                }}
                className={`${inputClass(false)} sm:w-28`}
              >
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={48}>48</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <div className="py-14 text-center">
              <Search
                size={38}
                className="mx-auto mb-3 text-slate-400 opacity-50"
              />

              <p className="font-bold text-sm">
                {tr(
                  'Записів не знайдено',
                  'No records found'
                )}
              </p>

              <p className="text-xs text-slate-400 mt-2">
                {search
                  ? tr(
                      'Спробуй інший пошуковий запит.',
                      'Try a different search.'
                    )
                  : tr(
                      'У цій вкладці поки немає записів.',
                      'There are no records in this tab.'
                    )}
              </p>
            </div>
          ) : (
            renderListContent()
          )}

          {filteredItems.length > 0 && (
            <div className={`flex flex-wrap items-center justify-between gap-3 pt-4 border-t ${
              dark
                ? 'border-slate-800'
                : 'border-slate-200'
            }`}>
              <p className="text-xs text-slate-400">
                {tr('Показано', 'Showing')}{' '}
                {startIndex + 1}–
                {Math.min(
                  startIndex + pageSize,
                  filteredItems.length
                )}{' '}
                {tr('із', 'of')}{' '}
                {filteredItems.length}
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={safePage <= 1}
                  onClick={() =>
                    setPage(value => Math.max(1, value - 1))
                  }
                  className={neutralButton}
                >
                  <span className="flex items-center gap-1">
                    <ChevronLeft size={15} />
                    {tr('Назад', 'Previous')}
                  </span>
                </button>

                <span className="text-xs font-bold whitespace-nowrap">
                  {safePage} / {totalPages}
                </span>

                <button
                  type="button"
                  disabled={safePage >= totalPages}
                  onClick={() =>
                    setPage(value =>
                      Math.min(totalPages, value + 1)
                    )
                  }
                  className={neutralButton}
                >
                  <span className="flex items-center gap-1">
                    {tr('Далі', 'Next')}
                    <ChevronRight size={15} />
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'add' && renderCarForm(false)}
      {activeTab === 'edit' && renderCarForm(true)}
    </div>
  );
}
