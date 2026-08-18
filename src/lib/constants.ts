/* ── Phone brands & default models ── */

export const BRANDS = [
  "Apple",
  "Samsung",
  "OnePlus",
  "Xiaomi",
  "Vivo",
  "Oppo",
  "Realme",
  "Google Pixel",
  "Motorola",
  "Nothing",
  "iQOO",
  "Poco",
  "Honor",
  "Asus",
  "Sony",
  "Nokia",
  "Other",
] as const;

export type Brand = (typeof BRANDS)[number];

/* ── Default models per brand (fallback when DB is empty/unreachable) ── */

export const DEFAULT_MODELS: Record<string, string[]> = {
  Apple: [
    "iPhone 16 Pro Max",
    "iPhone 16 Pro",
    "iPhone 16",
    "iPhone 16 Plus",
    "iPhone 15 Pro Max",
    "iPhone 15 Pro",
    "iPhone 15",
    "iPhone 15 Plus",
    "iPhone 14 Pro Max",
    "iPhone 14 Pro",
    "iPhone 14",
    "iPhone 14 Plus",
    "iPhone 13 Pro Max",
    "iPhone 13 Pro",
    "iPhone 13",
    "iPhone 13 Mini",
    "iPhone 12 Pro Max",
    "iPhone 12 Pro",
    "iPhone 12",
    "iPhone 12 Mini",
    "iPhone 11 Pro Max",
    "iPhone 11 Pro",
    "iPhone 11",
    "iPhone XR",
    "iPhone XS Max",
    "iPhone XS",
    "iPhone X",
    "iPhone SE (2nd Gen)",
    "iPhone SE (3rd Gen)",
  ],
  Samsung: [
    "Galaxy S24 Ultra",
    "Galaxy S24+",
    "Galaxy S24",
    "Galaxy S23 Ultra",
    "Galaxy S23+",
    "Galaxy S23",
    "Galaxy S22 Ultra",
    "Galaxy S22+",
    "Galaxy S22",
    "Galaxy S21 Ultra",
    "Galaxy S21+",
    "Galaxy S21",
    "Galaxy S20 FE",
    "Galaxy Z Fold 6",
    "Galaxy Z Fold 5",
    "Galaxy Z Flip 6",
    "Galaxy Z Flip 5",
    "Galaxy A55",
    "Galaxy A54",
    "Galaxy A35",
    "Galaxy A34",
    "Galaxy A15",
    "Galaxy A14",
    "Galaxy M15",
    "Galaxy M35",
    "Galaxy M55",
  ],
  OnePlus: [
    "OnePlus 13",
    "OnePlus 12R",
    "OnePlus 12",
    "OnePlus 11R",
    "OnePlus 11",
    "OnePlus 10R",
    "OnePlus 10 Pro",
    "OnePlus 9 Pro",
    "OnePlus 9R",
    "OnePlus 9",
    "OnePlus Nord 4",
    "OnePlus Nord CE 4",
    "OnePlus Nord 3",
    "OnePlus Nord CE 3",
    "OnePlus Nord 2",
    "OnePlus Nord CE 2",
  ],
  Xiaomi: [
    "Xiaomi 14",
    "Xiaomi 13 Pro",
    "Xiaomi 13",
    "Xiaomi 12 Pro",
    "Xiaomi 12",
    "Xiaomi 11i",
    "Xiaomi 11",
    "Redmi Note 13 Pro+",
    "Redmi Note 13 Pro",
    "Redmi Note 13",
    "Redmi Note 12 Pro",
    "Redmi Note 12",
    "Redmi 13",
    "Redmi 12",
    "Redmi K50",
    "Redmi K60",
  ],
  Vivo: [
    "Vivo X100 Pro",
    "Vivo X100",
    "Vivo X90 Pro",
    "Vivo X90",
    "Vivo V40 Pro",
    "Vivo V40",
    "Vivo V30 Pro",
    "Vivo V30",
    "Vivo V29 Pro",
    "Vivo V29",
    "Vivo T3 Pro",
    "Vivo T3",
    "Vivo Y200",
    "Vivo Y100",
    "Vivo Y36",
  ],
  Oppo: [
    "Oppo Find X7 Ultra",
    "Oppo Find X7",
    "Oppo Find X6 Pro",
    "Oppo Find X5 Pro",
    "Oppo Reno 12 Pro",
    "Oppo Reno 12",
    "Oppo Reno 11 Pro",
    "Oppo Reno 11",
    "Oppo Reno 10 Pro",
    "Oppo Reno 10",
    "Oppo F25 Pro",
    "Oppo F23",
    "Oppo A78",
    "Oppo A58",
  ],
  Realme: [
    "Realme GT 6",
    "Realme GT 5",
    "Realme GT 2",
    "Realme GT Neo 6",
    "Realme GT Neo 5",
    "Realme 13 Pro+",
    "Realme 13 Pro",
    "Realme 12 Pro+",
    "Realme 12 Pro",
    "Realme 12",
    "Realme 11 Pro",
    "Realme 11",
    "Realme C67",
    "Realme C55",
    "Realme Narzo 70 Pro",
    "Realme Narzo 60",
  ],
  "Google Pixel": [
    "Pixel 9 Pro XL",
    "Pixel 9 Pro",
    "Pixel 9",
    "Pixel 8 Pro",
    "Pixel 8a",
    "Pixel 8",
    "Pixel 7 Pro",
    "Pixel 7a",
    "Pixel 7",
    "Pixel 6 Pro",
    "Pixel 6a",
    "Pixel 6",
    "Pixel 5",
    "Pixel 4a",
  ],
  Motorola: [
    "Moto Edge 50 Ultra",
    "Moto Edge 50 Pro",
    "Moto Edge 50 Fusion",
    "Moto Edge 50 Neo",
    "Moto Edge 40 Pro",
    "Moto Edge 40",
    "Moto G85",
    "Moto G64",
    "Moto G54",
    "Moto G45",
    "Moto G34",
    "Moto Razr 50 Ultra",
    "Moto Razr 40 Ultra",
  ],
  Nothing: ["Nothing Phone (2a) Plus", "Nothing Phone (2a)", "Nothing Phone (2)", "Nothing Phone (1)"],
  iQOO: ["iQOO 12", "iQOO 11", "iQOO 10", "iQOO Neo 9 Pro", "iQOO Neo 9", "iQOO Neo 7", "iQOO Z9 Pro", "iQOO Z9", "iQOO Z7 Pro"],
  Poco: ["Poco F6", "Poco F5", "Poco X6 Pro", "Poco X6", "Poco X5 Pro", "Poco M6 Pro", "Poco M6", "Poco C65", "Poco C55"],
  Honor: ["Honor 200 Pro", "Honor 200", "Honor 90", "Honor 90 Lite", "Honor X9b", "Honor X9a", "Honor Magic 6 Pro"],
  Asus: ["ROG Phone 8 Pro", "ROG Phone 8", "ROG Phone 7", "ROG Phone 7 Ultimate", "Zenfone 11 Ultra", "Zenfone 10"],
  Sony: ["Xperia 1 VI", "Xperia 5 V", "Xperia 1 V", "Xperia 10 VI"],
  Nokia: ["Nokia 5.4", "Nokia 3.4", "Nokia G42", "Nokia G22", "Nokia C32", "Nokia X30"],
  Other: [],
};

