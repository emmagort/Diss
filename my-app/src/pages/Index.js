// import Home from './Home';
// import Student from './Student';
// import Teacher from './Teacher';
// import React from 'react'

// export default function Index() {
//     return (
//         <div>
//         <h1>Welcome to my app!</h1>
//         <div>
//             <h2>Click on one of the links below to go to the page you want to go to</h2>
//             <a href="http://localhost:3000/student">Student</a>
//             <br></br>
//             <a href="http://localhost:3000/teacher">Teacher</a>
//             <br></br>
//             <a href="http://localhost:3000/home">Home</a>
//             <br></br>
//             <a href="http://localhost:3000/results">Results</a>
//         </div>
//         </div>
//     );
//     }


import { Link } from 'react-router-dom';

export default function Index() {
    return (
        <div>
        <h1>Welcome to my app!</h1>
        <div>
            <h2>Click on one of the links below to go to the page you want to go to</h2>
            <Link to="/student">Student</Link>
            <br></br>
            <Link to="/teacher">Teacher</Link>
            <br></br>
            <Link to="/home">Home</Link>
            <br></br>
            <Link to="/results">Results</Link>
        </div>
        </div>
    );
}
