import Link from "next/link";

function HomeBrand() {
  return (
    <Link className="home-brand" href="/" aria-label="RecoveryFlow home">
      <span className="home-brand-mark" aria-hidden="true"><i /><i /><i /></span>
      <span>Recovery<span>Flow</span></span>
    </Link>
  );
}

export default function Home() {
  return (
    <main className="home-hero" id="home">
      <header className="home-header">
        <HomeBrand />
      </header>

      <section className="home-hero-shell" aria-labelledby="home-hero-title">
        <div className="home-hero-image" aria-hidden="true" />
        <div className="home-hero-overlay" aria-hidden="true" />
        <div className="home-hero-grid" aria-hidden="true" />

        <div className="home-hero-copy">
          <h1 id="home-hero-title">KEEP THE<br /><em>UK WORKING</em></h1>
          <p className="home-positioning">Connecting the right people, knowledge and resources.</p>
          <p className="home-supporting">Helping the UK powered access industry work better together.</p>
          <div className="home-actions">
            <a className="home-primary" href="#discover">Discover RecoveryFlow <b>→</b></a>
            <Link className="home-secondary" href="/keep">Contribute to the Recovery Study <b>→</b></Link>
          </div>
        </div>

        <div className="home-hero-device" aria-hidden="true">
          <span className="home-orbit home-orbit-one" />
          <span className="home-orbit home-orbit-two" />
          <span className="home-signal"><i /><i /><i /></span>
        </div>
      </section>

      <section className="problem-section" id="discover" aria-labelledby="problem-title">
        <div className="problem-grid" aria-hidden="true" />
        <div className="problem-inner">
          <div className="problem-intro">
            <h2 id="problem-title">The industry already has people, knowledge and resources.</h2>
            <p>The challenge is connecting the right ones at the right time.</p>
          </div>

          <div className="problem-cards">
            <article className="problem-card">
              <span className="problem-card-mark" aria-hidden="true" />
              <h3>Knowledge is fragmented</h3>
              <p>Useful experience often stays with individuals or individual companies.</p>
            </article>
            <article className="problem-card">
              <span className="problem-card-mark" aria-hidden="true" />
              <h3>The right help is hard to find</h3>
              <p>When a machine stops, finding the right knowledge or resource can take time.</p>
            </article>
            <article className="problem-card">
              <span className="problem-card-mark" aria-hidden="true" />
              <h3>Lessons are easily lost</h3>
              <p>A problem gets solved—but the learning often doesn&apos;t travel.</p>
            </article>
          </div>

          <p className="problem-closing">RecoveryFlow exists to help close these gaps.</p>
        </div>
      </section>

      <section className="what-section" aria-labelledby="what-title">
        <div className="what-grid" aria-hidden="true" />
        <div className="what-inner">
          <div className="what-intro">
            <p className="what-label">WHAT WE DO</p>
            <h2 id="what-title">RecoveryFlow connects the people, knowledge and resources that help the industry work better together.</h2>
          </div>

          <div className="what-modules">
            <article className="what-module">
              <div className="what-module-head">
                <span aria-hidden="true">01</span>
                <p>PEOPLE</p>
              </div>
              <h3>Connect the right people.</h3>
              <p>Bring together fleet operators, engineers, manufacturers, suppliers and industry specialists.</p>
            </article>
            <article className="what-module">
              <div className="what-module-head">
                <span aria-hidden="true">02</span>
                <p>KNOWLEDGE</p>
              </div>
              <h3>Make useful knowledge easier to share.</h3>
              <p>Turn real experience, recurring problems and practical lessons into knowledge others can use.</p>
            </article>
            <article className="what-module">
              <div className="what-module-head">
                <span aria-hidden="true">03</span>
                <p>RESOURCES</p>
              </div>
              <h3>Connect the right resources when they&apos;re needed.</h3>
              <p>Help make relevant support, information and industry resources easier to find.</p>
            </article>
          </div>

          <p className="what-closing">Right people. Right knowledge. Right resources. Better recovery.</p>
        </div>
      </section>

      <section className="how-section" aria-labelledby="how-title">
        <div className="how-grid" aria-hidden="true" />
        <div className="how-inner">
          <h2 id="how-title">HOW IT WORKS</h2>

          <div className="cycle-track">
            <article className="cycle-stage">
              <div className="cycle-node" aria-hidden="true">01</div>
              <h3>LISTEN</h3>
              <p>Listen to real experiences from across the industry.</p>
              <span className="cycle-arrow" aria-hidden="true">→</span>
            </article>
            <article className="cycle-stage">
              <div className="cycle-node" aria-hidden="true">02</div>
              <h3>LEARN</h3>
              <p>Identify recurring problems, patterns and practical lessons.</p>
              <span className="cycle-arrow" aria-hidden="true">→</span>
            </article>
            <article className="cycle-stage">
              <div className="cycle-node" aria-hidden="true">03</div>
              <h3>CONNECT</h3>
              <p>Connect useful knowledge, people and resources.</p>
              <span className="cycle-arrow" aria-hidden="true">→</span>
            </article>
            <article className="cycle-stage">
              <div className="cycle-node" aria-hidden="true">04</div>
              <h3>IMPROVE</h3>
              <p>Help the industry apply what it learns and work better together.</p>
            </article>
            <div className="cycle-return" aria-hidden="true"><span>→</span></div>
          </div>

          <p className="how-closing">Listen. Learn. Connect. Improve. Then repeat.</p>
        </div>
      </section>

      <section className="study-section" aria-labelledby="study-title">
        <div className="study-grid" aria-hidden="true" />
        <div className="study-inner">
          <div className="study-intro">
            <div className="study-heading">
              <p>UK POWERED ACCESS RECOVERY STUDY 2026</p>
              <h2 id="study-title">Learning from real downtime experiences across the industry.</h2>
            </div>
            <div className="study-copy">
              <p>The Recovery Study brings together real experiences from fleet managers, engineers, rental companies, manufacturers and suppliers.</p>
              <p>By understanding what stopped machines, what delayed recovery and what helped get them back to work, we can identify practical lessons worth sharing across the industry.</p>
            </div>
          </div>

          <div className="study-focus">
            <article>
              <span aria-hidden="true" />
              <h3>REAL EXPERIENCES</h3>
              <p>Learn from what actually happens in the field.</p>
            </article>
            <article>
              <span aria-hidden="true" />
              <h3>SHARED LEARNING</h3>
              <p>Turn individual experience into useful industry knowledge.</p>
            </article>
            <article>
              <span aria-hidden="true" />
              <h3>PRACTICAL INSIGHT</h3>
              <p>Focus on lessons that can help reduce unnecessary downtime.</p>
            </article>
          </div>

          <div className="study-action">
            <p>Every experience adds another piece to the picture.</p>
            <Link href="/keep">Contribute to the Recovery Study <b>→</b></Link>
          </div>
        </div>
      </section>

      <section className="involved-section" aria-labelledby="involved-title">
        <div className="involved-grid" aria-hidden="true" />
        <div className="involved-inner">
          <h2 id="involved-title">GET INVOLVED</h2>

          <div className="involved-paths">
            <article className="involved-path involved-contribute">
              <p className="involved-label">CONTRIBUTE</p>
              <h3>Share your experience.</h3>
              <p>Contribute a real downtime experience to the UK Powered Access Recovery Study and help build a clearer picture of what happens across the industry.</p>
              <Link href="/keep">Contribute to the Recovery Study <b>→</b></Link>
            </article>

            <article className="involved-path involved-connect">
              <p className="involved-label">CONNECT</p>
              <h3>Become part of the network.</h3>
              <p>Join other industry professionals who want to share experience, exchange practical knowledge and help the industry learn faster together.</p>
              <span className="involved-future" role="link" aria-disabled="true">Become a RecoveryFlow Contributor <b>→</b></span>
            </article>
          </div>

          <p className="involved-closing">Better connections. Shared knowledge. A stronger industry.</p>
        </div>
      </section>

      <footer className="home-footer">
        <div className="footer-inner">
          <div className="footer-main">
            <div className="footer-branding">
              <HomeBrand />
              <p>Connecting the right people, knowledge and resources.</p>
            </div>

            <nav className="footer-nav" aria-label="Footer navigation">
              <Link href="/keep">Recovery Study <b>→</b></Link>
              <span role="link" aria-disabled="true">Contributor Programme <b>→</b></span>
              <span role="link" aria-disabled="true">LinkedIn <b>→</b></span>
            </nav>
          </div>

          <p className="footer-closing">KEEP THE <em>UK WORKING</em></p>

          <div className="footer-legal">
            <p>© 2026 RecoveryFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
