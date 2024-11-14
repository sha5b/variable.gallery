<script>
  import { userInfo } from '$lib/stores/userInfoStore';
  import { createEventDispatcher } from 'svelte';
  import { validateFormFields } from '$lib/utils/paymentUtils';

  const dispatch = createEventDispatcher();
  export let validationErrors = {};

  // Expose validation method to parent
  export function validate() {
    const result = validateFormFields(get(userInfo));
    validationErrors = result.errors;
    dispatch('validation', result);
    return result.isValid;
  }
</script>

<form class="user-info-form space-y-sm">
  <div class="form-field">
    <label for="firstName">First Name</label>
    <input
      id="firstName"
      type="text"
      bind:value={$userInfo.firstName}
      placeholder="Your First Name"
      class="input-field"
    />
    {#if validationErrors.firstName}
      <p class="error">{validationErrors.firstName}</p>
    {/if}
  </div>

  <!-- Repeat for other fields -->
  <!-- ... -->
</form>

<style>
  .form-field {
    margin-bottom: var(--spacing-sm);
  }

  .input-field {
    width: 100%;
    padding: var(--spacing-sm);
    border: 1px solid var(--border-color);
    border-radius: var(--rounded-md);
  }

  .error {
    color: var(--error-color);
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }
</style> 