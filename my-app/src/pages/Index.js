import Home from './Home';
import Student from './Student';
import Teacher from './Teacher';

//create a page that allows you to click on what page you want to go to
//you can choose between student and teacher and home page

export default function Index() {
    return (
        <div>
        <h1>Welcome to my app!</h1>
        <div>
            <h2>Click on one of the links below to go to the page you want to go to</h2>
            <a href="http://localhost:3000/student">Student</a>
            <br></br>
            <a href="http://localhost:3000/teacher">Teacher</a>
            <br></br>
            <a href="http://localhost:3000/home">Home</a>
        </div>
        </div>
    );
    }