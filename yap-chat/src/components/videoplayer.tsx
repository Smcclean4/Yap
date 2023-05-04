import React from 'react'
import dynamic from 'next/dynamic'
const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });

type VideoPlayerTypes = {
  url: string;
}

const Videoplayer = ({ url }: VideoPlayerTypes) => {
  return (
    <div className="h-screen pointer-events-none absolute top-0 right-0 left-0 bottom-0 m-auto -z-10">
      <ReactPlayer url={url} loop={true} playbackRate={0.70} playing={true} controls={false} volume={0} height="100%" width="100%" muted config={{
        wistia: {
          options: {
            endVideoBehavior: "loop",
            qualityMin: 3840,
            controlsVisibleOnLoad: false,
            playButton: false,
            playPauseNotifier: false,
            wmode: "transparent",
            fitStrategy: "cover",
            plugin: false
          }
        }
      }} />
      <style jsx>{`
        .wistia-branding {
          display: none !important;
        }
      `}</style>
    </div>
  )
}

export default Videoplayer
