# GrammarPath (React Native / Expo, TypeScript)
Implements the MVP slice from the spec: A1 level map, topic explanations, fill-in / multiple-choice / error-identification exercises,
immediate feedback, practice + checkpoint (80% to pass), progress tracking, weak-spot list, error boundary and storage fallbacks.

    npm install && npx expo start     # run
    npm test                          # unit + content tests
    npm run typecheck

Layers: `src/domain` (pure logic) → `src/data` (content + repository port) → `src/store.ts` → `src/screens.tsx`.
Add content in `src/data/content.ts` (units, topics, exercises); progress survives because IDs are stable.
Swap storage by implementing `ProgressRepository`.
Not yet built: A2-C2 content, sentence-construction and transformation exercises, spaced-repetition review tab, placement test.

## Build for Android
    npx expo start --android                      # run on emulator/phone (Expo Go)
    npm i -g eas-cli && eas login
    eas build -p android --profile preview        # installable .apk
    eas build -p android --profile production     # .aab for Google Play

## Get an APK without Expo account (GitHub Actions)
Push this folder to a new GitHub repo, open the **Actions** tab, run **Build Android APK**, then download `grammarpath-apk` from the run. Install the .apk on your phone (allow "install unknown apps").

## Review
Every answer schedules its exercise (1, 3, 7, 16, 35 days; a miss resets to 1). The Home screen shows how many are due; tap Review for a session of up to 20, oldest first.

## Placement test
Home > placement card. 4 questions per level, A1 upward, no feedback during the test. It stops at the first level scored under 70% and recommends starting there (stored as `placementLevel`); no progress is faked and all levels stay open.

## Navigation
Bottom tabs: Home (continue, review, placement), Path (levels), Review (due queue grouped by topic, badge shows count), Stats. Level, Topic and Session screens open above the tabs.
