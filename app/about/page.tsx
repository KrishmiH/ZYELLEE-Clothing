import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="about-page">
      <section className="about-hero">
        <p className="about-eyebrow">THE STORY OF ZYELLEE</p>
        <h1>Style that feels like you.</h1>
        <p>
          Thoughtful everyday clothing made for effortless wear.
          Discover a collection designed to bring simplicity,
          confidence, and comfort into your everyday wardrobe.
        </p>
      </section>

      <section className="about-story">
        {/* <div className="about-story-image">
          <Image
            src="/images/about-story.jpg"
            alt="ZYELLEE fashion collection"
            width={700}
            height={850}
          />
        </div> */}
        <div className="about-story-image">
            <div className="about-image-placeholder">
                ZYELLEE
            </div>
        </div>

        <div className="about-story-content">
          <p className="about-eyebrow">WHO WE ARE</p>
          <h2>Everyday style, thoughtfully considered.</h2>
          <p>
            ZYELLEE is about making everyday dressing feel simple
            and special. We believe great style doesn't need to be
            complicated. It comes from pieces that feel comfortable,
            look beautiful, and fit naturally into your life.
          </p>
          <p>
            Our collection is thoughtfully selected for those who
            appreciate timeless style, effortless combinations,
            and the little details that make an outfit feel right.
          </p>
        </div>
      </section>

      <section className="about-values">
        <p className="about-eyebrow">OUR PHILOSOPHY</p>
        <h2>Less, but better.</h2>

        <div className="about-values-grid">
          <div>
            <h3>EFFORTLESS STYLE</h3>
            <p>
              Versatile pieces that make getting dressed feel easy.
            </p>
          </div>

          <div>
            <h3>EVERYDAY COMFORT</h3>
            <p>
              Styles chosen with comfort and confidence in mind.
            </p>
          </div>

          <div>
            <h3>TIMELESS DETAILS</h3>
            <p>
              A thoughtful approach to pieces you'll love wearing.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}