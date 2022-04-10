import SwtichNetworkButton from "../components/SwitchNetworkButton";

function MetamaskErrorPage({ error }) {
    return <><header class="err-header">
        <div class="header-logo-cont err-header-align">
            <div class="header-img-cont">
                <span>
                    <img src="/Images/logo.png" alt="" class="header-logo"
                    /></span>
            </div>
            <span class="logo-heading">Decentral Events</span>
        </div>
    </header>
        <main class="err-main">
            <div class="err-display-cont">
                <span class="err-1">{error}</span>
                {error !== "Please Install/Update MetaMask" && <div class="header-button-cont">
                    <SwtichNetworkButton />
                </div>}
            </div>
        </main>
        <footer class="footer err-footer">
            Copyright &copy; Decentral Events.
        </footer></>;
}

export default MetamaskErrorPage;