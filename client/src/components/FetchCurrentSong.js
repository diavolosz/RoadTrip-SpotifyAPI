import { useState } from "react"

import '../styles/FetchCurrentSong.scss'

export default function FetchCurrentSong(props) {

  const { token, spotifyApi, setCurrentFunc } = props

  const [currentSong, setCurrentSong] = useState('pending')
  const [wordLength, setwWordLength] = useState('pending')

  const fetchUserCurrentSong = (token) => {

    spotifyApi.getMyCurrentPlaybackState()
      .then((res) => {
        setwWordLength((res.item.name).split("").length)
        setCurrentSong({
          name: res.item.name,
          artist: res.item.artists[0].name,
          album: res.item.album.name,
          albumImg: res.item.album.images[1].url
        })
        console.log(wordLength)
      })
  }



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

            <div className="item-details">
              {wordLength >= 18 &&
                <p className="song-name-long">{currentSong.name}</p>
              }
              {wordLength < 18 &&
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