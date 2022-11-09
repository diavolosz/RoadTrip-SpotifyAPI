


export default function GenerateInvitation() {

  const showCurrentAcessToken = () => {
    console.log(localStorage.access_token)
    navigator.clipboard.writeText(localStorage.access_token)
  }

  return (
    <section>
      <button onClick={() => showCurrentAcessToken()}>Click to copy Invitation Code</button>
    </section>

  )
}