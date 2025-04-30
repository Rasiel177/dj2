import { pgTable, text, serial, integer, boolean, timestamp, json, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Track model
export const tracks = pgTable("tracks", {
  id: serial("id").primaryKey(),
  spotifyId: text("spotify_id").notNull().unique(),
  name: text("name").notNull(),
  artist: text("artist").notNull(),
  albumCover: text("album_cover"),
  durationMs: integer("duration_ms").notNull(),
  bpm: real("bpm").notNull(),
  key: integer("key").notNull(), // Spotify key (0-11)
  mode: integer("mode").notNull(), // 0: minor, 1: major
  camelotKey: text("camelot_key").notNull(), // e.g., "8A", "10B"
  energy: real("energy").notNull(), // 0.0 to 1.0
  danceability: real("danceability"), // 0.0 to 1.0
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTrackSchema = createInsertSchema(tracks).omit({
  id: true,
  createdAt: true,
});

// Playlist model
export const playlists = pgTable("playlists", {
  id: serial("id").primaryKey(),
  spotifyId: text("spotify_id").notNull().unique(),
  name: text("name").notNull(),
  owner: text("owner").notNull(),
  coverImage: text("cover_image"),
  trackCount: integer("track_count").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPlaylistSchema = createInsertSchema(playlists).omit({
  id: true,
  createdAt: true,
});

// Set model
export const sets = pgTable("sets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  userId: integer("user_id").references(() => users.id),
  playlistId: integer("playlist_id").references(() => playlists.id),
  tracks: json("tracks").notNull(), // Array of track IDs in order
  options: json("options"), // Set options like energy flow, bpm range, etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSetSchema = createInsertSchema(sets).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Track = typeof tracks.$inferSelect;
export type InsertTrack = z.infer<typeof insertTrackSchema>;

export type Playlist = typeof playlists.$inferSelect;
export type InsertPlaylist = z.infer<typeof insertPlaylistSchema>;

export type Set = typeof sets.$inferSelect;
export type InsertSet = z.infer<typeof insertSetSchema>;

// Additional custom types
export interface SpotifyPlaylistInfo {
  id: string;
  name: string;
  owner: string;
  coverImage?: string;
  trackCount: number;
}

export interface TrackAnalysis {
  id: string;
  name: string;
  artist: string;
  albumCover?: string;
  durationMs: number;
  bpm: number;
  key: number;
  mode: number;
  camelotKey: string;
  energy: number;
  danceability?: number;
}

export interface SetOptions {
  bpmRange: {
    min: number;
    max: number;
  };
  energyFlow: 'low-high' | 'high-high' | 'wave';
  transitionStyle: {
    forceHarmonic: boolean;
    forceBpmMatch: boolean;
    allowEnergyJumps: boolean;
  };
}
