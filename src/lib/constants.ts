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

export const SERVICE_FEE = 350;

export const PHONE_CONDITIONS = [
  "Like New",
  "Good",
  "Fair",
  "Poor / Damaged",
] as const;
