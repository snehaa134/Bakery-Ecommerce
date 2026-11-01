import { useTheme } from "../../festiveThemeContext/festiveThemeContext";
import diya from "../../assets/images/diya.png";
import "../festiveDecoration/festiveDecoration.css";

const FestiveDecorations = () => {
    const { activeTheme } = useTheme();

    if (!activeTheme || activeTheme.animationType !== "diya-glow") {
        return null;
    }

    const sparkles = Array.from({ length: 22 }, (_, index) => ({
        id: index,
        left: `${(index * 37 + 13) % 100}%`,
        top: `${(index * 53 + 17) % 100}%`,
        delay: `${(index % 7) * 0.4}s`,
        size: `${9 + (index % 3) * 3}px`,
    }));

    return (
        <div className="festive-decoration">

            <div className="sparkles">
                {sparkles.map((sparkle) => (
                    <span
                        key={sparkle.id}
                        className="sparkle"
                        style={{
                            left: sparkle.left,
                            top: sparkle.top,
                            animationDelay: sparkle.delay,
                            fontSize: sparkle.size,
                        }}
                    >
                        ✦
                    </span>
                ))}
            </div>
            {[1, 2, 3,4,5].map((item) => (
                <img
                    key={item}
                    src={diya}
                    alt="Diya"
                    className={`floating-diya diya-${item}`}
                />
            ))} 

        </div>
    );
};

export default FestiveDecorations;