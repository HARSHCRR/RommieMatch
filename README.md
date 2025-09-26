# RoomieMatch - Tinder-style Roommate Finder

A responsive, polished Next.js web application that replicates the swipe-first, card-based experience popularized by Tinder — but designed for discovering potential roommates. This is a **UI/UX-only prototype** with no backend required. All data is mocked/local.

## 🎯 Project Overview

RoomieMatch helps users discover compatible roommates through an intuitive swipe interface. Users can browse profiles, view detailed information, manage matches, and customize their own profile - all with smooth animations and modern design.

## ✨ Features

### Core Functionality
- **Swipe Deck**: Stacked cards with drag gestures and physics-based animations
- **Profile Cards**: Photo carousels, bio, interests, location, and metadata
- **Action Bar**: Like, dislike, super-like, and undo buttons
- **Profile Modal**: Full-screen profile details with photo gallery
- **Matches Page**: Grid view of mutual matches with search/filter
- **Profile Management**: Editable user profile with interests
- **Settings**: Preferences, privacy controls, and accessibility options
- **Onboarding**: Interactive tutorial for first-time users

### Interactions & Animations
- **Swipe Gestures**: Drag left/right with velocity thresholds and spring animations
- **Micro-interactions**: Heart pulse on like, star burst on super-like, card stack bounce
- **Smooth Transitions**: Framer Motion powered page transitions and modal animations
- **Photo Carousel**: Swipeable image galleries within profile cards
- **Keyboard Support**: Arrow keys for swiping, U for undo, Enter for profile view

### Accessibility
- **Keyboard Navigation**: Full keyboard support for all interactions
- **ARIA Labels**: Proper accessibility labels for screen readers
- **Reduced Motion**: Respects `prefers-reduced-motion` and includes toggle
- **Color Contrast**: AA compliant color schemes
- **Focus States**: Visible focus indicators for all interactive elements

## 🛠 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion
- **Gestures**: react-use-gesture + @react-spring/web
- **State Management**: Zustand
- **Icons**: Lucide React
- **Code Quality**: ESLint + Prettier

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd RoomMate-Finder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page (swipe deck)
│   ├── matches/           # Matches page
│   ├── profile/           # User profile page
│   └── settings/          # Settings page
├── components/            # Reusable components
│   ├── CardDeck/          # Main swipe deck container
│   ├── SwipeCard/         # Individual swipeable card
│   ├── ActionBar/         # Like/dislike action buttons
│   ├── Header/            # App header component
│   ├── ProfileModal/      # Full-screen profile modal
│   └── OnboardingModal/   # First-time user tutorial
├── lib/                   # Utilities and data
│   ├── mockData.ts        # Sample profiles and data
│   └── store.ts           # Zustand state management
└── styles/
    └── globals.css        # Global styles and Tailwind imports
```

## 🎮 How to Use

### Swiping
- **Swipe Right**: Like a profile
- **Swipe Left**: Pass on a profile
- **Tap Card**: View full profile details
- **Action Buttons**: Use the buttons below the cards for precise actions

### Keyboard Shortcuts
- **← (Left Arrow)**: Dislike current profile
- **→ (Right Arrow)**: Like current profile
- **U**: Undo last swipe action
- **Enter**: Open profile modal
- **Escape**: Close modals

### Navigation
- **Header Logo**: Return to home
- **Profile Icon**: View/edit your profile
- **Settings Icon**: Access settings and preferences

## 🧪 Testing Checklist

### Manual Testing Steps

1. **Swipe Functionality**
   - [ ] Swipe left/right with finger on mobile
   - [ ] Drag and release with mouse on desktop
   - [ ] Action buttons trigger card animations
   - [ ] Undo restores last card

2. **Profile Interactions**
   - [ ] Tap card opens profile modal
   - [ ] Swipe photos in gallery
   - [ ] Close modal with tap outside or ESC key

3. **Navigation**
   - [ ] All pages load correctly
   - [ ] Header navigation works
   - [ ] Back/forward browser buttons work

4. **Accessibility**
   - [ ] Keyboard navigation works
   - [ ] Screen reader compatibility
   - [ ] Reduced motion toggle functions
   - [ ] Color contrast meets standards

5. **Responsive Design**
   - [ ] Mobile-first layout works
   - [ ] Tablet view is functional
   - [ ] Desktop view shows centered cards

## 📊 Mock Data

The app includes 15 diverse sample profiles with:
- **Varied Interests**: cooking, gaming, yoga, fitness, music, etc.
- **Different Backgrounds**: students, professionals, artists, etc.
- **Realistic Bios**: 1-2 line descriptions
- **Placeholder Photos**: High-quality placeholder images
- **Location Data**: Distance in kilometers
- **Match Flags**: Some profiles marked as potential matches

### Data Structure
```typescript
interface Profile {
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
```

## 🎨 Design System

### Colors
- **Primary**: Blue (#3B82F6) for main actions
- **Success**: Green (#10B981) for likes
- **Danger**: Red (#EF4444) for dislikes
- **Neutral**: Gray scale for text and backgrounds

### Typography
- **Font**: Inter (Google Fonts)
- **Hierarchy**: Clear heading and body text sizes
- **Weight**: 300-700 range for different emphasis

### Components
- **Cards**: Rounded corners (2xl), subtle shadows
- **Buttons**: Rounded (xl), hover effects, consistent padding
- **Inputs**: Rounded (xl), focus states, proper spacing

## 🔧 Customization

### Adding New Profiles
Edit `src/lib/mockData.ts` to add more profiles:

```typescript
{
  id: 'u16',
  name: 'New User',
  age: 25,
  bio: 'Your bio here',
  college: 'University Name',
  interests: ['interest1', 'interest2'],
  photos: ['https://picsum.photos/seed/u16-1/600/800'],
  distanceKm: 1.5,
  match: false
}
```

### Modifying Animations
Adjust animation settings in components:
- **Swipe thresholds**: Modify in `SwipeCard.tsx`
- **Spring physics**: Update in `CardDeck.tsx`
- **Transition durations**: Change in Framer Motion components

### Styling Changes
- **Colors**: Update `tailwind.config.js`
- **Components**: Modify classes in component files
- **Global styles**: Edit `src/styles/globals.css`

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Other Platforms
- **Netlify**: Build command `npm run build`, publish directory `out`
- **GitHub Pages**: Use Next.js static export
- **Self-hosted**: Build and serve with `npm run build && npm run start`

## 📝 Development Notes

### State Management
- **Zustand Store**: Manages deck queue, history, matches, and current user
- **Local Storage**: Persists onboarding completion and user preferences
- **No Backend**: All data is client-side and resets on page refresh

### Performance
- **Image Optimization**: Uses placeholder services for fast loading
- **Lazy Loading**: Components load as needed
- **Animation Optimization**: Framer Motion handles GPU acceleration

### Browser Support
- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile**: iOS Safari, Chrome Mobile
- **Touch Events**: Full touch gesture support

## 🤝 Contributing

This is a UI prototype project. To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For questions or issues:
- Check the testing checklist above
- Review component documentation in code comments
- Ensure all dependencies are installed correctly

---

**Note**: This is a UI-only prototype. No real data is stored or transmitted. All profiles, matches, and user data are simulated for demonstration purposes.