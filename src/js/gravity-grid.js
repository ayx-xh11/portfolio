const DEFAULTS = {
  cellSize: 24,
  influenceRadius: 145,
  maxDisplacement: 13,
  spring: 0.13,
  damping: 0.76,
};

export function initGravityGrid(field) {
  const canvas = field?.querySelector("[data-gravity-canvas]");
  const context = canvas?.getContext("2d", { alpha: true });

  if (!field || !canvas || !context) {
    return () => {};
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(pointer: fine)");
  const state = {
    width: 0,
    height: 0,
    dpr: 1,
    animationFrame: 0,
    cells: [],
    scrollOffset: window.scrollY,
    pointer: { x: -1000, y: -1000, active: false },
    animationAllowed: !reducedMotion.matches && finePointer.matches,
  };

  function createCells() {
    const cellSize = window.innerWidth < 640 ? 22 : DEFAULTS.cellSize;
    const columns = Math.ceil(state.width / cellSize) + 1;
    const rows = Math.ceil(state.height / cellSize) + 2;
    const cells = [];

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        cells.push({
          x: column * cellSize,
          y: (row - 1) * cellSize,
          size: cellSize,
          offset: 0,
          velocity: 0,
          intensity: 0,
        });
      }
    }

    state.cells = cells;
  }

  function draw() {
    context.clearRect(0, 0, state.width, state.height);
    context.lineWidth = 1;
    context.shadowBlur = 0;

    for (const cell of state.cells) {
      const gap = 2;
      const x = cell.x + gap / 2;
      const scrollPhase = state.scrollOffset % cell.size;
      const y = cell.y - scrollPhase + cell.offset + gap / 2;
      const size = cell.size - gap;
      const highlight = Math.min(1, Math.abs(cell.offset) / DEFAULTS.maxDisplacement);

      context.strokeStyle = "rgba(255, 255, 255, 0.025)";
      context.strokeRect(x, y, size, size);

      if (highlight > 0.02) {
        context.shadowColor = "rgba(255, 250, 250, 0.95)";
        context.shadowBlur = 3 + highlight * 7;
        context.strokeStyle = `rgba(255, 250, 250, ${highlight * 0.9})`;
        context.strokeRect(x, y, size, size);
        context.shadowBlur = 0;
        context.fillStyle = `rgba(255, 250, 250, ${highlight * 0.075})`;
        context.fillRect(x, y, size, size);
      }
    }
  }

  function targetFor(cell) {
    if (!state.pointer.active || !state.animationAllowed) {
      cell.intensity = 0;
      return 0;
    }

    const centerX = cell.x + cell.size / 2;
    const scrollPhase = state.scrollOffset % cell.size;
    const centerY = cell.y - scrollPhase + cell.size / 2 + cell.offset;
    const distance = Math.hypot(centerX - state.pointer.x, centerY - state.pointer.y);

    if (distance >= DEFAULTS.influenceRadius) {
      cell.intensity = 0;
      return 0;
    }

    const proximity = 1 - distance / DEFAULTS.influenceRadius;
    cell.intensity = proximity * proximity;
    return DEFAULTS.maxDisplacement * cell.intensity;
  }

  function animate() {
    state.animationFrame = 0;
    let needsAnotherFrame = false;

    for (const cell of state.cells) {
      const target = targetFor(cell);
      const force = (target - cell.offset) * DEFAULTS.spring;
      cell.velocity = (cell.velocity + force) * DEFAULTS.damping;
      cell.offset += cell.velocity;

      if (Math.abs(target - cell.offset) > 0.02 || Math.abs(cell.velocity) > 0.02) {
        needsAnotherFrame = true;
      } else {
        cell.offset = target;
        cell.velocity = 0;
      }
    }

    draw();

    if (needsAnotherFrame) {
      state.animationFrame = window.requestAnimationFrame(animate);
    }
  }

  function requestDraw() {
    if (!state.animationFrame) {
      state.animationFrame = window.requestAnimationFrame(animate);
    }
  }

  function resize() {
    const bounds = field.getBoundingClientRect();
    state.width = Math.max(1, Math.round(bounds.width));
    state.height = Math.max(1, Math.round(bounds.height));
    state.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    state.scrollOffset = window.scrollY;

    canvas.width = Math.round(state.width * state.dpr);
    canvas.height = Math.round(state.height * state.dpr);
    context.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);

    createCells();
    draw();
  }

  function updatePointer(event) {
    if (!state.animationAllowed || event.pointerType === "touch") {
      return;
    }

    const bounds = field.getBoundingClientRect();
    const isInsideField = event.clientY >= bounds.top && event.clientY <= bounds.bottom;
    state.pointer.x = event.clientX - bounds.left;
    state.pointer.y = event.clientY - bounds.top;
    state.pointer.active = isInsideField;
    requestDraw();
  }

  function releasePointer() {
    if (!state.pointer.active) {
      return;
    }

    state.pointer.active = false;
    requestDraw();
  }

  function updateScrollPosition() {
    state.scrollOffset = window.scrollY;
    field.style.setProperty("--grid-scroll-offset", `${state.scrollOffset % DEFAULTS.cellSize}px`);
    requestDraw();
  }

  function updateMotionPreference() {
    state.animationAllowed = !reducedMotion.matches && finePointer.matches;
    state.pointer.active = false;
    window.cancelAnimationFrame(state.animationFrame);
    state.animationFrame = 0;

    for (const cell of state.cells) {
      cell.offset = 0;
      cell.velocity = 0;
      cell.intensity = 0;
    }

    draw();
  }

  field.dataset.enhanced = "true";
  resize();

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(field);

  document.addEventListener("pointermove", updatePointer, { passive: true });
  document.documentElement.addEventListener("mouseleave", releasePointer);
  window.addEventListener("scroll", updateScrollPosition, { passive: true });
  window.addEventListener("blur", releasePointer);
  reducedMotion.addEventListener("change", updateMotionPreference);
  finePointer.addEventListener("change", updateMotionPreference);

  return () => {
    window.cancelAnimationFrame(state.animationFrame);
    resizeObserver.disconnect();
    document.removeEventListener("pointermove", updatePointer);
    document.documentElement.removeEventListener("mouseleave", releasePointer);
    window.removeEventListener("scroll", updateScrollPosition);
    window.removeEventListener("blur", releasePointer);
    reducedMotion.removeEventListener("change", updateMotionPreference);
    finePointer.removeEventListener("change", updateMotionPreference);
    delete field.dataset.enhanced;
  };
}
