import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { extractSpotifyId, getPlaylistData, analyzePlaylist, optimizeSetList } from "./spotify-api";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Analyze a Spotify playlist
  app.get('/api/analyze', async (req, res, next) => {
    try {
      const playlistUrl = req.query.url as string;
      
      if (!playlistUrl) {
        return res.status(400).json({ message: 'Playlist URL is required' });
      }
      
      const playlistId = extractSpotifyId(playlistUrl);
      
      if (!playlistId) {
        return res.status(400).json({ message: 'Invalid Spotify playlist URL' });
      }
      
      // Check if we already have this playlist analyzed
      let playlist = await storage.getPlaylistBySpotifyId(playlistId);
      let tracks = [];
      
      if (!playlist) {
        // Fetch and analyze the playlist
        const playlistData = await getPlaylistData(playlistId);
        
        // Save to storage
        playlist = await storage.createPlaylist({
          spotifyId: playlistId,
          name: playlistData.name,
          owner: playlistData.owner,
          coverImage: playlistData.coverImage,
          trackCount: playlistData.trackCount
        });
        
        // Analyze tracks
        const analyzedTracks = await analyzePlaylist(playlistId);
        
        // Save tracks
        for (const track of analyzedTracks) {
          await storage.createTrack(track);
        }
        
        tracks = analyzedTracks;
      } else {
        // Get tracks for this playlist
        tracks = await storage.getTracksByPlaylistId(playlistId);
      }
      
      // Optimize the set list
      const optimizedTracks = optimizeSetList(tracks);
      
      // Calculate playlist statistics
      const totalDuration = Math.round(tracks.reduce((sum, track) => sum + track.durationMs, 0) / 1000 / 60);
      
      const averageBpm = tracks.reduce((sum, track) => sum + track.bpm, 0) / tracks.length;
      const averageEnergy = tracks.reduce((sum, track) => sum + track.energy, 0) / tracks.length;
      
      // Find dominant keys
      const keyCount: Record<string, number> = {};
      tracks.forEach(track => {
        keyCount[track.camelotKey] = (keyCount[track.camelotKey] || 0) + 1;
      });
      
      const dominantKeys = Object.entries(keyCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([key]) => key);
      
      // Return analysis results
      res.json({
        playlist,
        totalDuration,
        stats: {
          averageBpm,
          averageEnergy,
          dominantKeys
        },
        tracks,
        optimizedTracks
      });
      
    } catch (error) {
      next(error);
    }
  });

  // Save a set
  app.post('/api/sets', async (req, res, next) => {
    try {
      const { name, playlistId, tracks, options } = req.body;
      
      const set = await storage.createSet({
        name,
        playlistId,
        tracks,
        options
      });
      
      res.status(201).json(set);
    } catch (error) {
      next(error);
    }
  });

  // Get all sets
  app.get('/api/sets', async (req, res, next) => {
    try {
      const sets = await storage.getAllSets();
      res.json(sets);
    } catch (error) {
      next(error);
    }
  });

  // Export a set
  app.get('/api/sets/:id/export', async (req, res, next) => {
    try {
      const setId = parseInt(req.params.id);
      const format = req.query.format as string || 'csv';
      
      const set = await storage.getSet(setId);
      
      if (!set) {
        return res.status(404).json({ message: 'Set not found' });
      }
      
      // Get tracks for the set
      const trackIds = Array.isArray(set.tracks) ? set.tracks as number[] : [];
      const tracks = await Promise.all(trackIds.map((trackId: number) => storage.getTrack(trackId)));
      
      // Generate export data
      let exportData;
      
      if (format === 'json') {
        exportData = JSON.stringify(tracks, null, 2);
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="djino-set-${setId}.json"`);
      } else {
        // Default to CSV
        // Convert tracks to CSV format
        const header = 'Track,Artist,BPM,Key,Energy,Duration\n';
        const rows = tracks.map((track: any) => 
          `"${track.name}","${track.artist}",${track.bpm},${track.camelotKey},${track.energy},${Math.round(track.durationMs / 1000)}`
        ).join('\n');
        
        exportData = header + rows;
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="djino-set-${setId}.csv"`);
      }
      
      res.send(exportData);
    } catch (error) {
      next(error);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
