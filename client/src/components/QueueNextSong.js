




export default function QueueNextSong(props) {

  const { track_name, track_uri, spotifyApi } = props

  const queneSong = (track_name, track_uri) => {
    console.log(track_uri)
    spotifyApi.queue(track_uri)
    .then((res) => {
      console.log(res)
      console.log(`${track_name}: Song Sucessfully Queued`)
    })
    .catch((err) => {
      console.log(err)
    })
  }

  return (
    <section>
      <button onClick={() => queneSong(track_name, track_uri)}>
        Quene Song !
      </button>
    </section>
  )

}