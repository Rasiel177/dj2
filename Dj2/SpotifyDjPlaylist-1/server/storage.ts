import { 
  User, InsertUser, 
  Track, InsertTrack, 
  Playlist, InsertPlaylist, 
  Set, InsertSet
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Track methods
  getTrack(id: number): Promise<Track | undefined>;
  getTrackBySpotifyId(spotifyId: string): Promise<Track | undefined>;
  getTracksByPlaylistId(playlistId: string): Promise<Track[]>;
  createTrack(track: InsertTrack): Promise<Track>;
  
  // Playlist methods
  getPlaylist(id: number): Promise<Playlist | undefined>;
  getPlaylistBySpotifyId(spotifyId: string): Promise<Playlist | undefined>;
  createPlaylist(playlist: InsertPlaylist): Promise<Playlist>;
  
  // Set methods
  getSet(id: number): Promise<Set | undefined>;
  getAllSets(): Promise<Set[]>;
  createSet(set: InsertSet): Promise<Set>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tracks: Map<number, Track>;
  private playlists: Map<number, Playlist>;
  private sets: Map<number, Set>;
  
  // Track IDs by Spotify playlist ID for quick lookup
  private tracksByPlaylist: Map<string, Track[]>;
  
  private userId: number;
  private trackId: number;
  private playlistId: number;
  private setId: number;

  constructor() {
    this.users = new Map();
    this.tracks = new Map();
    this.playlists = new Map();
    this.sets = new Map();
    this.tracksByPlaylist = new Map();
    
    this.userId = 1;
    this.trackId = 1;
    this.playlistId = 1;
    this.setId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Track methods
  async getTrack(id: number): Promise<Track | undefined> {
    return this.tracks.get(id);
  }
  
  async getTrackBySpotifyId(spotifyId: string): Promise<Track | undefined> {
    return Array.from(this.tracks.values()).find(
      (track) => track.spotifyId === spotifyId
    );
  }
  
  async getTracksByPlaylistId(playlistId: string): Promise<Track[]> {
    return this.tracksByPlaylist.get(playlistId) || [];
  }
  
  async createTrack(insertTrack: InsertTrack): Promise<Track> {
    const id = this.trackId++;
    const track: Track = { 
      ...insertTrack, 
      id, 
      createdAt: new Date(),
      albumCover: insertTrack.albumCover || null,
      danceability: insertTrack.danceability || null
    };
    
    this.tracks.set(id, track);
    
    // Add to tracksByPlaylist for quick lookup
    if (insertTrack.spotifyId.includes(':')) {
      const parts = insertTrack.spotifyId.split(':');
      if (parts.length > 1) {
        const playlistId = parts[0];
        const tracks = this.tracksByPlaylist.get(playlistId) || [];
        tracks.push(track);
        this.tracksByPlaylist.set(playlistId, tracks);
      }
    }
    
    return track;
  }
  
  // Playlist methods
  async getPlaylist(id: number): Promise<Playlist | undefined> {
    return this.playlists.get(id);
  }
  
  async getPlaylistBySpotifyId(spotifyId: string): Promise<Playlist | undefined> {
    return Array.from(this.playlists.values()).find(
      (playlist) => playlist.spotifyId === spotifyId
    );
  }
  
  async createPlaylist(insertPlaylist: InsertPlaylist): Promise<Playlist> {
    const id = this.playlistId++;
    const playlist: Playlist = { 
      ...insertPlaylist, 
      id, 
      createdAt: new Date(),
      coverImage: insertPlaylist.coverImage || null
    };
    
    this.playlists.set(id, playlist);
    return playlist;
  }
  
  // Set methods
  async getSet(id: number): Promise<Set | undefined> {
    return this.sets.get(id);
  }
  
  async getAllSets(): Promise<Set[]> {
    return Array.from(this.sets.values());
  }
  
  async createSet(insertSet: InsertSet): Promise<Set> {
    const id = this.setId++;
    const set: Set = { 
      ...insertSet, 
      id, 
      createdAt: new Date(),
      options: insertSet.options || {},
      playlistId: insertSet.playlistId || null,
      userId: insertSet.userId || null
    };
    
    this.sets.set(id, set);
    return set;
  }
}

export const storage = new MemStorage();