/* ── Test categories & items ── */

export interface TestItem {
  category: string;
  name: string;
}

export const TEST_CATEGORIES: { category: string; items: string[] }[] = [
  {
    category: "Display",
    items: ["Display / Touch", "Dead Pixels", "Brightness / Screen"],
  },
  {
    category: "Camera",
    items: ["Front Camera", "Rear Camera(s)", "Flash"],
  },
  {
    category: "Audio",
    items: ["Speaker", "Earpiece", "Microphone"],
  },
  {
    category: "Hardware",
    items: [
      "Vibration",
      "Charging",
      "Charging Port",
      "Battery Health",
      "Power Button",
      "Volume Buttons",
      "Silent Switch",
    ],
  },
  {
    category: "Connectivity",
    items: ["Wi-Fi", "Bluetooth", "Mobile Network", "SIM", "GPS"],
  },
  {
    category: "Biometrics",
    items: ["Fingerprint", "Face ID / Face Unlock"],
  },
  {
    category: "Sensors",
    items: [
      "Proximity Sensor",
      "Light Sensor",
      "Accelerometer / Gyroscope",
      "Other Sensors",
    ],
  },
  {
    category: "Identity",
    items: ["IMEI Verification", "Serial Number", "Device Information"],
  },
];

export const ALL_TEST_ITEMS: TestItem[] = TEST_CATEGORIES.flatMap((cat) =>
  cat.items.map((name) => ({ category: cat.category, name }))
);

/* ── Physical condition options ── */

export const CONDITION_LEVELS = ["excellent", "good", "fair", "poor", "damaged"] as const;
export const DAMAGE_LEVELS = ["none", "minor", "moderate", "heavy"] as const;

export const PHYSICAL_FIELDS = [
  { key: "screen", label: "Screen Condition", type: "condition" },
  { key: "backPanel", label: "Back Panel", type: "condition" },
  { key: "frame", label: "Frame / Body", type: "condition" },
  { key: "cameraGlass", label: "Camera Glass", type: "condition" },
  { key: "scratches", label: "Scratches", type: "damage" },
  { key: "dents", label: "Dents", type: "damage" },
  { key: "cracks", label: "Cracks", type: "damage" },
  { key: "waterDamage", label: "Water / Liquid Damage", type: "boolean" },
  { key: "overallBody", label: "Overall Body", type: "condition" },
] as const;

/* ── Inspection status labels ── */

export const INSPECTION_STATUSES = {
  in_progress: "In Progress",
  completed: "Completed",
} as const;

export const RESULT_LABELS = {
  pass: "Pass",
  fail: "Fail",
  not_tested: "Not Tested",
  conditional: "Conditional",
} as const;

/* ── Booking ── */

export const BOOKING_STATUSES: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "#CA8A04" },
  assigned: { label: "Assigned", color: "#2563EB" },
  out_for_inspection: { label: "Out for Inspection", color: "#7C3AED" },
  inspected: { label: "Inspected", color: "#059669" },
  priced: { label: "Bill Ready", color: "#D97706" },
  paid: { label: "Paid", color: "#16A34A" },
  completed: { label: "Completed", color: "#16A34A" },
  cancelled: { label: "Cancelled", color: "#DC2626" },
};

export const TIME_SLOTS = [
  "09:00 AM – 11:00 AM",
  "11:00 AM – 01:00 PM",
  "01:00 PM – 03:00 PM",
  "03:00 PM – 05:00 PM",
  "05:00 PM – 07:00 PM",
] as const;

export const SERVICE_FEE = 349;

export const PHONE_CONDITIONS = [
  "Like New",
  "Good",
  "Fair",
  "Poor / Damaged",
] as const;
