import Image from "next/image";

export function AutomationVisual({ src, alt }: { src: string; alt: string }) {
  return (
    <figure className="automation-visual">
      <div className="visual-topline">
        <span>Connected by design</span>
        <span>01 / WORKFLOW</span>
      </div>
      <Image
        className="automation-art"
        src={src}
        alt={alt}
        width={1440}
        height={960}
        sizes="(max-width: 900px) 100vw, 52vw"
        priority
        unoptimized={!src.startsWith("/")}
      />
      <div
        className="platform-diagram"
        aria-label="Example workflow: business request to Power Automate to connected systems"
      >
        <div className="platform-heading">
          <Image
            src="/images/power-automate.svg"
            width={64}
            height={64}
            alt="Microsoft Power Automate"
          />
          <div>
            <span>THE AUTOMATION LAYER</span>
            <strong>Power Automate</strong>
          </div>
        </div>
        <div className="diagram-steps">
          <span>Business request</span>
          <i aria-hidden="true">→</i>
          <span>Automate</span>
          <i aria-hidden="true">→</i>
          <span>Connected systems</span>
        </div>
      </div>
      <figcaption>
        Cloud workflows. Desktop automation. Connected business.
      </figcaption>
    </figure>
  );
}
