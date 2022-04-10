import User1Image from "../../Images/fig-1.jpg";
import User2Image from "../../Images/fig-2.jpg";
import User3Image from "../../Images/fig-3.jpg";

function FeedbackSection() {
    return <section className="feedback">
        <div className="roadmap-head-cont feedback-head-cont">
            <h2 className="features-head feedback-head">Feedback</h2>
        </div>
        <div className="feedbacks-container">
            <figure className="feedback-cont">
                <div className="fig-img-cont">
                    <img className="fig-img" src={User1Image} alt="" />
                </div>
                <figcaption className="fig-feedback">
                    The back-end algorithm is crazy good, it manages the events for me every time. It's amazing not to worry about event management anymore!
                </figcaption>
                <span className="fig-name">- David Luther</span>
            </figure>
            <figure className="feedback-cont">
                <div className="fig-img-cont">
                    <img className="fig-img" src={User2Image} alt="" />
                </div>
                <figcaption className="fig-feedback">

                    Inexpensive, authentic and great- UI / UX. It feels truly magical while visiting the website!

                </figcaption>
                <span className="fig-name">- Marina Jones</span>
            </figure>
            <figure className="feedback-cont">
                <div className="fig-img-cont">
                    <img className="fig-img" src={User3Image} alt="" />
                </div>
                <figcaption className="fig-feedback">
                    `Decentral Events` is a life saver! I just started a company, so there's no time for booking events. I couldn't live without my event bookings now!
                </figcaption>
                <span className="fig-name">- James Aurther</span>
            </figure>
        </div>
    </section>;
}

export default FeedbackSection;