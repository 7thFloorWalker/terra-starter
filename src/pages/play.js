import React, { useState, useEffect } from "react";
import * as execute from '../contract/execute';
import * as query from '../contract/query';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import LoadingIndicator from '../components/LoadingIndicator';
import $ from 'jquery';

const Play = () => {
    const connectedWallet = useConnectedWallet();
    // Configure this as you want, I like shorter games
    const playTime = 35;

    const [time, setTime] = useState(playTime);
    const [gameOver, setGameOver] = useState(false);
    // We use this to track where the target is on the screen
    const [targetPosition, setTargetPosition] = useState({ top: "15%", left: "50%" });
    const [targetImage, setTargetImage] = useState( 'walker4.png' );
    const [loading, setLoading] = useState(false);
    const [count, setCount] = useState(4);
    const [score, setScore] = useState(0);


    // Every second we're going to lower the value of time.
    useEffect(() => {
        const unsubscribe = setInterval(() => {
            setTime(time => time > 0 ? time - 1 : 0);
        }, 1000);
        return unsubscribe;
    }, []);

    useEffect(() => {
        async function fetchMyAPI() {
            if (time === 0) {
                setTargetPosition({ display: 'none' });
                let highscore = await query.getScores(connectedWallet);
                let hs = 0;
                highscore.scores.forEach(element => {
                    //check if wallet already has a high score
                    if(element[0] == connectedWallet.walletAddress) {
                        //if it does set their current high score
                        hs = element[1]
                    }
                });
                if(hs < score) {
                    // Show alert to let user know it's game over
                    alert(`Game Over! Your score is ${score}. Please confirm transaction to submit score.`);
                    submitScore();
                } else {
                    alert(`Game Over! Your score is ${score}. This was not a new high score for you, try again!.`);
                    window.location.href = '/leaderboard';
                }
            }

        }

        fetchMyAPI()
    }, [time]);


    const submitScore = async () => {
        if (connectedWallet && connectedWallet.network.name === 'testnet') {
            setLoading(true);
            const tx = await execute.setScore(connectedWallet, score);
            console.log(tx);
            // Once the transaction is confirmed, we let the user know and navigate to the leaderboard
            alert('Score submitted!');
            setLoading(false);
            window.location.href = '/leaderboard';
        }
    };

    const handleClick = () => {
        // OGs will know this :)
        let audio = new Audio("/Zergling_explodes.mp3");
        let curxy = $('#target').position();
        let heroxy = $('#marine-img').position();

        //get the location of the click in the image
        let myImg = document.getElementById("target");
        let clickxy = GetCoordinates(myImg)

        let closex = heroxy.left - curxy.left;
        let closey = heroxy.top - curxy.top;

        //get new position based off hero and current pos
        let newx = (curxy.left + Math.floor(Math.random() * (closex)));
        let newy =  (curxy.top + Math.floor(Math.random() * (closey)));

        // Don't let it get too loud!
        audio.volume = 0.2;
        audio.play();
        let tcnt = 0;
        tcnt = count - 1;

        //headshot logic
        if(clickxy.y <= 15) {
            tcnt = 0;
            setCount(4);
            //less points for kills
            setScore(score => score + 1);
            // only move when fully cured
            setTargetPosition({
                top: `${Math.floor(Math.random() * 50)}%`,
                left: `${Math.floor(Math.random() * 50)}%`
            });
            setTargetImage(
                'walker4.png');
        } else {
            if(tcnt === 0) {
                setCount(4);
                //more points for saves
                setScore(score => score + 4);
                // only move when fully cured
                setTargetPosition({
                    top: `${Math.floor(Math.random() * 50)}%`,
                    left: `${Math.floor(Math.random() * 50)}%`
                });
                setTargetImage(
                    'walker4.png');
            } else {
                //move walker closer to hero and treat 1 step closer
                setCount(tcnt);
                setTargetPosition({
                    top: newy +'px',
                    left: newx +'px',
                });
                // Play around with this to control bounds!
                setTargetImage(
                    'walker' + tcnt+ '.png');

                //check how close walker is to hero
                if(checkcoll('target', 'marine-img')) {
                    alert(`They got you, GAME OVER! GM.`);
                    //too close GAME OVER
                    setTime(0);
                }
            }
        }
    };

    return (
        <div className="score-board-container">
            <div className="play-container">
                <span>Score: {score}</span>
                <span>Fight!</span>
                <span>Time left: {time} s</span>
            </div>

            {/* Render loading or game container */}
            {loading ? (
                <LoadingIndicator />
            ) : (
                <div className="game-container">
                    {/* CHANGE THIS IMAGE! It's loaded from the public folder. */}
                    <img src={targetImage} id="target" alt="Target" style={{ ...targetPosition }} onClick={handleClick} />
                    <img src="zombiehunter.png" id="marine-img" alt="Zombie_Hunter" />
                </div>
            )}
        </div>
    );
};

function FindPosition(oElement)
{
    if(typeof( oElement.offsetParent ) != "undefined")
    {
        for(var posX = 0, posY = 0; oElement; oElement = oElement.offsetParent)
        {
            posX += oElement.offsetLeft;
            posY += oElement.offsetTop;
        }
        return [ posX, posY ];
    }
    else
    {
        return [ oElement.x, oElement.y ];
    }
}

function GetCoordinates(el)
{
    var PosX = 0;
    var PosY = 0;
    var ImgPos;
    ImgPos = FindPosition(el);
    if (!e) var e = window.event;
    if (e.pageX || e.pageY)
    {
        PosX = e.pageX;
        PosY = e.pageY;
    }
    else if (e.clientX || e.clientY)
    {
        PosX = e.clientX + document.body.scrollLeft
            + document.documentElement.scrollLeft;
        PosY = e.clientY + document.body.scrollTop
            + document.documentElement.scrollTop;
    }
    PosX = PosX - ImgPos[0];
    PosY = PosY - ImgPos[1];
    return { x: PosX, y: PosY };
}

function checkcoll(el1, el2) {
    let d1 = document.getElementById(el1).getBoundingClientRect();
    let d2 = document.getElementById(el2).getBoundingClientRect();

    function touching(div1,div2){
        let ox = Math.abs(d1.x - d2.x) < (d1.x < d2.x ? d2.width : d1.width);
        let oy = Math.abs(d1.y - d2.y) < (d1.y < d2.y ? d2.height : d1.height);
        return ox && oy;
    }

    var t = touching(d1,d2) // should return whether they are touching

    return t;
}

export default Play;