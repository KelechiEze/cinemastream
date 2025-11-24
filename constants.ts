
import { Movie, NavItem, Episode, NewsItem, SubscriptionPlan } from './types';

// Updated Nav items to reflect real routes
export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/', hasDropdown: false },
  { label: 'Movies', href: '/movies', hasDropdown: true },
  { label: 'TV Shows', href: '/tv-shows', hasDropdown: true },
  { label: 'Latest', href: '/latest', hasDropdown: false },
  { label: 'Blog', href: '/blog', hasDropdown: false },
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
  },
  {
    id: 'hero-2',
    title: 'Life of Hollywood',
    year: '2017',
    genre: ['Drama', 'Documentary'],
    duration: '2hr 15 mins',
    imageUrl: 'https://picsum.photos/seed/hollywood/600/900',
    backdropUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1920&auto=format&fit=crop',
    description: 'Dive behind the velvet ropes into the glitz, glamour, and grit of the movie industry, exposing the untold stories of fame, fortune, and the price of stardom in a city that never sleeps.',
    isFeatured: true,
  },
  {
    id: 'hero-3',
    title: 'Black Entertainment',
    year: '2017',
    genre: ['Music', 'Cultural'],
    duration: '2hr 10 mins',
    imageUrl: 'https://picsum.photos/seed/blackent/600/900',
    backdropUrl: 'https://images.unsplash.com/photo-1514525253440-b393452086a9?q=80&w=1920&auto=format&fit=crop',
    description: 'A groundbreaking showcase of culture, music, and rhythm that defines a generation, featuring exclusive behind-the-scenes footage and electric performances from top artists around the globe.',
    isFeatured: true,
  },
  {
    id: 'hero-4',
    title: 'Dragon Castle',
    year: '2017',
    genre: ['Fantasy', 'Adventure'],
    duration: '2hr 3 mins',
    imageUrl: 'https://picsum.photos/seed/dragon/600/900',
    backdropUrl: 'https://images.unsplash.com/photo-1599739362312-8e4836988b00?q=80&w=1920&auto=format&fit=crop',
    description: 'In a kingdom forgotten by time, a young warrior must breach the impenetrable fortress of the Dragon Lord to reclaim a stolen artifact that holds the power to save her people from eternal winter.',
    isFeatured: true,
  },
  {
    id: 'hero-5',
    title: 'Spider-Man',
    year: '2018',
    genre: ['Action', 'Superhero'],
    duration: '2hr 14 mins',
    imageUrl: 'https://picsum.photos/seed/spidey/600/900',
    backdropUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?q=80&w=1920&auto=format&fit=crop',
    description: 'Peter Parker returns home to live with his Aunt May and is mentored by Tony Stark, but he must soon put his powers to the test when the evil Vulture emerges to threaten everything he holds dear.',
    isFeatured: true,
  }
];

export const BANNER_MOVIE: Movie = {
    id: 'banner-1',
    title: 'Delta Bravo',
    year: '2017',
    genre: ['Action', 'History'],
    duration: '2hr 15mins',
    imageUrl: '',
    backdropUrl: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?q=80&w=1920&auto=format&fit=crop',
    description: 'Strange black entity from another world bonds with Peter Parker and causes inner turmoil as he contends with new villains, temptations, and revenge.',
};

