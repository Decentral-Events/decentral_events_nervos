function HeroSection() {
    return <section className="hero">
        <div className="hero-left-cont">
            <div className="heading-cont">
                <h1 className="hero-heading">
                    Decentral Events
                    <h3>One stop solution for Event Management</h3>
                </h1>
                <p className="hero-description">
                    Decentral Events provides you an authentic platform to book events.
                </p>
            </div>
            <div className="app-dld-cont">
                <div className="play-store" onClick={() => alert("App in progress...")}>
                    <ion-icon name="logo-google-playstore" class="ps-icon"></ion-icon>
                    <span className="ps-head">get it on</span>
                    <span className="ps-name">Google Play</span>
                </div>
                <div className="app-store" onClick={() => alert("App in progress...")}>
                    <ion-icon class="ap-icon" name="logo-apple-appstore"></ion-icon>
                    <span className="ap-head">download on</span>
                    <span className="ap-name">App Store</span>
                </div>
            </div>
        </div>
    </section>;
}

export default HeroSection;