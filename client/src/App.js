import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from "react";
import req from "express/lib/request";

const CLIENT_ID = "Ov23liZSByIxKbpL87D6";

function loginWithGithub() {
    window.location.assign("https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID);
}

function App() {
    const [render, setRender] = useState(false);
    const [userData, setUserData] = useState({});
    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const codeParams = urlParams.get("code");
        console.log(codeParams);
        if (codeParams && (localStorage.getItem("accessToken") === null)) {
            async function getAccessToken() {
                await fetch("https://localhost:4000/getAccessToken?code=" + codeParams, {
                    method: "GET",
                }).then(response => {
                    return response.json();
                }).then((data) => {
                    console.log(data);
                    if (data.access_token) {
                        localStorage.setItem("access_token", data.access_token);
                        setRender(!render);

                    }
                });
            }

            getAccessToken();
        }
    }, []);


    async function getUserData() {
        await fetch("http://localhost:4000/getUserData", {
            method: "GET", headers: {
                "Authorization": "Bearer" + localStorage.getItem("accessToken") // Bearer ACCESSTOKEN
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data);
            setUserData(data);
        })
    }

    return (<div className="App">
        <header className="App-header">
            {localStorage.getItem("access_token") ? <>
                    <h1>We have the access token</h1>
                    <button onClick={() => {
                        localStorage.removeItem("accessToken");
                        setRender(!render)
                    }}>
                        Log out
                    </button>
                    <h3>Get Data from GitHub API</h3>
                    <button onClick={getUserData}>Get Data</button>
                    {Object.keys(userData).length !== 0 ? <>
                            <h4>Hey there {userData.login}</h4>

                        </>


                        : <>


                        </>}
                </> :

                <>
                    <h3>User is not logged in</h3>
                    <button onClick={loginWithGithub}>Login</button>

                </>

            }
        </header>
    </div>);
}

export default App;
