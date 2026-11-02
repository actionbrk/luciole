plugins {
    alias(libs.plugins.android.application)
}

android {
    namespace = "com.example.luciole"
    compileSdk {
        version = release(36) {
            minorApiLevel = 1
        }
    }

    defaultConfig {
        applicationId = "com.example.luciole"
        minSdk = 36
        targetSdk = 36
        versionCode = 1
        versionName = "1.0"

    }

    // Release signing key, provided through environment variables (see .github/workflows/build.yml).
    // Without it, release builds are signed with the debug key so the APK is still installable.
    signingConfigs {
        System.getenv("LUCIOLE_KEYSTORE_PATH")?.let { keystore ->
            create("release") {
                storeFile = file(keystore)
                storePassword = System.getenv("LUCIOLE_KEYSTORE_PASSWORD")
                keyAlias = System.getenv("LUCIOLE_KEY_ALIAS")
                keyPassword = System.getenv("LUCIOLE_KEY_PASSWORD")
            }
        }
    }

    buildTypes {
        release {
            signingConfig = signingConfigs.findByName("release") ?: signingConfigs.getByName("debug")
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
}

dependencies {
}