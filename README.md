# <img src="src/assets/holidaze-logo-mini.png" width="20" /> Holidaze <img src="src/assets/holidaze-logo-mini.png" width="20" />

### An online marketplace for short and long homestays. You can both book venues or/and list one. This was my project exam 2025 (Noroff school of technology and digital media).

<p align="center">
  <img src="src/assets/holidaze-gif-preview.gif" width="300" />
</p>

## 📖 Description

Holidaze is a responsive and modern online marketplace for short and long homestays. The design is focused on accessability and minimalism (whitespace). Inspired by the popular websites today like Airbnb, booking.com, Finn.no and Trivago.

Altough i was inspired by Airbnb's many genius solution and UX, i was a bit dissapointed with some parts. On Holidaze, you will register and log in at the same page no matter if you are going to be a venue manager or customer that books trips. Same goes for the profile page - and - its very clear where to navigate. My trips or My venues. From my venues, you will find your customers. You will be naturally guided by this UX. This will make it a smooth experience for everyone.

My biggest focus with this project was to, as mentioned, make it smooth, fast and seamless.

Since this is a exam project, unfortunately the schools API didnt have everything set up for me to really make this a complete 10/10 product. Further down i will mention improvement (for myself and the API).

---

## 📋 Table of Contents

- [Features](#features)
- [Folder Structure](#folder-structure)
- [Technologies Used](#technologies-used)
- [Setup & Installation](#setup--installation)
- [Usage](#usage)
- [API Integration](#api-integration)
- [Improvements](#improvements)
- [Credits](#credits)
- [License](#license)

---

## 🌟 Features

✅ User Authentication (Login/Register)  
✅ Profile Management (bio, avatar, venues)  
✅ Venue Listings with images, description, and availability  
✅ Calendar-based booking system  
✅ Search, filter, and sort venues  
✅ Booking guests and history, with earnings calculation  
✅ Public profile viewing  
✅ Responsive design  
✅ Visual feedback (loaders, messages)  
✅ 404 - Not Found page

---

## 📁 Folder Structure

```bash
📦 project-exam-2
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Booking/
│   │   │   ├── BookingCalendar.jsx
│   │   │   ├── BookingsList.jsx
│   │   │   ├── BookingSummary.jsx
│   │   │   └── EditBookingModal.jsx
│   │   ├── Buttons/
│   │   │   ├── BackButton.jsx
│   │   │   ├── FavouritesButton.jsx
│   │   │   └── SearchButton.jsx
│   │   ├── Shared/
│   │   │   ├── Loaders/
│   │   │   │   ├── CompleteLoader.jsx
│   │   │   │   ├── HolidazeLoader.jsx
│   │   │   │   └── PublishedLoader.jsx
│   │   │   ├── Avatar.jsx
│   │   │   ├── ErrorMessage.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Header.jsx
│   │   │   └── Layout.jsx
│   │   ├── UserProfile/
│   │   │   ├── EditProfileModal.jsx
│   │   │   └── UserProfileInfo.jsx
│   │   └── Venue/
│   │       ├── MyVenueCard.jsx
│   │       ├── VenueCard.jsx
│   │       ├── VenueForm.jsx
│   │       ├── VenueImageGallery.jsx
│   │       └── VenueInfo.jsx
│   ├── hooks/
│   │   ├── useProfile.js
│   │   ├── useSingleVenue.js
│   │   ├── useUserBookings.js
│   │   ├── useUserVenues.js
│   │   ├── useVenueBookings.js
│   │   ├── useVenues.js
│   │   └── useVenueSearch.js
│   ├── pages/
│   │   ├── BookingConfirmationPage/
│   │   │   └── index.jsx
│   │   ├── CreateVenuePage/
│   │   │   └── index.jsx
│   │   ├── EditVenuePage/
│   │   │   └── index.jsx
│   │   ├── FavouritesPage/
│   │   │   └── index.jsx
│   │   ├── HomePage/
│   │   │   └── Home.jsx
│   │   ├── LoginRegisterPage/
│   │   │   └── index.jsx
│   │   ├── MyTripsPage/
│   │   │   └── index.jsx
│   │   ├── MyVenuesPage/
│   │   │   └── index.jsx
│   │   ├── NotFoundPage/
│   │   │   └── index.jsx
│   │   ├── ProfilePage/
│   │   │   └── index.jsx
│   │   ├── PublicProfilesPage/
│   │   │   └── index.jsx
│   │   ├── SinglePage/
│   │   │   └── index.jsx
│   │   └── VenuesBookingPage/
│   │       └── index.jsx
│   ├── stores/
│   │   ├── authStore.js
│   │   ├── favouritesStore.js
│   │   ├── filterStore.js
│   │   └── venueStore.js
│   ├── utils/
│   │   ├── categoryMatcher.js
│   │   ├── featured.js
│   │   ├── calendar.css
│   ├── index.css
│   └── main.jsx
├── .env
├── index.html
├── tailwind.config.js
├── vite.config.js
├── package.json
├── package-lock.json
└── README.md
```

---

## ⚙️ Technologies Used

- **React 19**
- **Tailwind CSS**
- **Vite**
- **Zustand** (state management)
- **React Router 7**
- **React Hook Form**
- **React Day Picker**
- **Swiper / Slick Carousel**
- **React Icons / Lucide Icons**

---

## 🚀 Setup & Installation

```bash
git clone https://github.com/yourusername/project-exam-2.git
cd project-exam-2

npm install

npm run dev        # Starts local dev server
npm run build      # Production build
Access locally at http://localhost:5173
```

## 💡 Usage

### Login & Register

- Register a user with a @stud.noroff.no email.

- Log in and access your profile, bookings, and venues.

### Managing Profile

- Add a profile image, update your bio.

- View your trips or venues you own.

### Booking

- Pick available dates from the calendar.

- Receive a confirmation after booking.

- Hosts can view past and upcoming bookings and calculate earnings.

### Listing a Venue

- Venue managers can create, edit, or delete listings.

- Venues include title, description, images, location, and pricing.

### Search & Explore

- Search venues using keywords or filters like location or category.

- Sort by newest, price, or featured.

## 🤖 API Integration

This app uses the Noroff API:

- Auth endpoints for login/register

- Profiles (private). Can update bio and avatar.

- Venues (CRUD)

- Bookings (CRUD)

Example base: https://v2.api.noroff.dev/holidaze

## 💭 Improvements

The API was offering random ratings for venues. It did not offer a proper system for real rating and reviews. So i decided to not have it in my project. There are also many "testing" listings from the API that does not look great for the website - which, "in real life", would been flagged/not allowed to upload. Possibility to contact/chat between venue managers and customers, bedrooms/bathrooms etc is something i wish was available in the API.

As for me, some info and about pages should be added in the future.

## 🙌 Credits

Author: Line Svensen (me)

Design: Tailwind CSS

State: Zustand

Date Tools: date-fns, react-day-picker

API: Noroff Holidaze API

Animations: Lottie

Illustrations: Flaticon

## 📄 License

This project is licensed under the MIT License.

Built as part of the Noroff Frontend Development Course – Project Exam 2
