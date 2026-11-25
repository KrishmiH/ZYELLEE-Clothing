import Link from "next/link";

export default function BrandStory() {
  return (
    <section className="brand-story">
      <p className="eyebrow">OUR PHILOSOPHY</p>

      <h2>
        Less, but better.
        <br />
        Always you.
      </h2>

      <p>
        At ZYELLEE, we believe everyday clothing
        should feel as good as it looks. Discover
        thoughtfully selected styles that bring
        comfort, confidence and simplicity into
        your everyday life.
      </p>

      <Link href="/about" className="story-link">
        DISCOVER OUR STORY →
      </Link>
    </section>
  );
}
