
import { Movie, NavItem, Episode, NewsItem, SubscriptionPlan } from './types';

// Updated Nav items to reflect real routes and added Regions
export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/', hasDropdown: false },
  { label: 'Movies', href: '/movies', hasDropdown: true },
  { label: 'TV Shows', href: '/tv-shows', hasDropdown: true },
  { label: 'Regions', href: '#', hasDropdown: true }, // New Regions Dropdown
  { label: 'My List', href: '/my-list', hasDropdown: false },
  { label: 'Latest', href: '/latest', hasDropdown: false },
];

export const INDUSTRIES = [
    { id: 'hollywood', name: 'Hollywood', country: 'US', lang: 'en' },
    { id: 'bollywood', name: 'Bollywood', country: 'IN', lang: 'hi' },
    { id: 'korean', name: 'Korean', country: 'KR', lang: 'ko' },
    { id: 'japanese', name: 'Japanese', country: 'JP', lang: 'ja' },
    { id: 'indian', name: 'Indian (Regional)', country: 'IN', lang: '' },
];

export const MOVIE_GENRES = [
    { id: '28', name: 'Action' },
    { id: '12', name: 'Adventure' },
    { id: '16', name: 'Animation' },
    { id: '35', name: 'Comedy' },
    { id: '80', name: 'Crime' },
    { id: '99', name: 'Documentary' },
    { id: '18', name: 'Drama' },
    { id: '10751', name: 'Family' },
    { id: '14', name: 'Fantasy' },
    { id: '36', name: 'History' },
    { id: '27', name: 'Horror' },
    { id: '10402', name: 'Music' },
    { id: '9648', name: 'Mystery' },
    { id: '10749', name: 'Romance' },
    { id: '878', name: 'Sci-Fi' },
    { id: '53', name: 'Thriller' },
];

export const TV_GENRES = [
    { id: 'anime', name: 'Anime' },
    { id: '10759', name: 'Action & Adventure' },
    { id: '16', name: 'Animation' },
    { id: '35', name: 'Comedy' },
    { id: '80', name: 'Crime' },
    { id: '99', name: 'Documentary' },
    { id: '18', name: 'Drama' },
    { id: '10751', name: 'Family' },
    { id: '10762', name: 'Kids' },
    { id: '9648', name: 'Mystery' },
    { id: '10763', name: 'News' },
    { id: '10764', name: 'Reality' },
    { id: '10765', name: 'Sci-Fi & Fantasy' },
    { id: '10766', name: 'Soap' },
    { id: '10768', name: 'War & Politics' },
];

export const VIDEO_SOURCES = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
];

export const HERO_SLIDES: Movie[] = [
  {
    id: 'hero-1',
    title: 'American Made',
    year: '2017',
    genre: ['Comedy', 'Action'],
    duration: '1hr 55 mins',
    imageUrl: 'https://picsum.photos/seed/american/600/900',
    backdropUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1920&auto=format&fit=crop',
    description: 'Barry Seal, a TWA pilot, is recruited by the CIA to provide reconnaissance on the burgeoning communist threat in Central America.',
    isFeatured: true,
  }
];

export const POPULAR_MOVIES: Movie[] = [];
export const COMEDY_MOVIES: Movie[] = [];
export const TV_SERIES: Movie[] = [];

export const RECOMMENDATIONS: Movie[] = [
    { id: '201', title: 'Rec 1', year: '2020', genre: [], duration: '', imageUrl: 'https://picsum.photos/seed/rec1/300/160', backdropUrl: '' },
    { id: '202', title: 'Rec 2', year: '2020', genre: [], duration: '', imageUrl: 'https://picsum.photos/seed/rec2/300/160', backdropUrl: '' },
    { id: '203', title: 'Rec 3', year: '2020', genre: [], duration: '', imageUrl: 'https://picsum.photos/seed/rec3/300/160', backdropUrl: '' },
    { id: '204', title: 'Rec 4', year: '2020', genre: [], duration: '', imageUrl: 'https://picsum.photos/seed/rec4/300/160', backdropUrl: '' },
];

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
    {
        id: 'sub1',
        name: 'Basic',
        price: 'Free',
        period: 'forever',
        features: ['720p Streaming', 'Ads supported', 'Access to selected movies'],
        color: 'gray'
    },
    {
        id: 'sub2',
        name: 'Premium',
        price: '$12.99',
        period: 'per month',
        features: ['4K Ultra HD', 'No Ads', 'Offline Downloads', 'Early Access'],
        isPopular: true,
        color: 'blue'
    },
    {
        id: 'sub3',
        name: 'Diamond',
        price: '$99.99',
        period: 'per year',
        features: ['8K Support', 'VR Experience', 'Private Screenings', 'Exclusive Merch'],
        color: 'purple'
    }
];
