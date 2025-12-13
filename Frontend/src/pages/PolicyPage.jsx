import React from 'react';
import { useParams } from 'react-router-dom';

const policyContent = {
    'terms-conditions': {
        title: 'Terms & Conditions',
        content: (
            <>
                <p>Welcome to Syla. These terms and conditions outline the rules and regulations for the use of our website.</p>
                <h3>1. Introduction</h3>
                <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use Syla if you do not agree to take all of the terms and conditions stated on this page.</p>
                <h3>2. License</h3>
                <p>Unless otherwise stated, Syla and/or its licensors own the intellectual property rights for all material on Syla. All intellectual property rights are reserved.</p>
                <h3>3. User Comments</h3>
                <p>This Agreement shall begin on the date hereof.</p>
            </>
        )
    },
    'privacy-policy': {
        title: 'Privacy Policy',
        content: (
            <>
                <p>At Syla, accessible from our website, one of our main priorities is the privacy of our visitors.</p>
                <h3>Information We Collect</h3>
                <p>The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.</p>
                <h3>How We Use Your Information</h3>
                <p>We use the information we collect in various ways, including to provide, operate, and maintain our website.</p>
            </>
        )
    },
    'shipping-delivery': {
        title: 'Shipping & Delivery',
        content: (
            <>
                <p>We aim to deliver your order as soon as possible.</p>
                <h3>Domestic Shipping</h3>
                <p>We offer free shipping on all orders within India. Delivery typically takes 5-7 business days.</p>
                <h3>International Shipping</h3>
                <p>We ship worldwide. International delivery times vary by destination but generally take 10-15 business days.</p>
            </>
        )
    },
    'returns-exchanges': {
        title: 'Returns & Exchanges',
        content: (
            <>
                <p>We want you to be completely satisfied with your purchase.</p>
                <h3>Return Policy</h3>
                <p>You may return items within 7 days of delivery for a full refund or exchange, provided the items are unused and in their original condition.</p>
            </>
        )
    },
    'careers': {
        title: 'Careers',
        content: (
            <>
                <p>Join the Syla family.</p>
                <p>We are always looking for passionate individuals to join our team. Please send your resume to careers@syla.com.</p>
            </>
        )
    },
    'craft-heritage': {
        title: 'Craft & Heritage',
        content: (
            <>
                <p>Our legacy is built on the looms of Banaras.</p>
                <p>We work directly with master weavers to create textiles that are not just fabrics, but pieces of art. Each thread tells a story of tradition, skill, and dedication.</p>
            </>
        )
    }
};

const PolicyPage = () => {
    const { pageId } = useParams();
    const page = policyContent[pageId];

    if (!page) {
        return (
            <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                <h2>Page Not Found</h2>
            </div>
        );
    }

    return (
        <div className="policy-page" style={{ paddingTop: 'var(--header-height)' }}>
            <div className="container" style={{ padding: '4rem 2rem', maxWidth: '800px' }}>
                <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>
                    {page.title}
                </h1>
                <div className="policy-content" style={{ lineHeight: '1.8' }}>
                    {page.content}
                </div>
            </div>
        </div>
    );
};

export default PolicyPage;
