// import React from 'react'
// import './App.css';
// import StartComponent from './HomeComponents/StartComponent';
// import CreateComponent from './HomeComponents/CreateComponent';
// import JoinComponent from './HomeComponents/JoinComponent';

// import { useState } from 'react';

// function Home({gameID, handleCreateGame, joinGame}) {

//     const [currentSubMenu, setCurrentSubMenu] = useState("start");

//     const handleCreateButtonClick = () => {
//         setCurrentSubMenu("create");
//         handleCreateGame();
//     }

//     const handleJoinButtonClick = () => {
//         setCurrentSubMenu("join");
//     }

//     const subMenus = {
//         create: <CreateComponent gameID={gameID}/>,
//         join: <JoinComponent joinGame={joinGame}/>,
//         start: <StartComponent handleCreateButtonClick={handleCreateButtonClick} handleJoinButtonClick={handleJoinButtonClick}/>
//       }

//     return (
//         <div className='HomeContainer'>

//             {subMenus[currentSubMenu] || <StartComponent/>}

//         </div>
//     )
// }

// export default Home