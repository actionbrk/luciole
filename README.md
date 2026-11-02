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

### Install with Wear Installer 2

**luciole** is installed from your Android phone with the **Wear Installer 2** app ([help page](https://freepoc.org/wear-installer-2-help-page/)). Nothing needs to be installed on the watch beforehand.

1. On your phone, install **Wear Installer 2** from the Play Store, then download the latest `luciole-*.apk` from the [Releases page](https://github.com/actionbrk/luciole/releases) (it is saved in the **Download** folder).
2. On the watch, enable the developer options: **Settings > System > About > Versions**, then tap **Build number** 7 times (on Galaxy Watch: **Settings > About watch > Software information**, then tap **Software version** 7 times).
3. In **Settings > Developer options**, enable **ADB debugging** and **Wireless debugging**. The watch and the phone must be on the same Wi-Fi network (a phone hotspot does not work).
4. On the watch, open **Wireless debugging > Pair new device**: it shows a pairing code, an IP address and a port. Enter them in Wear Installer 2 to pair the phone with the watch.
5. In Wear Installer 2, connect to the watch with the IP address and port shown on the **Wireless debugging** screen. This port is different from the pairing port.
6. Tap **Custom APK**, select the `luciole-*.apk` file, then tap **Install**.
7. On the watch, long-press the current watch face, scroll to the end, tap **+** and choose **luciole**. If it is not in the list (on some Galaxy Watch models), select it with **Set Watchface** in Wear Installer 2.

Once installed, turn **Wireless debugging** and **ADB debugging** off again.

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