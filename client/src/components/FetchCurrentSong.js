import { useState } from "react"



export default function FetchCurrentSong(props) {

  const { token, spotifyApi } = props

  const fetchUserCurrentSong = (token) => {
    spotifyApi.getMyCurrentPlaybackState()
      .then((res) => {
        setCurrentSong({
          name: res.item.name,
          artist: res.item.artists[0].name,
          alblum: res.item.album.name,
        })
        // console.log(res)
      })
  }

  const [currentSong, setCurrentSong] = useState()


  return (
    <div>
      <section>
        <h2>This buttons fetch user's current song</h2>
        <button onClick={() => { fetchUserCurrentSong() }}>click to fetch</button>
        {currentSong && <p>current song is: {currentSong.name} by {currentSong.artist} from the ablum of {currentSong.alblum}</p>}
      </section>

    </div>
  )
}