export const COMEDY_MOVIES: Movie[] = [
  {
    id: 'c1',
    title: 'War for the Planet',
    year: '2017',
    genre: ['Action', 'Adventure'],
    duration: '2h 20m',
    imageUrl: 'https://picsum.photos/seed/warplanet/300/450',
    backdropUrl: '',
  },
  {
    id: 'c2',
    title: 'Renegades',
    year: '2018',
    genre: ['Action', 'Adventure'],
    duration: '1h 45m',
    imageUrl: 'https://picsum.photos/seed/renegades/300/450',
    backdropUrl: '',
  },
  {
    id: 'c3',
    title: 'My Generation',
    year: '2018',
    genre: ['Action', 'Docu'],
    duration: '1h 30m',
    imageUrl: 'https://picsum.photos/seed/generation/300/450',
    backdropUrl: '',
  },
  {
    id: 'c4',
    title: 'Mary Shelley',
    year: '2017',
    genre: ['Action', 'Bio'],
    duration: '2h 00m',
    imageUrl: 'https://picsum.photos/seed/mary/300/450',
    backdropUrl: '',
  },
  {
    id: 'c5',
    title: 'Love, Simon',
    year: '2018',
    genre: ['Action', 'Romance'],
    duration: '1h 50m',
    imageUrl: 'https://picsum.photos/seed/simon/300/450',
    backdropUrl: '',
    isFeatured: true,
  },
  {
    id: 'c6',
    title: 'Gnome Alone',
    year: '2017',
    genre: ['Action', 'Animation'],
    duration: '1h 25m',
    imageUrl: 'https://picsum.photos/seed/gnome/300/450',
    backdropUrl: '',
    isFeatured: true,
  },
   {
    id: 'c7',
    title: 'Game Night',
    year: '2018',
    genre: ['Comedy', 'Crime'],
    duration: '1h 40m',
    imageUrl: 'https://picsum.photos/seed/gamenight/300/450',
    backdropUrl: '',
  },
];


export const POPULAR_MOVIES: Movie[] = [
  {
    id: '101',
    title: 'The Convenient Groom',
    year: '2016',
    genre: ['Action', 'Adventure'],
    duration: '1h 30m',
    imageUrl: 'https://picsum.photos/seed/groom/400/600',
    backdropUrl: '',
    isFeatured: true,
  },
  {
    id: '102',
    title: 'Paradigm Lost',
    year: '2017',
    genre: ['Action', 'Docu'],
    duration: '1h 45m',
    imageUrl: 'https://picsum.photos/seed/paradigm/400/600',
    backdropUrl: '',
    isFeatured: true,
  },
  {
    id: '103',
    title: 'Pacific Rim: Uprising',
    year: '2018',
    genre: ['Action', 'Sci-Fi'],
    duration: '2h 10m',
    imageUrl: 'https://picsum.photos/seed/pacific/400/600',
    backdropUrl: '',
  },
  {
    id: '104',
    title: 'The Sure Thing',
    year: '2018',
    genre: ['Action', 'Sport'],
    duration: '1h 50m',
    imageUrl: 'https://picsum.photos/seed/surething/400/600',
    backdropUrl: '',
  },
  {
    id: '105',
    title: 'Take Shelter',
    year: '2016',
    genre: ['Action', 'Family'],
    duration: '2h 00m',
    imageUrl: 'https://picsum.photos/seed/shelter/400/600',
    backdropUrl: '',
    isFeatured: true,
  },
  {
    id: '106',
    title: 'Peaceful Warrior',
    year: '2008',
    genre: ['Action', 'Adventure'],
    duration: '2h 00m',
    imageUrl: 'https://picsum.photos/seed/warrior/400/600',
    backdropUrl: '',
  },
  {
    id: '107',
    title: 'Bpm',
    year: '2018',
    genre: ['Action', 'Drama'],
    duration: '2h 20m',
    imageUrl: 'https://picsum.photos/seed/bpm/400/600',
    backdropUrl: '',
  },
];

