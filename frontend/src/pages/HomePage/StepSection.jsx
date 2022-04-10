import Step1Image from "../../Images/step-1.png";
import Step2Image from "../../Images/step-2.png";
import Step3Image from "../../Images/step-3.png";
import Step4Image from "../../Images/step-4.png";

function StepSection() {
    return <section className="roadmap">
        <div className="roadmap-head-cont">
            <h2 className="features-head roadmap-head">roadmap</h2>
        </div>
        <div className="step-cont step-1-cont">
            <div className="step-img-cont">
                <img src={Step1Image} className="step-img" alt="" />
            </div>
            <div className="step-instruction-cont">
                <span className="step-no">01</span>
                <span className="step-name"> Select Event </span>
                <span className="step-instruction">
                    Select the event you want to attend from the website.
                </span>
            </div>
        </div>
        <div className="step-cont step-2-cont">
            <div className="step-instruction-cont">
                <span className="step-no">02</span>
                <span className="step-name"> Stake Tokens </span>
                <span className="step-instruction">
                    You need to stake some tokens for booking the event. If you attend
                    the event or cancel the event before start time, then you will get you tokens back, else
                    tokens will be lost.
                </span>
            </div>
            <div className="step-img-cont">
                <img src={Step2Image} className="step-img" alt="" />
            </div>
        </div>
        <div className="step-3-cont step-cont">
            <div className="step-img-cont">
                <img src={Step3Image} className="step-img" alt="" />
            </div>
            <div className="step-instruction-cont">
                <span className="step-no">03</span>
                <span className="step-name"> Attend Event </span>
                <span className="step-instruction">
                    Attend the event and mark you attendance there.
                </span>
            </div>
        </div>
        <div className="step-4-cont step-cont">
            <div className="step-instruction-cont">
                <span className="step-no">04</span>
                <span className="step-name"> Unstake Tokens </span>
                <span className="step-instruction">
                    You will be able to unstake the tokens if you had attended the event.
                </span>
            </div>
            <div className="step-img-cont">
                <img src={Step4Image} className="step-img" alt="" />
            </div>
        </div>
    </section>;
}

export default StepSection;