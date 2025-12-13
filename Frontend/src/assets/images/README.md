# Image Assets

Place your high-quality saree images in this directory.

## Recommended Files

To replace the placeholders used in the app, add the following files here:

- `hero-bg.jpg` (For the main banner)
- `collection-saree.jpg`
- `collection-lehenga.jpg`
- `collection-dupatta.jpg`
- `story-weaving.jpg` (For the "Handwoven Stories" section)
- `product-1.jpg`
- `product-2.jpg`
- `product-3.jpg`
- `product-4.jpg`

## How to Update Code

In each component (`src/components/...`), replace the remote URL string with a local import:

```javascript
// Old
const bgImage = "https://images.unsplash.com/...";

// New
import bgImage from '../assets/images/hero-bg.jpg';
```
