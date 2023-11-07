import { useScroll, animated, useSpring } from "@react-spring/web";
import { useRef } from "react";
import styles from "./ScrollAnimated.module.scss";

const X_LINES = 50;
const PAGE_COUNT = 4;
const INITIAL_WIDTH = 10;
export function ScrollAnimated({ children }: { children: any }) {
  const containerRef = useRef<HTMLDivElement>(null!);
  const barContainerRef = useRef<HTMLDivElement>(null!);

  const [textStyles, textApi] = useSpring(() => ({
    y: "100%",
  }));

  const { scrollYProgress } = useScroll({
    container: containerRef,
    onChange: ({ value: { scrollYProgress } }) => {
      if (scrollYProgress > 0.7) {
        textApi.start({ y: "0" });
      } else {
        textApi.start({ y: "100%" });
      }
    },
    default: {
      immediate: true,
    },
  });

  return (
    <div ref={containerRef} className={styles.body}>
      <div className={styles.animated__layers}>
        <animated.div ref={barContainerRef} className={styles.bar__container}>
          <animated.p className={styles.text}>Scroll Me!!</animated.p>
          {Array.from({ length: X_LINES }).map((_, i) => (
            <animated.div
              key={i}
              className={styles.bar}
              style={{
                width: scrollYProgress.to((scrollP) => {
                  const percentilePosition = (i + 1) / X_LINES;

                  return (
                    INITIAL_WIDTH / 4 +
                    100 * Math.cos(((percentilePosition - scrollP) * Math.PI) / 2) ** 32 +
                    30
                  );
                }),
              }}
            />
          ))}
        </animated.div>
        <animated.div className={styles.bar__container__inverted}>
          {Array.from({ length: X_LINES }).map((_, i) => (
            <animated.div
              key={i}
              className={styles.bar}
              style={{
                width: scrollYProgress.to((scrollP) => {
                  const percentilePosition = 1 - (i + 1) / X_LINES;

                  return (
                    INITIAL_WIDTH / 4 +
                    100 * Math.cos(((percentilePosition - scrollP) * Math.PI) / 2) ** 32 +
                    30
                  );
                }),
              }}
            />
          ))}
        </animated.div>

        <animated.div
          className={styles.dot}
          style={{
            clipPath: scrollYProgress.to((val) => `circle(${val * 100}%)`),
          }}
        ></animated.div>
      </div>
      <animated.div className={styles.pages}>
        {new Array(PAGE_COUNT).fill(null).map((_, index) => (
          <div className={styles.full__page} key={index} />
        ))}
        <div className={styles.full__page}>
          <animated.div className={styles.child}>{children}</animated.div>
        </div>
      </animated.div>
    </div>
  );
}