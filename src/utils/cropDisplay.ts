import type { TFunction } from 'i18next';
import { CROP_GUIDES, type CropCategory, type CropGuideProfile } from '../data/cropKnowledge';

const CROP_NAME_LOOKUP = new Map<string, CropGuideProfile>();
for (const crop of CROP_GUIDES) {
  CROP_NAME_LOOKUP.set(crop.id.toLowerCase(), crop);
  CROP_NAME_LOOKUP.set(crop.names.en.toLowerCase(), crop);
  CROP_NAME_LOOKUP.set(crop.names.te.toLowerCase(), crop);
  CROP_NAME_LOOKUP.set(crop.names.hi.toLowerCase(), crop);
  const enShort = crop.names.en.split(' (')[0].trim().toLowerCase();
  if (enShort) {
    CROP_NAME_LOOKUP.set(enShort, crop);
  }
}

export function findCropGuideByName(rawName: string | null | undefined): CropGuideProfile | undefined {
  const clean = (rawName || '').trim().toLowerCase();
  if (!clean) return undefined;
  const direct = CROP_NAME_LOOKUP.get(clean);
  if (direct) return direct;
  const baseName = clean.split(' (')[0].trim();
  if (baseName && CROP_NAME_LOOKUP.has(baseName)) {
    return CROP_NAME_LOOKUP.get(baseName);
  }
  return CROP_GUIDES.find(
    (g) => clean.includes(g.id) || clean.includes(g.names.en.toLowerCase().split(' (')[0])
  );
}

export function getLocalizedCropName(t: TFunction, rawName: string | null | undefined): string {
  const clean = (rawName || '').trim();
  if (!clean) return '';
  const matched = findCropGuideByName(clean);
  if (!matched) return clean;
  return t(`cropNames.${matched.id}`, { defaultValue: clean });
}

export function getLocalizedGuideCropName(t: TFunction, crop: CropGuideProfile): string {
  return t(`cropNames.${crop.id}`, { defaultValue: crop.names.en });
}

export function getLocalizedCategoryLabel(
  t: TFunction,
  categoryId: 'all' | CropCategory,
  fallbackLabel?: string
): string {
  return t(`cropCategories.${categoryId}`, { defaultValue: fallbackLabel || categoryId });
}

export function matchesCropSearch(crop: CropGuideProfile, query: string, t: TFunction): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const localizedName = getLocalizedGuideCropName(t, crop).toLowerCase();
  return (
    crop.id.toLowerCase().includes(q) ||
    crop.names.en.toLowerCase().includes(q) ||
    crop.names.te.toLowerCase().includes(q) ||
    crop.names.hi.toLowerCase().includes(q) ||
    localizedName.includes(q) ||
    crop.defaultVariety.toLowerCase().includes(q)
  );
}
