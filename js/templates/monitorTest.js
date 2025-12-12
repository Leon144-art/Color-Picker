export const monitorTestTemplate = `
  <div class="view-stack">
    <section class="panel">
      <h2>Solid Color Tests</h2>
      <p>Test primary colors, grayscale uniformity, and check for dead pixels or color accuracy issues.</p>

      <h3>Preset Colors</h3>
      <div class="test-grid">
        <button class="test-card" data-test="solid" data-color="#ff0000" style="--bg-color: #ff0000;">
          <span>Red</span>
        </button>
        <button class="test-card" data-test="solid" data-color="#00ff00" style="--bg-color: #00ff00;">
          <span>Green</span>
        </button>
        <button class="test-card" data-test="solid" data-color="#0000ff" style="--bg-color: #0000ff;">
          <span>Blue</span>
        </button>
        <button class="test-card light" data-test="solid" data-color="#ffffff" style="--bg-color: #ffffff;">
          <span>White</span>
        </button>
        <button class="test-card" data-test="solid" data-color="#000000" style="--bg-color: #000000;">
          <span>Black</span>
        </button>
        <button class="test-card" data-test="solid" data-color="#ff00ff" style="--bg-color: #ff00ff;">
          <span>Magenta</span>
        </button>
        <button class="test-card light" data-test="solid" data-color="#ffff00" style="--bg-color: #ffff00;">
          <span>Yellow</span>
        </button>
        <button class="test-card light" data-test="solid" data-color="#00ffff" style="--bg-color: #00ffff;">
          <span>Cyan</span>
        </button>
      </div>

      <h3>Custom Color</h3>
      <div class="custom-color-section">
        <div class="custom-color-controls">
          <input type="color" id="custom-test-color" value="#4f8cff" />
          <input type="text" id="custom-test-hex" value="#4f8cff" maxlength="7" placeholder="#RRGGBB" />
          <button id="launch-custom-color" class="btn-primary">Launch Custom Color</button>
        </div>
      </div>
    </section>

    <section class="panel">
      <h2>Tone & Contrast Tests</h2>
      <p>Calibrate brightness, contrast, and grayscale accuracy for optimal image reproduction.</p>

      <h3>Calibration Presets</h3>
      <div class="test-grid">
        <button class="test-card" data-test="blacklevel" style="background: linear-gradient(to right, #000 0%, #111 100%);" title="Adjust brightness until boxes 2–3 are barely visible">
          <span>Black Level</span>
        </button>
        <button class="test-card" data-test="white-saturation" style="background: linear-gradient(to right, #eee 0%, #fff 100%);" title="Adjust contrast so all white blocks remain distinguishable">
          <span>White Saturation</span>
        </button>
        <button class="test-card" data-test="gray-steps-32" style="background: linear-gradient(to right, #000 0%, #080808 3.125%, #101010 6.25%, #181818 9.375%, #202020 12.5%, #292929 15.625%, #313131 18.75%, #393939 21.875%, #414141 25%, #4a4a4a 28.125%, #525252 31.25%, #5a5a5a 34.375%, #626262 37.5%, #6b6b6b 40.625%, #737373 43.75%, #7b7b7b 46.875%, #838383 50%, #8c8c8c 53.125%, #949494 56.25%, #9c9c9c 59.375%, #a4a4a4 62.5%, #adadad 65.625%, #b5b5b5 68.75%, #bdbdbd 71.875%, #c5c5c5 75%, #cecece 78.125%, #d6d6d6 81.25%, #dedede 84.375%, #e6e6e6 87.5%, #efefef 90.625%, #f7f7f7 93.75%, #fff 100%);" title="Verify all 32 gray levels are distinguishable without banding">
          <span>32-Step Grayscale</span>
        </button>
        <button class="test-card" data-test="grayscale-gradient" style="background: linear-gradient(to right, #000, #fff);" title="Check for color banding or posterization in smooth gradients">
          <span>Grayscale Gradient</span>
        </button>
        <button class="test-card" data-test="rgb-gradients" style="background: linear-gradient(to right, #f00, #0f0, #00f);" title="Check for color banding in RGB transitions">
          <span>RGB Gradients</span>
        </button>
      </div>

      <h3>Create Custom Gradient</h3>
      <div class="custom-gradient-section">
        <div class="gradient-controls">
          <div class="gradient-stop">
            <label>Start Color:</label>
            <input type="color" id="gradient-start" value="#000000" />
          </div>
          <div class="gradient-stop">
            <label>End Color:</label>
            <input type="color" id="gradient-end" value="#ffffff" />
          </div>
          <div class="gradient-direction">
            <label>Direction:</label>
            <select id="gradient-direction">
              <option value="to right">Horizontal →</option>
              <option value="to left">Horizontal ←</option>
              <option value="to bottom">Vertical ↓</option>
              <option value="to top">Vertical ↑</option>
            </select>
          </div>
          <button id="launch-custom-gradient" class="btn-primary">Launch Custom Gradient</button>
        </div>
      </div>
    </section>

    <section class="panel">
      <h2>Geometry & Sharpness Tests</h2>
      <p>Check pixel accuracy, display geometry, color reproduction, and screen uniformity.</p>

      <div class="test-grid">
        <button class="test-card" data-test="sharpness-grid" style="background: repeating-conic-gradient(#000 0% 25%, #fff 0% 50%) 50% / 20px 20px;" title="All fine lines should be crisp without halos or blur">
          <span>Sharpness & Pixel Grid</span>
        </button>
        <button class="test-card" data-test="geometry-circles" style="background: repeating-linear-gradient(#000 0 1px, transparent 1px 40px), repeating-linear-gradient(90deg, #000 0 1px, #fff 1px 40px);" title="Circles should appear perfectly round, not oval">
          <span>Geometry & Circles</span>
        </button>
        <button class="test-card" data-test="color-bars-smpte" style="background: linear-gradient(to right, #c0c0c0 0% 14.28%, #c0c000 14.28% 28.56%, #00c0c0 28.56% 42.84%, #00c000 42.84% 57.12%, #c000c0 57.12% 71.4%, #c00000 71.4% 85.68%, #0000c0 85.68% 100%);" title="Standard SMPTE color bars for color accuracy verification">
          <span>Color Bars (SMPTE)</span>
        </button>
        <button class="test-card" data-test="uniformity-gray" style="background: #808080;" title="Check for backlight bleeding, dirty screen effect, or edge brightness variations">
          <span>Uniformity (50% Gray)</span>
        </button>
        <button class="test-card" data-test="dead-pixel-check" style="background: linear-gradient(135deg, #000 25%, #fff 25% 50%, #f00 50% 75%, #00f 75%);" title="Click to cycle through colors: Black → White → Red → Green → Blue">
          <span>Dead Pixel Check</span>
        </button>
      </div>
    </section>
  </div>
`;
