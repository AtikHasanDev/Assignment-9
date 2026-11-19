import { Wrench, ShieldCheck, ClipboardList, CreditCard, Smartphone, Laptop, Wind } from 'lucide-react';

export default function Home() {
  return (
    <div className="site-shell">
      <div>
        <section className="hero container">
          <div className="hero-copy">
            <p className="eyebrow">DEVICE & HOME APPLIANCE REPAIR</p>
            <h1>Good things<br />deserve a <span>second life.</span></h1>
            <p className="hero-description">A cracked screen. A silent AC. A laptop that needs a little love. FixMate brings repair services and clear job tracking together, with payment after the work is complete.</p>
            <a className="button" href="#our-approach">Meet FixMate</a>
            <div className="hero-note"><ShieldCheck size={19} /><span>Your repair, clear from start to finish.</span></div>
          </div>
          <div className="repair-scene" aria-label="Illustration of devices ready for a second life" role="img">
            <div className="scene-orbit" />
            <div className="device device-laptop"><Laptop size={144} strokeWidth={1.2} /><span>A fresh start.</span></div>
            <div className="device device-phone"><Smartphone size={72} strokeWidth={1.4} /></div>
            <div className="device device-ac"><Wind size={54} strokeWidth={1.5} /></div>
            <div className="scene-label"><span className="label-icon"><Wrench size={18} /></span>Repair. Reuse. Repeat.</div>
            <span className="scene-spark spark-one">✳</span><span className="scene-spark spark-two">+</span>
          </div>
        </section>
        <section className="approach" id="our-approach">
          <div className="container">
            <p className="eyebrow">A BETTER WAY TO REPAIR</p>
            <h2>Less uncertainty. More peace of mind.</h2>
            <div className="feature-grid">
              <article><ShieldCheck size={27} /><h3>Know your service</h3><p>Explore repair details, technician profiles, and starting prices before sending a request.</p></article>
              <article><ClipboardList size={27} /><h3>Follow every step</h3><p>Track your job from the first request through acceptance, repair, and completion.</p></article>
              <article><CreditCard size={27} /><h3>Pay after completion</h3><p>Payment opens only after your technician completes the job and sets the final amount.</p></article>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}


