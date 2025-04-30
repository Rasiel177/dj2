import { InsertTrack, SpotifyPlaylistInfo, TrackAnalysis } from "@shared/schema";
import { getCamelotKey, getCompatibleKeys, areKeysCompatible } from "../client/src/lib/camelot-wheel";

// Function to extract Spotify ID from URL
export function extractSpotifyId(url: string): string | null {
  // Handle different forms of Spotify URLs

  // Format: https://open.spotify.com/playlist/37i9dQZF1DX6J5NfMJS675
  const regex = /spotify\.com\/playlist\/([a-zA-Z0-9]+)/;
  const match = url.match(regex);

  if (match && match[1]) {
    return match[1];
  }

  // For embedded URLs like: https://open.spotify.com/embed/playlist/37i9dQZF1DX6J5NfMJS675
  const embedRegex = /spotify\.com\/embed\/playlist\/([a-zA-Z0-9]+)/;
  const embedMatch = url.match(embedRegex);

  if (embedMatch && embedMatch[1]) {
    return embedMatch[1];
  }

  // For URI format: spotify:playlist:37i9dQZF1DX6J5NfMJS675
  const uriRegex = /spotify:playlist:([a-zA-Z0-9]+)/;
  const uriMatch = url.match(uriRegex);

  if (uriMatch && uriMatch[1]) {
    return uriMatch[1];
  }

  return null;
}

// Get Spotify Access Token
async function getSpotifyToken(): Promise<string> {
  const clientId = process.env.SPOTIFY_CLIENT_ID || "";
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET || "";

  console.log("Client ID:", clientId?.substring(0, 5) + "...");
  console.log("Client Secret exists:", !!clientSecret);

  // For development, fallback to a mock token if no client id/secret provided
  if (!clientId || !clientSecret) {
    console.warn('No Spotify credentials provided, using mock data');
    return "mock_token";
  }

  // Using client credentials flow
  // Note: Client Credentials flow can only access public playlists
  const authOptions = {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    body: 'grant_type=client_credentials'
  };

  const response = await fetch('https://accounts.spotify.com/api/token', authOptions);

  if (!response.ok) {
    throw new Error(`Failed to get Spotify token: ${response.statusText}`);
  }

  const data = await response.json();
  return data.access_token;
}

// Get playlist data from Spotify API
export async function getPlaylistData(playlistId: string): Promise<SpotifyPlaylistInfo> {
  const token = await getSpotifyToken();

  // Return mock data if using mock token
  if (token === "mock_token") {
    console.log('Using mock data for playlist info due to missing API credentials');
    return {
      id: playlistId,
      name: "Deep House Relax",
      owner: "Spotify",
      coverImage: "https://images.unsplash.com/photo-1619983081563-430f63602796?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
      trackCount: 24
    };
  }

  try {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to get playlist: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      id: data.id,
      name: data.name,
      owner: data.owner.display_name,
      coverImage: data.images && data.images.length > 0 ? data.images[0].url : undefined,
      trackCount: data.tracks.total
    };
  } catch (error) {
    console.error('Error fetching playlist data from Spotify API:', error);
    console.log('Falling back to mock data for playlist info');
    // Return mock data as fallback when API fails
    return {
      id: playlistId,
      name: "DJ Mix Playlist",
      owner: "DJ User",
      coverImage: "https://images.unsplash.com/photo-1619983081563-430f63602796?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
      trackCount: 24
    };
  }
}

// Get track audio features from Tunebat
async function getTracksAudioFeatures(tracks: any[]): Promise<any[]> {
  const axios = require('axios');
  const cheerio = require('cheerio');

  async function getTunebatData(track: any) {
    try {
      const searchQuery = `${track.track.name} ${track.track.artists[0].name}`;
      const searchUrl = `https://tunebat.com/Info/${encodeURIComponent(searchQuery)}`;

      const response = await axios.get(searchUrl);
      const $ = cheerio.load(response.data);

      const bpm = parseFloat($('.BPMKey div').first().text()) || 120;
      const key = $('.BPMKey div').eq(1).text().trim() || 'C';

      return {
        id: track.track.id,
        tempo: bpm,
        key: key,
        mode: 1,
        energy: 0.8,
        danceability: 0.7
      };
    } catch (error) {
      console.error('Tunebat veri çekme hatası:', error);
      return {
        id: track.track.id,
        tempo: 120,
        key: 'C',
        mode: 1,
        energy: 0.8,
        danceability: 0.7
      };
    }
  }

  console.log('Tunebat\'tan veriler çekiliyor...');

  const features = [];
  for (const track of tracks) {
    const data = await getTunebatData(track);
    features.push(data);
    // Rate limiting için kısa bir bekleme
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return features;
}

// Get tracks from a playlist
async function getPlaylistTracks(playlistId: string): Promise<any[]> {
  const token = await getSpotifyToken();

  // Return mock data if using mock token
  if (token === "mock_token") {
    console.log('Using mock data for playlist tracks due to missing API credentials');
    return Array.from({ length: 24 }, (_, i) => ({
      track: {
        id: `track_${i}`,
        name: `Track ${i + 1}`,
        artists: [{ name: i % 2 === 0 ? 'Artist A' : 'Artist B' }],
        album: {
          images: [{ url: `https://images.unsplash.com/photo-${1580000000000 + i}?w=100&h=100` }]
        },
        duration_ms: 180000 + i * 10000
      }
    }));
  }

  try {
    let tracks: any[] = [];
    let url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?fields=items(track(id,name,artists,album,duration_ms)),next`;

    while (url) {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get playlist tracks: ${response.statusText}`);
      }

      const data = await response.json();
      tracks = [...tracks, ...data.items];
      url = data.next;
    }

    return tracks;
  } catch (error) {
    console.error('Error fetching playlist tracks from Spotify API:', error);
    console.log('Falling back to mock data for playlist tracks');
    // Return mock data as fallback when API fails
    return Array.from({ length: 24 }, (_, i) => ({
      track: {
        id: `track_${i}`,
        name: `Track ${i + 1}`,
        artists: [{ name: i % 2 === 0 ? 'Artist A' : 'Artist B' }],
        album: {
          images: [{ url: `https://images.unsplash.com/photo-${1580000000000 + i}?w=100&h=100` }]
        },
        duration_ms: 180000 + i * 10000
      }
    }));
  }
}

