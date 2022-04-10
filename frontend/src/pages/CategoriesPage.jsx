import Category1Image from "../Images/1.jpg";
import Category2Image from "../Images/sports.jpg";
import Category3Image from "../Images/conferences.jpg";
import Category4Image from "../Images/expos.jpg";
import Category5Image from "../Images/festival.jpg";
import Category6Image from "../Images/arts.jpg";
import Category7Image from "../Images/community.jpg";
import Category8Image from "../Images/politics.jpg";
import Category9Image from "../Images/academics.jpg";
import { Link } from "react-router-dom";

function CategoriesPage() {
    return <main>
        <div className="features categories">
            <div className="features-card-cont">
                <div className="features-card categories-card">
                    <div className="category-head">
                        <img
                            src={Category1Image}
                            className="feature-img category-img category-img-1"
                            alt=""
                        />
                        <span className="feature-card-head feature-card-head-1"> the </span>
                        <span className="feature-card-head feature-card-head-2">
                            concert
                        </span>
                    </div>
                    <div className="categort-txt-cont">
                        <p className="category-abt">
                            From massive tours down to gigs with only a handful of people,
                            know which shows drive your demand.
                        </p>
                        <div className="header-button-cont categories-btn-cont">
                            <Link to="/categories/concert" className="btn ctg-btn ctg-btn-1">
                                <span className="btn-visible categories-btn-txt">Learn More</span>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="features-card categories-card">
                    <div className="category-head">
                        <img
                            src={Category2Image}
                            className="feature-img category-img category-img-1"
                            alt=""
                        />
                        <span
                            className="feature-card-head category-card-head-2 feature-card-head-1"
                        >
                            the
                        </span>
                        <span
                            className="feature-card-head category-card-head-2 feature-card-head-2"
                        >
                            sports
                        </span>
                    </div>
                    <div className="categort-txt-cont">
                        <p className="category-abt">
                            Tournaments and more — sports are big demand drivers. We have
                            tailored models for each sport.
                        </p>
                        <div className="header-button-cont categories-btn-cont">
                            <Link to="/categories/sports" className="btn ctg-btn ctg-btn-2">
                                <span className="btn-visible categories-btn-txt">Learn More</span>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="features-card categories-card">
                    <div className="category-head">
                        <img
                            src={Category3Image}
                            className="feature-img category-img category-img-1"
                            alt=""
                        />
                        <span
                            className="feature-card-head category-card-head-3 feature-card-head-1"
                        >
                            the
                        </span>
                        <span
                            className="feature-card-head category-card-head-3 feature-card-head-2"
                        >
                            conference
                        </span>
                    </div>
                    <div className="categort-txt-cont">
                        <p className="category-abt">
                            Large conferences need to be in your forecasts and are
                            especially dynamic (location-change).
                        </p>
                        <div className="header-button-cont categories-btn-cont">
                            <Link to="/categories/conference" className="btn ctg-btn ctg-btn-3">
                                <span className="btn-visible categories-btn-txt">Learn More</span>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="features-card categories-card">
                    <div className="category-head">
                        <img
                            src={Category4Image}
                            className="feature-img category-img category-img-1"
                            alt=""
                        />
                        <span
                            className="feature-card-head category-card-head-3 feature-card-head-1"
                        >
                            the
                        </span>
                        <span
                            className="feature-card-head category-card-head-3 feature-card-head-2"
                        >
                            expos
                        </span>
                    </div>
                    <div className="categort-txt-cont">
                        <p className="category-abt">
                            Major events for educating the public or an industry. We cover
                            international, national and state trade shows.
                        </p>
                        <div className="header-button-cont categories-btn-cont">
                            <Link to="/categories/expos" className="btn ctg-btn ctg-btn-3">
                                <span className="btn-visible categories-btn-txt">Learn More</span>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="features-card categories-card">
                    <div className="category-head">
                        <img
                            src={Category5Image}
                            className="feature-img category-img category-img-1"
                            alt=""
                        />
                        <span
                            className="feature-card-head category-card-head-5 feature-card-head-1"
                        >
                            the
                        </span>
                        <span
                            className="feature-card-head category-card-head-5 feature-card-head-2"
                        >
                            festival
                        </span>
                    </div>
                    <div className="categort-txt-cont">
                        <p className="category-abt">
                            Multi-day, multi-performer events. From small local shows to
                            major international festivals with millions of attendees.
                        </p>
                        <div className="header-button-cont categories-btn-cont">
                            <Link to="/categories/festival" className="btn ctg-btn ctg-btn-5">
                                <span className="btn-visible categories-btn-txt">Learn More</span>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="features-card categories-card">
                    <div className="category-head">
                        <img
                            src={Category6Image}
                            className="feature-img category-img category-img-1"
                            alt=""
                        />
                        <span
                            className="feature-card-head category-card-head-6 feature-card-head-1"
                        >
                            the
                        </span>
                        <span
                            className="feature-card-head category-card-head-6 feature-card-head-2"
                        >
                            arts
                        </span>
                    </div>
                    <div className="categort-txt-cont">
                        <p className="category-abt">
                            Plays, exhibitions and creative events. Often smaller, these are
                            part of perfect storms of demand.
                        </p>
                        <div className="header-button-cont categories-btn-cont">
                            <Link to="/categories/arts" className="btn ctg-btn ctg-btn-6">
                                <span className="btn-visible categories-btn-txt">Learn More</span>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="features-card categories-card">
                    <div className="category-head">
                        <img
                            src={Category7Image}
                            className="feature-img category-img category-img-1"
                            alt=""
                        />
                        <span
                            className="feature-card-head category-card-head-7 feature-card-head-1"
                        >
                            the
                        </span>
                        <span
                            className="feature-card-head category-card-head-7 feature-card-head-2"
                        >
                            community
                        </span>
                    </div>
                    <div className="categort-txt-cont">
                        <p className="category-abt">
                            Fetes, fun runs, farmers markets and much more. These are often
                            part of high-impact event clusters.
                        </p>
                        <div className="header-button-cont categories-btn-cont">
                            <Link to="/categories/community" className="btn ctg-btn ctg-btn-7">
                                <span className="btn-visible categories-btn-txt">Learn More</span>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="features-card categories-card">
                    <div className="category-head">
                        <img
                            src={Category8Image}
                            className="feature-img category-img category-img-1"
                            alt=""
                        />
                        <span
                            className="feature-card-head category-card-head-8 feature-card-head-1"
                        >
                            the
                        </span>
                        <span
                            className="feature-card-head category-card-head-8 feature-card-head-2"
                        >
                            politics
                        </span>
                    </div>
                    <div className="categort-txt-cont">
                        <p className="category-abt">
                            Elections, rallies and key events such as inaugurations, need to
                            be factored into plans.
                        </p>
                        <div className="header-button-cont categories-btn-cont">
                            <Link to="/categories/politics" className="btn ctg-btn ctg-btn-8">
                                <span className="btn-visible categories-btn-txt">Learn More</span>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="features-card categories-card">
                    <div className="category-head">
                        <img
                            src={Category9Image}
                            className="feature-img category-img category-img-1"
                            alt=""
                        />
                        <span
                            className="feature-card-head category-card-head-9 feature-card-head-1"
                        >
                            the
                        </span>
                        <span
                            className="feature-card-head category-card-head-9 feature-card-head-2"
                        >
                            academics
                        </span>
                    </div>
                    <div className="categort-txt-cont">
                        <p className="category-abt">
                            Key dates in tertiary education calendars such as graduation,
                            homecoming and exams.
                        </p>
                        <div className="header-button-cont categories-btn-cont">
                            <Link to="/categories/academics" className="btn ctg-btn ctg-btn-9">
                                <span className="btn-visible categories-btn-txt">Learn More</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>;
}

export default CategoriesPage;