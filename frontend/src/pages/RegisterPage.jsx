import axios from "axios";
import { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import { AuthContext } from "../context";

function RegisterPage({ provider }) {
    const [name, setName] = useState("");
    const [image, setImage] = useState();
    const [username, setUsername] = useState("");
    const auth = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function submit(e) {
        e.preventDefault();
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setLoading(true);
        try {
            const { data: { message, registered } } = await axios.get(`${window.server}/auth/get-nonce-message/${address}`);
            const signature = await signer.signMessage(message);
            const formData = new FormData();
            formData.append("name", name);
            formData.append("image", image);
            formData.append("username", username);
            formData.append("address", address);
            formData.append("signature", signature);
            const { data: { user, token } } = registered
                ? await axios.post(`${window.server}/auth/login`, {
                    address,
                    signature
                })
                : await axios.post(`${window.server}/auth/register`, formData);
            auth.setLoginData({
                user,
                signer,
                token,
                isLoggedIn: true,
                expireTimeStamp: 0
            });
            navigate("/");
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    }

    if (auth.isLoggedIn) {
        return <Navigate to="/" />;
    }

    return <main className="signup-main">
        {loading && <Loading />}
        <div className="signup-container">
            <div className="form-container">
                <div className="event-head-cont">
                    <h2 className="features-head event-head">Create Account</h2>
                </div>
                <form onSubmit={submit} className="form">
                    <div className="form-ele-cont">
                        <label className="form-label" for="full-name"> Full Name </label>
                        <input
                            type="text"
                            name="Full Name"
                            placeholder="Jonas Smith"
                            id="full-name"
                            required
                            className="form-input"
                            value={name} onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="form-ele-cont">
                        <label className="form-label" for="user-name"> User Name </label>
                        <input
                            type="text"
                            name="User Name"
                            placeholder="Arvi_Acker"
                            id="user-name"
                            required
                            className="form-input"
                            value={username} onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <input
                        name="image"
                        id="image"
                        accept=".jpg,.png"
                        type="file"
                        required
                        hidden
                        onChange={(e) => setImage(e.target.files[0])} />
                    <div className="picture-form-cont">
                        <span className="form-fp-head form-label">Profile Picture</span>
                        <div className="flex">
                            <button onClick={() => document.getElementById("image").click()} className="btn eve-stake-btn">
                                <span className="btn-event btn-visible stake-btn"> Choose File </span>
                            </button>
                            <div style={{ marginLeft: "10px", display: "inline-block", fontSize: "1.2rem" }}>
                                {image && image.name}
                            </div>
                        </div>
                    </div>
                    <div className="create-acc-btn-cont">
                        <button type="submit" className="btn eve-sts-btn create-acc-btn btn-for-events">
                            <span className="btn-event cre-acc-btn-txt btn-visible">
                                Create Account
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </main>;
}

export default RegisterPage;