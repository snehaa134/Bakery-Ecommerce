
import { useTheme } from "../../festiveThemeContext/festiveThemeContext";
import "../festiveDecoration/festiveDecoration.css";
import { FaMagic, FaSnowflake, FaStar } from "react-icons/fa";
import diya from "../../assets/images/diya.png";

const FestiveDecorations = () => {
    const { activeTheme } = useTheme();

    if (!activeTheme || activeTheme.animationType === "none") {
        return null;
    }

    const animationType = activeTheme.animationType;

    return (
        <div className={`festive-decoration ${animationType}`}>

            {animationType === "diya-glow" && (
                <div className="diwali-sparkles">
                    {Array.from({ length: 5 }, (_, i) => (
                        <span
                            key={`diya-${i}`}
                            className="diya-item"
                            style={{
                                left: `${10 + i * 20}%`,
                                animationDelay: `${i * 0.4}s`
                            }}
                        >
                            <img src={diya} alt="Diya" />
                        </span>
                    ))}

                    {Array.from({ length: 25 }, (_, i) => (
                        <span
                            key={`sparkle-${i}`}
                            className="sparkle-item"
                            style={{
                                left: `${(i * 17) % 100}%`,
                                top: `${2 + (i % 3) * 6}px`,
                                animationDelay: `${i * 0.15}s`
                            }}
                        >
                           <FaStar/>
                        </span>
                    ))}
                </div>
            )}

            {animationType === "snowfall" && (
                <div className="christmas-snow">
                    {Array.from({ length: 15 }, (_, i) => (
                        <span
                            key={i}
                            style={{
                                left: `${i * 7}%`,
                                animationDelay: `${i * 0.5}s`,
                                animationDuration: `${4 + (i % 4)}s`
                            }}
                        >
                            <FaSnowflake />
                        </span>
                    ))}
                </div>
            )}

            {animationType === "confetti" && (
                <div className="newyear-confetti">
                    {Array.from({ length: 15 }, (_, i) => (
                        <span
                            key={i}
                            style={{
                                left: `${i * 7}%`,
                                animationDelay: `${i * 0.4}s`
                            }}
                        />
                    ))}
                </div>
            )}

            {animationType === "twinkle" && (
                <div className="diwali-sparkles">
                    {Array.from({ length: 25 }, (_, i) => (
                        <span
                            key={i}
                            className="sparkle-item"
                            style={{
                                left: `${(i * 17) % 100}%`,
                                top: `${2 + (i % 3) * 6}px`,
                                animationDelay: `${i * 0.15}s`
                            }}
                        >
                            <FaStar />
                        </span>
                    ))}
                </div>
            )}

        </div>
    );
};

export default FestiveDecorations;
