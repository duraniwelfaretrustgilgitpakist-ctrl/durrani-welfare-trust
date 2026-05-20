export const TEAM_PHOTOS: Record<string, string> = {
  'Mr. Waheed Faraz Durrani': '/team/chairman.jpeg',
  'Ms. Aman Faraz Durrani':   '/team/ceo.jpeg',
  'Ms. Rawasia Waheed':       '/team/chairperson.jpeg',
  'Vice Chairman':            '/team/vice-chairman.jpeg',
  'General Secretary':        '/team/general-secretary.jpeg',
};

const ROLE_PHOTOS: Record<string, string> = {
  'Chairman & Founder': '/team/chairman.jpeg',
  'CEO & Trustee':      '/team/ceo.jpeg',
  'Chairperson':        '/team/chairperson.jpeg',
  'Vice Chairman':      '/team/vice-chairman.jpeg',
  'General Secretary':  '/team/general-secretary.jpeg',
};

export function resolveTeamPhoto(name: string, role: string, photo: string | null, mediaUrlFn: (p: string) => string): string | null {
  if (photo) {
    if (photo.startsWith('/') && !photo.startsWith('/media')) return photo;
    return mediaUrlFn(photo);
  }
  return TEAM_PHOTOS[name] ?? ROLE_PHOTOS[role] ?? null;
}
