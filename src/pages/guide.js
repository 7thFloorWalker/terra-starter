import { Link } from 'react-router-dom';

const Guide = () => {
    return (
        <main className="App">
            <header>
                <Link to="/" className="home-link">
                    <div className="header-titles">
                        <h1>⚔ Walkers War ⚔️</h1>
                        <p>Only you can save us from Walker town</p>
                    </div>
                </Link>
            </header>

            <div className="score-board-container">
                <h3>How to play</h3>

                <div>
                    <img src ="walkeranime.gif" /><br />
          <span className="help">
           Treat as many walkers as you can save within 30 seconds! It takes 4 shots to cure a walker. However 1 brain-shot to kill them.  Treating them gains you more points.
          </span>
            <span className="help">
           The Walkers will try to get to you, if they do, GAME OVER! So be careful. If they are close, just got for the killshot.
          </span>
                </div>
            </div>
        </main>
    );
};

export default Guide;