<script>
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import '$lib/styles/components/loading.css';

  /** @type {'indicator'|'spinner'} */
  export let type = 'spinner';
  /** @type {boolean} */
  export let visible = false;
  /** @type {boolean} */
  export let overlay = true;

  /**
   * @typedef {Object} Package
   * @property {string} name
   * @property {string} size
   * @property {boolean} glitch
   */

  /** @type {Package[]} */
  let packages = [];
  /** @type {number|ReturnType<typeof setInterval>|undefined} */
  let interval;

  /** @type {string[]} */
  const possiblePackages = [
    'hacking_mona_lisa.exe',
    'decrypt_van_gogh_ear.dat',
    'downloading_creativity.zip',
    'steal_banksy_wall.py',
    'matrix_color_theory.dll',
    'cyber_renaissance.bin',
    'hack_the_louvre.sh',
    'quantum_brush_strokes.exe',
    'picasso_neural_net.ai',
    'davinci_code_breaker.hex',
    'art_critic_firewall.sys',
    'gallery_mainframe.css',
    'aesthetic_algorithm.js',
    'curator_brain_hack.exe',
    'abstract_data_stream.raw'
  ];

  function addPackage() {
    const randomPackage = possiblePackages[Math.floor(Math.random() * possiblePackages.length)];
    const size = (Math.random() * 10).toFixed(2);
    packages = [...packages, { name: randomPackage, size, glitch: true }];
    
    setTimeout(() => {
      packages = packages.map(pkg => 
        pkg.name === randomPackage ? { ...pkg, glitch: false } : pkg
      );
    }, 300);
  }

  $: if (visible && type === 'indicator') {
    interval = setInterval(addPackage, 150);
  } else {
    clearInterval(interval);
    packages = [];
  }

  onMount(() => {
    return () => clearInterval(interval);
  });
</script>

{#if visible}
  <div 
    class="loading-container"
    class:overlay
    transition:fade={{ duration: 200 }}
  >
    {#if type === 'spinner'}
      <div class="spinner"></div>
    {:else}
      <div class="package-container">
        {#each packages as pkg}
          <div class="package-line" class:glitch={pkg.glitch}>
            <span class="package-name">{pkg.name}</span>
            <span class="package-size">{pkg.size}MB</span>
            <span class="download-complete">✓</span>
          </div>
        {/each}
      </div>
    {/if}
  </div>
{/if}

<style>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.loading-container.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 9999;
}

/* Existing loading.css styles will be used for other classes */
</style>
