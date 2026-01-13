import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

export default function ScrollToTop() {
    const { pathname } = useLocation();
    const navType = useNavigationType();

    useEffect(() => {
        // Scroll to top only for PUSH (Link clicks) or REPLACE
        // Ignore POP (Back/Forward button) to let browser restore scroll
        if (navType !== 'POP') {
            window.scrollTo(0, 0);
        }
    }, [pathname, navType]);

    return null;
}
