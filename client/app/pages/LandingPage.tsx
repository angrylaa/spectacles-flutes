import "./LandingPage.css"; // CSS shown below
const logo = "/logo.png"; // Replace with your logo path

export function LandingPage({ onStart }: { onStart: () => void }) {
  return (
    <div className="landing-container">
      <img src={logo} alt="Logo" className="landing-logo" />
      <button
  className="start-button"
  onClick={() => {
    console.log("clicked");
    onStart();
  }}
>
  Start Game
</button>


    </div>
  );
}


// {/* <button className="start-button" onClick={onStart}>
      //   Start Game
      // </button> */}