



import { useState } from 'react'

export default function JoinSession(props) {

  const {token, invitationToken, setInvitationToken} = props

  const [ invitationTokenEntry, setInvitationTokenEntry ] = useState("")

  
  const handleSessionJoin = (newTokenInvite) => {
    console.log(newTokenInvite)
    setInvitationToken(newTokenInvite)
    localStorage.setItem("invitation_token", newTokenInvite)
  }

  return (
    <section>
      <h1>Enter new token here</h1>
      <form onSubmit={() => handleSessionJoin(invitationTokenEntry)}>
        <input 
        value={invitationTokenEntry} 
        onChange={(e) => setInvitationTokenEntry(e.target.value)}
        type='text' 
        placeholder="enter token here"></input>
        <button type='submit'>click to join session</button>
      </form>
    </section>
  )
}