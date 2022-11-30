import { useState } from "react"

import '../styles/FetchCurrentSong.scss'

export default function FetchCurrentSong(props) {

  const { token, spotifyApi, setCurrentFunc } = props

  const fetchUserCurrentSong = (token) => {

    spotifyApi.getMyCurrentPlaybackState()
      .then((res) => {
        setCurrentSong({
          name: res.item.name,
          artist: res.item.artists[0].name,
          alblum: res.item.album.name,
          albumImg: res.item.album.images[1].url
        })
        console.log(res)
      })
  }

  const [currentSong, setCurrentSong] = useState('pending')


  return (
    <div className="item-container">
      <section className="item-body">
        {/* <h2>This buttons fetch user's current song</h2> */}
        {currentSong === 'pending' &&
          <div className="item-info-container">
            <div className="image-container">
              <img className='disc-img' src='image/vinyl.png' alt='default' />
              {/* <img className='arm' src='image/arm.png' alt='arm' /> */}
            </div>

            <p>
              What is the current song?
            </p>
          </div>
        }
        {currentSong !== 'pending' &&
          <div className="item-info-container">
            <div className="image-container">
              <img className='disc-img' src={currentSong.albumImg} alt='albumImg' />
            </div>

            <p>current song is: {currentSong.name}
              by {currentSong.artist}
              from the ablum of {currentSong.alblum}
            </p>
          </div>
        }
        <img className='arm' src='image/arm.png' alt='arm' />
        <div className="button-container">
          <button onClick={() => fetchUserCurrentSong()}>click to fetch</button>
          <button onClick={() => setCurrentFunc('default')}>return</button>
        </div>
      </section>
    </div>
  )
}