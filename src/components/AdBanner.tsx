import { useEffect } from "react";

// Reserved space for AdMob banner (50dp). On native it shows the real ad;
// in the web preview it shows a placeholder so the layout is identical.
export function AdBanner() {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (typeof window === "undefined") return;
      try {
        const { Capacitor } = await import("@capacitor/core");
        if (!Capacitor.isNativePlatform()) return;
        const { AdMob, BannerAdPosition, BannerAdSize } = await import("@capacitor-community/admob");
        await AdMob.initialize({ initializeForTesting: true });
        if (cancelled) return;
        await AdMob.showBanner({
          // Google's official test banner ID — replace before publishing.
          adId: "ca-app-pub-3940256099942544/6300978111",
          adSize: BannerAdSize.ADAPTIVE_BANNER,
          position: BannerAdPosition.BOTTOM_CENTER,
          margin: 0,
        });
      } catch (e) {
        console.warn("AdMob not available:", e);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div
      className="w-full h-[60px] flex items-center justify-center bg-muted/60 border-t border-border text-xs text-muted-foreground"
      aria-label="Advertisement banner"
    >
      AdMob Banner (60dp)
    </div>
  );
}
