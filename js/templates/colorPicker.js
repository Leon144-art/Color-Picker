export const colorPickerTemplate = `
  <section class="panel">
    <h2>Quick Color Picker</h2>
    <div class="row">
      <input id="native-color" aria-label="Pick a color" type="color" value="#4f8cff" />
      <div class="swatch" id="swatch" title="Selected color"></div>
      <span class="code" id="color-text">#4f8cff</span>
      <button id="copy">Copy</button>
      <div class="blank-box"></div>
    </div>
    <div class="hint">Your last color is saved locally and restored on next open.</div>
  </section>

  <section class="panel">
    <h2>RGB Color Values</h2>
    <div class="rgb-row">
      <div id="rgb-text" class="readouts">RGB(255, 255, 255)</div>
      <div class="rgb-section">
        <div class="rgb-item">
          <span class="rgb-label">R:</span>
          <div class="swatch-r"></div>
        </div>
        <div class="rgb-item">
          <span class="rgb-label">G:</span>
          <div class="swatch-g"></div>
        </div>
        <div class="rgb-item">
          <span class="rgb-label">B:</span>
          <div class="swatch-b"></div>
        </div>
      </div>
    </div>
  </section>

  <section class="panel wheel-section">
    <h2>HSV Color Wheel</h2>
    <div class="wheel-wrap">
      <canvas id="hsv-wheel" width="240" height="240"></canvas>
      <div class="controls">
        <div class="row">
          <label for="hsv-value">Value (Brightness):</label>
          <input id="hsv-value" type="range" min="0" max="100" value="100" />
          <span id="hsv-v-text" class="code">V=100%</span>
        </div>
        <div class="readouts"><span id="hsv-hsv-text">HSV(0, 0%, 100%)</span></div>
        <div class="hint">Drag on the wheel for <strong>Hue/Saturation</strong>, use slider for
          <strong>Value</strong>.
        </div>
      </div>
    </div>
  </section>

  <section class="panel wheel-section">
    <h2>HSL Color Wheel</h2>
    <div class="wheel-wrap">
      <canvas id="hsl-wheel" width="240" height="240"></canvas>
      <div class="controls">
        <div class="row">
          <label for="hsl-lightness">Lightness:</label>
          <input id="hsl-lightness" type="range" min="0" max="100" value="50" />
          <span id="hsl-l-text" class="code">L=50%</span>
        </div>
        <div class="readouts">
          <span id="hsl-hsl-text">HSL(0, 0%, 50%)</span>
        </div>
        <div class="hint">Drag on the wheel for <strong>Hue/Saturation</strong>, use slider for
          <strong>Lightness</strong>.
        </div>
      </div>
    </div>
  </section>
`;
