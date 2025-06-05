# SFP - Search For Places

SFP designed for discovering places with real-time search suggestions, interactive maps, and a persistent history of selected locations, featuring a clean UI.

## ✨ Features

* **Welcome Screen:** A user-friendly introductory screen with a "Get Started" button.
* **Location Permissions:** Robust handling of location permissions, guiding users to settings if necessary.
* **Tab Navigation:** Intuitive bottom tab navigation for "Home" (Search) and "History" sections.
* **Real-time Place Search:**
    * Powered by the **Google Maps Places API** for accurate, real-time suggestions.
    * Suggestions displayed in a list.
* **Interactive Map View:**
    * Upon selecting a place, navigate to a detailed view showing the location on an interactive **Google Map**.
    * Displays a marker for the selected place.
* **Place Details:** Presents relevant information about the selected place, including:
    * Place Name
    * Address
    * Phone Number (if available)
    * Website (if available)
    * Rating and User Reviews (if available)
* **Search History:**
    * Automatically records all places a user has clicked on from the search suggestions.
    * **Persistent Storage:** History data is saved locally using for a seamless user experience across sessions.
    * Allows revisiting previously searched locations from the History tab.
    * **"Clear History" Button:** Provides an option to clear all saved search history with a confirmation prompt.
* **Consistent Dark Theme:** A cohesive user interface with a dark background, vibrant accents, and clean typography, inspired by Modern's design.


## 🚀 Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

Before you begin, ensure you have the following installed:

* **Node.js** (>=18 LTS version recommended)
* **npm** or **Yarn** 
* **React Native CLI:**
* **Xcode** (for iOS development, from Mac App Store)
* **Android Studio** (for Android development, with Android SDK and Emulator configured)


### 🔑 Google Cloud API Keys Setup (Crucial!)

This application uses Google Maps Platform APIs. You need to obtain several API keys and configure them correctly.

1.  **Google Cloud Project Setup:**
    * Go to the [Google Cloud Console](https://console.cloud.google.com/).
    * Create a new project or select an existing one.
    * Enable a **billing account** for your project. (Google Maps Platform APIs require a billing account, even for free tier usage.)

2.  **Enable APIs:**
    * In the Google Cloud Console, navigate to `APIs & Services > Library`.
    * Search for and **Enable** the following APIs:
        * `Places API (New)` (for search suggestions and place details)
        * `Maps SDK for Android`
        * `Maps SDK for iOS`

3.  **Go To API & Services:**
    * Click `+ CREATE CREDENTIALS > API key`.
    * Copy this key.

### API Key Configuration in The Project

**0. (Fastest) Open the project in VS code or any other IDE and Search for phrase `enter-your-api-key-here` in overall projct and just replace it with your API key**

## For Longer way 

**1. `key.ts` file from sfp/src/constants:**

* Update `GOOGLE_API_KEY` with your actual key.

**2. iOS Native Configuration (`ios/sfp/AppDelegate.swift`):**

* Open your Xcode project (`ios/sfp.xcworkspace`).
* Navigate to `ios/sfp/AppDelegate.swift`.
* Locate the `application(_:didFinishLaunchingWithOptions:)` method and modify the `GMSServices.provideAPIKey` line:

    ```swift
    import GoogleMaps // Ensure this import is present

    // ... other code ...

    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
    ) -> Bool {
        GMSServices.provideAPIKey("YOUR_IOS_MAPS_SDK_API_KEY_HERE") // <-- Add/Update this line
        // ... rest of file ...
        return true
    }
    ```
    (Replace `YOUR_IOS_MAPS_SDK_API_KEY_HERE` with the actual API key for Maps SDKs).

**3. Android Native Configuration (`android/app/src/main/AndroidManifest.xml`):**

* Open `android/app/src/main/AndroidManifest.xml`.
* Locate the `<application>` tag and ensure it contains the `meta-data` tag for the Google Maps API key:

    ```xml
    <application
        android:name=".MainApplication"
        android:label="@string/app_name"
        android:icon="@mipmap/ic_launcher"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:allowBackup="false"
        android:theme="@style/AppTheme">

        <meta-data
            android:name="com.google.android.geo.API_KEY"
            android:value="YOUR_ANDROID_MAPS_SDK_API_KEY_HERE"/> </application>
    ```
    (Replace `YOUR_ANDROID_MAPS_SDK_API_KEY_HERE` with the actual API key for Maps SDKs restricted to Android).


### Installation

1.  **Clone the repository:**
    ```bash
    git clone git@github.com:sobankhanlodhi/sfp-search-for-places.git
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the App

After configuring API keys, you need to clean and rebuild the native projects.

1.  **Stop Metro Bundler** if it's running (`Ctrl + C` or `Cmd + C` in the terminal).

2.  **Run instructions for Android:**
  * Have an Android emulator running (quickest way to get started), or a device connected.
    ```bash
    cd sfp
     ```
    ```bash 
    npm run android
    ```
3. **Run instructions for iOS:**
   ```bash 
    cd sfp/ios
    ```
  * Install Cocoapods
    ```bash 
    bundle install # you need to run this only once in your project.
    ```
  * Pod install 
    ```bash 
     bundle exec pod install
    ```

  * Start metro 
    ```bash 
     npm run start
    ```
  
  * Open your Xcode project (`ios/sfp.xcworkspace`)
   and Hit the Run button

---
