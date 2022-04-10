import { useState } from "react";

function ContactPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [feedback, setFeedback] = useState("");

    function submit(e) {
        e.preventDefault();
        setName("");
        setEmail("");
        setFeedback("");
        alert("Feedback Submitted Successfully");
    }

    return <main className="signup-main">
        <div className="signup-container">
            <div className="form-container">
                <div className="event-head-cont">
                    <h2 className="features-head event-head">Contact Form</h2>
                </div>
                <form onSubmit={submit} className="form">
                    <div className="form-ele-cont">
                        <label className="form-label" for="full-name"> Full Name </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Jonas Smith"
                            id="full-name"
                            required
                            className="form-input"
                        />
                    </div>
                    <div className="form-ele-cont">
                        <label className="form-label" for="email"> Email </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="demo@gmail.com"
                            id="email"
                            required
                            className="form-input"
                        />
                    </div>
                    <div className="form-ele-cont">
                        <label className="form-label" for="feedback"> Feedback </label>
                        <textarea
                            name="feedback"
                            id="feedback"
                            className="form-input form-input-feedback"
                            placeholder="feedback"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                        ></textarea>
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

export default ContactPage;