import { useEffect } from "react";

/**
 * AdMob banner.
 *
 * 🔧 PARA PUBLIKIMIT NE PLAY STORE:
 *  1. Krijo nje llogari AdMob: https://admob.google.com
 *  2. Shto aplikacionin → kopjo App ID (ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY)
 *     dhe vendose ne android/app/src/main/AndroidManifest.xml si meta-data
 *     <meta-data android:name="com.google.android.gms.ads.APPLICATION_ID"
 *                android:value="ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY"/>
 *  3. Krijo nje Banner Ad Unit → kopjo Ad Unit ID dhe zevendeso BANNER_AD_ID me te.
 *  4. Vendos USE_TEST_ADS = false me posht.
 */

// Test IDs zyrtare nga Google — sigurt per zhvillim, nuk gjenerojne para reale.
const TEST_BANNER_ID = "ca-app-pub-3940256099942544/6300978111";

// 🔁 Zevendeso me Ad Unit ID-ne tuaj reale para publikimit.
const BANNER_AD_ID = "ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY";

// 🔁 Vendose ne `false` para publikimit ne Play Store.
const USE_TEST_ADS = true;

export function AdBanner() {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (typeof window === "undefined") return;
      try {
        const { Capacitor } = await import("@capacitor/core");
        if (!Capacitor.isNativePlatform()) return;
        const { AdMob, BannerAdPosition, BannerAdSize } = await import(
          "@capacitor-community/admob"
        );
        await AdMob.initialize({
          initializeForTesting: USE_TEST_ADS,
          testingDevices: [], // shto Device ID-ne tende per test ne pajisje reale nese duhet
        });
        if (cancelled) return;
        await AdMob.showBanner({
          adId: USE_TEST_ADS ? TEST_BANNER_ID : BANNER_AD_ID,
          adSize: BannerAdSize.ADAPTIVE_BANNER,
          position: BannerAdPosition.BOTTOM_CENTER,
          margin: 0,
          isTesting: USE_TEST_ADS,
        });
      } catch (e) {
        console.warn("AdMob not available:", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      className="w-full h-[60px] flex items-center justify-center bg-muted/60 border-t border-border text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
      aria-label="Advertisement banner"
    >
      {USE_TEST_ADS ? "AdMob · Test Banner" : "Advertisement"}
    </div>
  );
}
