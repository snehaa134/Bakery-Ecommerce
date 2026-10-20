import { useNavigate } from "react-router-dom";
import { FaBirthdayCake, FaHeart } from "react-icons/fa";
import { GiStrawberry } from "react-icons/gi";
import about from "../../assets/images/about.jpg";
import ourstory from "../../assets/images/ourstory.jpg";
import "../aboutUs/about.css";
const About = () => {
    const navigate = useNavigate();

    return (
        <div className="about-page">

            <section
                className="about-hero"
                style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${about})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat"
                }}
            >
                <div className="about-hero-content">
                    <p className="about-subtitle">
                        WELCOME TO BAKERY BLISS
                    </p>

                    <h1>
                        Baking Happiness,
                        <br />
                        One Bite at a Time
                    </h1>

                    <p>
                        Every cake brings sweetness and happiness
                        to your special moments.
                    </p>

                    <button onClick={() => navigate("/products")}>
                        Shop Now
                    </button>
                </div>
            </section>

            <section className="about-story">
                <div className="about-story-image">
                    <img
                        src={ourstory}
                        alt="Beautiful bakery cake"
                    />
                </div>

                <div className="about-story-content">
                    <p className="about-label">OUR STORY</p>

                    <h2>A Little Sweetness in Every Moment</h2>

                    <p>
                        Welcome to Bakery Bliss, your happy place
                        for delicious cakes, delightful pastries,
                        and sweet treats.
                    </p>

                    <p>
                        We believe every celebration deserves
                        something special. From birthdays to
                        everyday cravings, we bring sweetness
                        to your memorable moments.
                    </p>

                    <button onClick={() => navigate("/products")}>
                        Explore Our Products
                    </button>
                </div>
            </section>

            <section className="about-features">
                <div className="about-section-heading">
                    <p className="about-label">WHY BAKERY BLISS?</p>
                    <h2>Made to Make You Smile</h2>
                    <p>Discover something sweet for every occasion.</p>
                </div>

                <div className="about-feature-grid">
                    <div className="about-feature-card">
                        <FaBirthdayCake className="feature-icon" />
                        <h3>Beautiful Cakes</h3>
                        <p>
                            Delicious cakes for birthdays,
                            celebrations, and special moments.
                        </p>
                    </div>

                    <div className="about-feature-card">
                        <GiStrawberry className="feature-icon" />
                        <h3>Sweet Variety</h3>
                        <p>
                            Explore chocolate cakes, fruit cakes,
                            pastries, donuts, and more.
                        </p>
                    </div>

                    <div className="about-feature-card">
                        <FaHeart className="feature-icon" />
                        <h3>Made with Love</h3>
                        <p>
                            We aim to make your bakery experience
                            enjoyable and memorable.
                        </p>
                    </div>
                </div>
            </section>

            <section className="about-cta">
                <p>MAKE EVERY MOMENT SWEETER</p>
                <h2>Life Is Sweeter with Cake!</h2>

                <button onClick={() => navigate("/products")}>
                    Explore Shop
                </button>
            </section>

        </div>
    );
};

export default About;