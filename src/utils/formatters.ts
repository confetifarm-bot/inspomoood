export const formatSoles = (amount: number): string => {
  return `S/ ${amount.toFixed(2)}`;
};

export const getOccasionLabel = (occasion: string): string => {
  const map: Record<string, string> = {
    'aniversario': 'Aniversario',
    'cumpleanos': 'Cumpleaños',
    'san-valentin': 'San Valentín',
    'halloween': 'Halloween',
    'porque-si': 'Porque sí',
  };
  return map[occasion] || occasion;
};

export const getCategoryIconName = (slugOrIcon: string): string => {
  if (slugOrIcon.includes('flor') || slugOrIcon.includes('ramo')) return 'Flower2';
  if (slugOrIcon.includes('perfume')) return 'Sparkles';
  if (slugOrIcon.includes('disfraz')) return 'Smile';
  if (slugOrIcon.includes('ropa') || slugOrIcon.includes('combinar')) return 'Shirt';
  if (slugOrIcon.includes('caja') || slugOrIcon.includes('regalo')) return 'Gift';
  if (slugOrIcon.includes('personal')) return 'PenTool';
  if (slugOrIcon.includes('combo')) return 'HeartHandshake';
  return 'Heart';
};
