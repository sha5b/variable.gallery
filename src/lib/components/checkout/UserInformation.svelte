<script>
    import { userInfo } from '$lib/stores/userInfoStore';
    export let errors = {};
</script>

<div class="user-info-section">
    <h2 class="text-lg font-semibold mb-4">Contact Information</h2>
    <input type="email" bind:value={userInfo.email} placeholder="Email address" class="input-field" class:border-red-500={errors.email} />
    {#if errors.email}<p class="error-text">{errors.email}</p>{/if}

    <h2 class="text-lg font-semibold mb-4">Billing Address</h2>
    <div class="flex flex-col md:flex-row gap-4">
        <input type="text" bind:value={userInfo.firstName} placeholder="First name" class="input-field" class:border-red-500={errors.firstName} />
        <input type="text" bind:value={userInfo.lastName} placeholder="Last name" class="input-field" class:border-red-500={errors.lastName} />
    </div>
    {#if errors.firstName || errors.lastName}
        <p class="error-text">{errors.firstName || errors.lastName}</p>
    {/if}

    <input type="text" bind:value={userInfo.address} placeholder="Address" class="input-field mt-4" class:border-red-500={errors.address} />
    {#if errors.address}<p class="error-text">{errors.address}</p>{/if}

    <div class="flex flex-col md:flex-row gap-4 mt-4">
        <input type="text" bind:value={userInfo.postalCode} placeholder="Postal code" class="input-field" class:border-red-500={errors.postalCode} />
        <input type="text" bind:value={userInfo.city} placeholder="City" class="input-field" class:border-red-500={errors.city} />
    </div>
    {#if errors.postalCode || errors.city}
        <p class="error-text">{errors.postalCode || errors.city}</p>
    {/if}

    <select bind:value={userInfo.country} class="input-field mt-4">
        <option value="" disabled>Select country</option>
        <option value="Austria">Austria</option>
        <option value="Germany">Germany</option>
        <option value="Switzerland">Switzerland</option>
    </select>
    {#if errors.country}<p class="error-text">{errors.country}</p>{/if}
</div>

<style>
    .user-info-section {
        padding: 1.5rem;
        background-color: #fdfdfd;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
    }

    .input-field {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ccc;
        border-radius: 8px;
        background-color: #f9f9f9;
    }

    .error-text {
        color: red;
        font-size: 0.875rem;
        margin-top: 0.25rem;
    }

    h2 {
        font-size: 1.25rem;
        font-weight: 600;
        color: #444;
        margin-bottom: 0.5rem;
    }
</style>
