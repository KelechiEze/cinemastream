
import { Movie, Episode, VideoSource, CastMember, BlogPost } from '../types';

const API_KEY = '5da30bd48bbfdebff012c3f33a3d7232';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';
const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const mapTmdbToMovie = (item: any): Movie => {
  return {
    id: item.id.toString(),
    tmdbId: item.id.toString(),
    title: item.title || item.name,
    year: (item.release_date || item.first_air_date || '').split('-')[0] || 'N/A',
    genre: [], 
    duration: '', 
    imageUrl: item.poster_path ? `${POSTER_BASE_URL}${item.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Poster',
    backdropUrl: item.backdrop_path ? `${IMAGE_BASE_URL}${item.backdrop_path}` : 'https://via.placeholder.com/1920x1080?text=No+Backdrop',
    description: item.overview,
    rating: item.vote_average ? item.vote_average.toFixed(1) : undefined,
    voteCount: item.vote_count,
    originalLanguage: item.original_language,
  };
};

export const fetchTrending = async (page: number = 1): Promise<Movie[]> => {
  try {
    const response = await fetch(`${BASE_URL}/trending/all/week?api_key=${API_KEY}&page=${page}`);
    const data = await response.json();
    return data.results.map(mapTmdbToMovie);
  } catch (error) {
    return [];
  }
};

export const fetchPopularMovies = async (page: number = 1): Promise<Movie[]> => {
  try {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`);
    const data = await response.json();
    return data.results.map(mapTmdbToMovie);
  } catch (error) {
    return [];
  }
};

export const fetchComedyMovies = async (page: number = 1): Promise<Movie[]> => {
  try {
    const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&page=${page}&with_genres=35`);
    const data = await response.json();
    return data.results.map(mapTmdbToMovie);
  } catch (error) {
    return [];
  }
};

export const fetchTVSeries = async (page: number = 1): Promise<Movie[]> => {
  try {
    const response = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&language=en-US&page=${page}`);
    const data = await response.json();
    return data.results.map(mapTmdbToMovie);
  } catch (error) {
    return [];
  }
};

export const fetchUpcoming = async (page: number = 1): Promise<Movie[]> => {
    try {
        const response = await fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=${page}`);
        const data = await response.json();
        return data.results.map(mapTmdbToMovie);
    } catch (error) {
        return [];
    }
};

export const discoverMovies = async (genreId?: string, page: number = 1, country?: string, lang?: string): Promise<Movie[]> => {
  let params = `api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&page=${page}`;
  if (genreId) params += `&with_genres=${genreId}`;
  if (country) params += `&with_origin_country=${country}`;
  if (lang) params += `&with_original_language=${lang}`;

  const response = await fetch(`${BASE_URL}/discover/movie?${params}`);
  const data = await response.json();
  return data.results.map(mapTmdbToMovie);
};

export const discoverTV = async (genreId?: string, page: number = 1, country?: string, lang?: string): Promise<Movie[]> => {
  let params = `api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&page=${page}`;
  
  // Special handling for "Anime"
  if (genreId === 'anime') {
    params += `&with_genres=16&with_original_language=ja`;
  } else if (genreId) {
    params += `&with_genres=${genreId}`;
  }

  if (country) params += `&with_origin_country=${country}`;
  if (lang) params += `&with_original_language=${lang}`;

  const response = await fetch(`${BASE_URL}/discover/tv?${params}`);
  const data = await response.json();
  return data.results.map(mapTmdbToMovie);
};

export const fetchTVDetails = async (id: string): Promise<any> => {
  try {
    const response = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=en-US`);
    return await response.json();
  } catch (error) {
    return null;
  }
};

export const fetchTVSeason = async (tvId: string, seasonNumber: number): Promise<Episode[]> => {
  try {
    const response = await fetch(`${BASE_URL}/tv/${tvId}/season/${seasonNumber}?api_key=${API_KEY}&language=en-US`);
    const data = await response.json();
    if (!data.episodes) return [];
    return data.episodes.map((ep: any) => ({
      id: ep.id.toString(),
      number: `S${seasonNumber < 10 ? '0' + seasonNumber : seasonNumber}E${ep.episode_number < 10 ? '0' + ep.episode_number : ep.episode_number}`,
      title: ep.name,
      imageUrl: ep.still_path ? `${POSTER_BASE_URL}${ep.still_path}` : 'https://via.placeholder.com/300x170?text=No+Image',
      airDate: ep.air_date,
      overview: ep.overview
    }));
  } catch (error) {
    return [];
  }
};

export const fetchCredits = async (id: string, type: 'movie' | 'tv' = 'movie'): Promise<{ cast: CastMember[], director: string }> => {
    try {
        const response = await fetch(`${BASE_URL}/${type}/${id}/credits?api_key=${API_KEY}&language=en-US`);
        const data = await response.json();
        const cast: CastMember[] = data.cast.slice(0, 10).map((c: any) => ({
            id: c.id.toString(),
            name: c.name,
            character: c.character,
            imageUrl: c.profile_path ? `${POSTER_BASE_URL}${c.profile_path}` : 'https://via.placeholder.com/150x225?text=No+Img'
        }));
        const director = data.crew.find((c: any) => c.job === 'Director')?.name || 'Unknown';
        return { cast, director };
    } catch (e) {
        return { cast: [], director: '' };
    }
};

export const fetchSimilarMovies = async (id: string, type: 'movie' | 'tv' = 'movie'): Promise<Movie[]> => {
    try {
        const response = await fetch(`${BASE_URL}/${type}/${id}/similar?api_key=${API_KEY}&language=en-US&page=1`);
        const data = await response.json();
        return data.results.slice(0, 6).map(mapTmdbToMovie);
    } catch (e) {
        return [];
    }
};

export const fetchMovieDetails = async (id: string, type: 'movie' | 'tv' = 'movie'): Promise<Partial<Movie>> => {
    try {
        const response = await fetch(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=en-US`);
        const data = await response.json();
        return {
            duration: type === 'movie' ? `${Math.floor(data.runtime / 60)}h ${data.runtime % 60}m` : `${data.episode_run_time?.[0] || 45}m`,
            genre: data.genres.map((g: any) => g.name),
            voteCount: data.vote_count,
            originalLanguage: data.original_language
        };
    } catch (e) {
        return {};
    }
};

export const getVideoSource = async (movie: Movie): Promise<VideoSource> => {
    return {
        type: 'trailer_only',
        source: 'youtube',
        videoUrl: '',
        embedCode: 'dQw4w9WgXcQ',
        warningMessage: 'Full movie streaming disabled for demo.'
    };
};

export const searchMulti = async (query: string): Promise<Movie[]> => {
  if (!query) return [];
  try {
    const response = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1&include_adult=false`);
    const data = await response.json();
    return data.results
        .filter((item: any) => item.media_type !== 'person')
        .map(mapTmdbToMovie);
  } catch (error) {
    return [];
  }
};

export const fetchRealUserData = async () => ({ continueWatching: [], watchlist: [] });
export const fetchRealBlogPosts = async () => [];