// Analyze a playlist and get track features
export async function analyzePlaylist(playlistId: string): Promise<InsertTrack[]> {
  // Get all tracks from the playlist
  const playlistTracks = await getPlaylistTracks(playlistId);

  // Extract Spotify track IDs

  // Get audio features for all tracks
  const audioFeatures = await getTracksAudioFeatures(playlistTracks);

  // Map track data with audio features
  const analyzedTracks: InsertTrack[] = playlistTracks
    .filter(item => item.track && item.track.id)
    .map(item => {
      const track = item.track;
      const features = audioFeatures.find(f => f.id === track.id);

      if (!features) {
        // Skip tracks without audio features
        return null;
      }

      // Convert Spotify key and mode to Camelot key
      const camelotKey = getCamelotKey(features.key, features.mode);

      return {
        spotifyId: `${playlistId}:${track.id}`,
        name: track.name,
        artist: track.artists.map((a: any) => a.name).join(', '),
        albumCover: track.album.images && track.album.images.length > 0 
          ? track.album.images[0].url 
          : undefined,
        durationMs: track.duration_ms,
        bpm: features.tempo,
        key: features.key,
        mode: features.mode,
        camelotKey,
        energy: features.energy,
        danceability: features.danceability
      };
    })
    .filter(Boolean) as InsertTrack[];

  return analyzedTracks;
}

// Optimize a set list based on Camelot Wheel, BPM, and energy flow
export function optimizeSetList(tracks: any[]): TrackAnalysis[] {
  if (!tracks || tracks.length === 0) {
    return [];
  }

  // Map database tracks to TrackAnalysis interface
  const trackAnalysis: TrackAnalysis[] = tracks.map(track => ({
    id: track.spotifyId.split(':')[1] || track.spotifyId,
    name: track.name,
    artist: track.artist,
    albumCover: track.albumCover || undefined,
    durationMs: track.durationMs,
    bpm: track.bpm,
    key: track.key,
    mode: track.mode,
    camelotKey: track.camelotKey,
    energy: track.energy,
    danceability: track.danceability || undefined
  }));

  // Sort by BPM first to get a baseline
  const sortedByBpm = [...trackAnalysis].sort((a, b) => a.bpm - b.bpm);

  const optimized: TrackAnalysis[] = [sortedByBpm[0]];
  const remaining = new Set(sortedByBpm.slice(1));

  // Greedy algorithm to build the set
  while (remaining.size > 0) {
    const lastTrack = optimized[optimized.length - 1];
    let bestNextTrack: TrackAnalysis | null = null;
    let bestScore = -Infinity;

    // Score each remaining track based on compatibility
    for (const track of Array.from(remaining)) {
      let score = 0;

      // BPM continuity (higher score for closer BPM)
      const bpmDiff = Math.abs(track.bpm - lastTrack.bpm);
      if (bpmDiff <= 5) {
        score += 10 - bpmDiff; // Max 10 points for exact BPM match
      } else {
        score -= bpmDiff * 0.5; // Penalty for large BPM jumps
      }

      // Key compatibility (highest score for compatible keys)
      if (areKeysCompatible(lastTrack.camelotKey, track.camelotKey)) {
        score += 20; // Major bonus for harmonic compatibility

        // Extra points for same key
        if (lastTrack.camelotKey === track.camelotKey) {
          score += 5;
        }
      }

      // Energy progression (prefer gradual increase)
      const energyDiff = track.energy - lastTrack.energy;
      if (energyDiff > 0 && energyDiff < 0.15) {
        score += 5; // Reward for slight energy increase
      } else if (energyDiff >= 0.15) {
        score += 2; // Small reward for bigger energy jumps
      } else if (energyDiff < 0 && energyDiff > -0.1) {
        score += 3; // Small drop is okay
      } else {
        score -= Math.abs(energyDiff) * 10; // Penalty for big energy drops
      }

      if (score > bestScore) {
        bestScore = score;
        bestNextTrack = track;
      }
    }

    if (bestNextTrack) {
      optimized.push(bestNextTrack);
      remaining.delete(bestNextTrack);
    } else {
      // Fallback: just add the next track with closest BPM if no good match
      const remainingArray = Array.from(remaining);
      const nextTrack = remainingArray.sort((a, b) => 
        Math.abs(a.bpm - lastTrack.bpm) - Math.abs(b.bpm - lastTrack.bpm)
      )[0];

      if (nextTrack) {
        optimized.push(nextTrack);
        remaining.delete(nextTrack);
      }
    }
  }

  return optimized;
};