export const TV_SERIES: Movie[] = [
  {
    id: 'tv1',
    title: 'Chicago Med',
    year: '2015 - 2016',
    genre: ['Action', 'Drama'],
    duration: '',
    imageUrl: 'https://picsum.photos/seed/chicago/400/225',
    backdropUrl: '',
  },
  {
    id: 'tv2',
    title: 'The Last Man on the earth',
    year: '2015 - 2016',
    genre: ['Action', 'Comedy', 'Drama'],
    duration: '',
    imageUrl: 'https://picsum.photos/seed/lastman/400/225',
    backdropUrl: '',
  },
  {
    id: 'tv3',
    title: 'Unbreakable Kimmy Schmidt',
    year: '2015 - 2016',
    genre: ['Comedy', 'Drama'],
    duration: '',
    imageUrl: 'https://picsum.photos/seed/kimmy/400/225',
    backdropUrl: '',
  },
  {
    id: 'tv4',
    title: 'House of cards',
    year: '2013 - 2015',
    genre: ['Action', 'Drama'],
    duration: '',
    imageUrl: 'https://picsum.photos/seed/hoc/400/225',
    backdropUrl: '',
  },
  {
    id: 'tv5',
    title: 'Grey\'s anatomy',
    year: '2005 - 2005',
    genre: ['Drama', 'Romance'],
    duration: '',
    imageUrl: 'https://picsum.photos/seed/grey/400/225',
    backdropUrl: '',
  },
  {
    id: 'tv6',
    title: 'Dom grozy(Peeny Dreadful)',
    year: '2014 - 2015',
    genre: ['Drama', 'Fantasy'],
    duration: '',
    imageUrl: 'https://picsum.photos/seed/dom/400/225',
    backdropUrl: '',
  },
  {
    id: 'tv7',
    title: 'Cardinal',
    year: '2017 - 2018',
    genre: ['Crime', 'Drama'],
    duration: '',
    imageUrl: 'https://picsum.photos/seed/cardinal/400/225',
    backdropUrl: '',
  },
  {
    id: 'tv8',
    title: 'Orange is the New black',
    year: '2013 - 2014',
    genre: ['Comedy', 'Crime'],
    duration: '',
    imageUrl: 'https://picsum.photos/seed/orange/400/225',
    backdropUrl: '',
  },
  {
    id: 'tv9',
    title: 'Narcos',
    year: '2015 - 2016',
    genre: ['Bio', 'Crime'],
    duration: '',
    imageUrl: 'https://picsum.photos/seed/narcos/400/225',
    backdropUrl: '',
  },
  {
    id: 'tv10',
    title: 'Better Call Saul',
    year: '2015 - 2016',
    genre: ['Crime', 'Drama'],
    duration: '',
    imageUrl: 'https://picsum.photos/seed/saul/400/225',
    backdropUrl: '',
  }
];

export const SEASON_EPISODES: Episode[] = [
  { id: 'e1', number: 'S05E01', title: 'The Departed Part 1', imageUrl: 'https://picsum.photos/seed/e1/300/170' },
  { id: 'e2', number: 'S05E02', title: 'The Departed Part 2', imageUrl: 'https://picsum.photos/seed/e2/300/170' },
  { id: 'e3', number: 'S05E03', title: 'Homeland', imageUrl: 'https://picsum.photos/seed/e3/300/170' },
  { id: 'e4', number: 'S05E04', title: 'The Plan', imageUrl: 'https://picsum.photos/seed/e4/300/170' },
  { id: 'e5', number: 'S05E05', title: 'The Prisoner', imageUrl: 'https://picsum.photos/seed/e5/300/170' },
];


export const RECOMMENDATIONS: Movie[] = [
    { id: '201', title: 'Rec 1', year: '2020', genre: [], duration: '', imageUrl: 'https://picsum.photos/seed/rec1/300/160', backdropUrl: '' },
    { id: '202', title: 'Rec 2', year: '2020', genre: [], duration: '', imageUrl: 'https://picsum.photos/seed/rec2/300/160', backdropUrl: '' },
    { id: '203', title: 'Rec 3', year: '2020', genre: [], duration: '', imageUrl: 'https://picsum.photos/seed/rec3/300/160', backdropUrl: '' },
    { id: '204', title: 'Rec 4', year: '2020', genre: [], duration: '', imageUrl: 'https://picsum.photos/seed/rec4/300/160', backdropUrl: '' },
];

export const CONTINUE_WATCHING: Movie[] = [
    {
        id: 'cw1',
        title: 'Spider-Man: Homecoming',
        year: '2018',
        genre: ['Action'],
        duration: '2h 14m',
        imageUrl: 'https://picsum.photos/seed/spidey/300/450',
        backdropUrl: '',
        progress: 45 // 45% watched
    },
    {
        id: 'cw2',
        title: 'Vikings: Valhalla',
        year: '2020',
        genre: ['Action', 'History'],
        duration: '45m',
        imageUrl: 'https://picsum.photos/seed/vikings/300/450',
        backdropUrl: '',
        progress: 80
    },
    {
        id: 'cw3',
        title: 'Black Mirror: Bandersnatch',
        year: '2019',
        genre: ['Sci-Fi'],
        duration: '1h 10m',
        imageUrl: 'https://picsum.photos/seed/blackmirror/300/450',
        backdropUrl: '',
        progress: 15
    }
];

