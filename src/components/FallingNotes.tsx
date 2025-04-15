import { motion, AnimatePresence } from 'framer-motion';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import yourdidit from '../assets/yourdidit.jpg';

const emojis = ['🎹', '🎸', '🎺', '🎻', '🥁', '🎷'];

const triggerCelebration = (
  setShowCelebration: Dispatch<SetStateAction<boolean>>
) => {
  setShowCelebration(true);
  confetti({
    particleCount: 500,
    spread: 500,
    origin: { y: 0.4 },
  });

  // Hide celebration after 5 seconds
  setTimeout(() => {
    setShowCelebration(false);
  }, 5000);
};

export const FallingNotes = () => {
  const [showCelebration, setShowCelebration] = useState(false);
  const [controllers, setControllers] = useState(
    emojis.map((emoji, index) => ({
      id: index,
      emoji,
      position: {
        x: Math.random() * (window.innerWidth - 100),
        y: Math.random() * (window.innerHeight - 100),
      },
      velocity: {
        x: Math.random() * 4 - 2,
        y: Math.random() * 4 - 2,
      },
    }))
  );

  useEffect(() => {
    const moveControllers = () => {
      setControllers((prev) =>
        prev.map((controller) => {
          const newX = controller.position.x + controller.velocity.x;
          const newY = controller.position.y + controller.velocity.y;
          let newVelocityX = controller.velocity.x;
          let newVelocityY = controller.velocity.y;

          // Check for corner hits
          const hitTopLeft = newX <= 0 && newY <= 0;
          const hitTopRight =
            newX >= window.innerWidth - 100 && newY <= 0;
          const hitBottomLeft =
            newX <= 0 && newY >= window.innerHeight - 100;
          const hitBottomRight =
            newX >= window.innerWidth - 100 &&
            newY >= window.innerHeight - 100;

          if (
            hitTopLeft ||
            hitTopRight ||
            hitBottomLeft ||
            hitBottomRight
          ) {
            triggerCelebration(setShowCelebration);
          }

          // Bounce off walls
          if (newX <= 0 || newX >= window.innerWidth - 100) {
            newVelocityX = -controller.velocity.x;
          }
          if (newY <= 0 || newY >= window.innerHeight - 100) {
            newVelocityY = -controller.velocity.y;
          }

          return {
            ...controller,
            position: { x: newX, y: newY },
            velocity: { x: newVelocityX, y: newVelocityY },
          };
        })
      );
    };

    const interval = setInterval(moveControllers, 16); // ~60fps
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        {controllers.map((controller) => (
          <motion.div
            key={controller.id}
            animate={{
              x: controller.position.x,
              y: controller.position.y,
            }}
            transition={{ duration: 0 }}
            style={{
              position: 'absolute',
              fontSize: '5rem',
              userSelect: 'none',
            }}
          >
            {controller.emoji}
          </motion.div>
        ))}
      </div>

      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
        }}
      >
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.5 }}
              style={{
                background: 'white',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0 0 20px rgba(0,0,0,0.3)',
                textAlign: 'center',
                maxHeight: '90vh',
                overflow: 'auto',
              }}
            >
              <img
                src={yourdidit}
                alt="You did it!"
                style={{
                  maxWidth: '300px',
                  maxHeight: '60vh',
                  borderRadius: '5px',
                  marginBottom: '10px',
                  objectFit: 'contain',
                }}
              />
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#333',
                }}
              >
                Wow, you really were bored
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
