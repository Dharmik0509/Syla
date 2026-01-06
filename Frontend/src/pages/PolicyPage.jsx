import React from 'react';
import { useParams } from 'react-router-dom';
import '../styles/PolicyPage.css';

const policyContent = {
    'terms-conditions': {
        title: 'Terms of Service',
        content: (
            <>
                <p><strong>Owner:</strong> The website www.sylaindia.com is owned by Syla, based in Anand, Gujarat.</p>

                <h3 className="policy-heading">1. Company & Eligibility</h3>
                <p>The site is owned by Syla. We trade in readymade garments and do not manufacture them.</p>

                <h3 className="policy-heading">2. Orders & Payments</h3>
                <ul>
                    <li><strong>Payment Methods:</strong> Net Banking and UPI.</li>
                    <li><strong>Currency:</strong> All transactions are in Indian Rupees (INR).</li>
                    <li><strong>High Value Orders:</strong> For purchases equal to or exceeding INR 2,00,000, the user must upload a copy of their PAN card or the order will be cancelled.</li>
                    <li><strong>Taxes:</strong> Prices are subject to applicable taxes (GST, etc.).</li>
                </ul>

                <h3 className="policy-heading">3. Shipping & Delivery</h3>
                <ul>
                    <li><strong>Range:</strong> Delivery is available within India.</li>
                    <li><strong>Timeline:</strong> We aim to deliver within 30 days max, though delays may occur due to external factors.</li>
                    <li><strong>Attempts:</strong> Logistics providers will make a maximum of 2 attempts to deliver. If failed, the order may be cancelled.</li>
                    <li><strong>Risk:</strong> The risk of loss transfers to the user once the item is delivered.</li>
                </ul>

                <h3 className="policy-heading">4. Cancellation, Return & Exchange Policy (Strict)</h3>
                <ul>
                    <li><strong>Cancellations:</strong>
                        <ul>
                            <li><strong>By User:</strong> You can only cancel an order before it is shipped.</li>
                            <li><strong>By Company:</strong> The company can cancel orders for various reasons (fraud, invalid address, bulk resale orders, pricing errors, etc.).</li>
                        </ul>
                    </li>
                    <li><strong>Exchanges (Size Only):</strong>
                        <ul>
                            <li>Must be raised within 2 days of delivery.</li>
                            <li>Only applicable for size issues.</li>
                            <li>User pays the return shipping expense.</li>
                        </ul>
                    </li>
                    <li><strong>Returns (Defects Only):</strong>
                        <ul>
                            <li>Accepted only for defective, damaged, or wrong products.</li>
                            <li>Must be raised within 2 days of delivery.</li>
                            <li>User pays the return shipping expense (non-refundable).</li>
                        </ul>
                    </li>
                    <li><strong>Refund Method:</strong> Refunds are sent to the original payment source within 2-3 working days after the return is processed.</li>
                </ul>

                <h3 className="policy-heading">5. Privacy & Data</h3>
                <ul>
                    <li><strong>Data Usage:</strong> User data is stored in compliance with the IT Act 2000.</li>
                    <li><strong>Third Parties:</strong> Data may be shared with third-party service providers (logistics, etc.) and finance partners (for offers and verification).</li>
                    <li><strong>Cookies:</strong> The site and third parties use cookies for tailored advertising.</li>
                </ul>

                <h3 className="policy-heading">6. Legal & Liability</h3>
                <ul>
                    <li><strong>"As Is" Basis:</strong> The website and services are provided without warranties. The company is not liable for technical errors, viruses, or interruptions.</li>
                    <li><strong>Indemnity:</strong> Users agree to indemnify the company against any legal claims or damages resulting from their use of the site.</li>
                    <li><strong>Jurisdiction:</strong> Any disputes are governed by the laws of India.</li>
                </ul>

                <h3 className="policy-heading">7. Contact & Grievances</h3>
                <ul>
                    <li><strong>Helpline:</strong> +91 9274720033 (Available 6 days a week, 11 AM to 8 PM).</li>
                    <li><strong>Legal Notices:</strong> Must be sent in English or Hindi to the company's official channels.</li>
                </ul>
            </>
        )
    },
    'privacy-policy': {
        title: 'Privacy Policy',
        content: (
            <>
                <h3 className="policy-heading">1. Scope & Consent</h3>
                <ul>
                    <li><strong>Applicability:</strong> This policy applies to all current and former consumers using the website. By using the site, you automatically agree to these terms.</li>
                    <li><strong>Third Parties:</strong> This policy does not cover data collected by third-party websites or affiliates linked on the Syla site.</li>
                    <li><strong>Eligibility:</strong> Users must be 18 years or older. Syla does not knowingly collect data from minors.</li>
                </ul>

                <h3 className="policy-heading">2. Information Collection</h3>
                <p>Syla collects three types of data:</p>
                <ul>
                    <li><strong>Provided by You:</strong> Name, photo, address, email, phone number, and ID/address proof.</li>
                    <li><strong>Automated Data:</strong> IP address, browser/device details, location, time zone, and clickstream data (pages visited, time spent, etc.).</li>
                    <li><strong>From Third Parties:</strong> Data from advertising networks, analytics providers, and other partners.</li>
                </ul>

                <h3 className="policy-heading">3. How Data is Used</h3>
                <p>Your information is used to:</p>
                <ul>
                    <li>Process orders and requests.</li>
                    <li>Improve services, security, and website functionality.</li>
                    <li>Send updates, offers, and promotions.</li>
                    <li>Resolve disputes or grievances.</li>
                    <li>Comply with legal obligations and government directions.</li>
                </ul>

                <h3 className="policy-heading">4. Data Sharing & Storage</h3>
                <ul>
                    <li><strong>Storage:</strong> Data is stored in compliance with the Information Technology Act, 2000.</li>
                    <li><strong>International Transfer:</strong> Data may be transferred, processed, and stored outside India.</li>
                    <li><strong>Sharing:</strong> Data may be shared with affiliates, service providers, potential buyers, and government authorities.</li>
                </ul>

                <h3 className="policy-heading">5. Security & Retention</h3>
                <ul>
                    <li><strong>Security:</strong> Syla uses industry-standard encryption (SSL) and access controls. However, we do not guarantee absolute security against data breaches or malicious attacks.</li>
                    <li><strong>Retention:</strong> Data is retained only as long as necessary for business purposes or to comply with the law (e.g., fraud prevention).</li>
                </ul>

                <h3 className="policy-heading">6. Cookies & Tracking</h3>
                <ul>
                    <li><strong>Cookies:</strong> The site uses cookies (mostly session cookies) to track user preferences and improve responsiveness. You can decline cookies, but some website features may not work.</li>
                    <li><strong>Local Storage:</strong> Syla may store information locally on your device to facilitate services.</li>
                </ul>

                <h3 className="policy-heading">7. Contact & Grievance Redressal</h3>
                <p>If you have privacy concerns, you can contact the support team or the Grievance Officer.</p>
                <ul>
                    <li><strong>Email:</strong> sylalife@gmail.com</li>
                    <li><strong>Address:</strong> “Trivedi House” Chandralok Society, Opp Mahendra Shah Hospital, Bhalej Road, Anand-388001 (Guj)</li>
                    <li><strong>Grievance Officer:</strong> Customer Service Manager</li>
                </ul>
            </>
        )
    },
    'shipping-delivery': {
        title: 'Shipping Policy',
        content: (
            <>
                <h3 className="policy-heading">1. Delivery Process & Timeline</h3>
                <ul>
                    <li><strong>Address Verification:</strong> The company verifies the shipping address before processing. If an address is unserviceable, the user must provide an alternative address within India.</li>
                    <li><strong>Timeline:</strong> Orders are generally delivered by the estimated date or within a maximum of 30 days.</li>
                    <li><strong>Delays:</strong> If the company cannot meet the delivery deadline, the user can choose to wait for a new date or cancel for a full refund. However, the company is not liable for compensation regarding mental agony or inconvenience caused by delays due to external factors (weather, political issues, etc.).</li>
                </ul>

                <h3 className="policy-heading">2. Delivery Attempts</h3>
                <ul>
                    <li><strong>Attempts:</strong> Logistics partners will make a maximum of 2 attempts to deliver.</li>
                    <li><strong>Failure to Receive:</strong> If the user is unavailable after 2 attempts, the company reserves the right to cancel the order.</li>
                    <li><strong>Rescheduling:</strong> Deliveries cannot be rescheduled once the order is placed.</li>
                </ul>

                <h3 className="policy-heading">3. Risk & Ownership</h3>
                <ul>
                    <li><strong>Transfer:</strong> Title and risk of loss for the products transfer to the user immediately upon delivery to the provided address.</li>
                </ul>

                <h3 className="policy-heading">4. Taxes & Duties</h3>
                <ul>
                    <li><strong>India:</strong> All prices displayed are inclusive of Indian taxes and VAT.</li>
                    <li><strong>International:</strong> Customers are responsible for any import duties or customs taxes that may apply. These fees are unpredictable and must be paid prior to delivery to the courier (e.g., DHL/FedEx) to release the shipment.</li>
                </ul>
            </>
        )
    },
    'returns-exchanges': {
        title: 'Exchange & Return Policy',
        content: (
            <>
                <h3 className="policy-heading">1. Exchange Policy (Size/Style)</h3>
                <ul>
                    <li><strong>Time Limit:</strong> Request must be made within 2 days of delivery.</li>
                    <li><strong>Eligibility:</strong> Only for unused items with tags. Not valid for sale, discounted, or coupon-based items.</li>
                    <li><strong>Cost:</strong> There is a processing fee of INR 250 for reverse pickup.</li>
                    <li><strong>Method:</strong> If pickup is unavailable, you must self-ship.</li>
                    <li><strong>Outcome:</strong> If the new size/item is out of stock, you receive your money on original payment source.</li>
                    <li><strong>Restriction:</strong> You cannot exchange an item twice (No second-time exchanges).</li>
                </ul>

                <h3 className="policy-heading">2. Return Policy (Damaged/Defective Only)</h3>
                <ul>
                    <li><strong>Condition:</strong> Returns are accepted ONLY for damaged or defective items.</li>
                    <li><strong>Requirement:</strong> A clear unboxing video showing the damage is mandatory.</li>
                    <li><strong>Time Limit:</strong> Report within 48 hours via email or Instagram.</li>
                    <li><strong>Refund Method:</strong> No Cash Refunds. You will receive original payment source after deducting shipping charges.</li>
                </ul>

                <h3 className="policy-heading">3. Cancellation Policy</h3>
                <p>Orders can be canceled within 24 hours of placement.</p>

                <h3 className="policy-heading">4. Key Fees & Exclusions</h3>
                <ul>
                    <li><strong>Exchange Fee:</strong> INR 250.</li>
                    <li><strong>Discounted Item Fee:</strong> Size exchanges on discounted items (if permitted) incur a fee of INR 300.</li>
                    <li><strong>International Orders:</strong> No returns or exchanges allowed.</li>
                </ul>
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
        <div className="policy-page">
            <div className="policy-container">
                <h1 className="policy-title">
                    {page.title}
                </h1>
                <div className="policy-content-wrapper">
                    {page.content}
                </div>
            </div>
        </div>
    );
};

export default PolicyPage;
