/**
 * Static team photos stored in public/team/ — baked into the deployment, always available.
 * Used as a fallback when the backend photo field is empty (ephemeral Vercel storage).
 */
export const TEAM_PHOTOS: Record<string, string> = {
  'Mr. Waheed Faraz Durrani': '/team/chairman.jpeg',
  'Ms. Aman Faraz Durrani':   '/team/ceo.jpeg',
  'Ms. Rawasia Waheed':       '/team/chairperson.jpeg',
  // Vice Chairman and General Secretary — update names to match DB entries
  'Vice Chairman':            '/team/vice-chairman.jpeg',
  'General Secretary':        '/team/general-secretary.jpeg',
};

export function resolveTeamPhoto(name: string, photo: string | null, mediaUrlFn: (p: string) => string): string | null {
  if (photo) {
    if (photo.startsWith('/') && !photo.startsWith('/media')) return photo;
    return mediaUrlFn(photo);
  }
  return TEAM_PHOTOS[name] ?? null;
}
