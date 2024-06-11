
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"

function Signup() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Use for redirect to another page
    let navigate = useNavigate()

    useEffect(function () {
        let username = localStorage.getItem("username")
        if (username !== null) {
            navigate("/signin")
        }
    }, [])

    function postData() {
        if (username === "" || email === "" || password === "") {
            alert("Blank Fields are not allowed")
        }
        else {
            let headers = new Headers()
            headers.append('Content-Type', 'application/json');
            headers.append('Accept', 'application/json');
            fetch('http://127.0.0.1:8000/mainwork/UserSignupView/',
                {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify({
                        username: username,
                        email: email,
                        password: password
                    })
                })
                .then((data) => data.json())
                .then((data) => {
                    navigate("/signin")
                })
                .then((err) => console.log(err))
        }
    }

    return (
        <>
            <div className="form-signup col-8 col-lg-3 col-sm-5 ">
                <img className="mb-4" src="/static/images/loginLogo.png" alt="" width="100" height="100" />
                <h1 className="h1 mb-3 ">Sign Up</h1>

                <div className="form-floating">
                    <input type="text" className="form-control" value={username} onChange={e => setUsername(e.target.value)} id="floatingInput" placeholder="Username..." fdprocessedid="ea6jl" name="username" />
                </div>
                <div className="form-floating mt-3">
                    <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} id="floatingInput" placeholder="Email..." fdprocessedid="ea6jl" name="email" />
                </div>

                <div className="form-floating mt-3">
                    <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} id="floatingPassword" placeholder="Password..." fdprocessedid="v6re6" name="password" />
                </div>

                <div className=" d-flex gap-3 justify-content-center py-4">
                    <button className="btn btn-info mt-5 justify-content-center py-2 mr-2" type="submit" onClick={postData} fdprocessedid="60ldeg">Sign Up</button>
                    <button className="btn btn-info mt-5 justify-content-center py-2" onClick={() => navigate("/signin")}>Sign In</button>
                </div>
            </div>
        </>
    )
}

export default Signup