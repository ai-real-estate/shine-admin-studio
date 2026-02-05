 /**
  * A hook to trigger haptic feedback on supported devices.
  * Uses the Vibration API when available.
  */
 export function useHaptic() {
   const trigger = (pattern: number | number[] = 10) => {
     if (typeof window !== "undefined" && navigator.vibrate) {
       try {
         navigator.vibrate(pattern);
       } catch {
         // Vibration not supported or failed
       }
     }
   };
 
   const light = () => trigger(10);
   const medium = () => trigger(25);
   const heavy = () => trigger(50);
   const selection = () => trigger(5);
   const success = () => trigger([10, 50, 20]);
   const warning = () => trigger([30, 50, 30]);
   const error = () => trigger([50, 100, 50]);
 
   return {
     trigger,
     light,
     medium,
     heavy,
     selection,
     success,
     warning,
     error,
   };
 }