// Import all images
import imgSarees from '../assets/images/IMG_6925.JPG';
import imgLehengas from '../assets/images/IMG_6926.JPG';
import imgSuits from '../assets/images/IMG_6929.JPG';
import imgDupattas from '../assets/images/IMG_6930.JPG';
import imgFabrics from '../assets/images/IMG_6931.JPG';
import imgBlouses from '../assets/images/IMG_6935.JPG';
import imgGifts from '../assets/images/IMG_6939.JPG';
import imgColl1 from '../assets/images/IMG_6943.JPG';
import imgColl2 from '../assets/images/IMG_6944.JPG';
import imgColl3 from '../assets/images/IMG_6948.JPG';
import imgProd1 from '../assets/images/IMG_6952.JPG';
import imgProd2 from '../assets/images/IMG_6956.JPG';
import imgProd3 from '../assets/images/IMG_6959.JPG';
import imgProd4 from '../assets/images/IMG_6961.JPG';

// Helper to generate mock products for each category
const generateProducts = (baseImage, categoryName, count = 6) => {
    return Array.from({ length: count }, (_, i) => ({
        id: `${categoryName.toLowerCase()}-${i + 1}`,
        name: `${categoryName} Design ${i + 1}`,
        price: "₹ " + (15000 + (i * 2500)).toLocaleString(),
        image: baseImage,
        description: `Exquisite ${categoryName.toLowerCase()} crafted with precision.`
    }));
};

export const productsData = {
    sarees: {
        title: "Katan Silk Sarees",
        description: "Elegant and timeless Banarasi sarees.",
        items: [
            ...generateProducts(imgSarees, "Saree", 4),
            { id: 's-5', name: "Katan Silk Jangla", price: "₹ 45,000", image: imgProd1 },
            { id: 's-6', name: "Gold Zari Katan", price: "₹ 52,000", image: imgProd2 },
            { id: 's-7', name: "Tissue Silk", price: "₹ 38,500", image: imgProd3 },
            { id: 's-8', name: "Traditional Banarasi", price: "₹ 60,000", image: imgProd4 }
        ]
    },
    lehengas: {
        title: "Bridal Lehengas",
        description: "Handcrafted lehengas for your special day.",
        items: generateProducts(imgLehengas, "Lehenga", 8)
    },
    suits: {
        title: "Designer Suits",
        description: "Contemporary and traditional suits.",
        items: generateProducts(imgSuits, "Suit", 6)
    },
    dupattas: {
        title: "Handwoven Dupattas",
        description: "Add a touch of elegance with our dupattas.",
        items: generateProducts(imgDupattas, "Dupatta", 6)
    },
    fabrics: {
        title: "Premium Fabrics",
        description: "Silk fabrics for custom tailoring.",
        items: generateProducts(imgFabrics, "Fabric", 6)
    },
    blouses: {
        title: "Designer Blouses",
        description: "Perfectly fitted blouses.",
        items: generateProducts(imgBlouses, "Blouse", 6)
    },
    gifts: {
        title: "Gifting Collections",
        description: "Perfect gifts for loved ones.",
        items: generateProducts(imgGifts, "Gift", 6)
    }
};
