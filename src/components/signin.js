import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function Signin() {
    let apiBaseUrl = "https://vineyarora.pythonanywhere.com"
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    let navigate = useNavigate()

    useEffect(function () {
        let username = localStorage.getItem("username")
        // let userPk = localStorage.getItem("userPk")
        // console.log(userPk)
        if (username !== null) {
            navigate("/")
        }
    }, [])

    //header declaration 
    let headers = new Headers()
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    function postData() {
        if (username === "" || password === "") {
            alert("Blank Fields are not allowed")
        }
        else {

            fetch(`${apiBaseUrl}/mainwork/UserSigninView/`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            })
                .then((data) => data.json())
                .then((data) => {
                    let userPk = data.userPk
                    if (data.success) {
                        localStorage.setItem("userPk", userPk)
                        localStorage.setItem("username", username)
                        navigate("/")
                    }
                })
                .catch((err) => {
                    if (err) {
                        alert("CREDENTIAL ERROR! Please Check Your Credential..")
                        console.log(err)
                    }
                })
        }
    }
    return (
        <>
            <div className="container mt-5 pt-5">
                <div class="row d-flex">
                    <div class="col-md-7 ">
                        <img src="static/images/login3.png" className="boyimg d-block w-100" alt="..." />
                    </div>
                    <div class="col-md-5 form-signin">
                        {/*</div><div className="form-signin col-8 col-lg-3 col-sm-5"> */}
                        <img className="mb-4" src="/static/images/loginLogo.png" alt="" width="110" height="100" />
                        <h1 className="h1 mb-3 ">Sign In</h1>

                        <div className="form-floating">
                            <input type="text" className="form-control" value={username} onChange={e => setUsername(e.target.value)} id="floatingInput" placeholder="Username.." fdprocessedid="ea6jl" name="username" />
                        </div>

                        <div className="form-floating mt-3">
                            <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} id="floatingPassword" placeholder="Password" fdprocessedid="v6re6" name="password" />
                        </div>

                        <div className="d-flex gap-3 justify-content-center py-4">
                            <button className="btn btn-info mt-5 justify-content-center py-2 mr-2" type="submit" onClick={postData} fdprocessedid="60ldeg">Sign In</button>
                            <button className="btn btn-info mt-5 justify-content-center py-2" onClick={() => navigate("/signup")}>Sign Up</button>
                        </div>
                        {/* </div> */}
                    </div>
                </div >
            </div>

        </>
    )
}

export default Signin
