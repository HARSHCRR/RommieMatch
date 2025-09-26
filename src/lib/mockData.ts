export interface Profile {
  id: string;
  name: string;
  age: number;
  bio: string;
  college?: string;
  company?: string;
  interests: string[];
  photos: string[];
  distanceKm: number;
  match?: boolean;
}

export const mockProfiles: Profile[] = [
  {
    id: 'u1',
    name: 'Aisha',
    age: 21,
    bio: 'Comp-sci student who loves cooking and weekend hikes.',
    college: 'NIT Raipur',
    interests: ['cooking', 'hiking', 'Ghibli movies', 'early-riser'],
    photos: [
      'https://picsum.photos/seed/u1-1/600/800',
      'https://picsum.photos/seed/u1-2/600/800',
      'https://picsum.photos/seed/u1-3/600/800'
    ],
    distanceKm: 2.3,
    match: false
  },
  {
    id: 'u2',
    name: 'Raj',
    age: 24,
    bio: 'Software engineer, night owl, loves gaming and anime.',
    company: 'TechCorp',
    interests: ['gaming', 'anime', 'night-owl', 'coding'],
    photos: [
      'https://picsum.photos/seed/u2-1/600/800',
      'https://picsum.photos/seed/u2-2/600/800'
    ],
    distanceKm: 1.8,
    match: true
  },
  {
    id: 'u3',
    name: 'Priya',
    age: 22,
    bio: 'Med student, vegetarian, loves yoga and meditation.',
    college: 'AIIMS Delhi',
    interests: ['yoga', 'meditation', 'vegetarian', 'neat-freak'],
    photos: [
      'https://picsum.photos/seed/u3-1/600/800',
      'https://picsum.photos/seed/u3-2/600/800',
      'https://picsum.photos/seed/u3-3/600/800',
      'https://picsum.photos/seed/u3-4/600/800'
    ],
    distanceKm: 3.1,
    match: false
  },
  {
    id: 'u4',
    name: 'Arjun',
    age: 26,
    bio: 'Marketing professional, fitness enthusiast, loves traveling.',
    company: 'Digital Marketing Co',
    interests: ['fitness', 'travel', 'photography', 'social'],
    photos: [
      'https://picsum.photos/seed/u4-1/600/800',
      'https://picsum.photos/seed/u4-2/600/800'
    ],
    distanceKm: 4.2,
    match: true
  },
  {
    id: 'u5',
    name: 'Sneha',
    age: 23,
    bio: 'Graphic designer, creative soul, loves art galleries and coffee.',
    company: 'Creative Studio',
    interests: ['art', 'coffee', 'design', 'museums'],
    photos: [
      'https://picsum.photos/seed/u5-1/600/800',
      'https://picsum.photos/seed/u5-2/600/800',
      'https://picsum.photos/seed/u5-3/600/800'
    ],
    distanceKm: 1.5,
    match: false
  },
  {
    id: 'u6',
    name: 'Vikram',
    age: 25,
    bio: 'Data scientist, loves reading sci-fi and playing chess.',
    company: 'DataTech Solutions',
    interests: ['reading', 'chess', 'data-science', 'quiet'],
    photos: [
      'https://picsum.photos/seed/u6-1/600/800',
      'https://picsum.photos/seed/u6-2/600/800'
    ],
    distanceKm: 2.8,
    match: false
  },
  {
    id: 'u7',
    name: 'Kavya',
    age: 21,
    bio: 'Dance student, loves Bollywood movies and street food.',
    college: 'Dance Academy',
    interests: ['dance', 'bollywood', 'street-food', 'music'],
    photos: [
      'https://picsum.photos/seed/u7-1/600/800',
      'https://picsum.photos/seed/u7-2/600/800',
      'https://picsum.photos/seed/u7-3/600/800'
    ],
    distanceKm: 3.5,
    match: true
  },
  {
    id: 'u8',
    name: 'Rohan',
    age: 27,
    bio: 'Chef, loves experimenting with fusion cuisine and wine tasting.',
    company: 'Fine Dining Restaurant',
    interests: ['cooking', 'wine', 'fusion-cuisine', 'food-blogging'],
    photos: [
      'https://picsum.photos/seed/u8-1/600/800',
      'https://picsum.photos/seed/u8-2/600/800'
    ],
    distanceKm: 2.1,
    match: false
  },
  {
    id: 'u9',
    name: 'Isha',
    age: 24,
    bio: 'Environmental activist, loves nature walks and sustainable living.',
    company: 'Green Earth NGO',
    interests: ['environment', 'nature', 'sustainability', 'activism'],
    photos: [
      'https://picsum.photos/seed/u9-1/600/800',
      'https://picsum.photos/seed/u9-2/600/800',
      'https://picsum.photos/seed/u9-3/600/800'
    ],
    distanceKm: 1.9,
    match: false
  },
  {
    id: 'u10',
    name: 'Aditya',
    age: 23,
    bio: 'Musician, plays guitar and loves indie music festivals.',
    college: 'Music Conservatory',
    interests: ['music', 'guitar', 'indie', 'festivals'],
    photos: [
      'https://picsum.photos/seed/u10-1/600/800',
      'https://picsum.photos/seed/u10-2/600/800'
    ],
    distanceKm: 3.8,
    match: true
  },
  {
    id: 'u11',
    name: 'Meera',
    age: 22,
    bio: 'Psychology student, loves books and deep conversations.',
    college: 'Psychology University',
    interests: ['psychology', 'books', 'deep-talks', 'therapy'],
    photos: [
      'https://picsum.photos/seed/u11-1/600/800',
      'https://picsum.photos/seed/u11-2/600/800',
      'https://picsum.photos/seed/u11-3/600/800'
    ],
    distanceKm: 2.6,
    match: false
  },
  {
    id: 'u12',
    name: 'Karan',
    age: 26,
    bio: 'Startup founder, loves networking and trying new restaurants.',
    company: 'Tech Startup',
    interests: ['entrepreneurship', 'networking', 'restaurants', 'business'],
    photos: [
      'https://picsum.photos/seed/u12-1/600/800',
      'https://picsum.photos/seed/u12-2/600/800'
    ],
    distanceKm: 1.2,
    match: false
  },
  {
    id: 'u13',
    name: 'Divya',
    age: 25,
    bio: 'Fashion designer, loves vintage shopping and art exhibitions.',
    company: 'Fashion House',
    interests: ['fashion', 'vintage', 'art', 'shopping'],
    photos: [
      'https://picsum.photos/seed/u13-1/600/800',
      'https://picsum.photos/seed/u13-2/600/800',
      'https://picsum.photos/seed/u13-3/600/800'
    ],
    distanceKm: 4.1,
    match: true
  },
  {
    id: 'u14',
    name: 'Rahul',
    age: 24,
    bio: 'Sports journalist, loves cricket and adventure sports.',
    company: 'Sports Media',
    interests: ['cricket', 'adventure-sports', 'journalism', 'sports'],
    photos: [
      'https://picsum.photos/seed/u14-1/600/800',
      'https://picsum.photos/seed/u14-2/600/800'
    ],
    distanceKm: 2.9,
    match: false
  },
  {
    id: 'u15',
    name: 'Ananya',
    age: 23,
    bio: 'Language teacher, loves learning new languages and cultures.',
    company: 'Language Institute',
    interests: ['languages', 'cultures', 'teaching', 'travel'],
    photos: [
      'https://picsum.photos/seed/u15-1/600/800',
      'https://picsum.photos/seed/u15-2/600/800',
      'https://picsum.photos/seed/u15-3/600/800'
    ],
    distanceKm: 3.3,
    match: false
  }
];

// Mock current user profile
export const mockCurrentUser: Profile = {
  id: 'current-user',
  name: 'You',
  age: 24,
  bio: 'Looking for a compatible roommate who shares similar interests and lifestyle.',
  college: 'Local University',
  interests: ['music', 'cooking', 'early-riser', 'neat-freak'],
  photos: [
    'https://picsum.photos/seed/current-user-1/600/800',
    'https://picsum.photos/seed/current-user-2/600/800'
  ],
  distanceKm: 0,
  match: false
};
