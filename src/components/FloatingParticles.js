const emojis = ['🍕', '🍔', '🍜', '🥗', '🍟', '🍩', '🥤', '🍱'];

function FloatingParticles() {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    emoji: emojis[i % emojis.length],
    left: Math.random() * 100,
    duration: 15 + Math.random() * 15,
    delay: Math.random() * 10,
    size: 20 + Math.random() * 20
  }));

  return (
    <div style={{
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      overflow: 'hidden',
      zIndex: 0,
      pointerEvents: 'none'
    }}>
      {particles.map((p, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            bottom: '-50px',
            fontSize: `${p.size}px`,
            opacity: 0.35,
            animation: `floatUp ${p.duration}s linear ${p.delay}s infinite`
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}

export default FloatingParticles;