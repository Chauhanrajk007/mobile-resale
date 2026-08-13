export type Role = "admin" | "technician" | "customer";

export interface UserMe {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  technicianId: string;
  active: boolean;
  emailNotifications?: boolean;
}

export interface TestResult {
  category: string;
  name: string;
  result: "pass" | "fail" | "not_tested";
  comment: string;
}

export interface PhysicalCondition {
  screen: string;
  backPanel: string;
  frame: string;
  cameraGlass: string;
  scratches: string;
  dents: string;
  cracks: string;
  waterDamage: boolean;
  missingParts: string;
  otherDamage: string;
  overallBody: string;
}

export interface InspectionPhoto {
  label: string;
  data: string;
  mimeType: string;
}

export interface InspectionLocation {
  lat: number | null;
  lng: number | null;
  address: string;
}

export interface InspectionDoc {
  _id: string;
  inspectionId: string;
  technician: UserMe | string;
  phone: {
    brand: string;
    model: string;
    variant: string;
    imei: string;
    serialNumber: string;
  };
  deviceInfo: {
    storage: string;
    color: string;
    os: string;
    status: string;
    blacklistStatus: string;
    warrantyInfo: string;
  };
  tests: TestResult[];
  physicalCondition: PhysicalCondition;
  photos: InspectionPhoto[];
  location: InspectionLocation;
  overallResult: "pass" | "fail" | "conditional";
  comments: string;
  status: "in_progress" | "completed";
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface PhoneModelDoc {
  _id: string;
  brand: string;
  model: string;
  variants: string[];
  active: boolean;
}

export interface IMEILookup {
  brand: string;
  model: string;
  storage: string;
  imei: string;
  serial: string;
  status: string;
  blacklisted: boolean;
  warranty: string;
}
