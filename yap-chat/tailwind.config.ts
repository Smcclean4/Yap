import { type Config } from "tailwindcss";
import { withUt } from "uploadthing/tw";

export default withUt({
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        // top line: rotate down into X
        rotateUp: {
          "0%": { transform: "translateY(0) rotate(0deg)" },
          "100%": { transform: "translateY(0.35rem) rotate(45deg)" },
        },
        // reverse: X back to straight
        rotateUpRev: {
          "0%": { transform: "translateY(0.35rem) rotate(45deg)" },
          "100%": { transform: "translateY(0) rotate(0deg)" },
        },
        // bottom line: rotate up into X
        rotateDwn: {
          "0%": { transform: "translateY(0) rotate(0deg)" },
          "100%": { transform: "translateY(-0.35rem) rotate(-45deg)" },
        },
        // reverse: X back to straight
        rotateDwnRev: {
          "0%": { transform: "translateY(-0.35rem) rotate(-45deg)" },
          "100%": { transform: "translateY(0) rotate(0deg)" },
        },
        // middle line fades out when opening
        fading: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        // middle line fades back in when closing
        fadingRev: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        // menu items slide up + fade in
        extension1: {
          "0%": { opacity: "0", transform: "translateY(1.5rem)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        extension2: {
          "0%": { opacity: "0", transform: "translateY(2rem)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        extension3: {
          "0%": { opacity: "0", transform: "translateY(2.5rem)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        rotateUp: "rotateUp 0.25s ease-in-out forwards",
        rotateUpRev: "rotateUpRev 0.25s ease-in-out forwards",
        rotateDwn: "rotateDwn 0.25s ease-in-out forwards",
        rotateDwnRev: "rotateDwnRev 0.25s ease-in-out forwards",
        fading: "fading 0.2s ease-in-out forwards",
        fadingRev: "fadingRev 0.2s ease-in-out forwards",
        extension1: "extension1 0.35s ease-out forwards",
        extension2: "extension2 0.45s ease-out forwards",
        extension3: "extension3 0.55s ease-out forwards",
      },
    },
  },
  plugins: [],
}) satisfies Config;