export const WATCHLIST: Movie[] = [
    {
        id: 'wl1',
        title: 'Inception',
        year: '2010',
        genre: ['Sci-Fi'],
        duration: '2h 28m',
        imageUrl: 'https://picsum.photos/seed/inception/300/450',
        backdropUrl: ''
    },
    {
        id: 'wl2',
        title: 'Interstellar',
        year: '2014',
        genre: ['Sci-Fi'],
        duration: '2h 49m',
        imageUrl: 'https://picsum.photos/seed/interstellar/300/450',
        backdropUrl: ''
    },
    {
        id: 'wl3',
        title: 'The Dark Knight',
        year: '2008',
        genre: ['Action'],
        duration: '2h 32m',
        imageUrl: 'https://picsum.photos/seed/darkknight/300/450',
        backdropUrl: ''
    },
     {
        id: 'wl4',
        title: 'Dune',
        year: '2021',
        genre: ['Sci-Fi'],
        duration: '2h 35m',
        imageUrl: 'https://picsum.photos/seed/dune/300/450',
        backdropUrl: ''
    }
];

export const UPCOMING_NEWS: NewsItem[] = [
    {
        id: 'n1',
        title: 'The Matrix: Rebirth',
        date: 'Coming Dec 2024',
        imageUrl: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?q=80&w=600&auto=format&fit=crop',
        description: 'The code is evolving. Join the next chapter of the simulation.',
        type: 'Premiere'
    },
    {
        id: 'n2',
        title: 'Cyberpunk Edgerunners S2',
        date: 'Available for Pre-order',
        imageUrl: 'https://images.unsplash.com/photo-1515630278258-407f66498911?q=80&w=600&auto=format&fit=crop',
        description: 'Return to Night City with exclusive pre-order bonuses including digital artbook.',
        type: 'Event'
    },
    {
        id: 'n3',
        title: 'Space Odyssey Remastered',
        date: 'Oct 24, 2024',
        imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=600&auto=format&fit=crop',
        description: 'Experience the classic in 8K resolution. Exclusive to VIP members.',
        type: 'Update'
    }
];

export const PREORDER_MOVIES: Movie[] = [
    {
        id: 'po1',
        title: 'Avatar 3: Fire and Ash',
        year: '2025',
        genre: ['Sci-Fi'],
        duration: '3h 10m',
        imageUrl: 'https://picsum.photos/seed/avatar3/300/450',
        backdropUrl: '',
        price: '$19.99'
    },
    {
        id: 'po2',
        title: 'Avengers: Secret Wars',
        year: '2026',
        genre: ['Action'],
        duration: '2h 50m',
        imageUrl: 'https://picsum.photos/seed/avengers/300/450',
        backdropUrl: '',
        price: '$24.99'
    }
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

export const BLOG_POSTS = [
    {
        id: 'b1',
        title: 'Top 10 Hidden Gems of 2024',
        excerpt: 'Discover the movies that flew under the radar but deserve your attention.',
        image: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=600&auto=format&fit=crop',
        date: 'Oct 15, 2024',
        author: 'Alex Reviewer'
    },
    {
        id: 'b2',
        title: 'The Future of Streaming VR',
        excerpt: 'How Virtual Reality is changing the way we consume cinematic content.',
        image: 'https://images.unsplash.com/photo-1622979135228-5b1ed37a0167?q=80&w=600&auto=format&fit=crop',
        date: 'Oct 12, 2024',
        author: 'Sarah Tech'
    },
    {
        id: 'b3',
        title: 'Interview with Director Nolan',
        excerpt: 'Exclusive insights into the making of his latest sci-fi masterpiece.',
        image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop',
        date: 'Oct 08, 2024',
        author: 'John Doe'
    }
];