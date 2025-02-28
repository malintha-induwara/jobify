# Jobify - Mobile Job Search Application

A modern **Mobile Job Search Platform** that allows users to search for jobs, save favorites, and apply directly from their mobile device. Built with React Native and Expo.

## Features

### 1. **Job Search**

- Search for jobs by title, company, or location
- Filter results by job type, experience level, and more
- View detailed job descriptions and requirements

### 2. **User Authentication**

- Create personal accounts
- Secure login with Supabase authentication
- Password recovery options

### 3. **Job Management**

- Save favorite jobs for later review
- Track application history
- Apply to jobs directly through the app


## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- Supabase account
- RapidAPI account (for JSearch API)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/jobify.git
   ```
2. Navigate to the project directory:
   ```bash
   cd jobify
   ```
3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Configuration

1. Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
2. Add your API keys and configuration values:
   ```
   EXPO_PUBLIC_RAPIDAPI_KEY=your_rapid_api_key
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Running the Application

1. Start the development server:
   ```bash
   npx expo start
   ```
2. Use the Expo Go app on your mobile device or an emulator to run the application

## Technology Stack

[![React Native](https://img.shields.io/badge/React_Native-black?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)

[![Expo](https://img.shields.io/badge/Expo-black?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)

[![NativeWind](https://img.shields.io/badge/NativeWind-black?style=for-the-badge&logo=tailwindcss&logoColor=38B2AC)](https://www.nativewind.dev/)

[![Redux](https://img.shields.io/badge/Redux-black?style=for-the-badge&logo=redux&logoColor=764ABC)](https://redux.js.org/)

[![Supabase](https://img.shields.io/badge/Supabase-black?style=for-the-badge&logo=supabase&logoColor=3ECF8E)](https://supabase.io/)

[![Lucide React](https://img.shields.io/badge/Lucide_React-black?style=for-the-badge&logo=lucide&logoColor=FF5C5C)](https://lucide.dev/)

## API Integration

Jobify uses the [JSearch API](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch) from RapidAPI to fetch real-time job listings from across the web. The API provides comprehensive job data including:

- Job descriptions
- Company information
- Salary details
- Location data
- Application links

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.

