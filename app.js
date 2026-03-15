// Sales HQ v2.0 — Scroll animations + card interactions
document.addEventListener('DOMContentLoaded', () => {

  // ===== Intersection Observer for fade-up animations =====
  const fadeEls = document.querySelectorAll('.fade-up');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  fadeEls.forEach(el => observer.observe(el));

  // ===== Card expand/collapse on hover + touch =====
  const nodes = document.querySelectorAll('.node');

  nodes.forEach(node => {
    const list = node.querySelector('.detail-list');
    if (!list) return;

    // Collapse by default
    list.style.maxHeight = '0';
    list.style.overflow = 'hidden';
    list.style.opacity = '0';
    list.style.transition = 'max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease';

    const expand = () => {
      list.style.maxHeight = list.scrollHeight + 'px';
      list.style.opacity = '1';
    };

    const collapse = () => {
      list.style.maxHeight = '0';
      list.style.opacity = '0';
    };

    // Desktop hover
    node.addEventListener('mouseenter', expand);
    node.addEventListener('mouseleave', collapse);

    // Mobile touch toggle
    node.addEventListener('click', () => {
      const isOpen = list.style.maxHeight !== '0px' && list.style.maxHeight !== '0';

      // Close all others
      nodes.forEach(other => {
        if (other === node) return;
        const otherList = other.querySelector('.detail-list');
        if (otherList) {
          otherList.style.maxHeight = '0';
          otherList.style.opacity = '0';
        }
      });

      if (isOpen) {
        collapse();
      } else {
        expand();
      }
    });
  });

  // ===== Subtle parallax on v2.0 glow cards =====
  const newCards = document.querySelectorAll('.node.is-new');

  newCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

      card.style.boxShadow = `
        ${x * 4}px ${y * 4}px 20px rgba(209, 163, 79, 0.08),
        0 0 0 1px rgba(209, 163, 79, 0.2),
        inset 0 0 0 1px rgba(209, 163, 79, 0.06)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.boxShadow = '0 0 0 1px rgba(209, 163, 79, 0.15), inset 0 0 0 1px rgba(209, 163, 79, 0.06)';
    });
  });

  // ===== Counter animation for stats =====
  const statNums = document.querySelectorAll('.stat-num');
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const text = el.textContent.trim();

      // Only animate pure numbers
      const match = text.match(/^(\d+)$/);
      if (match) {
        const target = parseInt(match[1]);
        animateCounter(el, 0, target, 800);
      }

      // Animate X/Y format
      const fracMatch = text.match(/^(\d+)\/(\d+)$/);
      if (fracMatch) {
        const a = parseInt(fracMatch[1]);
        const b = parseInt(fracMatch[2]);
        animateCounter(el, 0, a, 800, `/${b}`);
      }

      statsObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => statsObserver.observe(el));

  function animateCounter(el, from, to, duration, suffix = '') {
    const start = performance.now();
    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(from + (to - from) * eased);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
});
