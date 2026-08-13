/** Format a date string for display */
export function formatDate(d: string | Date): string {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Format currency in INR */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Format a full datetime string */
export function formatDateTime(d: string | Date): string {
  return new Date(d).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Generate a unique inspection ID like CMP-2026-00042 */
export function inspectionNumber(seq: number): string {
  const year = new Date().getFullYear();
  return `CMP-${year}-${String(seq).padStart(5, "0")}`;
}

/** Result color for pass/fail/not_tested */
export function resultColor(result: string): string {
  switch (result) {
    case "pass":
      return "var(--success)";
    case "fail":
      return "var(--danger)";
    default:
      return "var(--text2)";
  }
}

/** Overall result label with emoji */
export function resultEmoji(result: string): string {
  switch (result) {
    case "pass":
      return "✓ Pass";
    case "fail":
      return "✗ Fail";
    case "conditional":
      return "⚠ Conditional";
    default:
      return result;
  }
}

/** Condition badge color */
export function conditionColor(level: string): string {
  switch (level) {
    case "excellent":
      return "var(--success)";
    case "good":
      return "var(--primary)";
    case "fair":
      return "var(--warning)";
    case "poor":
    case "damaged":
      return "var(--danger)";
    default:
      return "var(--text2)";
  }
}

/** Merge class names */
export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

/** Compress an image file to base64 (client-side) */
export function compressImage(file: File, maxWidth = 800, quality = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ratio = Math.min(maxWidth / img.width, 1);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
