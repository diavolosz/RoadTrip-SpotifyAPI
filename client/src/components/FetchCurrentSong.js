import { useState } from "react"

import '../styles/FetchCurrentSong.scss'

export default function FetchCurrentSong(props) {

  const { token, spotifyApi, setCurrentFunc } = props

  const [currentSong, setCurrentSong] = useState('pending')
  // const [wordLength, setwWordLength] = useState()

  const fetchUserCurrentSong = (token) => {

    spotifyApi.getMyCurrentPlaybackState()
      .then((res) => {
        setCurrentSong({
          name: res.item.name,
          artist: res.item.artists[0].name,
          album: res.item.album.name,
          albumImg: res.item.album.images[1].url,
          wordLength: (res.item.name).split("").length
        })
      })
  }



  return (
    <div className="item-container">
      <section className="item-body">
        {/* <h2>This buttons fetch user's current song</h2> */}
        {currentSong === 'pending' &&
          <div className="item-info-container">
            <div className="image-container">
              <img className='disc-img' src='image/VynliaLogo.png' alt='default' />
              {/* <img className='arm' src='image/arm.png' alt='arm' /> */}
            </div>

            <div className="item-loading-container">
              <span className="loading-text">Loading the Vynl</span>
              <span className="dot-animation">....</span>
            </div>
          </div>
        }
        {currentSong !== 'pending' &&
          <div className="item-info-container">
            <div className="image-container">
              <img className='disc-img' src={currentSong.albumImg} alt='albumImg' />
            </div>

            <div className="item-details">
              {currentSong.wordLength >= 40 &&
                <p className="song-name-max">{currentSong.name}</p>
              }
              {currentSong.wordLength >= 18 && currentSong.wordLength <= 40 &&
                <p className="song-name-long">{currentSong.name}</p>
              }
              {currentSong.wordLength < 18 &&
                <p className="song-name">{currentSong.name}</p>
              }

              {/* <p className="song-ablum">{currentSong.album}</p> */}
              <p className="song-artist">{currentSong.artist}</p>

            </div>
          </div>
        }
        <img className='arm' src='image/arm.png' alt='arm' />
        <div className="button-container">
          <button className="neu-button " onClick={() => setCurrentFunc('default')}>{"<"}</button>
          <button className="neu-button " onClick={() => fetchUserCurrentSong()}>See Current Song</button>
        </div>
      </section>
    </div>
  )
}