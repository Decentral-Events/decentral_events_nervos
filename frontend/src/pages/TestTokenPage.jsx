import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context";
import TokenContract from "../abi/Token.json";
import { ethers } from "ethers";
import Loading from "../components/Loading";

function TestTokenPage() {
    const [tokens, setTokens] = useState(0);
    const [tokenContract, setTokenContract] = useState(null);
    const auth = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    async function submit(e) {
        e.preventDefault();
        if (!tokens) return;
        const tx = await tokenContract.mint(ethers.utils.parseEther(tokens));
        setLoading(true);
        await tx.wait();
        setLoading(false);
        alert("Tokens Minted Successfully");
    }

    useEffect(() => {
        (async () => {
            if (!auth.signer) return;
            const tokenContract = new ethers.Contract(TokenContract.address, TokenContract.abi, auth.signer);
            setTokenContract(tokenContract);
        })();
    }, [auth.signer]);


    return <main className="signup-main">
        {loading && <Loading />}
        <div className="signup-container">
            <div className="form-container">
                <div className="event-head-cont">
                    <h2 className="features-head event-head">Mint Test Tokens</h2>
                </div>
                <form onSubmit={submit} className="form">
                    <div className="form-ele-cont">
                        <label className="form-label" for="tokens"> Tokens </label>
                        <input
                            type="number"
                            value={tokens}
                            onChange={(e) => setTokens(e.target.value)}
                            placeholder="0"
                            id="tokens"
                            required
                            className="form-input"
                        />
                    </div>
                    <div className="create-acc-btn-cont">
                        <button type="submit" className="btn eve-sts-btn create-acc-btn btn-for-events">
                            <span className="btn-event cre-acc-btn-txt btn-visible">
                                Submit
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </main>;
}

export default TestTokenPage;