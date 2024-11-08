<script>
    export let exhibitions = [];
    export let media = [];
  
    // Filter exhibitions to only include virtual ones and sort by date to get the latest
    const latestVirtualExhibition = exhibitions
        .filter(exhibition => exhibition.acf.virtual === true)
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  
    // Function to get media URL by fingerprint ID
    function getMediaUrlByFingerprint(fingerprintId) {
        const mediaItem = media.find(item => item.id === fingerprintId);
        return mediaItem ? mediaItem.source_url : '';
    }
  </script>

  <!-- Display the latest virtual exhibition if it exists -->
  {#if latestVirtualExhibition}
    <a href="/exhibitions" class="exhibition">
        <div class="exhibition-image-container">
            <img src="{getMediaUrlByFingerprint(latestVirtualExhibition.acf.fingerprint)}" alt="Exhibition Media">
            <h2 class="exhibition-title">{latestVirtualExhibition.title.rendered}</h2>
        </div>
        <p class="exhibition-description">{latestVirtualExhibition.description}</p>
    </a>
  {:else}
    <p>No virtual exhibitions available.</p>
  {/if}
  

    
  <style>
    .exhibition {
        margin-bottom: 2rem;
        position: relative;
        max-width: 100%;
        cursor: pointer;
        text-decoration: none; /* Remove link styling */
        color: inherit;
    }
  
    .exhibition-image-container {
        position: relative;
        width: 100%;
        overflow: hidden;
    }
  
    .exhibition img {
        width: 100%;
        height: auto;
        display: block;
    }
  
    .exhibition-title {
        position: absolute;
        bottom: 0;
        left: 0;
        margin: 0;
        color: var(--text-color);
        font-size: 8rem;
        font-weight: bold;
        width: auto;
    }
  
    .exhibition-description {
        font-size: 1rem;
        color: var(--text-color);
        margin-top: 1rem;
    }
  </style>
  