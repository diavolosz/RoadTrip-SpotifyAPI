

import { useState } from 'react'

import QueueNextSong from './QueueNextSong'


export default function SongbySearch(props) {

  let { spotifyApi } = props

  const [searchValue, setSearchValue] = useState("");
  const [searchType, setSearchType] = useState("track");
  const [searchResult, setSearchResult] = useState()

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setSearchValue("")
    // console.log({ searchValue, searchType })

    spotifyApi.search(searchValue, [searchType], { limit: 10 })
      .then((res) => {
        // console.log(res.tracks.items)

        let filteredSearchResult = res.tracks.items.map((result) => {
          return {
            track_name: result.name,
            track_id: result.id,
            track_uri: result.uri,
            artist_name: result.artists[0].name,
            artist_id: result.artists[0].id,
            external_urls: result.external_urls.spotify,
          }
        })
        setSearchResult(filteredSearchResult)
      })
  }


  const handleResetSearchResult = () => {
    setSearchResult()
  }

  const searchListObj = [
    {
      label: 'track',
      value: 'track'
    },
    // {
    //   label: 'album',
    //   value: 'album'
    // },
    // {
    //   label: 'artist',
    //   value: 'artist'
    // },
    // {
    //   label: 'playlist',
    //   value: 'playlist'
    // },
  ]


  const searchItemList = searchListObj.map((option, index) => {
    return (
      <option key={index} value={option.value}>{option.label}</option>
    )
  })


  let searchResultDisplay
  if (searchResult) {
    searchResultDisplay = searchResult.map((display, index) => {
      const { track_name, track_id, track_uri, artist_name, artist_id, external_urls } = display

      return (
        <div key={index}>
          <div>track name: {track_name}</div>
          <div>track id: {track_id}</div>
          <div>track uri: {track_uri}</div>
          <div>artist name: {artist_name}</div>
          <div>artist id: {artist_id}</div>
          <div>external url: <a href={external_urls}>{external_urls}</a></div>

          <QueueNextSong
          track_name={track_name}
            track_uri={track_uri}
            spotifyApi={spotifyApi}
          />
          <br />
        </div>
      )
    })
  }

  return (
    <section>
      <h2>Try searching something !</h2>
      <form onSubmit={(e) => handleSearchSubmit(e)}>
        <input
          type="text"
          placeholder="Search something..."
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
        />
        <select onChange={e => setSearchType(e.target.value)}>
          {searchItemList}
        </select>
        <button type="submit">Submit</button>
      </form>
      <button onClick={() => handleResetSearchResult()}>Clear Search Result</button>
      <div>
        {!searchResult
          ? <h2>empty search</h2>
          : <div>{searchResultDisplay}</div>
        }
      </div>
    </section>
  )
}