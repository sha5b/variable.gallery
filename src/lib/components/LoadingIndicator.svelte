<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import '$lib/styles/components/loading.css';

  export let isLoading = false;

  interface Package {
    name: string;
    size: string;
    glitch: boolean;
  }

  let packages: Package[] = [];
  let interval: number | NodeJS.Timeout | undefined;

  const possiblePackages: string[] = [
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
