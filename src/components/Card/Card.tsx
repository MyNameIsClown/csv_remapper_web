import { useRef, useState, useLayoutEffect, PropsWithChildren, CSSProperties } from "react";
import { createPortal } from "react-dom";
import styles from "./Card.module.css";
import clsx from "clsx";

type CardProps = {
  variant?: "flat" | "gradient",
  className?: string;
  style?: CSSProperties;
  hoverEnabled?: boolean;
  hoverScale?: number;
  hoverDuration?: number; // in ms
};

export default function Card({
  variant = "flat",
  children,
  className = "",
  style,
  hoverEnabled = true,
  hoverScale = 1.1,
  hoverDuration = 300
}: PropsWithChildren<CardProps>) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false); // overlay mounted
  const [isActive, setIsActive] = useState(false);   // scale up/down
  const [rect, setRect] = useState<DOMRect | null>(null);
  const closeTimer = useRef<number | null>(null);

  // Helpers para cierre con delay (permite pasar del base al overlay sin parpadeos)
  const scheduleClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      setIsActive(false); // animar a scale(1)
      window.setTimeout(() => {
        setIsVisible(false); // desmontar tras animación
        setRect(null);
      }, hoverDuration);
    }, 40); // pequeño delay para permitir entrar al overlay
  };

  const cancelClose = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  // Cierre forzado en scroll/resize
  useLayoutEffect(() => {
    if (!isVisible) return;
    const hardClose = () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
      setIsActive(false);
      setTimeout(() => { setIsVisible(false); setRect(null); }, hoverDuration);
    };
    window.addEventListener("scroll", hardClose, true);
    window.addEventListener("resize", hardClose);
    return () => {
      window.removeEventListener("scroll", hardClose, true);
      window.removeEventListener("resize", hardClose);
    };
  }, [isVisible, hoverDuration]);

  // Base: enter/leave
  const handleBaseEnter = () => {
    if (!hoverEnabled || !ref.current) return;
    cancelClose();
    const r = ref.current.getBoundingClientRect();
    setRect(r);
    setIsVisible(true); // montar overlay con tamaño original
    requestAnimationFrame(() => setIsActive(true)); // animar a hoverScale
  };

  const handleBaseLeave = () => {
    // no cierres inmediato: quizá el mouse va al overlay
    scheduleClose();
  };

  // Overlay: enter/leave (permite interactuar sobre overlay)
  const handleOverlayEnter = () => {
    cancelClose();
    setIsActive(true); // mantener ampliado mientras estamos encima
  };

  const handleOverlayLeave = () => {
    scheduleClose();
  };

  return (
    <>
      <div
        ref={ref}
        className={clsx(styles.card, styles[`card--${variant}`], `${className}`)}
        style={style}
        onMouseEnter={handleBaseEnter}
        onMouseLeave={handleBaseLeave}
      >
        <div style={{ margin: "1.5rem" }}>
          {children}
        </div>
      </div>

      {hoverEnabled && isVisible && rect &&
        createPortal(
          <div
            className={clsx(styles.card, styles[`card--${variant}`], `${className}`, styles.cardOverlay)}
            style={{
              position: "fixed",
              top: rect.top + rect.height / 2,
              left: rect.left + rect.width / 2,
              width: rect.width,
              height: rect.height,
              transform: `translate(-50%, -50%) scale(${isActive ? hoverScale : 1})`,
              transformOrigin: "center center",
              transition: `transform ${hoverDuration}ms ease, box-shadow ${hoverDuration}ms ease`,
              boxShadow: isActive
                ? "0 16px 32px rgba(0,0,0,0.3)"
                : "0 4px 12px rgba(0,0,0,0.15)",
              zIndex: 9999,
              // AHORA SÍ: el overlay recibe eventos para texto/botones
              pointerEvents: "auto",
            }}
            onMouseEnter={handleOverlayEnter}
            onMouseLeave={handleOverlayLeave}
          >
            <div style={{ margin: "1.5rem" }}>
              {children}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
