
import { Movie, Episode, VideoSource, CastMember, BlogPost } from '../types';

const API_KEY = '5da30bd48bbfdebff012c3f33a3d7232';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';
const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Helper to map TMDB response to our Movie interface
const mapTmdbToMovie = (item: any): Movie => {
  return {
    id: item.id.toString(),
    tmdbId: item.id.toString(),
    title: item.title || item.name, // TMDB uses 'name' for TV shows
    year: (item.release_date || item.first_air_date || '').split('-')[0] || 'N/A',
    genre: [], // We would need to map genre_ids to names, handling broadly for now
    duration: '', // Duration requires detailed fetch, leaving empty for list view
    imageUrl: item.poster_path ? `${POSTER_BASE_URL}${item.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Poster',
    backdropUrl: item.backdrop_path ? `${IMAGE_BASE_URL}${item.backdrop_path}` : 'https://via.placeholder.com/1920x1080?text=No+Backdrop',
    description: item.overview,
    rating: item.vote_average ? item.vote_average.toFixed(1) : undefined,
    voteCount: item.vote_count,
    originalLanguage: item.original_language,
  };
};

export const fetchTrending = async (): Promise<Movie[]> => {
  try {
    const response = await fetch(`${BASE_URL}/trending/all/week?api_key=${API_KEY}`);
    const data = await response.json();
    return data.results.map(mapTmdbToMovie);
  } catch (error) {
    console.error("Error fetching trending:", error);
    return [];
  }
};

export const fetchPopularMovies = async (): Promise<Movie[]> => {
  try {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`);
    const data = await response.json();
    return data.results.map(mapTmdbToMovie);
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    return [];
  }
};

export const fetchComedyMovies = async (): Promise<Movie[]> => {
  try {
    // Genre ID 35 is Comedy
    const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=35&sort_by=popularity.desc`);
    const data = await response.json();
    return data.results.map(mapTmdbToMovie);
  } catch (error) {
    console.error("Error fetching comedy movies:", error);
    return [];
  }
};

export const fetchTVSeries = async (): Promise<Movie[]> => {
  try {
    const response = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&language=en-US&page=1`);
    const data = await response.json();
    return data.results.map(mapTmdbToMovie);
  } catch (error) {
    console.error("Error fetching TV series:", error);
    return [];
  }
};

export const searchMulti = async (query: string): Promise<Movie[]> => {
  if (!query) return [];
  try {
    const response = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1&include_adult=false`);
    const data = await response.json();
    return data.results
        .filter((item: any) => item.media_type !== 'person') // Exclude people
        .map(mapTmdbToMovie);
  } catch (error) {
    console.error("Error searching:", error);
    return [];
  }
};

export const fetchMovieVideos = async (id: string, type: 'movie' | 'tv' = 'movie'): Promise<any[]> => {
  try {
    const response = await fetch(`${BASE_URL}/${type}/${id}/videos?api_key=${API_KEY}&language=en-US`);
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching videos:", error);
    return [];
  }
};

export const discoverMovies = async (genreId?: string): Promise<Movie[]> => {
  try {
    const genreParam = genreId ? `&with_genres=${genreId}` : '';
    const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&page=1${genreParam}`);
    const data = await response.json();
    return data.results.map(mapTmdbToMovie);
  } catch (error) {
    console.error("Error discovering movies:", error);
    return [];
  }
};

export const discoverTV = async (genreId?: string): Promise<Movie[]> => {
  try {
    const genreParam = genreId ? `&with_genres=${genreId}` : '';
    const response = await fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&page=1${genreParam}`);
    const data = await response.json();
    return data.results.map(mapTmdbToMovie);
  } catch (error) {
    console.error("Error discovering TV:", error);
    return [];
  }
};

export const fetchUpcoming = async (): Promise<Movie[]> => {
    try {
        const response = await fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`);
        const data = await response.json();
        return data.results.map(mapTmdbToMovie);
    } catch (error) {
        console.error("Error fetching upcoming:", error);
        return [];
    }
}

// --- NEW FUNCTIONS FOR REAL DATA IMPLEMENTATION ---

export const fetchTVDetails = async (id: string): Promise<Movie | null> => {
  try {
    const response = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=en-US`);
    const data = await response.json();
    return mapTmdbToMovie(data);
  } catch (error) {
    console.error("Error fetching TV details:", error);
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
    console.error("Error fetching season:", error);
    return [];
  }
};

export const fetchRealUserData = async (): Promise<{ continueWatching: Movie[], watchlist: Movie[] }> => {
  try {
     // Simulating user data by fetching Top Rated and Now Playing
     const topRatedReq = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&page=1`);
     const nowPlayingReq = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&page=1`);
     
     const topRated = await topRatedReq.json();
     const nowPlaying = await nowPlayingReq.json();

     const continueWatching = nowPlaying.results.slice(0, 5).map((m: any) => ({
         ...mapTmdbToMovie(m),
         progress: Math.floor(Math.random() * 80) + 10
     }));

     const watchlist = topRated.results.slice(0, 8).map(mapTmdbToMovie);

     return { continueWatching, watchlist };
  } catch (e) {
      console.error(e);
      return { continueWatching: [], watchlist: [] };
  }
}

// --- ARCHIVE.ORG SEARCH ---
const searchArchiveOrg = async (title: string, year: string): Promise<string | null> => {
    try {
        // Construct query: title AND year AND mediatype:movies
        const query = `title:(${title}) AND year:(${year}) AND mediatype:(movies)`;
        const url = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(query)}&fl[]=identifier&rows=1&output=json`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.response && data.response.docs && data.response.docs.length > 0) {
            return data.response.docs[0].identifier;
        }
        return null;
    } catch (error) {
        console.error("Error searching Archive.org:", error);
        return null;
    }
};

