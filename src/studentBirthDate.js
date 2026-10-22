export function normalizeBirthDateValue(value) {
  if (value === null || value === undefined) {
    return "";
  }

  const raw = String(value).trim();
  if (!raw) {
    return "";
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return raw;
  }

  if (/^\d{4}$/.test(raw)) {
    return `${raw}-01-01`;
  }

  return raw;
}

export function calculateAgeYears(value, now = new Date()) {
  const normalized = normalizeBirthDateValue(value);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    return 0;
  }

  const [year, month, day] = normalized.split('-').map(Number);
  const birthDate = new Date(year, month - 1, day);
  const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let age = currentDate.getFullYear() - birthDate.getFullYear();
  const currentMonthDay = currentDate.getMonth() * 100 + currentDate.getDate();
  const birthMonthDay = birthDate.getMonth() * 100 + birthDate.getDate();

  if (currentMonthDay < birthMonthDay) {
    age -= 1;
  }

  return age;
}
