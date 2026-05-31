import TrackPlayer, { Event } from 'react-native-track-player';

export const PlaybackService = async function() {
    TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
    TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
    TrackPlayer.addEventListener(Event.RemoteNext, () => TrackPlayer.skipToNext());
    TrackPlayer.addEventListener(Event.RemotePrevious, () => TrackPlayer.skipToPrevious());
    TrackPlayer.addEventListener(Event.RemoteSeek, (event) => TrackPlayer.seekTo(event.position));
    TrackPlayer.addEventListener(Event.RemoteJumpForward, async () => {
        const position = await TrackPlayer.getPosition();
        await TrackPlayer.seekTo(position + 15);
    });
    TrackPlayer.addEventListener(Event.RemoteJumpBackward, async () => {
        const position = await TrackPlayer.getPosition();
        await TrackPlayer.seekTo(position - 15);
    });
};
