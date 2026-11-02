# luciole ✨ — An essential Wear OS watch face

**luciole** is a minimalist watch face for Wear OS, crafted for clarity, endurance, and quiet awareness.

> A yellow dot appears. Something is waiting — **luciole** 🟡.

## Why **luciole**?

**luciole** aims to show what matters most — the time — and gently remind you when something needs attention. It is intentionally subtle: easy to notice, hard to annoy.

- Clean, glanceable time display 👀
- Lightweight and power-friendly 🔋
- Easy-to-spot notifications 🟡

## Installation

**luciole** requires a watch running **Wear OS 6** or later.

### Install the APK (sideloading)

1. Download the latest `luciole-*.apk` from the [Releases page](https://github.com/actionbrk/luciole/releases).
2. On the watch, enable the developer options: **Settings > System > About > Versions**, then tap **Build number** 7 times (on Galaxy Watch: **Settings > About watch > Software information > Software version**).
3. In **Settings > Developer options**, enable **ADB debugging** and **Wireless debugging**. The watch and the computer must be on the same Wi-Fi network.
4. In **Wireless debugging**, tap **Pair new device** and pair from your computer with [adb](https://developer.android.com/tools/releases/platform-tools):
   ```sh
   adb pair <ip>:<pairing port>   # enter the pairing code shown on the watch
   adb connect <ip>:<port>        # ip and port shown on the Wireless debugging screen
   adb install luciole-*.apk
   ```
5. Long-press the current watch face, scroll to the end, tap **+** and choose **luciole**.

No computer? Android phone apps such as *Wear Installer 2* or *Bugjaeger* can install an APK on the watch over Wireless debugging, using the same pairing steps.

Once installed, you can turn **ADB debugging** and **Wireless debugging** off again.

### Build from source

1. Clone this repository
2. Open it in Android Studio
3. Build & Run on a Wear OS device/emulator

### Change watch settings

It is recommended to disable this setting on your watch: **Settings > General > Show unread notification dot**.

## Publishing a release

Every push builds the APK with GitHub Actions (download it from the run's *Artifacts*). Pushing a `v*` tag also publishes a GitHub release with the APK attached:

```sh
git tag v1.0
git push origin v1.0
```

Remember to increase `versionCode` and `versionName` in `watchface/build.gradle.kts` before tagging a new version.

### Signing key

To let users install a new version over the previous one, every release must be signed with the same key. Create it once and keep it safe:

```sh
keytool -genkeypair -v -keystore luciole-release.jks -alias luciole -keyalg RSA -keysize 4096 -validity 10000
base64 -w0 luciole-release.jks   # value for LUCIOLE_KEYSTORE_BASE64
```

Then add these secrets in **Settings > Secrets and variables > Actions**: `LUCIOLE_KEYSTORE_BASE64`, `LUCIOLE_KEYSTORE_PASSWORD`, `LUCIOLE_KEY_ALIAS` (`luciole` above) and `LUCIOLE_KEY_PASSWORD` (same as the keystore password with the command above).

Without these secrets, the APK is signed with a temporary debug key: it installs fine, but each new build has to be installed after uninstalling the previous one.