// --- STRICT VIDEO SOURCE LOGIC ---
export const getVideoSource = async (movie: Movie): Promise<VideoSource> => {
    // STEP 1: Check Archive.org (Public Domain)
    if (movie.title && movie.year && movie.year !== 'N/A') {
        const archiveId = await searchArchiveOrg(movie.title, movie.year);
        if (archiveId) {
            return {
                type: 'public_domain',
                source: 'archive.org',
                videoUrl: `https://archive.org/embed/${archiveId}`,
                embedCode: `https://archive.org/embed/${archiveId}`
            };
        }
    }

    // STEP 2: Check for Official Full Content via TMDB (Proxy for Official Youtube)
    if (movie.tmdbId) {
        const videos = await fetchMovieVideos(movie.tmdbId, movie.year.length > 4 ? 'tv' : 'movie');
        
        // Look for "Feature" type which usually denotes a full movie or episode on TMDB
        // OR look for videos > 60mins (not directly available in standard video list, so we rely on type)
        const fullFeature = videos.find((vid: any) => 
            vid.site === 'YouTube' && 
            (vid.type === 'Feature' || vid.type === 'Full Movie')
        );

        if (fullFeature) {
             return {
                type: 'official_full',
                source: 'youtube',
                videoUrl: `https://www.youtube.com/watch?v=${fullFeature.key}`,
                embedCode: fullFeature.key
            };
        }

        // STEP 3: Fallback to Trailer
        const trailer = videos.find((vid: any) => vid.site === 'YouTube' && vid.type === 'Trailer') || 
                        videos.find((vid: any) => vid.site === 'YouTube');
        
        if (trailer) {
            return {
                type: 'trailer_only',
                source: 'tmdb',
                videoUrl: `https://www.youtube.com/watch?v=${trailer.key}`,
                embedCode: trailer.key,
                warningMessage: 'Full movie not available for free — showing trailer instead.'
            };
        }
    }

    // 4. Fallback / Nothing Legal Found
    return {
        type: 'trailer_only', 
        source: 'tmdb',
        videoUrl: '',
        warningMessage: 'No video content found.'
    };
};

// --- ENHANCED TMDB FEATURES FOR MODALS ---

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
        console.error("Error fetching credits", e);
        return { cast: [], director: '' };
    }
};

export const fetchSimilarMovies = async (id: string, type: 'movie' | 'tv' = 'movie'): Promise<Movie[]> => {
    try {
        const response = await fetch(`${BASE_URL}/${type}/${id}/similar?api_key=${API_KEY}&language=en-US&page=1`);
        const data = await response.json();
        return data.results.slice(0, 6).map(mapTmdbToMovie);
    } catch (e) {
        console.error("Error fetching similar", e);
        return [];
    }
};

export const fetchMovieDetails = async (id: string, type: 'movie' | 'tv' = 'movie'): Promise<Partial<Movie>> => {
    try {
        const response = await fetch(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=en-US`);
        const data = await response.json();
        return {
            duration: type === 'movie' ? `${Math.floor(data.runtime / 60)}h ${data.runtime % 60}m` : `${data.episode_run_time?.[0] || 45}m`,
            genre: data.genres.map((g: any) => g.name)
        };
    } catch (e) {
        return {};
    }
};

// --- BLOG GENERATOR ---
export const fetchRealBlogPosts = async (): Promise<BlogPost[]> => {
    try {
        const upcoming = await fetchUpcoming();
        const topMovies = upcoming.slice(0, 12);

        return topMovies.map((movie, index) => {
            // Generate deterministic fake data based on movie
            const type = index % 3 === 0 ? 'Review' : index % 3 === 1 ? 'News' : 'Preview';
            const titles = [
                `Why ${movie.title} is the Must-Watch Movie of the Year`,
                `Exclusive: Behind the Scenes of ${movie.title}`,
                `First Look: ${movie.title} Trailer Breakdown`,
                `${movie.title}: A Cinematic Masterpiece?`,
                `Interview with the stars of ${movie.title}`
            ];

            return {
                id: `blog-${movie.id}`,
                title: titles[index % titles.length],
                excerpt: `Dive deep into our comprehensive coverage of ${movie.title}. We explore the plot, the performances, and the stunning visuals that make this film a standout.`,
                content: `
                    <p><strong>${movie.title}</strong> is set to take the world by storm. In this exclusive article, we break down everything you need to know about this upcoming blockbuster.</p>
                    <h3>The Hype is Real</h3>
                    <p>${movie.description || 'The anticipation for this movie is palpable. Fans around the globe are waiting to see how the story unfolds.'}</p>
                    <p>With a stellar cast and a visionary director, expectations are high. Early screenings suggest that it delivers on every front, from heart-pounding action to emotional depth.</p>
                    <h3>Visual Spectacle</h3>
                    <p>The cinematography in ${movie.title} is nothing short of breathtaking. Every frame is a work of art, designed to immerse the audience in its unique world.</p>
                    <h3>Final Thoughts</h3>
                    <p>Mark your calendars for ${movie.year}. This is one cinematic event you do not want to miss.</p>
                `,
                image: movie.backdropUrl,
                date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                author: index % 2 === 0 ? 'Alex Reviewer' : 'Sarah Cinephile',
                tags: [type, ...movie.genre.slice(0, 2)]
            };
        });
    } catch (e) {
        console.error("Error fetching blog posts", e);
        return [];
    }
}
