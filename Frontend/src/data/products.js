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
    "3pc-set-kurti": {
        title: "3pc Set Kurti",
        description: "Elegant and stylish 3-piece kurti sets.",
        items: generateProducts(imgSuits, "Kurti Set", 6)
    },
    "casual-dress": {
        title: "Casual Dress",
        description: "Comfortable and chic casual dresses.",
        items: generateProducts(imgFabrics, "Casual Dress", 6)
    },
    "gown": {
        title: "Designer Gown",
        description: "Stunning gowns for evening wear.",
        items: generateProducts(imgLehengas, "Gown", 6)
    },
    "indo-western": {
        title: "Indo Western",
        description: "Fusion of Indian traditions and western styles.",
        items: generateProducts(imgBlouses, "Indo Western", 6)
    },
    "choli-saree": {
        title: "Choli Saree",
        description: "Traditional choli sarees with a modern twist.",
        items: generateProducts(imgSarees, "Choli Saree", 6)
    },
    "chaniya-choli": {
        title: "Chaniya Choli",
        description: "Vibrant chaniya cholis for festive occasions.",
        items: generateProducts(imgDupattas, "Chaniya Choli", 6)
    },
    "choli-suit": {
        title: "Choli Suit",
        description: "Perfect blend of choli and suit styles.",
        items: generateProducts(imgGifts, "Choli Suit", 6)
    }
};
