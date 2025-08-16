
export interface Representative {
  id: string;
  name: string;
  party: string;
  role: string;
  level: string; // Federal, State, or Local
  photoUrl?: string;
  reason: string;
}