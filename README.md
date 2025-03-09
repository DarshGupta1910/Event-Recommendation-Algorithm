# Event Recommendation System

## Recommendation Algorithm Overview

| Test Case                  | Key Factor in Recommendations           | Handling in Algorithm                                      |
|----------------------------|----------------------------------------|------------------------------------------------------------|
| User with 1 attended event | Content-based & Preference-based filtering | Uses attended events + preferences to rank similar ones  |
| User with no history       | Preference-based filtering             | Finds the most relevant events using user preferences     |
| User with no preferences   | Content-based filtering                | Recommends events similar to what the user attended       |
| Completely new user        | Location & Popularity-based filtering  | Recommends popular events near the user's location       |

## Test Results

### Loading Test Data
```
Loading test data...
Loaded 10000 users and 2000 events
```

### Distance Calculation Tests
```
--- TESTING DISTANCE CALCULATION ---
Test 1: Distance between points: 3935.75 km
  Expected ~3935 km. Result: PASS ✓
Test 2: Distance between points: 343.56 km
  Expected ~334 km. Result: PASS ✓
Test 3: Distance between points: 0.00 km
  Expected ~0 km. Result: PASS ✓
```

### Recommendation Algorithm Tests

#### Test Case 1: Normal User with 1 Attended Event
```
User ID: user_0
Preferences: politics, food, finance
Previously attended events:
  - event_1926: Event 1926 (Categories: movies, technology)
Normal user recommendation time: 2.104ms
Top recommendations:
  1. Event 459 (Categories: politics, food, finance)
  2. Event 1037 (Categories: food, family, finance)
  3. Event 849 (Categories: dance, food, finance)
  4. Event 262 (Categories: fashion, food, finance)
  5. Event 1191 (Categories: finance, science, food)
```

#### Test Case 2: User with No Attended Events
```
User ID: user_1
Preferences: travel, business
No history user recommendation time: 2.06ms
Top recommendations:
  1. Event 1619 (Categories: travel, business, health)
  2. Event 13 (Categories: business, travel)
  3. Event 1942 (Categories: travel, business, gaming)
  4. Event 1381 (Categories: travel, fashion, business)
  5. Event 370 (Categories: business, health, travel)
```

#### Test Case 3: User with No Preferences
```
User ID: user_2
Attended events: 1
No preferences user recommendation time: 0.892ms
Top recommendations:
  1. Event 1176 (Categories: education, politics, family)
  2. Event 1249 (Categories: fashion, literature, dance)
  3. Event 1018 (Categories: music, health, technology)
  4. Event 1753 (Categories: music, movies)
  5. Event 1861 (Categories: literature)
```

#### Test Case 4: Completely New User
```
User location: (40.7128, -74.006)
New user recommendation time: 0.538ms
Top recommendations:
  1. Event 330 (Categories: technology, health, music)
  2. Event 89 (Categories: music, education)
  3. Event 718 (Categories: business, politics, dance)
  4. Event 610 (Categories: health, travel)
  5. Event 721 (Categories: education, fashion, finance)
