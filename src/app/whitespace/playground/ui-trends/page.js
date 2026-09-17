import styles from './ui-trends.module.css'
import Punct from '@/app/whitespace/punct'

export const metadata = {
  title: 'UI Design Trends Playground',
  description: 'Interactive examples of modern UI trends like Aurora Gradients, Glassmorphism, and Bento Box layouts.',
}

export default function UITrendsPlayground() {
  return (
    <div className={styles.playgroundWrapper}>
      {/* 1. Aurora Mesh Gradient */}
      <section className={styles.trendSection}>
        <div className={styles.sectionHeader}>
          <Punct><h2>01. Aurora Mesh Gradients</h2></Punct>
          <p>Replacing flat colors with rich, blurred radial depth.</p>
        </div>
        <div className={styles.auroraContainer}>
          <div className={styles.auroraBlob1}></div>
          <div className={styles.auroraBlob2}></div>
          <div className={styles.auroraBlob3}></div>
          <div className={styles.auroraContent}>
            <h3>Modern Depth</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
        </div>
      </section>

      {/* 2. Glassmorphism */}
      <section className={styles.trendSection}>
        <div className={styles.sectionHeader}>
          <Punct><h2>02. Glassmorphism</h2></Punct>
          <p>Creating hierarchy and context through frosted layers.</p>
        </div>
        <div className={styles.glassBackground}>
          <div className={styles.glassCard}>
            <h3>Frosted UI Layer</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <button className={styles.glassButton}>Lorem Ipsum</button>
          </div>
        </div>
      </section>

      {/* 3. Bento Box Layout */}
      <section className={styles.trendSection}>
        <div className={styles.sectionHeader}>
          <Punct><h2>03. Bento Box Layout</h2></Punct>
          <p>Organizing complexity using asymmetrical CSS grids.</p>
        </div>
        <div className={styles.bentoContainer}>
          <div className={`${styles.bentoCard} ${styles.bentoHero}`}>
            <h3>Primary Feature</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>
          </div>
          <div className={`${styles.bentoCard} ${styles.bentoSquare}`}>
            <h4>Metric</h4>
            <h2>82%</h2>
          </div>
          <div className={`${styles.bentoCard} ${styles.bentoSquare}`}>
            <h4>Status</h4>
            <p>Lorem ipsum</p>
          </div>
          <div className={`${styles.bentoCard} ${styles.bentoWide}`}>
            <h3>Secondary Details</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut perspiciatis unde omnis iste natus error sit voluptatem.</p>
          </div>
        </div>
      </section>

      {/* 4. Scrollytelling (For Video Recording) */}
      <section className={styles.trendSection}>
        <div className={styles.sectionHeader}>
          <Punct><h2>04. Scrollytelling</h2></Punct>
          <p>Scroll down to see the graphic react to your scroll position.</p>
        </div>
        <div className={styles.scrollyContainer}>
          <div className={styles.scrollyStickyGraphic}>
            <div className={styles.graphicPlaceholder}>
              <h3>Interactive Graphic</h3>
              <p>Watch me change as you scroll.</p>
            </div>
          </div>
          <div className={styles.scrollyContent}>
            <div className={styles.scrollyCard}>
              <h3>Step 1</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nisl eros, pulvinar facilisis justo mollis.</p>
            </div>
            <div className={styles.scrollyCard}>
              <h3>Step 2</h3>
              <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>
            </div>
            <div className={styles.scrollyCard}>
              <h3>Step 3</h3>
              <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
