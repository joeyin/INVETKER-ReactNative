export const formatDecimal = (value?: number) => {
  if (value === undefined || value === null) {
    return "-";
  }

  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

export const formatInteger = (value?: number) => {
  if (value === undefined || value === null) {
    return "-";
  }

  return value.toLocaleString(undefined, {
    maximumFractionDigits: 0
  });
}

export const formatDate = (date: Date) => {
  return date.toISOString().replace("T", " ").substring(0, 19);
}

export const formatLocalizedCapitalized = (str, locale = 'en-US') => {
  return str ? str.charAt(0).toLocaleUpperCase(locale) + str.slice(1).toLocaleLowerCase(locale) : "-";
}