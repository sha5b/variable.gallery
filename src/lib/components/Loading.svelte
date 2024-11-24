<script>
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  export let isLoading = false;

  let packages = [];
  let interval;

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
    'abstract_data_stream.raw',
    'infiltrate_guggenheim.bat',
    'bypass_gallery_security.dll',
    'art_market_crypto.nft',
    'virtual_spray_paint.exe',
    'pixel_perfect_virus.jpg',
    'corrupted_masterpiece.png',
    'glitch_in_the_canvas.raw',
    'modern_art_malware.exe',
    'surreal_encryption.dat',
    'dadaist_database.sql',
    'minimalist_exploit.min',
    'conceptual_keylogger.art',
    'performance_art_trojan.exe',
    'installation_backdoor.php',
    'art_history_rootkit.log',
    'baroque_blockchain.btc',
    'impressionist_interface.io',
    'cubist_code_injection.js',
    'pop_art_password.crack',
    'futurist_firewall.hack',
    'expressionist_error.404',
    'uploading_inspiration.exe',
    'downloading_talent.zip',
    'rendering_genius.tmp',
    'buffering_creativity.load',
    'art_school_debt.exe',
    'pretentious_artist_statement.doc',
    'overpriced_jpeg.nft',
    'coffee_stained_canvas.jpg',
    'artistic_procrastination.exe',
    'unfinished_masterpiece.tmp',
    'creative_block_error.log',
    'art_supplies_cart.php',
    'paint_water_not_coffee.exe',
    'reference_layer_missing.psd',
    'ctrl_z_infinity_loop.exe',
    'rgb_to_cmyk_panic.dll',
    'accidentally_saved_over.bak',
    'forgot_to_backup.cry',
    'final_final_FINAL_v2.psd',
    'definitely_not_traced.png',
    'pinterest_inspiration.exe',
    'instagram_filter_hack.js',
    'tiktok_art_trend.exe',
    'art_critique_simulator.ai'
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

  $: if (isLoading) {
    interval = setInterval(addPackage, 150);
  } else {
    clearInterval(interval);
    packages = [];
  }

  onMount(() => {
    return () => clearInterval(interval);
  });
</script>

{#if isLoading}
  <div 
    class="loading-overlay" 
    transition:fade={{ duration: 200 }}
  >
    <div class="package-container">
      {#each packages as pkg}
        <div class="package-line" class:glitch={pkg.glitch}>
          <span class="package-name">{pkg.name}</span>
          <span class="package-size">{pkg.size}MB</span>
          <span class="download-complete">✓</span>
        </div>
      {/each}
    </div>
  </div>
{/if}

<style>
  .loading-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background-color: rgba(0, 0, 0, 0.9);
    font-family: monospace;
    color: #00ff00;
  }

  .package-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    max-width: 600px;
  }

  .package-line {
    display: flex;
    justify-content: space-between;
    padding: 4px 8px;
    opacity: 0;
    animation: fadeIn 0.3s forwards;
  }

  .package-name {
    flex: 1;
  }

  .package-size {
    margin: 0 20px;
  }

  .download-complete {
    color: #00ff00;
  }

  .glitch {
    animation: glitch 0.3s infinite;
    text-shadow: 
      2px 0 #ff0000,
      -2px 0 #0000ff;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes glitch {
    0% { transform: translate(0) }
    20% { transform: translate(-2px, 2px) }
    40% { transform: translate(-2px, -2px) }
    60% { transform: translate(2px, 2px) }
    80% { transform: translate(2px, -2px) }
    100% { transform: translate(0) }
  }
</style> 