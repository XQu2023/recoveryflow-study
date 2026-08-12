import Link from "next/link";
import ContributorJoin from "./ContributorJoin";

export default function ContributorProgramme() {
  return (
    <main className="cp-page">
      <header className="home-header">
        <Link className="home-brand" href="/" aria-label="RecoveryFlow home">
          <span className="home-brand-mark" aria-hidden="true"><i /><i /><i /></span>
          <span>Recovery<span>Flow</span></span>
        </Link>
      </header>

      <section className="cp-hero" aria-labelledby="cp-title">
        <div className="cp-hero-image" aria-hidden="true" />
        <div className="cp-hero-overlay" aria-hidden="true" />
        <div className="cp-hero-grid" aria-hidden="true" />

        <div className="cp-copy">
          <p className="cp-eyebrow">RECOVERYFLOW CONTRIBUTOR PROGRAMME</p>
          <h1 id="cp-title">Help the industry learn from <em>experience.</em></h1>
          <p className="cp-supporting">Join professionals across the UK powered access industry who are willing to share experience, practical knowledge and ideas that can help others.</p>
          <a className="cp-primary" href="#join">Become a Contributor <b>→</b></a>
          <p className="cp-statement">No membership fee. No sales obligation. Contribute when you have something useful to share.</p>
        </div>

        <div className="cp-network" aria-hidden="true">
          <span className="cp-orbit cp-orbit-one" />
          <span className="cp-orbit cp-orbit-two" />
          <span className="cp-orbit cp-orbit-three" />
          <span className="cp-node cp-node-one" />
          <span className="cp-node cp-node-two" />
          <span className="cp-node cp-node-three" />
          <span className="home-signal"><i /><i /><i /></span>
        </div>
      </section>

      <span className="cp-join-anchor" aria-hidden="true" />

      <section className="cp-why" aria-labelledby="cp-why-title">
        <div className="cp-why-grid" aria-hidden="true" />
        <div className="cp-why-inner">
          <div className="cp-why-heading">
            <p>WHY CONTRIBUTE?</p>
            <h2 id="cp-why-title">Valuable industry knowledge already exists. Much of it never travels far enough.</h2>
          </div>

          <div className="cp-knowledge-flow" aria-label="Individual Experience to Shared Industry Knowledge">
            <div className="cp-flow-state cp-flow-individual">
              <div className="cp-individual-visual" aria-hidden="true">
                <span /><span /><span />
                <i />
              </div>
              <p>Individual Experience</p>
            </div>

            <div className="cp-flow-path" aria-hidden="true">
              <span /><span /><span />
              <b>→</b>
            </div>

            <div className="cp-flow-state cp-flow-shared">
              <div className="cp-shared-visual" aria-hidden="true">
                <span /><span /><span /><span /><span />
                <i />
              </div>
              <p>Shared Industry Knowledge</p>
            </div>
          </div>

          <div className="cp-why-copy">
            <div>
              <p>Every engineer, fleet manager, manufacturer and supplier learns things through experience.</p>
              <p>When those lessons stay with one person or one company, the wider industry loses the opportunity to learn.</p>
            </div>
            <p className="cp-why-closing">RecoveryFlow helps useful experience travel further.</p>
          </div>
        </div>
      </section>

      <section className="cp-methods" id="contribution-methods" aria-labelledby="cp-methods-title">
        <div className="cp-methods-grid" aria-hidden="true" />
        <div className="cp-methods-inner">
          <h2 id="cp-methods-title">HOW YOU CAN CONTRIBUTE</h2>

          <div className="cp-methods-track">
            <article className="cp-method">
              <div className="cp-method-node" aria-hidden="true"><span>01</span><i /><i /><i /></div>
              <h3>SHARE EXPERIENCE</h3>
              <p>Contribute real downtime and recovery experiences.</p>
            </article>

            <article className="cp-method">
              <div className="cp-method-node" aria-hidden="true"><span>02</span><i /><i /><i /></div>
              <h3>SHARE KNOWLEDGE</h3>
              <p>Share practical lessons, technical insight and what has worked.</p>
            </article>

            <article className="cp-method">
              <div className="cp-method-node" aria-hidden="true"><span>03</span><i /><i /><i /></div>
              <h3>JOIN CONVERSATIONS</h3>
              <p>Take part in interviews, studies and industry discussions.</p>
            </article>

            <article className="cp-method">
              <div className="cp-method-node" aria-hidden="true"><span>04</span><i /><i /><i /></div>
              <h3>MAKE CONNECTIONS</h3>
              <p>Introduce useful people, knowledge or resources when appropriate.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="cp-returns" id="value-return" aria-labelledby="cp-returns-title">
        <div className="cp-returns-grid" aria-hidden="true" />
        <div className="cp-returns-inner">
          <div className="cp-returns-heading">
            <h2 id="cp-returns-title">WHAT YOU GET BACK</h2>
            <p>Contribution should create value for you, too.</p>
          </div>

          <div className="cp-return-source" aria-hidden="true">
            <span className="cp-return-orbit"><i /><i /><i /><i /></span>
            <span className="cp-return-mark"><i /><i /><i /></span>
          </div>

          <div className="cp-return-track">
            <article className="cp-return-benefit">
              <div className="cp-return-node" aria-hidden="true"><span>01</span></div>
              <h3>LEARN</h3>
              <p>Receive findings and practical insights from RecoveryFlow studies.</p>
            </article>

            <article className="cp-return-benefit">
              <div className="cp-return-node" aria-hidden="true"><span>02</span></div>
              <h3>CONNECT</h3>
              <p>Build useful relationships with people across the industry.</p>
            </article>

            <article className="cp-return-benefit">
              <div className="cp-return-node" aria-hidden="true"><span>03</span></div>
              <h3>CONTRIBUTE</h3>
              <p>Help shape future research and industry conversations.</p>
            </article>

            <article className="cp-return-benefit">
              <div className="cp-return-node" aria-hidden="true"><span>04</span></div>
              <h3>BE RECOGNISED</h3>
              <p>Choose whether your contribution is acknowledged publicly or remains anonymous.</p>
            </article>
          </div>

          <p className="cp-return-closing">You share what you know. The network helps everyone know more.</p>
        </div>
      </section>

      <section className="cp-commitment" id="our-commitment" aria-labelledby="cp-commitment-title">
        <div className="cp-commitment-inner">
          <div className="cp-commitment-heading">
            <h2 id="cp-commitment-title">OUR COMMITMENT</h2>
            <p>Contribution should create value — not become another sales channel.</p>
          </div>

          <div className="cp-charter">
            <p>RecoveryFlow will:</p>
            <ul>
              <li><span aria-hidden="true" /><strong>Respect your privacy.</strong></li>
              <li><span aria-hidden="true" /><strong>Never publish identifiable cases without your permission.</strong></li>
              <li><span aria-hidden="true" /><strong>Focus on shared learning, not individual company criticism.</strong></li>
              <li><span aria-hidden="true" /><strong>Never sell contributor personal data.</strong></li>
              <li><span aria-hidden="true" /><strong>Keep participation voluntary.</strong></li>
            </ul>
          </div>

          <p className="cp-commitment-closing">Your experience remains yours. What we build together becomes shared learning.</p>
        </div>
      </section>

      <ContributorJoin />
    </main>
  );
}
