import { useEffect, useState } from "react";
import { useGetAllBannersQuery } from "../../servicesApis/bannerServices/bannerServices";
import "../banner/banner.css";
import { useNavigate } from "react-router-dom";

const Banner = () => {
    const { data, isLoading, isError } = useGetAllBannersQuery();
    const navigate = useNavigate();
    const banners = data?.data || [];

    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (banners?.length <= 1) return;

        const timer = setInterval(() => {
            setIndex((currentIndex) => {
                return (currentIndex + 1) % banners?.length
            })
        }, 3000);
        return () => clearInterval(timer);

    }, [banners?.length])



    if (isLoading) {
        return <p>Loading banners..</p>
    }

    if (isError) {
        return <p>Something went wrong!</p>
    }
    if (banners?.length === 0) {
        return <p>No banners available</p>
    }

    const banner = banners[index];

    return (
        <>
            <div className="main-banner">
                <div className="banner-content">
                    <h2>{banner.title}</h2>
                    <p>{banner.description}</p>
                    <button className="buy-btn" onClick={()=>navigate("/products")}>
                        Buy Now
                    </button>
                </div>

                {banner?.images?.[0] && (
                    <img src={`http://localhost:5000/uploads/${banner?.images[0]}`} alt={banner.title} className="banner-img" />
                )}

                {banners?.length > 1 && (
                    <div className="banner-buttons">

                        <button onClick={() => setIndex((index + 1) % banners?.length)}>Next</button>
                        <button onClick={() => setIndex((index - 1 + banners?.length) % banners?.length)}>Previous</button>

                    </div>
                )}


            </div>




        </>
    )
}
export default Banner;

