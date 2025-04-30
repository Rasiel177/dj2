// Camelot Wheel mapping
// The Camelot Wheel organizes musical keys in a circle
// Each key is assigned a number (1-12) and a letter (A for minor, B for major)
// Compatible keys are adjacent on the wheel or in the same position in the other wheel (e.g., 8A and 8B)

export interface CamelotKeyInfo {
  name: string;   // Human-readable name of the key
  number: number; // Position on the Camelot Wheel (1-12)
  mode: string;   // "minor" or "major"
  spotifyKey: number; // Spotify's key representation (0-11)
  spotifyMode: number; // Spotify's mode (0 for minor, 1 for major)
}

export const camelotWheelMap: Record<string, CamelotKeyInfo> = {
  // Minor keys (A)
  "1A": { name: "A♭ minor", number: 1, mode: "minor", spotifyKey: 1, spotifyMode: 0 }, // A♭m
  "2A": { name: "E♭ minor", number: 2, mode: "minor", spotifyKey: 6, spotifyMode: 0 }, // E♭m
  "3A": { name: "B♭ minor", number: 3, mode: "minor", spotifyKey: 11, spotifyMode: 0 }, // B♭m
  "4A": { name: "F minor", number: 4, mode: "minor", spotifyKey: 4, spotifyMode: 0 }, // Fm
  "5A": { name: "C minor", number: 5, mode: "minor", spotifyKey: 9, spotifyMode: 0 }, // Cm
  "6A": { name: "G minor", number: 6, mode: "minor", spotifyKey: 2, spotifyMode: 0 }, // Gm
  "7A": { name: "D minor", number: 7, mode: "minor", spotifyKey: 7, spotifyMode: 0 }, // Dm
  "8A": { name: "A minor", number: 8, mode: "minor", spotifyKey: 0, spotifyMode: 0 }, // Am
  "9A": { name: "E minor", number: 9, mode: "minor", spotifyKey: 5, spotifyMode: 0 }, // Em
  "10A": { name: "B minor", number: 10, mode: "minor", spotifyKey: 10, spotifyMode: 0 }, // Bm
  "11A": { name: "F♯ minor", number: 11, mode: "minor", spotifyKey: 3, spotifyMode: 0 }, // F♯m
  "12A": { name: "C♯ minor", number: 12, mode: "minor", spotifyKey: 8, spotifyMode: 0 }, // C♯m

  // Major keys (B)
  "1B": { name: "B major", number: 1, mode: "major", spotifyKey: 11, spotifyMode: 1 }, // B
  "2B": { name: "F♯ major", number: 2, mode: "major", spotifyKey: 6, spotifyMode: 1 }, // F♯
  "3B": { name: "C♯ major", number: 3, mode: "major", spotifyKey: 1, spotifyMode: 1 }, // C♯
  "4B": { name: "A♭ major", number: 4, mode: "major", spotifyKey: 8, spotifyMode: 1 }, // A♭
  "5B": { name: "E♭ major", number: 5, mode: "major", spotifyKey: 3, spotifyMode: 1 }, // E♭
  "6B": { name: "B♭ major", number: 6, mode: "major", spotifyKey: 10, spotifyMode: 1 }, // B♭
  "7B": { name: "F major", number: 7, mode: "major", spotifyKey: 5, spotifyMode: 1 }, // F
  "8B": { name: "C major", number: 8, mode: "major", spotifyKey: 0, spotifyMode: 1 }, // C
  "9B": { name: "G major", number: 9, mode: "major", spotifyKey: 7, spotifyMode: 1 }, // G
  "10B": { name: "D major", number: 10, mode: "major", spotifyKey: 2, spotifyMode: 1 }, // D
  "11B": { name: "A major", number: 11, mode: "major", spotifyKey: 9, spotifyMode: 1 }, // A
  "12B": { name: "E major", number: 12, mode: "major", spotifyKey: 4, spotifyMode: 1 }, // E
};

// Reverse lookup to find Camelot key from Spotify key and mode
export function getCamelotKey(spotifyKey: number, spotifyMode: number): string {
  for (const [key, info] of Object.entries(camelotWheelMap)) {
    if (info.spotifyKey === spotifyKey && info.spotifyMode === spotifyMode) {
      return key;
    }
  }
  return "8A"; // Default to A minor if not found
}

// Get compatible keys according to Camelot Wheel rules
export function getCompatibleKeys(camelotKey: string): string[] {
  const compatibleKeys: string[] = [];
  
  if (!camelotWheelMap[camelotKey]) {
    return compatibleKeys;
  }
  
  const keyNumber = camelotWheelMap[camelotKey].number;
  const keyType = camelotKey.endsWith('A') ? 'A' : 'B';
  
  // Add same key (perfect match)
  compatibleKeys.push(camelotKey);
  
  // Add same position in the other wheel (e.g., 8A -> 8B)
  compatibleKeys.push(`${keyNumber}${keyType === 'A' ? 'B' : 'A'}`);
  
  // Add adjacent keys in the same wheel (e.g., 8A -> 7A, 9A)
  const prevNumber = keyNumber === 1 ? 12 : keyNumber - 1;
  const nextNumber = keyNumber === 12 ? 1 : keyNumber + 1;
  
  compatibleKeys.push(`${prevNumber}${keyType}`);
  compatibleKeys.push(`${nextNumber}${keyType}`);
  
  // Return only valid keys that exist in our map
  return compatibleKeys.filter(key => camelotWheelMap[key]);
}

// Check if two Camelot keys are compatible
export function areKeysCompatible(key1: string, key2: string): boolean {
  const compatibleKeys = getCompatibleKeys(key1);
  return compatibleKeys.includes(key2);
}
