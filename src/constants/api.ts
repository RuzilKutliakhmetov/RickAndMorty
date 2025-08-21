// api.ts
import { 
  Character, 
  Location, 
  Episode, 
  CharacterFilter, 
  LocationFilter, 
  EpisodeFilter,
  CharacterResponse,
  LocationResponse,
  EpisodeResponse
} from './types';

const API_BASE = 'https://rickandmortyapi.com/api';

export class RickAndMortyAPI {
  // Characters
  static async getCharacters(filters?: CharacterFilter): Promise<CharacterResponse> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }
    
    const response = await fetch(`${API_BASE}/character?${params}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  static async getCharacter(id: number): Promise<Character> {
    const response = await fetch(`${API_BASE}/character/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Locations
  static async getLocations(filters?: LocationFilter): Promise<LocationResponse> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }
    
    const response = await fetch(`${API_BASE}/location?${params}`);
    return response.json();
  }

  static async getLocation(id: number): Promise<Location> {
    const response = await fetch(`${API_BASE}/location/${id}`);
    return response.json();
  }

  // Episodes
  static async getEpisodes(filters?: EpisodeFilter): Promise<EpisodeResponse> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }
    
    const response = await fetch(`${API_BASE}/episode?${params}`);
    return response.json();
  }

  static async getEpisode(id: number): Promise<Episode> {
    const response = await fetch(`${API_BASE}/episode/${id}`);
    return response.json();
  }

  // Multiple items
  static async getMultipleCharacters(ids: number[]): Promise<Character[]> {
    const response = await fetch(`${API_BASE}/character/${ids.join(',')}`);
    return response.json();
  }

  static async getMultipleEpisodes(ids: number[]): Promise<Episode[]> {
    const response = await fetch(`${API_BASE}/episode/${ids.join(',')}`);
    return response.json();
  }

  // URL-based fetching
  static async getByUrl<T>(url: string): Promise<T> {
    const response = await fetch(url);
    return response.json();
  }
}